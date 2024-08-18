import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import { newProductRequestBody } from "../Types/types.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const newProduct = tryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

    if (!name || !stock || !category || !photo || !price)
      return next(new Error("Please add all fields!"));

    await Product.create({
      name,
      price,
      stock,
      photo: photo?.path,
      category: category.toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: `New Product ${name} has created successfully`,
    });
  }
);
