import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createReview } from "./review.controller";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const router = Router();

router.post("/", authenticate, validate(z.object({ gearItemId: z.string().min(1), rating: z.number().int().min(1).max(5), comment: z.string().optional() })), createReview);

export default router;