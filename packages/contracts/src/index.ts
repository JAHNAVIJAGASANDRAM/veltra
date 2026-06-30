import { z } from "zod";

export const healthStatusSchema = z.object({
  status: z.enum(["ok", "degraded", "unavailable"]),
  service: z.string(),
  timestamp: z.string().datetime(),
  checks: z.record(z.string(), z.enum(["ok", "degraded", "unavailable"]))
});

export type HealthStatus = z.infer<typeof healthStatusSchema>;

export const systemInfoSchema = z.object({
  name: z.literal("Veltra"),
  version: z.string(),
  environment: z.string(),
  securityPosture: z.enum(["foundation", "identity"])
});

export type SystemInfo = z.infer<typeof systemInfoSchema>;

export const registerRequestSchema = z.object({
  email: z.string().email().max(320),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/\d/, "Password must include a number"),
  displayName: z.string().trim().min(2).max(100)
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128),
  totpCode: z.string().regex(/^\d{6}$/).optional()
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(16).max(512).optional()
});

export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export const verifyEmailRequestSchema = z.object({
  token: z.string().min(16).max(512)
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email().max(320)
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  token: z.string().min(16).max(512),
  password: registerRequestSchema.shape.password
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export const mfaSetupConfirmSchema = z.object({
  totpCode: z.string().regex(/^\d{6}$/)
});

export type MfaSetupConfirmRequest = z.infer<typeof mfaSetupConfirmSchema>;

export const mfaDisableSchema = z.object({
  password: z.string().min(1).max(128),
  totpCode: z.string().regex(/^\d{6}$/)
});

export type MfaDisableRequest = z.infer<typeof mfaDisableSchema>;

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string(),
  emailVerified: z.boolean(),
  mfaEnabled: z.boolean(),
  roles: z.array(z.string())
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const authSessionSchema = z.object({
  id: z.string().uuid(),
  deviceName: z.string(),
  ipAddress: z.string(),
  lastUsedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  current: z.boolean()
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const authResponseSchema = z.object({
  user: publicUserSchema,
  accessToken: z.string(),
  expiresIn: z.number().int().positive()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const mfaSetupResponseSchema = z.object({
  secret: z.string(),
  otpauthUri: z.string().url()
});

export type MfaSetupResponse = z.infer<typeof mfaSetupResponseSchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional()
  })
});

export type ApiError = z.infer<typeof apiErrorSchema>;
