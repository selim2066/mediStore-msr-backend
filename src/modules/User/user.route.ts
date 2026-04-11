import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { UserController } from "./user.controller";


const router = Router();

router.get("/", authMiddleware(UserRole.ADMIN), UserController.getAllUsers);
router.get("/me", authMiddleware(), UserController.getMe);
router.patch("/:id", authMiddleware(UserRole.ADMIN), UserController.updateUserStatus);

export const UserRoutes = router;