import { postgresPool } from "../../infrastructure/database/postgres.js";

export async function getUserPermissions(userId: string): Promise<string[]> {
  const result = await postgresPool.query<{ permission: string }>(
    `
      SELECT DISTINCT rp.permission
      FROM user_roles ur
      INNER JOIN role_permissions rp ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
      ORDER BY rp.permission ASC
    `,
    [userId]
  );

  return result.rows.map((row) => row.permission);
}

export async function getUserRoles(userId: string): Promise<string[]> {
  const result = await postgresPool.query<{ name: string }>(
    `
      SELECT r.name
      FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = $1
      ORDER BY r.name ASC
    `,
    [userId]
  );

  return result.rows.map((row) => row.name);
}

export async function assignDefaultMemberRole(userId: string): Promise<void> {
  await postgresPool.query(
    `
      INSERT INTO user_roles (user_id, role_id)
      SELECT $1, id FROM roles WHERE name = 'member'
      ON CONFLICT DO NOTHING
    `,
    [userId]
  );
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required) || permissions.includes("*");
}
