import paginationSortingHelpers from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";

type GetAllMedicinesQuery = {
  categoryId?: string;
  manufacturer?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// todo #1 !create medicine service

const createMedicineService = async (
  sellerId: string,
    data: {
      name: string;
      description: string;
      price: number;
      stock: number;
      manufacturer: string;
      categoryId: string;
      image?: string;
      images?: string[];
    },
) => {
  return await prisma.medicine.create({
    data: {
      ...data,
      sellerId,
    },
  });
};

//todo #2 !get all medicines service
const getAllMedicinesService = async (query: GetAllMedicinesQuery) => {
  const {
    categoryId,
    manufacturer,
    minPrice,
    maxPrice,
    search,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const andConditions: any[] = [];

  // * a. category filter
  if (categoryId) {
    andConditions.push({ categoryId: categoryId });
  }
  //* b. manufacturer filter
  if (manufacturer) {
    andConditions.push({
      manufacturer: { contains: manufacturer, mode: "insensitive" },
    });
  }
  //* c. price range filter
  const paseMinPrice = minPrice ? parseFloat(minPrice) : undefined;
  const paseMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
  if (paseMinPrice !== undefined || paseMaxPrice !== undefined) {
    const priceFilter: any = {};
    // Validate min ≤ max
    if (
      paseMinPrice !== undefined &&
      paseMaxPrice !== undefined &&
      paseMinPrice > paseMaxPrice
    ) {
      throw new Error("Minimum price cannot be greater than maximum price");
    }
    if (paseMinPrice !== undefined) priceFilter.gte = paseMinPrice;
    if (paseMaxPrice !== undefined) priceFilter.lte = paseMaxPrice;
    andConditions.push({ price: priceFilter });
  }

  //* d. Search filter (OR logic)
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // * e. Pagination & sorting using helper
  const pagination = paginationSortingHelpers({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const allMedicines = await prisma.medicine.findMany({
    where: { AND: andConditions.length > 0 ? andConditions : undefined },
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: { [pagination.sortBy as string]: pagination.sortOrder },
    include: {
      category: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  });
  const total_medicine = await prisma.medicine.count({
    where: andConditions.length > 0 ? { AND: andConditions } : undefined,
  });
  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total_medicine,
      totalPages: Math.ceil(total_medicine / pagination.limit),
    },
    data: allMedicines,
  };
};

// todo #2.1 get seller medicines service
const getSellerMedicinesService = async (
  sellerId: string,
  options: { page?: number | string; limit?: number | string } = {}
) => {
  const { page, limit, skip } = paginationSortingHelpers({
    page: options.page,
    limit: options.limit,
  });

  const [data, total] = await Promise.all([
    prisma.medicine.findMany({
      where: { sellerId },
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.medicine.count({ where: { sellerId } }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total_medicine: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// todo #3 get medicine by id service
const getMedicineByIdService = async (id: string) => {
  return await prisma.medicine.findUnique({
    where: { id },
  });
};

// todo #4 update medicine service
const updateMedicineService = async (
  sellerId: string,
  isAdmin: boolean,
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    manufacturer?: string;
    image?: string;
    images?: string[];
    categoryId?: string;
  },
) => {
  if (!Object.keys(data).length) {
    throw new Error("No fields provided to update");
  }
  // * 1. Check if medicine exists and belongs to the seller
  const existingMedicine = await prisma.medicine.findUnique({
    where: { id },
  }); //here id is medicine id from params

  if (!existingMedicine) {
    throw new Error("Medicine not found");
  }
  if (!isAdmin && existingMedicine.sellerId !== sellerId) {
    throw new Error("Unauthorized: You can only update your own medicines");
  }

  // * 2. If categoryId is being updated, verify it actually exists
  if (data.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  // * 3. Update the medicine
  return await prisma.medicine.update({
    where: { id },
    data,
  });
};

// todo #5 delete medicine service
const deleteMedicineService = async (
  param_id: string,
  sellerId: string,
  isAdmin: boolean,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: param_id },
  });
  if (!medicine) {
    const error: any = new Error("Medicine not found");
    error.statusCode = 404;
    throw error;
  }
  if (!isAdmin && medicine.sellerId !== sellerId) {
    const error: any = new Error("Forbidden - You do not own this medicine");
    error.statusCode = 403;
    throw error;
  }

  return await prisma.medicine.delete({ where: { id: param_id } });
};

export const MedicineService = {
  createMedicineService,
  getAllMedicinesService,
    getSellerMedicinesService,
  getMedicineByIdService,
  updateMedicineService,
  deleteMedicineService,
};
