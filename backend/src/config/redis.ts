import { createClient } from "redis";

import { env } from "./env.js";
import { logger } from "./logger.js";

export const redisClient = createClient({
  url: env.REDIS_URL,

  socket: {
    connectTimeout: 5_000,

    reconnectStrategy(retries) {
      if (retries >= 5) {
        return new Error("Redis connection retry limit reached");
      }

      return Math.min(100 * 2 ** retries, 3_000);
    },
  },
});

redisClient.on("error", (error: Error) => {
  logger.error(
    {
      err: error,
    },
    "Redis client error",
  );
});

redisClient.on("reconnecting", () => {
  logger.warn("Redis client is reconnecting");
});

redisClient.on("ready", () => {
  logger.info("Redis client is ready");
});

redisClient.on("end", () => {
  logger.info("Redis client connection closed");
});

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.close();
}
