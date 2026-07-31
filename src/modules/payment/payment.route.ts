import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createPayment, confirmPayment, getUserPayments, getPaymentById } from "./payment.controller";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const router = Router();

router.post("/create", authenticate, validate(z.object({ rentalOrderId: z.string().min(1), method: z.enum(["STRIPE", "SSLCOMMERZ"]) })), createPayment);
router.post("/confirm", authenticate, validate(z.object({ transactionId: z.string().min(1), status: z.enum(["COMPLETED", "FAILED"]) })), confirmPayment);
router.get("/", authenticate, getUserPayments);
router.get("/:id", authenticate, getPaymentById);

export default router;