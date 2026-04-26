import paginationSortingHelpers from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";

// ✅ UPDATED — added pagination
const getAllUsers = async (
  options: { page?: number | string; limit?: number | string } = {}
) => {
  const { page, limit, skip } = paginationSortingHelpers({
    page: options.page,
    limit: options.limit,
  });

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isBanned: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.user.update({
    where: { id },
    data: { isBanned },
  });
};

const getMe = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      isBanned: true,
      image: true,
      emailVerified: true,
    },
  });
};

export const UserService = {
  getAllUsers,
  updateUserStatus,
  getMe,
};