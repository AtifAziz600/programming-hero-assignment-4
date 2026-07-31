import * as gearService from "./gear.service";
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
export const getAllGear = async (req, res) => {
    const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        brand: req.query.brand,
    };
    const gear = await gearService.getAllGear(filters);
    res.status(200).json({ success: true, data: gear });
};
export const getGearById = async (req, res) => {
    const gear = await gearService.getGearById(req.params.id);
    res.status(200).json({ success: true, data: gear });
};
export const createGear = async (req, res) => {
    const providerId = req.user.id;
    const data = createGearSchema.parse(req.body);
    const gear = await gearService.createGear(providerId, data);
    res.status(201).json({ success: true, data: gear });
};
export const updateGear = async (req, res) => {
    const providerId = req.user.id;
    const data = updateGearSchema.parse(req.body);
    const gear = await gearService.updateGear(providerId, req.params.id, data);
    res.status(200).json({ success: true, data: gear });
};
export const deleteGear = async (req, res) => {
    const providerId = req.user.id;
    await gearService.deleteGear(providerId, req.params.id);
    res.status(200).json({ success: true, message: "Gear item deleted" });
};
