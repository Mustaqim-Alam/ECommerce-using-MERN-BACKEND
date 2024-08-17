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
    // console.log("Hello");

    // console.log(req.body);
    // console.log(req.file);

    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (photo) console.log(photo.filename);
    else console.log("Photo not found");

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
