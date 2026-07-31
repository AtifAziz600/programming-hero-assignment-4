import { Request, Response } from "express";
import * as providerService from "./provider.service";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED"]),
});

export const getProviderOrders = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const orders = await providerService.getProviderOrders(providerId);
  res.status(200).json({ success: true, data: orders });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const { status } = updateOrderStatusSchema.parse(req.body);
  const order = await providerService.updateOrderStatus(providerId, req.params.id as string, status);
  res.status(200).json({ success: true, data: order });
};