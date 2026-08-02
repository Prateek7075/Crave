import pino from "pino";

import { env } from "./env.js";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : env.LOG_LEVEL,

  base: {
    service: "crave-api",
    environment: env.NODE_ENV,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  redact: {
    paths: [
      "password",
      "passwordHash",
      "otp",
      "verificationCode",
      "accessToken",
      "refreshToken",
      "token",
      "*.password",
      "*.passwordHash",
      "*.otp",
      "*.verificationCode",
      "*.accessToken",
      "*.refreshToken",
      "*.token",
    ],
    censor: "[REDACTED]",
  },

  ...(env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});
