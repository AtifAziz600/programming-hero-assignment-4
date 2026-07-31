import { Request, Response } from "express";
import * as rentalService from "./rental.service";

export const createRentalOrder = async (req: Request, res: Response) => {
  const customerId = (req as any).user.id;
  const order = await rentalService.createRentalOrder(customerId, req.body);
  res.status(201).json({ success: true, data: order });
};

export const getUserRentals = async (req: Request, res: Response) => {
  const customerId = (req as any).user.id;
  const rentals = await rentalService.getUserRentals(customerId);
  res.status(200).json({ success: true, data: rentals });
};

export const getRentalById = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const rental = await rentalService.getRentalById(req.params.id as string, userId, role);
  res.status(200).json({ success: true, data: rental });
};