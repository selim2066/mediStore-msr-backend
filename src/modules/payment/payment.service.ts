import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const sslcommerz = new SSLCommerzPayment(
  config.ssl.storeId,
  config.ssl.storePassword,
  config.ssl.isLive,
);

export const initiatePayment = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: true, items: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.customerId !== userId) throw new Error("Unauthorized");
  if (order.paymentStatus === "PAID") throw new Error("Order already paid");

  const tran_id = `MEDISTORE-${orderId}-${Date.now()}`;

  const payload = {
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id,
    success_url: `${config.backendUrl}/api/payment/success`,
    fail_url: `${config.backendUrl}/api/payment/fail`,
    cancel_url: `${config.backendUrl}/api/payment/cancel`,
    ipn_url: `${config.backendUrl}/api/payment/ipn`,
    product_name: "MediStore Order",
    product_category: "Medicine",
    product_profile: "general",
    cus_name: order.customer.name,
    cus_email: order.customer.email,
    cus_add1: order.shippingAddress,
    cus_phone: order.customer.phone ?? "01700000000",
    shipping_method: "NO",
    num_of_item: order.items.length,
  };

  console.log("SSLCommerz payload:", JSON.stringify(payload, null, 2));
  const response = await sslcommerz.init(payload);

  if (!response?.GatewayPageURL) {
    throw new Error("Failed to initiate payment. Try again.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { transactionId: tran_id, paymentMethod: "ONLINE" },
  });

  return { gatewayUrl: response.GatewayPageURL };
};

export const handleSuccess = async (body: Record<string, string>) => {
  const { val_id, tran_id, status } = body;

  if (status !== "VALID" && status !== "VALIDATED") {
    return `${config.frontendUrl}/payment/fail`;
  }

  // Always validate — never trust redirect alone
  const validation = await sslcommerz.validate({ val_id });

  if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
    return `${config.frontendUrl}/payment/fail`;
  }

  const order = await prisma.order.findFirst({
    where: { transactionId: tran_id },
  });

  if (!order) return `${config.frontendUrl}/payment/fail`;

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "PAID", paymentMethod: "ONLINE" },
  });

  return `${config.frontendUrl}/payment/success?orderId=${order.id}`;
};

export const handleFail = async (body: Record<string, string>) => {
  const { tran_id } = body;

  const order = await prisma.order.findFirst({
    where: { transactionId: tran_id },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED", paymentMethod: "ONLINE" },
    });
  }

  return `${config.frontendUrl}/payment/fail?orderId=${order?.id ?? ""}`;
};

export const handleCancel = async (body: Record<string, string>) => {
  const { tran_id } = body;

  const order = await prisma.order.findFirst({
    where: { transactionId: tran_id },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "CANCELLED", paymentMethod: "ONLINE" },
    });
  }

  return `${config.frontendUrl}/payment/cancel?orderId=${order?.id ?? ""}`;
};
