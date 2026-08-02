import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().max(65535).default(3000),

  FRONTEND_URL: z.string().url(),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
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
