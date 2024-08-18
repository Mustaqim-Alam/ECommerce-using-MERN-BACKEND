import { getLatestProduct, newProduct } from "../Controllers/product.js";
import { adminOnly } from "../Middlewares/auth.js";
import { singleUpload } from "../Middlewares/multer.js";
import express from "express";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getLatestProduct);
export default app;
