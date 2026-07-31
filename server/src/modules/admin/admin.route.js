// src/modules/admin/admin.route.ts
import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";
import { getAllUsers, updateUserStatus, getAllGearAdmin, getAllRentalsAdmin } from "./admin.controller";
import { validate } from "../../middlewares/validate";
import { z } from "zod";
const router = Router();
router.get("/users", authenticate, authorize("ADMIN"), getAllUsers);
router.patch("/users/:id", authenticate, authorize("ADMIN"), validate(z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) })), updateUserStatus);
router.get("/gear", authenticate, authorize("ADMIN"), getAllGearAdmin);
router.get("/rentals", authenticate, authorize("ADMIN"), getAllRentalsAdmin);
export default router;
