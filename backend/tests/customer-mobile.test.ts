import { describe, expect, it } from "vitest";

import { indianMobileSchema } from "../src/features/auth/customer/customer-mobile.js";

describe("Indian customer mobile validation", () => {
  it("normalizes a valid 10-digit mobile number", () => {
    const result = indianMobileSchema.parse("9876543210");

    expect(result).toBe("+919876543210");
  });

  it("preserves an already normalized Indian number", () => {
    const result = indianMobileSchema.parse("+919876543210");

    expect(result).toBe("+919876543210");
  });

  it("trims surrounding whitespace", () => {
    const result = indianMobileSchema.parse("  9876543210  ");

    expect(result).toBe("+919876543210");
  });

  it("rejects a number that does not start with 6 to 9", () => {
    const result = indianMobileSchema.safeParse("5123456789");

    expect(result.success).toBe(false);
  });

  it("rejects unsupported mobile formats", () => {
    const invalidNumbers = ["919876543210", "+449876543210", "98765", "98765abcde"];

    for (const mobile of invalidNumbers) {
      const result = indianMobileSchema.safeParse(mobile);

      expect(result.success).toBe(false);
    }
  });
});
