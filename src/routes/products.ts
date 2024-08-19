/**
 * Product Routes
 *
 * This router handles all the CRUD operations related to products in the e-commerce platform.
 *
 * Routes:
 * - POST /new: Create a new product (Admin only, with image upload).
 * - GET /latest: Retrieve the latest products added to the store.
 * - GET /categories: Get a list of all product categories.
 * - GET /admin-products: Fetch all products with admin-level access (Admin only).
 * - GET /all-products: Fetch all products with user-level access.
 * - GET /:id: Retrieve details of a single product by its ID.
 * - PUT /:id: Update an existing product (Admin only, with image upload).
 * - DELETE /:id: Delete a product by its ID (Admin only).
 *
 * Middleware:
 * - `adminOnly`: Ensures only users with admin privileges can access certain routes.
 * - `singleUpload`: Handles single image uploads using Multer.
 *
 * This modular structure ensures maintainability and scalability as the project grows.
 */

import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../Controllers/product.js";
import { adminOnly } from "../Middlewares/auth.js";
import { singleUpload } from "../Middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getLatestProduct);
app.get("/categories", getAllCategories);
app.get("/admin-products", adminOnly, getAdminProducts);
app.get("/all-products", getAllProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
