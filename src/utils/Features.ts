import mongoose, { Document, Types } from "mongoose";
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
  productId,
}: InvalidateCacheProps) => {
  // Check if 'user' is provided. If so, proceed to invalidate cache
  if (product) {
    // Initialize an array to hold the cache keys for products and categories
    const productKeys: string[] = [
      "latest-product",
      "all-categories",
      "all-admin-products",
    ];

    if (typeof productId === "string")
      productKeys.push(`productId-${productId}`);
    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`productId-${i}`));

    const product = await Product.find({}).select("_id");

    // Iterate through the fetched products and create cache keys for each product
    product.forEach((element) => {
      productKeys.push(`product-${element}`);
    });
    // Invalidate (delete) all the cache entries associated with the generated keys
    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
      `product-${productId}`,
    ];

    const orders = await Order.find({}).select("_id");

    orders.forEach((i) => {
      orderKeys.push();
    });

    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-bar-charts",
      "admin-pie-charts",
      "admin-line-charts",
    ]);
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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getProductCategories = async ({
  productCategory,
  productCount,
}: {
  productCategory: string[];
  productCount: number;
}) => {
  const categoriesCount = await Promise.all(
    productCategory.map((category) => Product.countDocuments({ category }))
  );

  const categoryCount: Record<string, Number>[] = [];

  productCategory.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += property ? i[property]! || 0 : 1;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};
