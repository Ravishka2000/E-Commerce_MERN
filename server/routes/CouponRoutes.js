import express from "express";
import AuthMiddlewares from "../middlewares/authMiddleware.js";
import CouponController from "../controllers/CouponController.js";

const router = express.Router();

router.post('/', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, CouponController.createCoupon);

export default router;