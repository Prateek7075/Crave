import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../src/common/errors/app-error.js";

const serviceMocks = vi.hoisted(() => ({
  requestCustomerCode: vi.fn(),
}));

vi.mock("../src/features/auth/customer/customer-auth.service.js", () => ({
  requestCustomerCode: serviceMocks.requestCustomerCode,
}));

import { createApp } from "../src/app.js";

describe("customer authentication routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks a new customer for registration details", async () => {
    serviceMocks.requestCustomerCode.mockResolvedValue({
      nextStep: "ENTER_REGISTRATION_DETAILS",
    });

    const response = await request(createApp()).post("/api/v1/auth/customer/request-code").send({
      mobile: "9876543210",
    });

    expect(response.status).toBe(200);

    expect(serviceMocks.requestCustomerCode).toHaveBeenCalledWith({
      mobile: "+919876543210",
    });

    expect(response.headers["cache-control"]).toBe("no-store");

    expect(response.body).toEqual({
      success: true,
      data: {
        nextStep: "ENTER_REGISTRATION_DETAILS",
      },
      message: "Registration details are required",
    });
  });

  it("returns an OTP challenge for a valid request", async () => {
    serviceMocks.requestCustomerCode.mockResolvedValue({
      nextStep: "VERIFY_CODE",
      challengeId: "54eb34f7-cce4-4757-880a-90ce174b5e09",
      expiresInSeconds: 300,
      resendAfterSeconds: 30,
      developmentCode: "1234",
    });

    const response = await request(createApp()).post("/api/v1/auth/customer/request-code").send({
      mobile: "+919876543210",
      fullName: "  Prateek Yadav  ",
    });

    expect(response.status).toBe(200);

    expect(serviceMocks.requestCustomerCode).toHaveBeenCalledWith({
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
    });

    expect(response.body).toEqual({
      success: true,
      data: {
        nextStep: "VERIFY_CODE",
        challengeId: "54eb34f7-cce4-4757-880a-90ce174b5e09",
        expiresInSeconds: 300,
        resendAfterSeconds: 30,
        developmentCode: "1234",
      },
      message: "Verification code requested successfully",
    });
  });

  it("rejects invalid request data before calling the service", async () => {
    const response = await request(createApp()).post("/api/v1/auth/customer/request-code").send({
      mobile: "5123456789",
    });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request data is invalid",
      },
      requestId: response.headers["x-request-id"],
    });

    expect(serviceMocks.requestCustomerCode).not.toHaveBeenCalled();
  });

  it("forwards service errors to the central error handler", async () => {
    serviceMocks.requestCustomerCode.mockRejectedValue(
      new AppError(
        "This mobile number is registered for a different account type",
        409,
        "ACCOUNT_ROLE_CONFLICT",
      ),
    );

    const response = await request(createApp()).post("/api/v1/auth/customer/request-code").send({
      mobile: "9876543210",
    });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "ACCOUNT_ROLE_CONFLICT",
        message: "This mobile number is registered for a different account type",
      },
      requestId: response.headers["x-request-id"],
    });
  });
});
