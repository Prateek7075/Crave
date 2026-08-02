import { createServer } from "node:http";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase, disconnectDatabase } from "./config/prisma.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";

const app = createApp();
const server = createServer(app);

let isShuttingDown = false;

async function connectDependencies(): Promise<void> {
  try {
    await connectDatabase();
    await connectRedis();
  } catch (error) {
    await Promise.allSettled([disconnectRedis(), disconnectDatabase()]);

    throw error;
  }
}

async function disconnectDependencies(): Promise<boolean> {
  const results = await Promise.allSettled([disconnectRedis(), disconnectDatabase()]);

  let succeeded = true;

  for (const result of results) {
    if (result.status === "rejected") {
      succeeded = false;

      logger.error(
        {
          err: result.reason,
        },
        "Dependency disconnection failed",
      );
    }
  }

  return succeeded;
}

async function startServer(): Promise<void> {
  await connectDependencies();

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

  server.close(async (serverError) => {
    const dependenciesDisconnected = await disconnectDependencies();

    if (serverError) {
      logger.error(
        {
          err: serverError,
        },
        "HTTP server shutdown failed",
      );
    }

    if (serverError || !dependenciesDisconnected) {
      process.exitCode = 1;
      return;
    }

    logger.info("Crave API shut down successfully");
    process.exitCode = 0;
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
