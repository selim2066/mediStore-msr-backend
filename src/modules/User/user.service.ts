import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
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

export const UserService = {
  getAllUsers,
  updateUserStatus,
};