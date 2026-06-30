import { importPKCS8, importSPKI, SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface AccessTokenClaims extends JWTPayload {
  sub: string;
  email: string;
  permissions: string[];
  sessionId: string;
}

export interface JwtKeyPair {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

export async function loadJwtKeyPair(
  privateKeyPem: string,
  publicKeyPem: string
): Promise<JwtKeyPair> {
  const privateKey = await importPKCS8(privateKeyPem, "RS256");
  const publicKey = await importSPKI(publicKeyPem, "RS256");
  return { privateKey, publicKey };
}

export function decodePemFromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

export async function signAccessToken(
  keys: JwtKeyPair,
  claims: {
    sub: string;
    email: string;
    permissions: string[];
    sessionId: string;
  },
  ttlSeconds: number
): Promise<string> {
  return new SignJWT({
    email: claims.email,
    permissions: claims.permissions,
    sessionId: claims.sessionId
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(keys.privateKey);
}

export async function verifyAccessToken(
  keys: JwtKeyPair,
  token: string
): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, keys.publicKey, {
    algorithms: ["RS256"]
  });

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    !Array.isArray(payload.permissions) ||
    typeof payload.sessionId !== "string"
  ) {
    throw new Error("Invalid access token claims");
  }

  return payload as AccessTokenClaims;
}
