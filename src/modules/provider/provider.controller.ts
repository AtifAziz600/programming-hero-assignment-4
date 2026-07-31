import { Request, Response } from "express";
import * as providerService from "./provider.service";

export const getProviderOrders = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const orders = await providerService.getProviderOrders(providerId);
  res.status(200).json({ success: true, data: orders });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const { status } = req.body as { status: "CONFIRMED" | "PICKED_UP" | "RETURNED" };
  const order = await providerService.updateOrderStatus(providerId, req.params.id as string, status);
  res.status(200).json({ success: true, data: order });
};