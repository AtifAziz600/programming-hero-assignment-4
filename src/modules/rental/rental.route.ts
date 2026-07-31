import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";
import { createRentalOrder, getUserRentals, getRentalById } from "./rental.controller";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const router = Router();

router.post("/", authenticate, authorize("CUSTOMER"), validate(z.object({ startDate: z.string().min(1), endDate: z.string().min(1), items: z.array(z.object({ gearItemId: z.string(), quantity: z.number().int().positive() })).min(1) })), createRentalOrder);
router.get("/", authenticate, getUserRentals);
router.get("/:id", authenticate, getRentalById);

export default router;