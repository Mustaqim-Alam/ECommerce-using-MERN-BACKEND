import express from "express";
import {
  allOrders,
  deleteOrder,
  myOrders,
  newOrder,
} from "../Controllers/order.js";
import { adminOnly } from "../Middlewares/auth.js";

const app = express();

// Route - /api/v1/order/new
app.post("/new", newOrder);
// Route - /api/v1/order/my
app.get("/my", myOrders);
// Route - /api/v1/order/allOrders
app.get("/allOrders", adminOnly, allOrders);
// Route - /api/v1/order/deleteOrder
app.delete("/deleteOrder", deleteOrder);

export default app;
