import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("auth routes", () => {
  const app = createApp();

  it("rejects invalid registration payloads", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "not-an-email",
        password: "short",
        displayName: "A"
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects unauthenticated profile access", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });
});
