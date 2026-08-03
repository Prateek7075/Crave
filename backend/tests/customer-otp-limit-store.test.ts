import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMocks = vi.hoisted(() => ({
  eval: vi.fn(),
}));

vi.mock("../src/config/redis.js", () => ({
  redisClient: redisMocks,
}));

import {
  CUSTOMER_OTP_HOURLY_WINDOW_SECONDS,
  CUSTOMER_OTP_MAX_SENDS_PER_HOUR,
  CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS,
  reserveCustomerOtpSend,
} from "../src/features/auth/customer/customer-otp-limit.store.js";

describe("customer OTP send limits", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    redisMocks.eval.mockResolvedValue([1]);
  });

  it("reserves an allowed OTP request atomically", async () => {
    const result = await reserveCustomerOtpSend("+919876543210");

    expect(result).toEqual({
      allowed: true,
    });

    expect(redisMocks.eval).toHaveBeenCalledWith(expect.any(String), {
      keys: ["auth:customer:otp:cooldown:+919876543210", "auth:customer:otp:hourly:+919876543210"],

      arguments: [
        String(CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS),
        String(CUSTOMER_OTP_HOURLY_WINDOW_SECONDS),
        String(CUSTOMER_OTP_MAX_SENDS_PER_HOUR),
      ],
    });
  });

  it("returns the remaining resend cooldown", async () => {
    redisMocks.eval.mockResolvedValue([0, 1, 18]);

    const result = await reserveCustomerOtpSend("+919876543210");

    expect(result).toEqual({
      allowed: false,
      reason: "COOLDOWN",
      retryAfterSeconds: 18,
    });
  });

  it("returns the remaining hourly-limit time", async () => {
    redisMocks.eval.mockResolvedValue([0, 2, 2_400]);

    const result = await reserveCustomerOtpSend("+919876543210");

    expect(result).toEqual({
      allowed: false,
      reason: "HOURLY_LIMIT",
      retryAfterSeconds: 2_400,
    });
  });

  it("uses safe fallback times for invalid TTL results", async () => {
    redisMocks.eval.mockResolvedValueOnce([0, 1, 0]).mockResolvedValueOnce([0, 2, -1]);

    const cooldownResult = await reserveCustomerOtpSend("+919876543210");

    const hourlyResult = await reserveCustomerOtpSend("+919876543210");

    expect(cooldownResult).toEqual({
      allowed: false,
      reason: "COOLDOWN",
      retryAfterSeconds: CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS,
    });

    expect(hourlyResult).toEqual({
      allowed: false,
      reason: "HOURLY_LIMIT",
      retryAfterSeconds: CUSTOMER_OTP_HOURLY_WINDOW_SECONDS,
    });
  });
});
