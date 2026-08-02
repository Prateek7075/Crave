import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());

  app.use(
    cors({
      origin: "http://localhost:5173",
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

  return app;
}
