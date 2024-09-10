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
export const connectdb = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
        dbName: "ECommerce_MERN",
    })
        .then((c) => console.log(`DB connection established with ${c.connection.host}`))
        .catch((err) => console.log(err));
};
// Checking caches for user, product and admin
export const invalidCache = (_a) => __awaiter(void 0, [_a], void 0, function* ({ admin, product, user, }) {
    // Check if 'user' is provided. If so, proceed to invalidate cache
    if (user) {
        // Initialize an array to hold the cache keys for products and categories
        const productKeys = [
            "latest-product",
            "all-categories",
            "all-admin-products",
        ];
        const product = yield Product.find({}).select("_id");
        // Iterate through the fetched products and create cache keys for each product
        product.forEach((element) => {
            productKeys.push(`product-${element}`);
        });
        // Invalidate (delete) all the cache entries associated with the generated keys
        myCache.del(productKeys);
    }
    if (product) {
        // const productKeys: [] = [];
        // myCache.del(productKeys);
    }
    if (admin) {
        const adminKeys = [];
    }
});
