import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresPool } from "./postgres.js";
import { logger } from "../../shared/logging/logger.js";

function resolveMigrationsDir(): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const searchRoots = [process.cwd(), moduleDir];

  for (const start of searchRoots) {
    let current = start;

    for (let depth = 0; depth < 8; depth += 1) {
      const candidates = [
        path.join(current, "apps/api/src/infrastructure/database/migrations"),
        path.join(current, "src/infrastructure/database/migrations"),
        path.join(current, "infrastructure/database/migrations")
      ];

      for (const candidate of candidates) {
        if (existsSync(candidate)) {
          return candidate;
        }
      }

      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }

      current = parent;
    }
  }

  throw new Error("Database migrations directory not found");
}

const migrationsDir = resolveMigrationsDir();

export async function runMigrations(): Promise<void> {
  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const migrationId = file.replace(/\.sql$/, "");
    const applied = await postgresPool.query<{ id: string }>(
      "SELECT id FROM schema_migrations WHERE id = $1",
      [migrationId]
    );

    if (applied.rowCount && applied.rowCount > 0) {
      continue;
    }

    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    const client = await postgresPool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [migrationId]);
      await client.query("COMMIT");
      logger.info({ migrationId }, "applied database migration");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
