import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/:farmerId/products", asyncHandler(productController.listFarmerProducts));

export default router;
