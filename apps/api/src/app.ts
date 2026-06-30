import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Request } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { appConfig } from "./config/app-config.js";
import { errorHandler } from "./http/error-handler.js";
import { notFoundHandler } from "./http/not-found.js";
import { requestContext } from "./http/request-context.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { systemRouter } from "./modules/system/system.routes.js";
import { logger } from "./shared/logging/logger.js";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestContext);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as Request).id
    })
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "same-site" },
      referrerPolicy: { policy: "no-referrer" },
      ...(appConfig.NODE_ENV === "production" ? {} : { hsts: false as const })
    })
  );
  app.use(
    cors({
      origin: appConfig.PUBLIC_WEB_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", appConfig.REQUEST_ID_HEADER]
    })
  );
  app.use(compression());
  app.use(cookieParser(appConfig.COOKIE_SECRET));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));

  app.use(systemRouter);
  app.use("/api/v1/auth", authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
