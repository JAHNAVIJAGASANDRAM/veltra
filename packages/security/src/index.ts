export type SecurityControl =
  | "identity"
  | "session-management"
  | "rbac"
  | "abac"
  | "audit-logging"
  | "file-security"
  | "risk-scoring"
  | "threat-detection";

export interface SecurityDecisionRecord {
  id: string;
  control: SecurityControl;
  decision: string;
  rationale: string;
  status: "proposed" | "accepted" | "superseded";
}

export const baselineSecurityControls: SecurityControl[] = [
  "identity",
  "session-management",
  "rbac",
  "abac",
  "audit-logging",
  "file-security",
  "risk-scoring",
  "threat-detection"
];

export { hashPassword, verifyPassword } from "./password.js";
export {
  generateSecureToken,
  hashToken,
  buildDeviceFingerprint,
  deriveDeviceName
} from "./tokens.js";
export {
  decodePemFromBase64,
  loadJwtKeyPair,
  signAccessToken,
  verifyAccessToken,
  type AccessTokenClaims,
  type JwtKeyPair
} from "./jwt.js";
export {
  buildTotpUri,
  generateTotpSecret,
  verifyTotpCode
} from "./totp.js";
