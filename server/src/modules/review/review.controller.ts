import { Request, Response } from "express";
import * as reviewService from "./review.service";
import { z } from "zod";

const createReviewSchema = z.object({
  gearItemId: z.string().min(1, "Gear item ID is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().optional(),
});

export const createReview = async (req: Request, res: Response) => {
  const customerId = (req as any).user.id;
  const data = createReviewSchema.parse(req.body);
  const review = await reviewService.createReview(customerId, data);
  res.status(201).json({ success: true, data: review });
};