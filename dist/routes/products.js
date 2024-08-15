import { newProduct } from "../Controllers/product.js";
import { singleUpload } from "../Middlewares/multer.js";
import express from "express";
const app = express();
app.post("/new", singleUpload, newProduct);
export default app;
