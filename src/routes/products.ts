import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getLatestProduct,
  getSingleProduct,
  newProduct,
} from "../Controllers/product.js";
import { adminOnly } from "../Middlewares/auth.js";
import { singleUpload } from "../Middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getLatestProduct);
app.get("/categories", getAllCategories);
app.get("/admin-products", getAdminProducts );

app.route("/:id").get(getSingleProduct)

export default app;
