import type { Response } from "express";
import {
  buildDeviceFingerprint,
  buildTotpUri,
  deriveDeviceName,
  generateSecureToken,
  generateTotpSecret,
  hashPassword,
  hashToken,
  signAccessToken,
  verifyPassword,
  verifyTotpCode
} from "@veltra/security";
import type {
  AuthResponse,
  AuthSession,
  LoginRequest,
  MfaSetupResponse,
  PublicUser,
  RegisterRequest
} from "@veltra/contracts";
import { appConfig } from "../../config/app-config.js";
import { getJwtKeyPair } from "../../infrastructure/crypto/jwt-keys.js";
import { decryptSecret, encryptSecret } from "../../infrastructure/crypto/secret-cipher.js";
import { sendEmail } from "../../infrastructure/email/email.service.js";
import { recordAuditEvent } from "../audit/audit.service.js";
import {
  assignDefaultMemberRole,
  getUserPermissions,
  getUserRoles
} from "../rbac/rbac.service.js";
import { AppError } from "../../shared/errors/app-error.js";
import {
  consumeVerificationToken,
  createUser,
  createVerificationToken,
  disableMfa,
  enableMfa,
  findUserByEmail,
  findUserById,
  invalidateVerificationTokens,
  markEmailVerified,
  setMfaSecret,
  updatePassword
} from "./auth.repository.js";
import {
  createSession,
  findSessionByRefreshTokenHash,
  listUserSessions,
  revokeSession,
  revokeAllUserSessions,
  rotateSession,
  touchSession
} from "./session.repository.js";

export interface RequestContext {
  ipAddress: string;
  userAgent: string;
}

function buildPublicUser(user: {
  id: string;
  email: string;
  displayName: string;
  emailVerifiedAt: Date | null;
  mfaEnabled: boolean;
}, roles: string[]): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    emailVerified: Boolean(user.emailVerifiedAt),
    mfaEnabled: user.mfaEnabled,
    roles
  };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: appConfig.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api/v1/auth",
    maxAge: appConfig.REFRESH_TOKEN_TTL_SECONDS * 1000
  };
}

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(appConfig.SESSION_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(appConfig.SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: appConfig.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth"
  });
}

async function issueAuthResponse(
  userId: string,
  sessionId: string
): Promise<AuthResponse> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", {
      statusCode: 404,
      code: "USER_NOT_FOUND"
    });
  }

  const [roles, permissions] = await Promise.all([
    getUserRoles(user.id),
    getUserPermissions(user.id)
  ]);

  const jwtKeys = await getJwtKeyPair(appConfig);
  const accessToken = await signAccessToken(
    jwtKeys,
    {
      sub: user.id,
      email: user.email,
      permissions,
      sessionId
    },
    appConfig.ACCESS_TOKEN_TTL_SECONDS
  );

  return {
    user: buildPublicUser(user, roles),
    accessToken,
    expiresIn: appConfig.ACCESS_TOKEN_TTL_SECONDS
  };
}

async function createAuthSession(
  userId: string,
  res: Response,
  context: RequestContext
): Promise<AuthResponse> {
  const refreshToken = generateSecureToken(48);
  const refreshTokenHash = hashToken(refreshToken);
  const deviceFingerprint = buildDeviceFingerprint(context.userAgent, context.ipAddress);
  const deviceName = deriveDeviceName(context.userAgent);
  const expiresAt = new Date(Date.now() + appConfig.REFRESH_TOKEN_TTL_SECONDS * 1000);

  const session = await createSession({
    userId,
    refreshTokenHash,
    deviceFingerprint,
    deviceName,
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
    expiresAt
  });

  setRefreshCookie(res, refreshToken);
  return issueAuthResponse(userId, session.id);
}

