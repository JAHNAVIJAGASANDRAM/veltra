import { createServer } from "node:http";
import { appConfig } from "./config/app-config.js";
import { createApp } from "./app.js";
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

function shutdown(signal: NodeJS.Signals): void {
  logger.info({ signal }, "shutting down Veltra API");
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "HTTP server shutdown failed");
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
