import express from "express";
import { newOrder } from "../Controllers/order.js";

const app = express();

app.post("/new", newOrder);

export default app;