async function sendVerificationEmail(userId: string, email: string): Promise<void> {
  const token = generateSecureToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + appConfig.EMAIL_VERIFICATION_TTL_SECONDS * 1000);

  await invalidateVerificationTokens(userId, "email_verification");
  await createVerificationToken({
    userId,
    tokenHash,
    tokenType: "email_verification",
    expiresAt
  });

  const verificationUrl = `${appConfig.PUBLIC_WEB_ORIGIN}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your Veltra account",
    text: `Verify your email by visiting ${verificationUrl}`
  });
}

export async function registerUser(
  input: RegisterRequest,
  res: Response,
  context: RequestContext
): Promise<AuthResponse> {
  const existing = await findUserByEmail(input.email);

  if (existing) {
    throw new AppError("An account with this email already exists", {
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS"
    });
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email: input.email,
    passwordHash,
    displayName: input.displayName
  });

  await assignDefaultMemberRole(user.id);
  await sendVerificationEmail(user.id, user.email);

  await recordAuditEvent({
    actorUserId: user.id,
    action: "auth.register",
    resourceType: "user",
    resourceId: user.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });

  return createAuthSession(user.id, res, context);
}

export async function loginUser(
  input: LoginRequest,
  res: Response,
  context: RequestContext
): Promise<AuthResponse> {
  const user = await findUserByEmail(input.email);

  if (!user || user.status === "locked") {
    throw new AppError("Invalid email or password", {
      statusCode: 401,
      code: "INVALID_CREDENTIALS"
    });
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash);

  if (!passwordValid) {
    await recordAuditEvent({
      actorUserId: user.id,
      action: "auth.login_failed",
      resourceType: "user",
      resourceId: user.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    throw new AppError("Invalid email or password", {
      statusCode: 401,
      code: "INVALID_CREDENTIALS"
    });
  }

  if (user.mfaEnabled) {
    if (!input.totpCode) {
      throw new AppError("Multi-factor authentication code required", {
        statusCode: 401,
        code: "MFA_REQUIRED"
      });
    }

    if (!user.mfaSecretEncrypted) {
      throw new AppError("MFA is misconfigured for this account", {
        statusCode: 500,
        code: "MFA_MISCONFIGURED"
      });
    }

    const secret = decryptSecret(user.mfaSecretEncrypted);
    const validTotp = verifyTotpCode(secret, input.totpCode);

    if (!validTotp) {
      throw new AppError("Invalid multi-factor authentication code", {
        statusCode: 401,
        code: "INVALID_MFA_CODE"
      });
    }
  }

  await recordAuditEvent({
    actorUserId: user.id,
    action: "auth.login",
    resourceType: "user",
    resourceId: user.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });

  return createAuthSession(user.id, res, context);
}

export async function logoutUser(
  refreshToken: string | undefined,
  res: Response,
  context: RequestContext,
  actorUserId?: string
): Promise<void> {
  if (refreshToken) {
    const session = await findSessionByRefreshTokenHash(hashToken(refreshToken));

    if (session) {
      await revokeSession(session.id, session.userId);
      await recordAuditEvent({
        actorUserId: actorUserId ?? session.userId,
        action: "auth.logout",
        resourceType: "session",
        resourceId: session.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
    }
  }

  clearRefreshCookie(res);
}

export async function refreshAuthSession(
  refreshToken: string | undefined,
  res: Response,
  context: RequestContext
): Promise<AuthResponse> {
  if (!refreshToken) {
    throw new AppError("Refresh token required", {
      statusCode: 401,
      code: "REFRESH_TOKEN_REQUIRED"
    });
  }

  const session = await findSessionByRefreshTokenHash(hashToken(refreshToken));

  if (!session) {
    clearRefreshCookie(res);
    throw new AppError("Invalid refresh token", {
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN"
    });
  }

  const nextRefreshToken = generateSecureToken(48);
  const nextRefreshTokenHash = hashToken(nextRefreshToken);
  const expiresAt = new Date(Date.now() + appConfig.REFRESH_TOKEN_TTL_SECONDS * 1000);

  const rotatedSession = await rotateSession({
    previousSessionId: session.id,
    familyId: session.familyId,
    userId: session.userId,
    refreshTokenHash: nextRefreshTokenHash,
    deviceFingerprint: buildDeviceFingerprint(context.userAgent, context.ipAddress),
    deviceName: deriveDeviceName(context.userAgent),
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
    expiresAt
  });

  setRefreshCookie(res, nextRefreshToken);

  await recordAuditEvent({
    actorUserId: session.userId,
    action: "auth.refresh",
    resourceType: "session",
    resourceId: rotatedSession.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });

  return issueAuthResponse(session.userId, rotatedSession.id);
}

export async function verifyEmailToken(token: string, context: RequestContext): Promise<void> {
  const consumed = await consumeVerificationToken({
    tokenHash: hashToken(token),
    tokenType: "email_verification"
  });

  if (!consumed) {
    throw new AppError("Invalid or expired verification token", {
      statusCode: 400,
      code: "INVALID_VERIFICATION_TOKEN"
    });
  }

  await markEmailVerified(consumed.userId);

  await recordAuditEvent({
    actorUserId: consumed.userId,
    action: "auth.email_verified",
    resourceType: "user",
    resourceId: consumed.userId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function requestPasswordReset(email: string, context: RequestContext): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const token = generateSecureToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + appConfig.PASSWORD_RESET_TTL_SECONDS * 1000);

  await invalidateVerificationTokens(user.id, "password_reset");
  await createVerificationToken({
    userId: user.id,
    tokenHash,
    tokenType: "password_reset",
    expiresAt
  });

  const resetUrl = `${appConfig.PUBLIC_WEB_ORIGIN}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your Veltra password",
    text: `Reset your password by visiting ${resetUrl}`
  });

  await recordAuditEvent({
    actorUserId: user.id,
    action: "auth.password_reset_requested",
    resourceType: "user",
    resourceId: user.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function resetPassword(
  token: string,
  password: string,
  context: RequestContext
): Promise<void> {
  const consumed = await consumeVerificationToken({
    tokenHash: hashToken(token),
    tokenType: "password_reset"
  });

  if (!consumed) {
    throw new AppError("Invalid or expired reset token", {
      statusCode: 400,
      code: "INVALID_RESET_TOKEN"
    });
  }

  const passwordHash = await hashPassword(password);
  await updatePassword(consumed.userId, passwordHash);
  await revokeAllUserSessions(consumed.userId);

  await recordAuditEvent({
    actorUserId: consumed.userId,
    action: "auth.password_reset_completed",
    resourceType: "user",
    resourceId: consumed.userId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", {
      statusCode: 404,
      code: "USER_NOT_FOUND"
    });
  }

  const roles = await getUserRoles(user.id);
  return buildPublicUser(user, roles);
}

export async function listSessions(userId: string, currentSessionId: string): Promise<AuthSession[]> {
  const sessions = await listUserSessions(userId);

  return sessions.map((session) => ({
    id: session.id,
    deviceName: session.deviceName,
    ipAddress: session.ipAddress,
    lastUsedAt: session.lastUsedAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
    current: session.id === currentSessionId
  }));
}

export async function revokeUserSession(
  userId: string,
  sessionId: string,
  context: RequestContext
): Promise<void> {
  const revoked = await revokeSession(sessionId, userId);

  if (!revoked) {
    throw new AppError("Session not found", {
      statusCode: 404,
      code: "SESSION_NOT_FOUND"
    });
  }

  await recordAuditEvent({
    actorUserId: userId,
    action: "auth.session_revoked",
    resourceType: "session",
    resourceId: sessionId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function beginMfaSetup(userId: string): Promise<MfaSetupResponse> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", {
      statusCode: 404,
      code: "USER_NOT_FOUND"
    });
  }

  const secret = generateTotpSecret();
  await setMfaSecret(userId, encryptSecret(secret));

  return {
    secret,
    otpauthUri: buildTotpUri(secret, user.email, appConfig.MFA_ISSUER)
  };
}

