import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMocks = vi.hoisted(() => {
  const transaction = {
    hSet: vi.fn(),
    expire: vi.fn(),
    exec: vi.fn(),
  };

  transaction.hSet.mockReturnValue(transaction);
  transaction.expire.mockReturnValue(transaction);

  const client = {
    multi: vi.fn(() => transaction),
    hGetAll: vi.fn(),
    del: vi.fn(),
  };

  return {
    transaction,
    client,
  };
});

vi.mock("../src/config/redis.js", () => ({
  redisClient: redisMocks.client,
}));

import {
  CUSTOMER_OTP_CHALLENGE_TTL_SECONDS,
  createCustomerOtpChallenge,
  deleteCustomerOtpChallenge,
  findCustomerOtpChallenge,
} from "../src/features/auth/customer/customer-otp-challenge.store.js";

describe("customer OTP challenge store", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    redisMocks.transaction.hSet.mockReturnValue(redisMocks.transaction);

    redisMocks.transaction.expire.mockReturnValue(redisMocks.transaction);

    redisMocks.transaction.exec.mockResolvedValue([]);

    redisMocks.client.hGetAll.mockResolvedValue({});
    redisMocks.client.del.mockResolvedValue(1);
  });

  it("stores a registration challenge with an expiry", async () => {
    const challengeId = await createCustomerOtpChallenge({
      purpose: "CUSTOMER_REGISTRATION",
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
    });

    const expectedKey = `auth:customer:otp:${challengeId}`;

    expect(challengeId).toEqual(expect.any(String));

    expect(redisMocks.client.multi).toHaveBeenCalledTimes(1);

    expect(redisMocks.transaction.hSet).toHaveBeenCalledWith(expectedKey, {
      purpose: "CUSTOMER_REGISTRATION",
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
      failedAttempts: "0",
    });

    expect(redisMocks.transaction.expire).toHaveBeenCalledWith(
      expectedKey,
      CUSTOMER_OTP_CHALLENGE_TTL_SECONDS,
    );

    expect(redisMocks.transaction.exec).toHaveBeenCalledTimes(1);
  });

  it("reads and parses an existing challenge", async () => {
    const challengeId = randomUUID();

    redisMocks.client.hGetAll.mockResolvedValue({
      purpose: "CUSTOMER_LOGIN",
      mobile: "+919876543210",
      failedAttempts: "2",
    });

    const result = await findCustomerOtpChallenge(challengeId);

    expect(result).toEqual({
      challengeId,
      purpose: "CUSTOMER_LOGIN",
      mobile: "+919876543210",
      failedAttempts: 2,
    });
  });

  it("returns null when the challenge does not exist", async () => {
    const result = await findCustomerOtpChallenge(randomUUID());

    expect(result).toBeNull();
  });

  it("deletes invalid stored challenge data", async () => {
    const challengeId = randomUUID();
    const expectedKey = `auth:customer:otp:${challengeId}`;

    redisMocks.client.hGetAll.mockResolvedValue({
      purpose: "INVALID_PURPOSE",
      mobile: "+919876543210",
      failedAttempts: "0",
    });

    await expect(findCustomerOtpChallenge(challengeId)).rejects.toThrow(
      "Stored customer OTP challenge is invalid",
    );

    expect(redisMocks.client.del).toHaveBeenCalledWith(expectedKey);
  });

  it("deletes a challenge explicitly", async () => {
    const challengeId = randomUUID();
    const expectedKey = `auth:customer:otp:${challengeId}`;

    await deleteCustomerOtpChallenge(challengeId);

    expect(redisMocks.client.del).toHaveBeenCalledWith(expectedKey);
  });
});
