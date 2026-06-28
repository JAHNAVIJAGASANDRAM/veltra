import pino from "pino";
import { appConfig } from "../../config/app-config.js";

export const logger = pino({
  level: appConfig.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "*.password",
      "*.token",
      "*.secret"
    ],
    censor: "[REDACTED]"
  }
});
