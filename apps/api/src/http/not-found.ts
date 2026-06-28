import type { RequestHandler } from "express";
import { AppError } from "../shared/errors/app-error.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(`Route not found: ${req.method} ${req.path}`, {
      statusCode: 404,
      code: "ROUTE_NOT_FOUND"
    })
  );
};
