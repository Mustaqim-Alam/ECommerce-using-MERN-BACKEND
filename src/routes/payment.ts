import express from "express";
import { applyDiscount, newCoupon } from "../Controllers/payment.js";

const app = express();

// app/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
// app/v1/payment/discount
app.get("/discount", applyDiscount);

export default app;
