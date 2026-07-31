// src/modules/gear/gear.route.ts  (PUBLIC — no auth)
import { Router } from "express";
import { getAllGear, getGearById } from "./gear.controller";

const router = Router();

router.get("/", getAllGear);
router.get("/:id", getGearById);

export default router;