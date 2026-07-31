import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";
import { createRentalOrder, getUserRentals, getRentalById } from "./rental.controller";

const router = Router();

router.post("/", authenticate, authorize("CUSTOMER"), createRentalOrder);
router.get("/", authenticate, getUserRentals);
router.get("/:id", authenticate, getRentalById);

export default router;