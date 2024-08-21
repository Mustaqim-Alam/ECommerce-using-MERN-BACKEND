import mongoose from "mongoose";
import { invalidCachedQuery } from "../Types/types.js";
import { myCache } from "../app.js";

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

export const invalidCache = ({ admin, product, user }: invalidCachedQuery) => {
  if (user) {
    const 
  }
  if (product) {
    const productKeys: [] = [];
    myCache.del(productKeys)
  }
  if (admin) {
  }
};
