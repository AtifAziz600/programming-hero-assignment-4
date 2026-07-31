// src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import gearRoutes from "./modules/gear/gear.route";
import categoryRoutes from "./modules/category/category.route";
import rentalRoutes from "./modules/rental/rental.route";
import paymentRoutes from "./modules/payment/payment.route";
import reviewRoutes from "./modules/review/review.route";
import providerRoutes from "./modules/provider/provider.route";
import adminRoutes from "./modules/admin/admin.route";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", (_req, res) => res.send("GearUp API is running"));
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found", errorDetails: undefined });
});
app.use(errorHandler);
export default app;
