var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { rm } from "fs";
// @route POST /api/v1/product/new
export const newProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    // Check if a photo is attached
    if (!photo)
        return next(new ErrorHandler("Please attach a photo", 400));
    // Ensure all required fields are filled
    if (!name || !stock || !category || !price) {
        // Delete the uploaded photo if any field is missing
        rm(photo.path, () => {
            console.log("Deleted incomplete product photo");
        });
        return next(new Error("Please add all fields!"));
    }
    // Create and save the new product
    yield Product.create({
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
}));
//  @route GET /api/v1/product/latest
export const getLatestProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product.find({}).sort({ createdat: -1 }).limit(5);
    if (!products)
        return next(new ErrorHandler("Product not found!", 404));
    return res.status(200).json({
        success: true,
        products,
    });
}));
// @route GET /api/v1/product/categories
export const getAllCategories = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
    });
}));
// @route GET /api/v1/product/admin-products
export const getAdminProducts = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminProducts = yield Product.find({});
    return res.status(200).json({
        success: true,
        adminProducts,
    });
}));
// @route GET /api/v1/product/:id
export const getSingleProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found!", 404));
    return res.status(200).json({
        success: true,
        product,
    });
}));
// @route PUT /api/v1/product/:id
export const updateProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    // Check if a new photo is attached
    if (!photo)
        return next(new ErrorHandler("Please attach a photo", 400));
    const product = yield Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product not found!", 404));
    // Update the product fields
    if (photo) {
        // Delete the old photo if a new one is uploaded
        rm(product.photo, () => {
            console.log("Deleted old product photo");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    if (price)
        product.price = price;
    yield product.save();
    return res.status(200).json({
        success: true,
        message: `Product ${name} has updated successfully`,
    });
}));
// @route DELETE /api/v1/product/:id
export const deleteProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found!", 404));
    // Delete the product and its associated photo
    yield product.deleteOne();
    rm(product.photo, () => {
        console.log("Product photo deleted");
    });
    return res.status(200).json({
        success: true,
        message: `Product ${product.name} deleted successfully!`,
    });
}));
