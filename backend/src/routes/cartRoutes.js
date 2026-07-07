import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("buyer", "admin"));

router.get("/", asyncHandler(cartController.getCart));
router.post("/items", asyncHandler(cartController.addCartItem));
router.patch("/items/:id", asyncHandler(cartController.updateCartItem));
router.delete("/items/:id", asyncHandler(cartController.removeCartItem));
router.delete("/", asyncHandler(cartController.clearCart));

export default router;
