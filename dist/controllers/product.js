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
export const newProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please attach a photo", 400));
    if (!name || !stock || !category || !photo || !price) {
        rm(photo.path, () => {
            console.log("Deleted");
        });
        return next(new Error("Please add all fields!"));
    }
    yield Product.create({
        name,
        price,
        stock,
        photo: photo === null || photo === void 0 ? void 0 : photo.path,
        category: category.toLowerCase(),
    });
    return res.status(201).json({
        success: true,
        message: `New Product ${name} has created successfully`,
    });
}));
export const getLatestProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product.find({}).sort({ createdat: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        products,
    });
}));
export const getAllCategories = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
    });
}));
export const getAdminProducts = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminProducts = yield Product.find({});
    return res.status(200).json({
        success: true,
        adminProducts,
    });
}));
export const getSingleProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product.findById(req.params.id);
    return res.status(200).json({
        success: true,
        product,
    });
}));
export const updateProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, stock, category, price } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please attach a photo", 400));
    const product = yield Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid product", 400));
    if (photo) {
        rm(product.photo, () => {
            console.log("Deleted");
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
    yield Product.create({
        name,
        price,
        stock,
        photo: photo === null || photo === void 0 ? void 0 : photo.path,
        category: category.toLowerCase(),
    });
    return res.status(201).json({
        success: true,
        message: `New Product ${name} has created successfully`,
    });
}));
