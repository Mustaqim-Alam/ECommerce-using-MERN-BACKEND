import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import { newProductRequestBody } from "../Types/types.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { rm } from "fs";

export const newProduct = tryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

    if (!name || !stock || !category || !photo || !price) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new Error("Please add all fields!"));
    }
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

export const getLatestProduct = tryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdat: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = tryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = tryCatch(async (req, res, next) => {
  const adminProducts = await Product.find({});

  return res.status(200).json({
    success: true,
    adminProducts,
  });
});

export const getSingleProduct = tryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { name, stock, category, price } = req.body;
  const photo = req.file;
  if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid product", 400));

  if (photo) {
    rm(product.photo, () => {
      console.log("Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (price) product.price = price;

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
});
