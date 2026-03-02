import paginationSortingHelpers from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";

type GetAllMedicinesQuery = {
  category?: string;
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
    category,
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
  if (category) {
    andConditions.push({ categoryId: category });
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
  const pagination = paginationSortingHelpers({ page, limit, sortBy, sortOrder });


  const allMedicines = await prisma.medicine.findMany({
    where:{ AND: andConditions.length > 0 ? andConditions : undefined },
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

// !get medicine by id service
const getMedicineByIdService = async (id: string) => {
  return await prisma.medicine.findUnique({
    where: { id },
  });
};
export const MedicineService = {
  createMedicineService,
  getAllMedicinesService,
  getMedicineByIdService,
};
