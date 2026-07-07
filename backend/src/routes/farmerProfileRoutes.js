import { Router } from "express";
import * as profileController from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("farmer", "admin"));

router.get("/profile", asyncHandler(profileController.getFarmerProfile));
router.put("/profile", asyncHandler(profileController.updateFarmerProfile));

export default router;
