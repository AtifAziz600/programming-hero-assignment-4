import { Request, Response } from "express";
import * as adminService from "./admin.service";

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({ success: true, data: users });
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body as { status: "ACTIVE" | "SUSPENDED" };
  const user = await adminService.updateUserStatus(req.params.id as string, status);
  res.status(200).json({ success: true, data: user });
};

export const getAllGearAdmin = async (_req: Request, res: Response) => {
  const gear = await adminService.getAllGearAdmin();
  res.status(200).json({ success: true, data: gear });
};

export const getAllRentalsAdmin = async (_req: Request, res: Response) => {
  const rentals = await adminService.getAllRentalsAdmin();
  res.status(200).json({ success: true, data: rentals });
};