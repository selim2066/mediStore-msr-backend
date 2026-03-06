import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/authMiddleware";
import { OrderController } from "./order.controller";

const router = Router();

// customer
router.post("/", authMiddleware(UserRole.CUSTOMER), OrderController.createOrder);
router.get("/", authMiddleware(UserRole.CUSTOMER), OrderController.getCustomerOrders);//all orders of a customer
router.get("/:id", authMiddleware(UserRole.CUSTOMER), OrderController.getCustomerOrderById);//single order details_orderId
router.patch("/:id/cancel", authMiddleware(UserRole.CUSTOMER), OrderController.cancelOrder);

// seller
router.get("/seller/all", authMiddleware(UserRole.SELLER), OrderController.getSellerOrders);
router.patch("/seller/:id/status", authMiddleware(UserRole.SELLER), OrderController.updateOrderStatus);

// admin
router.get("/admin/all", authMiddleware(UserRole.ADMIN), OrderController.getAllOrdersAdmin);

export const OrdersRoutes = router;