import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { medicineId, rating, comment } = req.body;

    if (!medicineId || !rating) {
      res.status(400).json({
        success: false,
        message: "Medicine ID and rating are required",
      });
      return;
    }

    const review = await ReviewService.createReview(req.user!.id, {
      medicineId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicineReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await ReviewService.getMedicineReviews(
      req.params.medicineId as string
    );
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ReviewService.deleteReview(req.params.id as string, req.user!.id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getMedicineReviews,
  deleteReview,
};