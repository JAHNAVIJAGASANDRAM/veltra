import pg from "pg";
import { appConfig } from "../../config/app-config.js";

const { Pool } = pg;

export const postgresPool = new Pool({
  connectionString: appConfig.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export async function checkPostgres(): Promise<"ok" | "unavailable"> {
  try {
    await postgresPool.query("select 1");
    return "ok";
  } catch {
    return "unavailable";
  }
}
