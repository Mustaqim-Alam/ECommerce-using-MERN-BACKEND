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

export const invalidCache = async ({
  admin,
  product,
  user,
}: invalidCachedQuery) => {
  if (user) {
    const productKeys: string[] = [
      "latest-product",
      "all-categories",
      "all-admin-products",
    ];

    const product = await Product.find({}).select("_id");

    myCache.del(productKeys);
  }
  if (product) {
    const productKeys: [] = [];
    myCache.del(productKeys);
  }
  if (admin) {
  }
};
