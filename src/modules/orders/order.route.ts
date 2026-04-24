
import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { OrderController } from "./order.controller";

const router = Router();

// customer
router.post("/", authMiddleware(UserRole.CUSTOMER), OrderController.createOrder);
router.get("/", authMiddleware(UserRole.CUSTOMER), OrderController.getCustomerOrders);
router.patch("/:id/cancel", authMiddleware(UserRole.CUSTOMER), OrderController.cancelOrder);

// seller — before /:id
router.get("/seller", authMiddleware(UserRole.SELLER), OrderController.getSellerOrders);
router.patch("/seller/:id/status", authMiddleware(UserRole.SELLER), OrderController.updateOrderStatus);

// admin — before /:id
router.get("/admin/all", authMiddleware(UserRole.ADMIN), OrderController.getAllOrdersAdmin);
// router.patch("/admin/:id/status", authMiddleware(UserRole.ADMIN), OrderController.updateOrderStatus);
router.patch("/admin/:id/status", authMiddleware(UserRole.ADMIN), OrderController.updateOrderStatusAdmin);

// /:id always last
router.get("/:id", authMiddleware(UserRole.CUSTOMER), OrderController.getCustomerOrderById);

export const OrdersRoutes = router;

