import type { NextFunction, Request, Response } from "express";
import type { ZodType, ZodIssue } from "zod";
import { AppError } from "../errors/app-error.js";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue: ZodIssue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      next(
        new AppError(`Validation failed: ${details}`, {
          statusCode: 400,
          code: "VALIDATION_ERROR"
        })
      );
      return;
    }

    req.body = parsed.data;
    next();
  };
}
