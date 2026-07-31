// src/modules/provider/provider.route.ts  (PROVIDER-ONLY)
import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";
import { createGear, updateGear, deleteGear } from "../gear/gear.controller";
import { getProviderOrders, updateOrderStatus } from "./provider.controller";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const router = Router();

router.post("/gear", authenticate, authorize("PROVIDER"), validate(z.object({ name: z.string().min(1), description: z.string().optional(), brand: z.string().optional(), pricePerDay: z.number().positive(), categoryId: z.string(), images: z.array(z.string()).optional(), stock: z.number().int().positive().optional() })), createGear);
router.put("/gear/:id", authenticate, authorize("PROVIDER"), validate(z.object({ name: z.string().min(1).optional(), description: z.string().optional(), brand: z.string().optional(), pricePerDay: z.number().positive().optional(), categoryId: z.string().optional(), images: z.array(z.string()).optional(), stock: z.number().int().positive().optional(), isAvailable: z.boolean().optional() })), updateGear);
router.delete("/gear/:id", authenticate, authorize("PROVIDER"), deleteGear);

router.get("/orders", authenticate, authorize("PROVIDER"), getProviderOrders);
router.patch("/orders/:id", authenticate, authorize("PROVIDER"), validate(z.object({ status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED"]) })), updateOrderStatus);

export default router;