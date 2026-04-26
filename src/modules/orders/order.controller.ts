import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shippingAddress, items } = req.body;

    if (!shippingAddress || !items || !items.length) {
      res.status(400).json({
        success: false,
        message: "Shipping address and items are required",
      });
      return;
    }

    const order = await OrderService.createOrder(req.user!.id, {
      shippingAddress,
      items,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await OrderService.getCustomerOrders(req.user!.id);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await OrderService.getCustomerOrderById(
      req.params.id as string,
      req.user!.id
    );
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderService.cancelOrder(
      req.params.id as string,
      req.user!.id
    );
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATED — pass page & limit from query
const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const result = await OrderService.getSellerOrders(req.user!.id, {
      page: page as string,
      limit: limit as string,
    });
    res.status(200).json({ success: true, message: "Seller orders fetched successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ success: false, message: "Status is required" });
      return;
    }

    const order = await OrderService.updateOrderStatus(
      req.params.id as string,
      req.user!.id,
      status
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATED — pass page & limit from query
const getAllOrdersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const result = await OrderService.getAllOrdersAdmin({
      page: page as string,
      limit: limit as string,
    });
    res.status(200).json({ success: true, message: "All orders fetched successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatusAdmin = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = await OrderService.updateOrderStatusAdmin(id, status);
  res.json({ success: true, message: "Order status updated", data: order });
}

export const OrderController = {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
};