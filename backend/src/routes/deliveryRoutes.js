import { Router } from "express";
import * as deliveryController from "../controllers/deliveryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("logistics", "admin"));

router.get("/", asyncHandler(deliveryController.listDeliveries));
router.get("/:id", asyncHandler(deliveryController.getDelivery));
router.post("/", asyncHandler(deliveryController.createDelivery));
router.patch("/:id/status", asyncHandler(deliveryController.updateDeliveryStatus));
router.patch("/:id/location", asyncHandler(deliveryController.updateDeliveryLocation));

export default router;
