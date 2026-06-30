import { postgresPool } from "../../infrastructure/database/postgres.js";

export interface UserRecord {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
  passwordHash: string;
  displayName: string;
  mfaSecretEncrypted: string | null;
  mfaEnabled: boolean;
  status: "pending_verification" | "active" | "locked";
  createdAt: Date;
  updatedAt: Date;
}

function mapUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    emailVerifiedAt: row.email_verified_at ? new Date(String(row.email_verified_at)) : null,
    passwordHash: String(row.password_hash),
    displayName: String(row.display_name),
    mfaSecretEncrypted: row.mfa_secret_encrypted ? String(row.mfa_secret_encrypted) : null,
    mfaEnabled: Boolean(row.mfa_enabled),
    status: row.status as UserRecord["status"],
    createdAt: new Date(String(row.created_at)),
    updatedAt: new Date(String(row.updated_at))
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await postgresPool.query(
    `
      SELECT *
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [email]
  );

  const row = result.rows[0];
  return row ? mapUser(row) : null;
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  const result = await postgresPool.query(
    `
      SELECT *
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  const row = result.rows[0];
  return row ? mapUser(row) : null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  displayName: string;
}): Promise<UserRecord> {
  const result = await postgresPool.query(
    `
      INSERT INTO users (email, password_hash, display_name)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [input.email.toLowerCase(), input.passwordHash, input.displayName]
  );

  return mapUser(result.rows[0]!);
}

export async function markEmailVerified(userId: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE users
      SET email_verified_at = NOW(),
          status = 'active',
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId]
  );
}

export async function updatePassword(userId: string, passwordHash: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE users
      SET password_hash = $2,
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId, passwordHash]
  );
}

export async function setMfaSecret(userId: string, encryptedSecret: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE users
      SET mfa_secret_encrypted = $2,
          mfa_enabled = FALSE,
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId, encryptedSecret]
  );
}

export async function enableMfa(userId: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE users
      SET mfa_enabled = TRUE,
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId]
  );
}

export async function disableMfa(userId: string): Promise<void> {
  await postgresPool.query(
    `
      UPDATE users
      SET mfa_enabled = FALSE,
          mfa_secret_encrypted = NULL,
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId]
  );
}

export async function createVerificationToken(input: {
  userId: string;
  tokenHash: string;
  tokenType: "email_verification" | "password_reset";
  expiresAt: Date;
}): Promise<void> {
  await postgresPool.query(
    `
      INSERT INTO verification_tokens (user_id, token_hash, token_type, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
    [input.userId, input.tokenHash, input.tokenType, input.expiresAt.toISOString()]
  );
}

export async function consumeVerificationToken(input: {
  tokenHash: string;
  tokenType: "email_verification" | "password_reset";
}): Promise<{ userId: string } | null> {
  const result = await postgresPool.query(
    `
      UPDATE verification_tokens
      SET used_at = NOW()
      WHERE token_hash = $1
        AND token_type = $2
        AND used_at IS NULL
        AND expires_at > NOW()
      RETURNING user_id
    `,
    [input.tokenHash, input.tokenType]
  );

  const row = result.rows[0];
  return row ? { userId: String(row.user_id) } : null;
}

export async function invalidateVerificationTokens(
  userId: string,
  tokenType: "email_verification" | "password_reset"
): Promise<void> {
  await postgresPool.query(
    `
      UPDATE verification_tokens
      SET used_at = NOW()
      WHERE user_id = $1
        AND token_type = $2
        AND used_at IS NULL
    `,
    [userId, tokenType]
  );
}
