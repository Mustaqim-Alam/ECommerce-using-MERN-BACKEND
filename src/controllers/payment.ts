import { stripe } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";
import { Coupon } from "../Models/coupon.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const cretePaymentIntent = tryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  res.status(200).json({
    success: true,
    clintSecret: paymentIntent.client_secret,
  });
});

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

export const applyDiscount = tryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) return next(new ErrorHandler("Invalid coupon code!", 400));

  res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const allCoupon = tryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new ErrorHandler("Coupon not available", 400));

  res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon Id", 400));
  console.log(coupon?.code);

  coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} deleted succesfully`,
  });
});
