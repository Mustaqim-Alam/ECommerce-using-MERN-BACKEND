var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../Models/product.js";
import { Order } from "../Models/order.js";
export const connectdb = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "ECommerce_MERN",
    })
        .then((c) => console.log(`DB connection established with ${c.connection.host}`))
        .catch((err) => console.log(err));
};
// Checking caches for user, product and admin
export const invalidCache = (_a) => __awaiter(void 0, [_a], void 0, function* ({ admin, product, order, orderId, userId, productId, }) {
    // Check if 'user' is provided. If so, proceed to invalidate cache
    if (product) {
        // Initialize an array to hold the cache keys for products and categories
        const productKeys = [
            "latest-product",
            "all-categories",
            "all-admin-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`productId-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`productId-${i}`));
        const product = yield Product.find({}).select("_id");
        // Iterate through the fetched products and create cache keys for each product
        product.forEach((element) => {
            productKeys.push(`product-${element}`);
        });
        // Invalidate (delete) all the cache entries associated with the generated keys
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
            `product-${productId}`,
        ];
        const orders = yield Order.find({}).select("_id");
        orders.forEach((i) => {
            orderKeys.push();
        });
        myCache.del(orderKeys);
    }
    if (admin) {
        const adminKeys = [];
    }
});
export const reduceStock = (orderItems) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = yield Product.findById(order.productId);
        if (!product)
            throw new Error("Product not found");
        product.stock -= 2;
        yield product.save();
    }
});
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getProductCategories = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productCategory, productCount, }) {
    const categoriesCount = yield Promise.all(productCategory.map((category) => Product.countDocuments({ category })));
    const categoryCount = [];
    productCategory.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100),
        });
    });
    return categoryCount;
});
