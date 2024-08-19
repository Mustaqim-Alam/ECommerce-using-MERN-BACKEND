import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import {
  BaseQuery,
  newProductRequestBody,
  searchRequestQuery,
} from "../Types/types.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { rm } from "fs";

// @route POST /api/v1/product/new
export const newProduct = tryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, stock, category, price } = req.body;
    const photo = req.file;

    // Check if a photo is attached
    if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

    // Ensure all required fields are filled
    if (!name || !stock || !category || !price) {
      // Delete the uploaded photo if any field is missing
      rm(photo.path, () => {
        console.log("Deleted incomplete product photo");
      });
      return next(new Error("Please add all fields!"));
    }

    // Create and save the new product
    await Product.create({
      name,
      price,
      stock,
      photo: photo.path,
      category: category.toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: `New Product ${name} has created successfully`,
    });
  }
);

//  @route GET /api/v1/product/latest

export const getLatestProduct = tryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdat: -1 }).limit(5);
  if (!products) return next(new ErrorHandler("Product not found!", 404));

  return res.status(200).json({
    success: true,
    products,
  });
});

// @route GET /api/v1/product/categories

export const getAllCategories = tryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});

// @route GET /api/v1/product/admin-products
export const getAdminProducts = tryCatch(async (req, res, next) => {
  const adminProducts = await Product.find({});
  return res.status(200).json({
    success: true,
    adminProducts,
  });
});

// @route GET /api/v1/product/:id
export const getSingleProduct = tryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found!", 404));

  return res.status(200).json({
    success: true,
    product,
  });
});

// @route PUT /api/v1/product/:id
export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, stock, category, price } = req.body;
  const photo = req.file;

  // Check if a new photo is attached
  if (!photo) return next(new ErrorHandler("Please attach a photo", 400));

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found!", 404));

  // Update the product fields
  if (photo) {
    // Delete the old photo if a new one is uploaded
    rm(product.photo, () => {
      console.log("Deleted old product photo");
    });
    product.photo = photo.path;
  }
  if (name) product.name = name;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (price) product.price = price;

  await product.save();

  return res.status(200).json({
    success: true,
    message: `Product ${name} has updated successfully`,
  });
});

// @route DELETE /api/v1/product/:id
export const deleteProduct = tryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found!", 404));

  // Delete the product and its associated photo
  await product.deleteOne();
  rm(product.photo, () => {
    console.log("Product photo deleted");
  });

  return res.status(200).json({
    success: true,
    message: `Product ${product.name} deleted successfully!`,
  });
});

export const getAllProducts = tryCatch(
  async (req: Request<{}, {}, {}, searchRequestQuery>, res, next) => {
    const { search, category, price, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = (page - 1) * limit;

    const basequery: BaseQuery = {};

    if (search) {
      basequery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) basequery.category = category;

    if (price) {
      basequery.price = {
        $lte: Number(price),
      };
    }

    const products = await Product.find(basequery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const totalPages = Math.ceil(products.length / limit);

    if (!products) return next(new ErrorHandler("Product not found", 404));

    return res.status(200).json({ success: true, products, totalPages });
  }
);
