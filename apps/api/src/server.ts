import { createServer } from "node:http";
import { appConfig } from "./config/app-config.js";
import { createApp } from "./app.js";
import { postgresPool } from "./infrastructure/database/postgres.js";
import { redisClient } from "./infrastructure/redis/redis.js";
import { logger } from "./shared/logging/logger.js";

const app = createApp();
const server = createServer(app);

server.listen(appConfig.API_PORT, () => {
  logger.info(
    {
      port: appConfig.API_PORT,
      environment: appConfig.NODE_ENV
    },
    "Veltra API listening"
  );
});

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  logger.info({ signal }, "shutting down Veltra API");

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  }).catch((error) => {
    logger.error({ err: error }, "HTTP server shutdown failed");
    process.exit(1);
  });

  await Promise.allSettled([
    postgresPool.end(),
    redisClient.isOpen ? redisClient.quit() : Promise.resolve()
  ]);

  await new Promise<void>((resolve) => {
    logger.flush(() => resolve());
  });

  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
