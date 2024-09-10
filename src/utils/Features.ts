import mongoose from "mongoose";
import { invalidCachedQuery } from "../Types/types.js";
import { myCache } from "../app.js";
import { Product } from "../Models/product.js";

export const connectdb = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "ECommerce_MERN",
    })
    .then((c) =>
      console.log(`DB connection established with ${c.connection.host}`)
    )
    .catch((err) => console.log(err));
};

// Checking caches for user, product and admin
export const invalidCache = async ({
  admin,
  product,
  user,
}: invalidCachedQuery) => {
  // Check if 'user' is provided. If so, proceed to invalidate cache
  if (user) {
    // Initialize an array to hold the cache keys for products and categories
    const productKeys: string[] = [
      "latest-product",
      "all-categories",
      "all-admin-products",
    ];

    const product = await Product.find({}).select("_id");

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
    const adminKeys: string[] = [];
  }
};
