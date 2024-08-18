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
