import { z } from "zod";

const indianMobilePattern = /^(?:\+91)?[6-9]\d{9}$/;

export const indianMobileSchema = z
  .string()
  .trim()
  .regex(indianMobilePattern, "Enter a valid Indian mobile number")
  .transform((mobile) => (mobile.startsWith("+91") ? mobile : `+91${mobile}`));

export type IndianMobile = z.infer<typeof indianMobileSchema>;
