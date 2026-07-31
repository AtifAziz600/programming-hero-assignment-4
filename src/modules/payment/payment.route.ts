import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createPayment, confirmPayment, getUserPayments, getPaymentById } from "./payment.controller";

const router = Router();

router.post("/create", authenticate, createPayment);
router.post("/confirm", authenticate, confirmPayment);
router.get("/", authenticate, getUserPayments);
router.get("/:id", authenticate, getPaymentById);

export default router;