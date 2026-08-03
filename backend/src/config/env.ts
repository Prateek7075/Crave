import "dotenv/config";

import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().int().positive().max(65535).default(3000),

    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),

    DEV_OTP_CODE: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z
        .string()
        .regex(/^\d{4}$/, "DEV_OTP_CODE must contain exactly 4 digits")
        .optional(),
    ),

    FRONTEND_URL: z.string().url(),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    REDIS_URL: z
      .string()
      .url("REDIS_URL must be a valid Redis connection URL")
      .refine((value) => value.startsWith("redis://") || value.startsWith("rediss://"), {
        message: "REDIS_URL must start with redis:// or rediss://",
      }),
  })
  .superRefine((environment, context) => {
    if (environment.NODE_ENV !== "production" && environment.DEV_OTP_CODE === undefined) {
      context.addIssue({
        code: "custom",
        path: ["DEV_OTP_CODE"],
        message: "DEV_OTP_CODE is required in development and test environments",
      });
    }

    if (environment.NODE_ENV === "production" && environment.DEV_OTP_CODE !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["DEV_OTP_CODE"],
        message: "DEV_OTP_CODE must not be configured in production",
      });
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues
    .map((issue) => {
      const field = issue.path.join(".");
      return `${field}: ${issue.message}`;
    })
    .join("; ");

  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = result.data;

export function getDevelopmentOtpCode(): string {
  if (env.NODE_ENV === "production" || env.DEV_OTP_CODE === undefined) {
    throw new Error("The fixed development OTP code is unavailable");
  }

  return env.DEV_OTP_CODE;
}
