import { Router } from "express";
import {
  forgotPasswordRequestSchema,
  loginRequestSchema,
  mfaDisableSchema,
  mfaSetupConfirmSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  verifyEmailRequestSchema
} from "@veltra/contracts";
import type { Request } from "express";
import { authenticate, requirePermission } from "../../shared/middleware/authenticate.js";
import { authRateLimiter } from "../../shared/middleware/rate-limit.js";
import { validateBody } from "../../shared/middleware/validate.js";
import {
  beginMfaSetup,
  confirmMfaSetup,
  disableUserMfa,
  getCurrentUser,
  listSessions,
  loginUser,
  logoutUser,
  readRefreshTokenFromRequest,
  refreshAuthSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
  revokeUserSession,
  verifyEmailToken
} from "./auth.service.js";

export const authRouter = Router();

function requestContext(req: Request) {
  return {
    ipAddress: req.ip ?? "",
    userAgent: req.get("user-agent") ?? ""
  };
}

authRouter.use(authRateLimiter);

authRouter.post("/register", validateBody(registerRequestSchema), async (req, res, next) => {
  try {
    const response = await registerUser(req.body, res, requestContext(req));
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateBody(loginRequestSchema), async (req, res, next) => {
  try {
    const response = await loginUser(req.body, res, requestContext(req));
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = readRefreshTokenFromRequest(req.cookies ?? {});
    await logoutUser(refreshToken, res, requestContext(req), req.auth?.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken =
      readRefreshTokenFromRequest(req.cookies ?? {}) ?? req.body?.refreshToken;
    const response = await refreshAuthSession(refreshToken, res, requestContext(req));
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-email", validateBody(verifyEmailRequestSchema), async (req, res, next) => {
  try {
    await verifyEmailToken(req.body.token, requestContext(req));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordRequestSchema),
  async (req, res, next) => {
    try {
      await requestPasswordReset(req.body.email, requestContext(req));
      res.status(202).json({ accepted: true });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordRequestSchema),
  async (req, res, next) => {
    try {
      await resetPassword(req.body.token, req.body.password, requestContext(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.auth!.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/sessions", authenticate, async (req, res, next) => {
  try {
    const sessions = await listSessions(req.auth!.userId, req.auth!.sessionId);
    res.status(200).json({ sessions });
  } catch (error) {
    next(error);
  }
});

authRouter.delete("/sessions/:sessionId", authenticate, async (req, res, next) => {
  try {
    const sessionId = typeof req.params.sessionId === "string" ? req.params.sessionId : req.params.sessionId?.[0];

    if (!sessionId) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Session id is required"
        }
      });
      return;
    }

    await revokeUserSession(req.auth!.userId, sessionId, requestContext(req));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authRouter.post("/mfa/setup", authenticate, async (req, res, next) => {
  try {
    const setup = await beginMfaSetup(req.auth!.userId);
    res.status(200).json(setup);
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/mfa/confirm",
  authenticate,
  validateBody(mfaSetupConfirmSchema),
  async (req, res, next) => {
    try {
      await confirmMfaSetup(req.auth!.userId, req.body.totpCode, requestContext(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/mfa/disable",
  authenticate,
  validateBody(mfaDisableSchema),
  async (req, res, next) => {
    try {
      await disableUserMfa(
        req.auth!.userId,
        req.body.password,
        req.body.totpCode,
        requestContext(req)
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get(
  "/admin/audit/ping",
  authenticate,
  requirePermission("audit:read"),
  (_req, res) => {
    res.status(200).json({ ok: true });
  }
);
