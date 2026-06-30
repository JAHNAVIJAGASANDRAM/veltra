import { describe, expect, it } from "vitest";
import {
  buildDeviceFingerprint,
  generateTotpSecret,
  hashPassword,
  hashToken,
  verifyPassword,
  verifyTotpCode
} from "../src/index.js";

describe("password hashing", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("SecurePass123");
    await expect(verifyPassword("SecurePass123", hash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPass123", hash)).resolves.toBe(false);
  });
});

describe("token helpers", () => {
  it("hashes tokens deterministically", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("def"));
  });

  it("builds stable device fingerprints", () => {
    expect(buildDeviceFingerprint("agent", "127.0.0.1")).toBe(
      buildDeviceFingerprint("agent", "127.0.0.1")
    );
  });
});

describe("totp", () => {
  it("generates secrets and rejects invalid codes", () => {
    const secret = generateTotpSecret();
    expect(secret.length).toBeGreaterThan(10);
    expect(verifyTotpCode(secret, "000000")).toBe(false);
  });
});
