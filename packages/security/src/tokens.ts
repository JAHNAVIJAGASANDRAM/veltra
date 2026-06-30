import { createHash, randomBytes } from "node:crypto";

export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function buildDeviceFingerprint(userAgent: string, ipAddress: string): string {
  return createHash("sha256").update(`${userAgent}:${ipAddress}`).digest("hex");
}

export function deriveDeviceName(userAgent: string): string {
  const normalized = userAgent.trim();

  if (!normalized) {
    return "Unknown device";
  }

  if (/iPhone|iPad|iPod/i.test(normalized)) {
    return "Apple mobile device";
  }

  if (/Android/i.test(normalized)) {
    return "Android device";
  }

  if (/Windows/i.test(normalized)) {
    return "Windows device";
  }

  if (/Macintosh|Mac OS X/i.test(normalized)) {
    return "Mac device";
  }

  if (/Linux/i.test(normalized)) {
    return "Linux device";
  }

  return "Web browser";
}
