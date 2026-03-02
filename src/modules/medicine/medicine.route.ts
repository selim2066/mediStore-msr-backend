import { Router } from "express"
import { MedicineController,  } from "./medicine.controller"
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";

const router = Router();

// ! create medicine route
router.post("/", authMiddleware(UserRole.SELLER, UserRole.ADMIN), MedicineController.createMedicineController)



// ! get all medicine route
router.get("/", MedicineController.getAllMedicineController)

// ! get medicine by id route
router.get("/:id", MedicineController.getMedicineByIdController)
export const MedicineRoutes = router;