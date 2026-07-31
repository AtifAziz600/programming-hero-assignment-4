import { Router } from "express";
import * as categoryService from "./category.service";

const router = Router();

router.get("/", categoryService.getAllCategories);

export default router;