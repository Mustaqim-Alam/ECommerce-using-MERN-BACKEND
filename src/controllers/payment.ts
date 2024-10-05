import { tryCatch } from "../Middlewares/error.js";
import { Coupon } from "../Models/coupon.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const newCoupon = tryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Enter both coupon & amount", 400));

  await Coupon.create({ code: coupon, amount });

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
  });
});
