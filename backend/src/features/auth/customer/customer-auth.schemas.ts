import { z } from "zod";

import { indianMobileSchema } from "./customer-mobile.js";

export const customerFullNameSchema = z
  .string()
  .trim()
  .min(3, "Full name must contain at least 3 characters")
  .max(120, "Full name must not exceed 120 characters");

export const customerRequestCodeBodySchema = z.strictObject({
  mobile: indianMobileSchema,
  fullName: customerFullNameSchema.optional(),
});

export const customerVerifyCodeBodySchema = z.strictObject({
  challengeId: z.uuid({
    message: "Challenge ID must be a valid UUID",
  }),

  code: z.string().regex(/^\d{4}$/, "Verification code must contain exactly 4 digits"),
});

export type CustomerRequestCodeBody = z.infer<typeof customerRequestCodeBodySchema>;

export type CustomerVerifyCodeBody = z.infer<typeof customerVerifyCodeBodySchema>;
