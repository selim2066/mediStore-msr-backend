import { prisma } from "../../lib/prisma";


// customer can only review if they have a DELIVERED order containing this medicine
const createReview = async (
  customerId: string,
  data: {
    medicineId: string;
    rating: number;
    comment?: string;
  }
) => {
  const { medicineId, rating, comment } = data;

  // validate rating
  if (rating < 1 || rating > 5) {
    const error: any = new Error("Rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  // check customer has a DELIVERED order containing this medicine
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      customerId,
      status: {
        in: ["CANCELLED", "DELIVERED"],
      },
      items: {
        some: { medicineId },
      },
    },
  });

  if (!deliveredOrder) {
    const error: any = new Error(
      "You can only review medicines from delivered orders"
    );
    error.statusCode = 403;
    throw error;
  }

  return await prisma.review.create({
    data: {
      customerId,
      medicineId,
      rating,
      comment,
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });
};

// get all reviews for a medicine
const getMedicineReviews = async (medicineId: string) => {
  // check medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    const error: any = new Error("Medicine not found");
    error.statusCode = 404;
    throw error;
  }

  const reviews = await prisma.review.findMany({
    where: { medicineId },
    include: {
      customer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    reviews,
  };
};

// delete review — customer can only delete their own
const deleteReview = async (id: string, customerId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    const error: any = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  if (review.customerId !== customerId) {
    const error: any = new Error("Forbidden - This is not your review");
    error.statusCode = 403;
    throw error;
  }

  return await prisma.review.delete({ where: { id } });
};

export const ReviewService = {
  createReview,
  getMedicineReviews,
  deleteReview,
};