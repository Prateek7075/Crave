import { AppError } from "../../../common/errors/app-error.js";
import { env, getDevelopmentOtpCode } from "../../../config/env.js";

import type { CustomerRequestCodeBody } from "./customer-auth.schemas.js";
import {
  createCustomerOtpChallenge,
  CUSTOMER_OTP_CHALLENGE_TTL_SECONDS,
  type CreateCustomerOtpChallengeInput,
} from "./customer-otp-challenge.store.js";
import {
  CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS,
  reserveCustomerOtpSend,
} from "./customer-otp-limit.store.js";
import { findAccountByMobile, type AccountByMobile } from "./customer-auth.repository.js";

export type CustomerRequestCodeResult =
  | {
      nextStep: "ENTER_REGISTRATION_DETAILS";
    }
  | {
      nextStep: "VERIFY_CODE";
      challengeId: string;
      expiresInSeconds: number;
      resendAfterSeconds: number;
      developmentCode?: string;
    };

function assertCustomerAccountCanLogin(account: NonNullable<AccountByMobile>): void {
  if (account.role !== "CUSTOMER") {
    throw new AppError(
      "This mobile number is registered for a different account type",
      409,
      "ACCOUNT_ROLE_CONFLICT",
    );
  }

  if (account.status !== "ACTIVE") {
    throw new AppError("This account is currently unavailable", 403, "ACCOUNT_NOT_ACTIVE");
  }
}

async function enforceOtpSendLimits(mobile: string): Promise<void> {
  const allowance = await reserveCustomerOtpSend(mobile);

  if (allowance.allowed) {
    return;
  }

  if (allowance.reason === "COOLDOWN") {
    throw new AppError(
      "Please wait before requesting another verification code",
      429,
      "OTP_RESEND_COOLDOWN",
      {
        retryAfterSeconds: allowance.retryAfterSeconds,
      },
    );
  }

  throw new AppError("Too many verification codes were requested", 429, "OTP_HOURLY_LIMIT", {
    retryAfterSeconds: allowance.retryAfterSeconds,
  });
}

async function createOtpResponse(
  input: CreateCustomerOtpChallengeInput,
): Promise<CustomerRequestCodeResult> {
  await enforceOtpSendLimits(input.mobile);

  const challengeId = await createCustomerOtpChallenge(input);

  const response: CustomerRequestCodeResult = {
    nextStep: "VERIFY_CODE",
    challengeId,
    expiresInSeconds: CUSTOMER_OTP_CHALLENGE_TTL_SECONDS,
    resendAfterSeconds: CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS,
  };

  if (env.NODE_ENV !== "production") {
    response.developmentCode = getDevelopmentOtpCode();
  }

  return response;
}

export async function requestCustomerCode(
  input: CustomerRequestCodeBody,
): Promise<CustomerRequestCodeResult> {
  const account = await findAccountByMobile(input.mobile);

  if (account !== null) {
    assertCustomerAccountCanLogin(account);

    return createOtpResponse({
      purpose: "CUSTOMER_LOGIN",
      mobile: input.mobile,
    });
  }

  if (input.fullName === undefined) {
    return {
      nextStep: "ENTER_REGISTRATION_DETAILS",
    };
  }

  return createOtpResponse({
    purpose: "CUSTOMER_REGISTRATION",
    mobile: input.mobile,
    fullName: input.fullName,
  });
}
