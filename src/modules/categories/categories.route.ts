import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { CategoryController } from "./categories.controller";

const router = Router();
// !category routes


// public
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// admin only
router.post("/", authMiddleware(UserRole.ADMIN), CategoryController.createCategory);
router.put("/:id", authMiddleware(UserRole.ADMIN), CategoryController.updateCategory);
router.delete("/:id", authMiddleware(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoriesRoutes = router;