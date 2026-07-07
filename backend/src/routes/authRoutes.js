import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", authMiddleware, asyncHandler(authController.me));

export default router;
