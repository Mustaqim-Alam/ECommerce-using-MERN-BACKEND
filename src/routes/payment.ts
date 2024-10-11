import express from "express";
import { allCoupon, applyDiscount, cretePaymentIntent, deleteCoupon, newCoupon } from "../Controllers/payment.js";

const app = express();

// app/v1/payment/create
app.post("/create", cretePaymentIntent);

// app/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
// app/v1/payment/coupon/all
app.get("/coupon/all", allCoupon);
// app/v1/payment/coupon/delete/:id
app.delete("/coupon/delete/:id", deleteCoupon);
// app/v1/payment/discount
app.get("/discount", applyDiscount);

export default app;
