import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../src/common/errors/app-error.js";

const mocks = vi.hoisted(() => ({
  findAccountByMobile: vi.fn(),
  createCustomerOtpChallenge: vi.fn(),
  reserveCustomerOtpSend: vi.fn(),
}));

vi.mock("../src/config/env.js", () => ({
  env: {
    NODE_ENV: "development",
  },

  getDevelopmentOtpCode: () => "1234",
}));

vi.mock("../src/features/auth/customer/customer-auth.repository.js", () => ({
  findAccountByMobile: mocks.findAccountByMobile,
}));

vi.mock("../src/features/auth/customer/customer-otp-challenge.store.js", () => ({
  CUSTOMER_OTP_CHALLENGE_TTL_SECONDS: 300,

  createCustomerOtpChallenge: mocks.createCustomerOtpChallenge,
}));

vi.mock("../src/features/auth/customer/customer-otp-limit.store.js", () => ({
  CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS: 30,

  reserveCustomerOtpSend: mocks.reserveCustomerOtpSend,
}));

import { requestCustomerCode } from "../src/features/auth/customer/customer-auth.service.js";

describe("customer request-code service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.findAccountByMobile.mockResolvedValue(null);

    mocks.reserveCustomerOtpSend.mockResolvedValue({
      allowed: true,
    });

    mocks.createCustomerOtpChallenge.mockResolvedValue("54eb34f7-cce4-4757-880a-90ce174b5e09");
  });

  it("asks for registration details when the mobile is unused", async () => {
    const result = await requestCustomerCode({
      mobile: "+919876543210",
    });

    expect(result).toEqual({
      nextStep: "ENTER_REGISTRATION_DETAILS",
    });

    expect(mocks.reserveCustomerOtpSend).not.toHaveBeenCalled();

    expect(mocks.createCustomerOtpChallenge).not.toHaveBeenCalled();
  });

  it("creates a login challenge for an active customer", async () => {
    mocks.findAccountByMobile.mockResolvedValue({
      id: 12,
      role: "CUSTOMER",
      status: "ACTIVE",
      mobile: "+919876543210",
    });

    const result = await requestCustomerCode({
      mobile: "+919876543210",
    });

    expect(mocks.createCustomerOtpChallenge).toHaveBeenCalledWith({
      purpose: "CUSTOMER_LOGIN",
      mobile: "+919876543210",
    });

    expect(result).toEqual({
      nextStep: "VERIFY_CODE",
      challengeId: "54eb34f7-cce4-4757-880a-90ce174b5e09",
      expiresInSeconds: 300,
      resendAfterSeconds: 30,
      developmentCode: "1234",
    });
  });

  it("creates a registration challenge for a new customer", async () => {
    const result = await requestCustomerCode({
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
    });

    expect(mocks.createCustomerOtpChallenge).toHaveBeenCalledWith({
      purpose: "CUSTOMER_REGISTRATION",
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
    });

    expect(result.nextStep).toBe("VERIFY_CODE");
  });

  it("rejects a mobile belonging to another role", async () => {
    mocks.findAccountByMobile.mockResolvedValue({
      id: 20,
      role: "DELIVERY_PARTNER",
      status: "ACTIVE",
      mobile: "+919876543210",
    });

    await expect(
      requestCustomerCode({
        mobile: "+919876543210",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "ACCOUNT_ROLE_CONFLICT",
    } satisfies Partial<AppError>);

    expect(mocks.reserveCustomerOtpSend).not.toHaveBeenCalled();
  });

  it("rejects an inactive customer account", async () => {
    mocks.findAccountByMobile.mockResolvedValue({
      id: 12,
      role: "CUSTOMER",
      status: "SUSPENDED",
      mobile: "+919876543210",
    });

    await expect(
      requestCustomerCode({
        mobile: "+919876543210",
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      code: "ACCOUNT_NOT_ACTIVE",
    } satisfies Partial<AppError>);
  });

  it.each([
    {
      allowance: {
        allowed: false,
        reason: "COOLDOWN",
        retryAfterSeconds: 18,
      },
      expectedCode: "OTP_RESEND_COOLDOWN",
    },
    {
      allowance: {
        allowed: false,
        reason: "HOURLY_LIMIT",
        retryAfterSeconds: 2_400,
      },
      expectedCode: "OTP_HOURLY_LIMIT",
    },
  ])("rejects OTP requests when the send limit is reached", async ({ allowance, expectedCode }) => {
    mocks.findAccountByMobile.mockResolvedValue({
      id: 12,
      role: "CUSTOMER",
      status: "ACTIVE",
      mobile: "+919876543210",
    });

    mocks.reserveCustomerOtpSend.mockResolvedValue(allowance);

    await expect(
      requestCustomerCode({
        mobile: "+919876543210",
      }),
    ).rejects.toMatchObject({
      statusCode: 429,
      code: expectedCode,
      details: {
        retryAfterSeconds: allowance.retryAfterSeconds,
      },
    });

    expect(mocks.createCustomerOtpChallenge).not.toHaveBeenCalled();
  });
});
