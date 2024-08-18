import { newProduct } from "../Controllers/product.js";
import { singleUpload } from "../Middlewares/multer.js";
import express from "express";
const app = express.Router();
app.post("/new", singleUpload, newProduct);
app.post("/latest");
export default app;
