import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { runMigrations } from "../src/infrastructure/database/migrate.js";
import { postgresPool } from "../src/infrastructure/database/postgres.js";

const integrationEnabled = process.env.RUN_INTEGRATION_TESTS === "true";

describe.skipIf(!integrationEnabled)("auth integration", () => {
  const app = createApp();
  const email = `user-${randomUUID()}@example.com`;
  const password = "SecurePass123";
  let accessToken = "";
  let refreshCookie = "";

  beforeAll(async () => {
    await runMigrations();
  });

  afterAll(async () => {
    await postgresPool.query("DELETE FROM users WHERE email = $1", [email]);
    await postgresPool.end();
  });

  it("registers, logs in, refreshes, and logs out", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email,
        password,
        displayName: "Integration User"
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe(email);
    expect(registerResponse.headers["set-cookie"]?.[0]).toContain("veltra_session=");

    accessToken = registerResponse.body.accessToken;
    refreshCookie = registerResponse.headers["set-cookie"]?.[0]?.split(";")[0] ?? "";

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.displayName).toBe("Integration User");

    const refreshResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.accessToken).toBeTruthy();

    const logoutResponse = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", refreshResponse.headers["set-cookie"]?.[0]?.split(";")[0] ?? "");

    expect(logoutResponse.status).toBe(204);
  });
});
