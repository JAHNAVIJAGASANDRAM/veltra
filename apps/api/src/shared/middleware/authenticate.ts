import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@veltra/security";
import { appConfig } from "../../config/app-config.js";
import { getJwtKeyPair } from "../../infrastructure/crypto/jwt-keys.js";
import { AppError } from "../errors/app-error.js";
import { touchCurrentSession } from "../../modules/auth/auth.service.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!bearerToken) {
    next(
      new AppError("Authentication required", {
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED"
      })
    );
    return;
  }

  try {
    const jwtKeys = await getJwtKeyPair(appConfig);
    const claims = await verifyAccessToken(jwtKeys, bearerToken);

    req.auth = {
      userId: claims.sub,
      email: claims.email,
      permissions: claims.permissions,
      sessionId: claims.sessionId
    };

    await touchCurrentSession(claims.sessionId);
    next();
  } catch {
    next(
      new AppError("Invalid or expired access token", {
        statusCode: 401,
        code: "INVALID_ACCESS_TOKEN"
      })
    );
  }
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(
        new AppError("Authentication required", {
          statusCode: 401,
          code: "AUTHENTICATION_REQUIRED"
        })
      );
      return;
    }

    const allowed =
      req.auth.permissions.includes(permission) || req.auth.permissions.includes("*");

    if (!allowed) {
      next(
        new AppError("Insufficient permissions", {
          statusCode: 403,
          code: "FORBIDDEN"
        })
      );
      return;
    }

    next();
  };
}
