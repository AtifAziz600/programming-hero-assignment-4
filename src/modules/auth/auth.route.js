// src/modules/auth/auth.route.ts
import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { z } from "zod";
const router = Router();
router.post("/register", validate(z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]) })), register);
router.post("/login", validate(z.object({ email: z.string().email(), password: z.string().min(1) })), login);
router.get("/me", authenticate, getMe);
export default router;
