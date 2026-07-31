// src/modules/payment/payment.service.ts
import prisma from "../../config/db";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
export const createPayment = async (userId, data) => {
    const rental = await prisma.rentalOrder.findUnique({ where: { id: data.rentalOrderId } });
    if (!rental)
        throw new Error("Rental order not found");
    if (data.method === "STRIPE") {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: process.env.STRIPE_SUCCESS_URL || "http://localhost:5000/api/payments/success",
            cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:5000/api/payments/cancel",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Rental Order ${rental.id}`,
                        },
                        unit_amount: Math.round(Number(rental.totalAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                rentalOrderId: rental.id,
                userId,
            },
        });
        const payment = await prisma.payment.create({
            data: {
                transactionId: session.id,
                amount: rental.totalAmount,
                method: data.method,
                status: "PENDING",
                rentalOrderId: rental.id,
                userId,
            },
        });
        return { payment, redirectUrl: session.url || "" };
    }
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
    return { payment, redirectUrl: "" };
};
// Called by the gateway's webhook/callback
export const confirmPayment = async (transactionId, status) => {
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
export const getUserPayments = async (userId) => {
    return prisma.payment.findMany({ where: { userId }, include: { rentalOrder: true } });
};
export const getPaymentById = async (paymentId, userId) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { rentalOrder: true },
    });
    if (!payment)
        throw new Error("Payment not found");
    if (payment.userId !== userId)
        throw new Error("Forbidden");
    return payment;
};
