import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  account: {
    findUnique: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: prismaMocks,
}));

import { findAccountByMobile } from "../src/features/auth/customer/customer-auth.repository.js";

describe("customer authentication repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("looks up an account using the normalized mobile number", async () => {
    prismaMocks.account.findUnique.mockResolvedValue({
      id: 12,
      role: "CUSTOMER",
      status: "ACTIVE",
      mobile: "+919876543210",
    });

    const result = await findAccountByMobile("+919876543210");

    expect(prismaMocks.account.findUnique).toHaveBeenCalledWith({
      where: {
        mobile: "+919876543210",
      },

      select: {
        id: true,
        role: true,
        status: true,
        mobile: true,
      },
    });

    expect(result).toEqual({
      id: 12,
      role: "CUSTOMER",
      status: "ACTIVE",
      mobile: "+919876543210",
    });
  });

  it("returns null when the mobile number is unused", async () => {
    prismaMocks.account.findUnique.mockResolvedValue(null);

    const result = await findAccountByMobile("+919876543210");

    expect(result).toBeNull();
  });
});
