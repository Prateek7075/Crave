import { createServer } from "node:http";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/prisma.js";

const app = createApp();
const server = createServer(app);

let isShuttingDown = false;

async function startServer(): Promise<void> {
  await connectDatabase();

  server.listen(env.PORT, () => {
    console.log(`Crave API running at http://localhost:${env.PORT}`);
  });
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down Crave API...`);

  server.close(async (error) => {
    try {
      await disconnectDatabase();

      if (error) {
        console.error("HTTP server shutdown failed:", error);
        process.exitCode = 1;
        return;
      }

      console.log("Crave API shut down successfully.");
      process.exitCode = 0;
    } catch (disconnectError) {
      console.error("Database disconnection failed:", disconnectError);
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
  console.error("Crave API failed to start:", error);
  process.exitCode = 1;
});
