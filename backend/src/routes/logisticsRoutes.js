import { Router } from "express";
import * as deliveryController from "../controllers/deliveryController.js";
import * as profileController from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("logistics", "admin"));

router.get("/profile", asyncHandler(profileController.getLogisticsProfile));
router.put("/profile", asyncHandler(profileController.updateLogisticsProfile));
router.get("/overview", asyncHandler(deliveryController.getOverview));
router.get("/assigned", asyncHandler(deliveryController.getAssigned));
router.get("/pickup", asyncHandler(deliveryController.getPickup));
router.get("/in-transit", asyncHandler(deliveryController.getInTransit));
router.get("/completed", asyncHandler(deliveryController.getCompleted));

export default router;
