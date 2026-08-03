import { prisma } from "../../../config/prisma.js";

export async function findAccountByMobile(mobile: string) {
  return prisma.account.findUnique({
    where: {
      mobile,
    },

    select: {
      id: true,
      role: true,
      status: true,
      mobile: true,
    },
  });
}

export type AccountByMobile = Awaited<ReturnType<typeof findAccountByMobile>>;
