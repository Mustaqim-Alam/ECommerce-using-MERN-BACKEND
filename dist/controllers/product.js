var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { rm } from "fs";
import { myCache } from "../app.js";
import { tryCatch } from "../Middlewares/error.js";
import { Product } from "../Models/product.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { invalidCache } from "../Utils/features.js";
//  @route GET /api/v1/product/latest
export const getLatestProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product"));
    }
    else {
        products = yield Product.find({}).sort({ createdat: -1 }).limit(5);
        if (!products)
            return next(new ErrorHandler("Product not found!", 404));
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
}));
// @route GET /api/v1/product/categories
export const getAllCategories = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let categories;
    if (myCache.has("all-categories")) {
        myCache.get("categories");
        categories = JSON.parse(myCache.get("all-categories"));
    }
    else {
        categories = yield Product.distinct("category");
        myCache.set("all-categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
}));
// @route GET /api/v1/product/admin-products
export const getAdminProducts = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let adminProducts;
    if (myCache.has("all-admin-products")) {
        adminProducts = JSON.parse(myCache.get("all-admin-products"));
    }
    else {
        adminProducts = yield Product.find({});
        myCache.set("all-admin-products", JSON.stringify(adminProducts));
    }
    return res.status(200).json({
        success: true,
        adminProducts,
    });
}));
// @route GET /api/v1/product/:id
export const getSingleProduct = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let product;
    if (myCache.has(`product - ${id}`)) {
        product = JSON.parse(myCache.get(`product - ${id}`));
    }
    else {
        product = yield Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product not found!", 404));
        myCache.set(`product - ${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
}));
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
    yield invalidCache({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: `New Product ${name} has created successfully`,
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
    yield invalidCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
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
    yield invalidCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: `Product ${product.name} deleted successfully!`,
    });
}));
export const getAllProducts = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category, price, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const basequery = {};
    if (search) {
        basequery.name = {
            $regex: search,
            $options: "i",
        };
    }
    if (category)
        basequery.category = category;
    if (price) {
        basequery.price = {
            $lte: Number(price),
        };
    }
    const productPromise = yield Product.find(basequery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, onlyFilteredProducts] = yield Promise.all([
        productPromise,
        Product.find(basequery),
    ]);
    const totalPages = Math.ceil(onlyFilteredProducts.length / limit);
    if (!products)
        return next(new ErrorHandler("Product not found", 404));
    return res.status(200).json({ success: true, products, totalPages });
}));
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "src\\uploads\\c071a20b-6682-4e89-9da4-0a927afd59bc.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// const deleteRandomProduct = async (count: number = 15 ) => {
//   const products = await Product.find({}).skip(2);
//   for (let index = 0; index < products.length; index++) {
//     const product = products[index];
//     await product.deleteOne();
//   }
//   console.log({ Success: true });
// };
// deleteRandomProduct(20)