export async function confirmMfaSetup(
  userId: string,
  totpCode: string,
  context: RequestContext
): Promise<void> {
  const user = await findUserById(userId);

  if (!user?.mfaSecretEncrypted) {
    throw new AppError("MFA setup has not been started", {
      statusCode: 400,
      code: "MFA_SETUP_NOT_STARTED"
    });
  }

  const secret = decryptSecret(user.mfaSecretEncrypted);
  const validTotp = verifyTotpCode(secret, totpCode);

  if (!validTotp) {
    throw new AppError("Invalid multi-factor authentication code", {
      statusCode: 400,
      code: "INVALID_MFA_CODE"
    });
  }

  await enableMfa(userId);

  await recordAuditEvent({
    actorUserId: userId,
    action: "auth.mfa_enabled",
    resourceType: "user",
    resourceId: userId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function disableUserMfa(
  userId: string,
  password: string,
  totpCode: string,
  context: RequestContext
): Promise<void> {
  const user = await findUserById(userId);

  if (!user?.mfaEnabled || !user.mfaSecretEncrypted) {
    throw new AppError("MFA is not enabled", {
      statusCode: 400,
      code: "MFA_NOT_ENABLED"
    });
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    throw new AppError("Invalid password", {
      statusCode: 401,
      code: "INVALID_PASSWORD"
    });
  }

  const secret = decryptSecret(user.mfaSecretEncrypted);
  const validTotp = verifyTotpCode(secret, totpCode);

  if (!validTotp) {
    throw new AppError("Invalid multi-factor authentication code", {
      statusCode: 401,
      code: "INVALID_MFA_CODE"
    });
  }

  await disableMfa(userId);

  await recordAuditEvent({
    actorUserId: userId,
    action: "auth.mfa_disabled",
    resourceType: "user",
    resourceId: userId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

export async function touchCurrentSession(sessionId: string): Promise<void> {
  await touchSession(sessionId);
}

export function readRefreshTokenFromRequest(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[appConfig.SESSION_COOKIE_NAME];
}
