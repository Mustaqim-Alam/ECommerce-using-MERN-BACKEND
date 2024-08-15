import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import { newProductRequestBody } from "../Types/types.js";

export const newProduct = tryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, stock, category } = req.body;
    const photo = req.file;

    const newProduct = await Product.create({
      name,
      photo: photo?.path,
      stock,
      category,
    });

    res.status(200).json({
      success: true,
      message: `New Product ${newProduct.name} created successfully`,
    });
  }
);
