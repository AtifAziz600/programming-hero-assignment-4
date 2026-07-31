import * as rentalService from "./rental.service";
import { z } from "zod";
const createRentalSchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    items: z.array(z.object({
        gearItemId: z.string().min(1, "Gear item ID is required"),
        quantity: z.number().int().positive("Quantity must be a positive integer"),
    })).min(1, "At least one item is required"),
});
export const createRentalOrder = async (req, res) => {
    const customerId = req.user.id;
    const data = createRentalSchema.parse(req.body);
    const order = await rentalService.createRentalOrder(customerId, data);
    res.status(201).json({ success: true, data: order });
};
export const getUserRentals = async (req, res) => {
    const customerId = req.user.id;
    const rentals = await rentalService.getUserRentals(customerId);
    res.status(200).json({ success: true, data: rentals });
};
export const getRentalById = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const rental = await rentalService.getRentalById(req.params.id, userId, role);
    res.status(200).json({ success: true, data: rental });
};
