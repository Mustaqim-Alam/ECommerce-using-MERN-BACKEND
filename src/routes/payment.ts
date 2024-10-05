import express from "express";
import { newCoupon } from "../Controllers/payment.js";

const app = express();

// app/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);

export default app;
