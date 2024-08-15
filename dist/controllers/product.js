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
export const newProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, stock, category } = req.body;
    const photo = req.file;
    const newProduct = yield Product.create({
        name,
        photo: photo === null || photo === void 0 ? void 0 : photo.path,
        stock,
        category,
    });
    return res.status(201).json({
        success: true,
        message: `New Product ${newProduct.name} created successfully`,
    });
}));
