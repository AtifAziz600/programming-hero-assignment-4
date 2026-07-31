import { Request, Response } from "express";
import * as gearService from "./gear.service";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const createGearSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  pricePerDay: z.number().positive(),
  categoryId: z.string(),
  images: z.array(z.string()).optional(),
  stock: z.number().int().positive().optional(),
});

const updateGearSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  pricePerDay: z.number().positive().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  stock: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
});

export const getAllGear = async (req: Request, res: Response) => {
  const filters = {
    category: req.query.category as string | undefined,
    minPrice: req.query.minPrice as string | undefined,
    maxPrice: req.query.maxPrice as string | undefined,
    brand: req.query.brand as string | undefined,
  };
  const gear = await gearService.getAllGear(filters);
  res.status(200).json({ success: true, data: gear });
};

export const getGearById = async (req: Request, res: Response) => {
  const gear = await gearService.getGearById(req.params.id as string);
  res.status(200).json({ success: true, data: gear });
};

export const createGear = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const data = createGearSchema.parse(req.body);
  const gear = await gearService.createGear(providerId, data);
  res.status(201).json({ success: true, data: gear });
};

export const updateGear = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  const data = updateGearSchema.parse(req.body);
  const gear = await gearService.updateGear(providerId, req.params.id as string, data);
  res.status(200).json({ success: true, data: gear });
};

export const deleteGear = async (req: Request, res: Response) => {
  const providerId = (req as any).user.id;
  await gearService.deleteGear(providerId, req.params.id as string);
  res.status(200).json({ success: true, message: "Gear item deleted" });
};