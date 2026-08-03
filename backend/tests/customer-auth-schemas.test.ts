import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  customerRequestCodeBodySchema,
  customerVerifyCodeBodySchema,
} from "../src/features/auth/customer/customer-auth.schemas.js";

describe("customer authentication request schemas", () => {
  it("accepts and normalizes a mobile-only request", () => {
    const result = customerRequestCodeBodySchema.parse({
      mobile: "9876543210",
    });

    expect(result).toEqual({
      mobile: "+919876543210",
    });
  });

  it("accepts and trims registration details", () => {
    const result = customerRequestCodeBodySchema.parse({
      mobile: "+919876543210",
      fullName: "  Prateek Yadav  ",
    });

    expect(result).toEqual({
      mobile: "+919876543210",
      fullName: "Prateek Yadav",
    });
  });

  it("rejects an invalid full name", () => {
    const result = customerRequestCodeBodySchema.safeParse({
      mobile: "9876543210",
      fullName: "P",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unexpected request properties", () => {
    const result = customerRequestCodeBodySchema.safeParse({
      mobile: "9876543210",
      role: "CUSTOMER",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid verification request", () => {
    const challengeId = randomUUID();

    const result = customerVerifyCodeBodySchema.parse({
      challengeId,
      code: "1234",
    });

    expect(result).toEqual({
      challengeId,
      code: "1234",
    });
  });

  it("rejects invalid verification details", () => {
    const result = customerVerifyCodeBodySchema.safeParse({
      challengeId: "not-a-valid-uuid",
      code: "12345",
    });

    expect(result.success).toBe(false);
  });
});
