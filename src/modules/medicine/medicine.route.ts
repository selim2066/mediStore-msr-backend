import { Router } from "express"
import { MedicineController,  } from "./medicine.controller"
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { upload } from "../../config/multer.config";

const router = Router();

// todo #1 create medicine route
// router.post("/", authMiddleware(UserRole.SELLER, UserRole.ADMIN), upload.single("image"), MedicineController.createMedicineController)
// ✅ AFTER — no multer, express.json() already handles it
router.post("/", authMiddleware(UserRole.SELLER, UserRole.ADMIN), MedicineController.createMedicineController)



// todo #2 get all medicine route
router.get("/", MedicineController.getAllMedicineController)

//* 
router.get("/seller", authMiddleware(UserRole.SELLER), MedicineController.getSellerMedicinesController)

// todo #3 get medicine by id route
router.get("/:id", MedicineController.getMedicineByIdController)

// todo #4 update medicine route
router.put("/:id", authMiddleware(UserRole.SELLER, UserRole.ADMIN), MedicineController.updateMedicineController)

// todo #5 delete medicine route
router.delete("/:id", authMiddleware(UserRole.SELLER, UserRole.ADMIN), MedicineController.deleteMedicineController)

export const MedicineRoutes = router;