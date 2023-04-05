import Coupon from "../models/CouponModel.js";
import asyncHandler from "express-async-handler";

const createCoupon = asyncHandler (async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.json(coupon);
    } catch (error) {
        throw new Error(error);
    }
});

export default {
    createCoupon,
}