import rateLimit from "express-rate-limit";
import { appConfig } from "../../config/app-config.js";

export const authRateLimiter = rateLimit({
  windowMs: appConfig.AUTH_RATE_LIMIT_WINDOW_MS,
  max: appConfig.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many authentication attempts. Try again later."
    }
  }
});
