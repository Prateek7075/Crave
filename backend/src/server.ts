import { createServer } from "node:http";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase, disconnectDatabase } from "./config/prisma.js";

const app = createApp();
const server = createServer(app);

let isShuttingDown = false;

async function startServer(): Promise<void> {
  await connectDatabase();

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
      },
      "Crave API started",
      console.log(`Crave API running at http://localhost:${env.PORT}`),
    );
  });
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    {
      signal,
    },
    "Shutdown signal received",
  );

  server.close(async (error) => {
    try {
      await disconnectDatabase();

      if (error) {
        logger.error(
          {
            err: error,
          },
          "HTTP server shutdown failed",
        );

        process.exitCode = 1;
        return;
      }

      logger.info("Crave API shut down successfully");
      process.exitCode = 0;
    } catch (disconnectError) {
      logger.error(
        {
          err: disconnectError,
        },
        "Database disconnection failed",
      );

      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer().catch((error: unknown) => {
  logger.fatal(
    {
      err: error,
    },
    "Crave API failed to start",
  );

  process.exitCode = 1;
});
