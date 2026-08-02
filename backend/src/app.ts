import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { httpLogger } from "./common/middleware/http-logger.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import { notFoundHandler } from "./common/middleware/not-found.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");

  app.use(httpLogger);

  app.use(helmet());

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(
    express.json({
      limit: "100kb",
    }),
  );

  app.get("/api/v1/health/live", (_request: Request, response: Response) => {
    return response.status(200).json({
      success: true,
      data: {
        status: "UP",
      },
      message: "Crave API is running",
    });
  });

  app.get("/api/v1/health/ready", async (_request: Request, response: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return response.status(200).json({
        success: true,
        data: {
          status: "READY",
          database: "CONNECTED",
        },
        message: "Crave API is ready",
      });
    } catch {
      return response.status(503).json({
        success: false,
        error: {
          code: "SERVICE_NOT_READY",
          message: "The database connection is unavailable",
        },
      });
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
