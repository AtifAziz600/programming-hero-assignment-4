import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createPayment, getUserPayments, getPaymentById } from "./payment.controller";
import * as paymentService from "./payment.service";
import Stripe from "stripe";
import { validate } from "../../middlewares/validate";
import { z } from "zod";
import express from "express";
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
router.post("/create", authenticate, validate(z.object({ rentalOrderId: z.string().min(1), method: z.enum(["STRIPE", "SSLCOMMERZ"]) })), createPayment);
router.post("/confirm", authenticate, validate(z.object({ transactionId: z.string().min(1), status: z.enum(["COMPLETED", "FAILED"]) })), async (req, res) => {
    const { transactionId, status } = req.body;
    const payment = await paymentService.confirmPayment(transactionId, status);
    res.status(200).json({ success: true, data: payment });
});
router.get("/", authenticate, getUserPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig)
        return res.status(400).send("Missing stripe-signature header");
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    }
    catch (err) {
        return res.status(400).json({ success: false, message: `Webhook signature verification failed: ${err.message}` });
    }
    const session = event.data.object;
    if (event.type === "checkout.session.completed") {
        try {
            await paymentService.confirmPayment(session.id, "COMPLETED");
        }
        catch (e) {
            console.error("Failed to confirm payment via webhook", e);
        }
    }
    res.json({ received: true });
});
router.get("/success", (req, res) => {
    const sessionId = req.query.session_id;
    res.redirect(`${process.env.STRIPE_SUCCESS_URL || "http://localhost:5000/api/payments/success"}?session_id=${sessionId}`);
});
router.get("/cancel", (req, res) => {
    res.redirect(process.env.STRIPE_CANCEL_URL || "http://localhost:5000/api/payments/cancel");
});
export default router;
