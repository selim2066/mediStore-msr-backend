import { OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// todo #1 create order with items and deduct stock
const createOrder = async (
  customerId: string,
  data: {
    shippingAddress: string;
    items: { medicineId: string; quantity: number }[];
  },
) => {
  const { shippingAddress, items } = data;

  //?* ## use transaction — all or nothing
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    //* 1. validate stock and calculate total
    const orderItems = await Promise.all(
      items.map(async (item) => {
        
        // Find medicine in database
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

          // Check medicine exists
        if (!medicine) {
          const error: any = new Error(
            `Medicine not found: ${item.medicineId}`,
          );
          error.statusCode = 404;
          throw error;
        }
        // Check stock availability
        if (medicine.stock < item.quantity) {
          const error: any = new Error(
            `Insufficient stock for medicine: ${medicine.name}`,
          );
          error.statusCode = 400;
          throw error;
        }

        totalAmount += medicine.price * item.quantity;

        return {
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: medicine.price, // snapshot price
        };
      }),
    );

    //* 2. create order with items
    const order = await tx.order.create({
      data: {
        customerId,
        shippingAddress,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            medicine: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    //* 3. deduct(reduce as medicine sell so stock will decrease) stock for each medicine
    await Promise.all(
      items.map((item) =>
        tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    return order;
  });
};

// todo #2 get all orders for a customer
const getCustomerOrders = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      items: {
        include: {
          medicine: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// todo #3 get single order for a customer
const getCustomerOrderById = async (id: string, customerId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, image: true, price: true },
          },
        },
      },
    },
  });

  if (!order) {
    const error: any = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.customerId !== customerId) {
    const error: any = new Error("Forbidden - This is not your order");
    error.statusCode = 403;
    throw error;
  }

  return order;
};

// todo #4 customer cancel order — only if PLACED
const cancelOrder = async (id: string, customerId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    const error: any = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.customerId !== customerId) {
    const error: any = new Error("Forbidden - This is not your order");
    error.statusCode = 403;
    throw error;
  }

  if (order.status !== OrderStatus.PLACED) {
    const error: any = new Error(
      "Order can only be cancelled when status is PLACED",
    );
    error.statusCode = 400;
    throw error;
  }

  // restore stock and cancel order in transaction
  return await prisma.$transaction(async (tx) => {
    // restore stock
    await Promise.all(
      order.items.map((item) =>
        tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );

    // update order status
    return await tx.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  });
};

// todo #5 seller — get orders containing their medicines
const getSellerOrders = async (sellerId: string) => {
  return await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId },
        },
      },
    },
    include: {
      items: {
        where: {
          medicine: { sellerId },
        },
        include: {
          medicine: { select: { id: true, name: true, image: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// todo #6.1 valid status transitions for seller
const validTransitions: Record<string, OrderStatus> = {
  PLACED: OrderStatus.PROCESSING,
  PROCESSING: OrderStatus.SHIPPED,
  SHIPPED: OrderStatus.DELIVERED,
};

// todo #6.2 seller — update order status
const updateOrderStatus = async (
  id: string,
  sellerId: string,
  status: OrderStatus,
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { medicine: true },
      },
    },
  });

  if (!order) {
    const error: any = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // check seller owns at least one medicine in this order
  const sellerOwnsItem = order.items.some(
    (item) => item.medicine.sellerId === sellerId,
  );
  if (!sellerOwnsItem) {
    const error: any = new Error(
      "Forbidden - This order has no medicines from you",
    );
    error.statusCode = 403;
    throw error;
  }

  // validate status transition
  const expectedNext = validTransitions[order.status];
  if (!expectedNext || expectedNext !== status) {
    const error: any = new Error(
      `Invalid status transition from ${order.status} to ${status}`,
    );
    error.statusCode = 400;
    throw error;
  }

  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

// admin — get all orders
const getAllOrdersAdmin = async () => {
  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          medicine: { select: { id: true, name: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const OrderService = {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrdersAdmin,
};
