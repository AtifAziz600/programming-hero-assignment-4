// src/modules/provider/provider.route.ts  (PROVIDER-ONLY)
import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";
import { createGear, updateGear, deleteGear } from "../gear/gear.controller";
import { getProviderOrders, updateOrderStatus } from "./provider.controller";

const router = Router();

router.post("/gear", authenticate, authorize("PROVIDER"), createGear);
router.put("/gear/:id", authenticate, authorize("PROVIDER"), updateGear);
router.delete("/gear/:id", authenticate, authorize("PROVIDER"), deleteGear);

router.get("/orders", authenticate, authorize("PROVIDER"), getProviderOrders);
router.patch("/orders/:id", authenticate, authorize("PROVIDER"), updateOrderStatus);

export default router;