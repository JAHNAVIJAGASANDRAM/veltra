import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { appConfig } from "../config/app-config.js";

export function requestContext(req: Request, res: Response, next: NextFunction): void {
  const incomingRequestId = req.headers[appConfig.REQUEST_ID_HEADER.toLowerCase()];
  const normalizedRequestId = Array.isArray(incomingRequestId)
    ? incomingRequestId[0]
    : incomingRequestId;
  const requestId = normalizedRequestId?.trim() || randomUUID();

  req.id = requestId;
  res.setHeader(appConfig.REQUEST_ID_HEADER, requestId);
  next();
}
