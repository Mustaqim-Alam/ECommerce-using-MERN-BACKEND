import express from "express";
import { myOrders, newOrder } from "../Controllers/order.js";

const app = express();

// Route - /api/v1/order/new
app.post("/new", newOrder);
// Route - /api/v1/order/my
app.get("/my", myOrders);

export default app;
