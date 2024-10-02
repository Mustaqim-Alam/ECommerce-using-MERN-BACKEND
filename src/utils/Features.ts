import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../Models/product.js";
import { orderItemType, InvalidateCacheProps } from "../Types/types.js";
import { Order } from "../Models/order.js";

export const connectdb = (uri: string) => {
  mongoose
    .connect(uri, {
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
  order,
  orderId,
  userId,
}: InvalidateCacheProps) => {
  // Check if 'user' is provided. If so, proceed to invalidate cache
  if (product) {
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
  if (order) {
    const orderKeys: string[] = ["all-orders", `my-orders-${userId}`];

    const orders = await Order.find({}).select("_id");

    orders.forEach((i) => {
      orderKeys.push(`order-${i._id}`);
    });

    myCache.del(orderKeys);
  }
  if (admin) {
    const adminKeys: string[] = [];
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= 2;
    await product.save();
  }
};
