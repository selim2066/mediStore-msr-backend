import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { ReviewController } from "./reviews.controller";

const router = Router();

// public
router.get("/medicine/:medicineId", ReviewController.getMedicineReviews);

// customer only
router.post("/", authMiddleware(UserRole.CUSTOMER), ReviewController.createReview);
router.delete("/:id", authMiddleware(UserRole.CUSTOMER), ReviewController.deleteReview);

export const ReviewsRoutes = router;