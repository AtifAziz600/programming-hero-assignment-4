import { Request, Response } from "express";
import * as reviewService from "./review.service";

export const createReview = async (req: Request, res: Response) => {
  const customerId = (req as any).user.id;
  const review = await reviewService.createReview(customerId, req.body);
  res.status(201).json({ success: true, data: review });
};