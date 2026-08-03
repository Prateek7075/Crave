import { randomUUID } from "node:crypto";

import { z } from "zod";

import { redisClient } from "../../../config/redis.js";
import { customerFullNameSchema } from "./customer-auth.schemas.js";
import { indianMobileSchema } from "./customer-mobile.js";

export const CUSTOMER_OTP_CHALLENGE_TTL_SECONDS = 5 * 60;
export const CUSTOMER_OTP_MAX_FAILED_ATTEMPTS = 5;

export const customerOtpPurposeSchema = z.enum(["CUSTOMER_LOGIN", "CUSTOMER_REGISTRATION"]);

export type CustomerOtpPurpose = z.infer<typeof customerOtpPurposeSchema>;

const storedCustomerOtpChallengeSchema = z
  .object({
    purpose: customerOtpPurposeSchema,
    mobile: indianMobileSchema,
    fullName: customerFullNameSchema.optional(),

    failedAttempts: z.coerce.number().int().nonnegative(),
  })
  .strict();

export type CustomerOtpChallenge = z.infer<typeof storedCustomerOtpChallengeSchema> & {
  challengeId: string;
};

export interface CreateCustomerOtpChallengeInput {
  purpose: CustomerOtpPurpose;
  mobile: string;
  fullName?: string;
}

function getCustomerOtpChallengeKey(challengeId: string): string {
  return `auth:customer:otp:${challengeId}`;
}

export async function createCustomerOtpChallenge(
  input: CreateCustomerOtpChallengeInput,
): Promise<string> {
  const challengeId = randomUUID();
  const key = getCustomerOtpChallengeKey(challengeId);

  const fields: Record<string, string> = {
    purpose: input.purpose,
    mobile: input.mobile,
    failedAttempts: "0",
  };

  if (input.fullName !== undefined) {
    fields["fullName"] = input.fullName;
  }

  const transaction = redisClient.multi();

  transaction.hSet(key, fields);
  transaction.expire(key, CUSTOMER_OTP_CHALLENGE_TTL_SECONDS);

  await transaction.exec();

  return challengeId;
}

export async function findCustomerOtpChallenge(
  challengeId: string,
): Promise<CustomerOtpChallenge | null> {
  const key = getCustomerOtpChallengeKey(challengeId);
  const storedFields = await redisClient.hGetAll(key);

  if (Object.keys(storedFields).length === 0) {
    return null;
  }

  const result = storedCustomerOtpChallengeSchema.safeParse(storedFields);

  if (!result.success) {
    await redisClient.del(key);

    throw new Error("Stored customer OTP challenge is invalid");
  }

  return {
    challengeId,
    ...result.data,
  };
}

export async function deleteCustomerOtpChallenge(challengeId: string): Promise<void> {
  const key = getCustomerOtpChallengeKey(challengeId);

  await redisClient.del(key);
}
