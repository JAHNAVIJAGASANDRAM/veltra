import type { ErrorRequestHandler } from "express";
import { AppError } from "../shared/errors/app-error.js";
import { logger } from "../shared/logging/logger.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("Internal server error", {
          statusCode: 500,
          code: "INTERNAL_SERVER_ERROR",
          expose: false
        });

  logger.error(
    {
      err: error,
      requestId: req.id,
      path: req.path,
      method: req.method,
      code: appError.code
    },
    "request failed"
  );

  res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      message: appError.expose ? appError.message : "Internal server error",
      requestId: req.id
    }
  });
};
