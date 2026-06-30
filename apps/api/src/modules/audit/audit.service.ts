import { postgresPool } from "../../infrastructure/database/postgres.js";

export interface AuditEventInput {
  actorUserId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function recordAuditEvent(input: AuditEventInput): Promise<void> {
  await postgresPool.query(
    `
      INSERT INTO audit_events (
        actor_user_id,
        action,
        resource_type,
        resource_id,
        metadata,
        ip_address,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
    `,
    [
      input.actorUserId ?? null,
      input.action,
      input.resourceType,
      input.resourceId ?? null,
      JSON.stringify(input.metadata ?? {}),
      input.ipAddress ?? "",
      input.userAgent ?? ""
    ]
  );
}
