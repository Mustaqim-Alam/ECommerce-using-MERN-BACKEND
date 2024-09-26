import express from "express";
import { allOrders, myOrders, newOrder } from "../Controllers/order.js";
import { adminOnly } from "../Middlewares/auth.js";

const app = express();

// Route - /api/v1/order/new
app.post("/new", newOrder);
// Route - /api/v1/order/my
app.get("/my", myOrders);
// Route - /api/v1/order/allOrders
app.get("/allOrders", adminOnly, allOrders);

export default app;
