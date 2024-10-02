import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  proccessOrders,
} from "../Controllers/order.js";
import { adminOnly } from "../Middlewares/auth.js";
import { getSingleProduct } from "../Controllers/product.js";

const app = express();

// Route - /api/v1/order/new
app.post("/new", newOrder);
// Route - /api/v1/order/my
app.get("/my", myOrders);
// Route - /api/v1/order/allOrders
app.get("/allOrders", adminOnly, allOrders);
// Route - /api/v1/order/deleteOrder
app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, proccessOrders)
  .delete(adminOnly, deleteOrder);

export default app;
