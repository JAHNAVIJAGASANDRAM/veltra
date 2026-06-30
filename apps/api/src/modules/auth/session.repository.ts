import { randomUUID } from "node:crypto";
import { postgresPool } from "../../infrastructure/database/postgres.js";

export interface SessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  familyId: string;
  deviceFingerprint: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date;
  createdAt: Date;
}

function mapSession(row: Record<string, unknown>): SessionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    refreshTokenHash: String(row.refresh_token_hash),
    familyId: String(row.family_id),
    deviceFingerprint: String(row.device_fingerprint),
    deviceName: String(row.device_name),
    userAgent: String(row.user_agent),
    ipAddress: String(row.ip_address),
    expiresAt: new Date(String(row.expires_at)),
    revokedAt: row.revoked_at ? new Date(String(row.revoked_at)) : null,
    lastUsedAt: new Date(String(row.last_used_at)),
    createdAt: new Date(String(row.created_at))
  };
}

export async function createSession(input: {
  userId: string;
  refreshTokenHash: string;
  familyId?: string;
  deviceFingerprint: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}): Promise<SessionRecord> {
  const result = await postgresPool.query(
    `
      INSERT INTO sessions (
        user_id,
        refresh_token_hash,
        family_id,
        device_fingerprint,
        device_name,
        user_agent,
        ip_address,
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      input.userId,
      input.refreshTokenHash,
      input.familyId ?? randomUUID(),
      input.deviceFingerprint,
      input.deviceName,
      input.userAgent,
      input.ipAddress,
      input.expiresAt.toISOString()
    ]
  );

  return mapSession(result.rows[0]!);
}

export async function findSessionByRefreshTokenHash(
  refreshTokenHash: string
): Promise<SessionRecord | null> {
  const result = await postgresPool.query(
    `
      SELECT *
      FROM sessions
      WHERE refresh_token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [refreshTokenHash]
  );

  const row = result.rows[0];
  return row ? mapSession(row) : null;
}

export async function rotateSession(input: {
  previousSessionId: string;
  familyId: string;
  userId: string;
  refreshTokenHash: string;
  deviceFingerprint: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}): Promise<SessionRecord> {
  const client = await postgresPool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `
        UPDATE sessions
        SET revoked_at = NOW()
        WHERE id = $1
      `,
      [input.previousSessionId]
    );

    const result = await client.query(
      `
        INSERT INTO sessions (
          user_id,
          refresh_token_hash,
          family_id,
          device_fingerprint,
          device_name,
          user_agent,
          ip_address,
          expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        input.userId,
        input.refreshTokenHash,
        input.familyId,
        input.deviceFingerprint,
        input.deviceName,
        input.userAgent,
        input.ipAddress,
        input.expiresAt.toISOString()
      ]
    );

    await client.query("COMMIT");
    return mapSession(result.rows[0]!);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function revokeSession(sessionId: string, userId: string): Promise<boolean> {
  const result = await postgresPool.query(
    `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND revoked_at IS NULL
      RETURNING id
    `,
    [sessionId, userId]
  );

  return Boolean(result.rowCount && result.rowCount > 0);
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = $1
        AND revoked_at IS NULL
    `,
    [userId]
  );
}

export async function listUserSessions(userId: string): Promise<SessionRecord[]> {
  const result = await postgresPool.query(
    `
      SELECT *
      FROM sessions
      WHERE user_id = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
      ORDER BY last_used_at DESC
    `,
    [userId]
  );

  return result.rows.map(mapSession);
}

export async function touchSession(sessionId: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE sessions
      SET last_used_at = NOW()
      WHERE id = $1
    `,
    [sessionId]
  );
}

export async function findSessionById(
  sessionId: string,
  userId: string
): Promise<SessionRecord | null> {
  const result = await postgresPool.query(
    `
      SELECT *
      FROM sessions
      WHERE id = $1
        AND user_id = $2
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [sessionId, userId]
  );

  const row = result.rows[0];
  return row ? mapSession(row) : null;
}
