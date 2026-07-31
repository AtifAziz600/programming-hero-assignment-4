// src/modules/payment/payment.service.ts
import prisma from "../../config/db";
import crypto from "crypto";

export const createPayment = async (
  userId: string,
  data: { rentalOrderId: string; method: "STRIPE" | "SSLCOMMERZ" }
) => {
  const rental = await prisma.rentalOrder.findUnique({ where: { id: data.rentalOrderId } });
  if (!rental) throw new Error("Rental order not found");

  // In a real integration: call Stripe/SSLCommerz SDK here to create a session,
  // then store the returned session/transaction id below.
  const transactionId = `TXN-${crypto.randomUUID()}`;

  const payment = await prisma.payment.create({
    data: {
      transactionId,
      amount: rental.totalAmount,
      method: data.method,
      status: "PENDING",
      rentalOrderId: rental.id,
      userId,
    },
  });

  // return this to the frontend so it can redirect to Stripe Checkout / SSLCommerz gateway page
  return { payment, redirectUrl: `https://sandbox-payment-gateway.example/pay/${transactionId}` };
};

// Called by the gateway's webhook/callback
export const confirmPayment = async (transactionId: string, status: "COMPLETED" | "FAILED") => {
  const payment = await prisma.payment.update({
    where: { transactionId },
    data: { status, paidAt: status === "COMPLETED" ? new Date() : null },
  });

  if (status === "COMPLETED") {
    await prisma.rentalOrder.update({
      where: { id: payment.rentalOrderId },
      data: { status: "PAID" },
    });
  }

  return payment;
};

export const getUserPayments = async (userId: string) => {
  return prisma.payment.findMany({ where: { userId }, include: { rentalOrder: true } });
};

export const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { rentalOrder: true },
  });
  if (!payment) throw new Error("Payment not found");
  if (payment.userId !== userId) throw new Error("Forbidden");
  return payment;
};