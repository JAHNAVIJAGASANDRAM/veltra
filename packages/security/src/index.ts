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
