import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import { z } from "zod";

const createPaymentSchema = z.object({
  rentalOrderId: z.string().min(1, "Rental order ID is required"),
  method: z.enum(["STRIPE", "SSLCOMMERZ"]),
});

const confirmPaymentSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  status: z.enum(["COMPLETED", "FAILED"]),
});

export const createPayment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const data = createPaymentSchema.parse(req.body);
  const result = await paymentService.createPayment(userId, data);
  res.status(201).json({ success: true, data: result });
};

export const confirmPayment = async (req: Request, res: Response) => {
  const { transactionId, status } = confirmPaymentSchema.parse(req.body);
  const payment = await paymentService.confirmPayment(transactionId, status);
  res.status(200).json({ success: true, data: payment });
};

export const getUserPayments = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const payments = await paymentService.getUserPayments(userId);
  res.status(200).json({ success: true, data: payments });
};

export const getPaymentById = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const payment = await paymentService.getPaymentById(req.params.id as string, userId);
  res.status(200).json({ success: true, data: payment });
};