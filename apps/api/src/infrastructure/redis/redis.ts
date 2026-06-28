import { createClient } from "redis";
import { appConfig } from "../../config/app-config.js";
import { logger } from "../../shared/logging/logger.js";

export const redisClient = createClient({
  url: appConfig.REDIS_URL
});

redisClient.on("error", (error) => {
  logger.warn({ err: error }, "redis client error");
});

export async function ensureRedisConnected(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function checkRedis(): Promise<"ok" | "unavailable"> {
  try {
    await ensureRedisConnected();
    await redisClient.ping();
    return "ok";
  } catch {
    return "unavailable";
  }
}
