import { Router } from "express";
import type { HealthStatus, SystemInfo } from "@veltra/contracts";
import { appConfig } from "../../config/app-config.js";
import { checkPostgres } from "../../infrastructure/database/postgres.js";
import { checkRedis } from "../../infrastructure/redis/redis.js";

export const systemRouter = Router();

systemRouter.get("/health/live", (_req, res) => {
  const response: HealthStatus = {
    status: "ok",
    service: "veltra-api",
    timestamp: new Date().toISOString(),
    checks: {
      process: "ok"
    }
  };

  res.status(200).json(response);
});

systemRouter.get("/health/ready", async (_req, res) => {
  const checks = {
    postgres: await checkPostgres(),
    redis: await checkRedis()
  };

  const status = Object.values(checks).every((value) => value === "ok") ? "ok" : "unavailable";
  const response: HealthStatus = {
    status,
    service: "veltra-api",
    timestamp: new Date().toISOString(),
    checks
  };

  res.status(status === "ok" ? 200 : 503).json(response);
});

systemRouter.get("/api/v1/system/info", (_req, res) => {
  const response: SystemInfo = {
    name: "Veltra",
    version: "0.1.0",
    environment: appConfig.NODE_ENV,
    securityPosture: "foundation"
  };

  res.status(200).json(response);
});
