import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

const createCategory = async (data: { name: string; description?: string }) => {
  return await prisma.category.create({
    data,
  });
};

const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};