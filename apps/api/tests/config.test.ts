import { describe, expect, it } from "vitest";
import { loadConfig } from "@veltra/config";

const validEnvironment = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://veltra:password@localhost:5432/veltra",
  REDIS_URL: "redis://localhost:6379",
  S3_ENDPOINT: "http://localhost:9000",
  S3_REGION: "us-east-1",
  S3_BUCKET: "veltra-files",
  S3_ACCESS_KEY: "veltra",
  S3_SECRET_KEY: "veltra_dev_secret",
  COOKIE_SECRET: "12345678901234567890123456789012",
  JWT_PRIVATE_KEY_B64: "private",
  JWT_PUBLIC_KEY_B64: "public"
};

describe("loadConfig", () => {
  it("rejects missing secrets", () => {
    expect(() => loadConfig({})).toThrow("Invalid Veltra environment configuration");
  });

  it("loads a valid environment", () => {
    expect(loadConfig(validEnvironment).NODE_ENV).toBe("test");
  });
});
