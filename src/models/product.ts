import { timeStamp } from "console";
import mongoose from "mongoose";
import path from "path";

const schema = new mongoose.Schema(
  {
    _id: {
      type: "string",
      required: [true, "Please enter ID"],
    },
    name: {
      type: "string",
      required: [true, "Please enter product name"],
    },
    photo: {
      type: "string",
      required: [true, "Please enter product photo"],
    },
    stock: {
      type: "string",
      required: [true, "Please enter stock details"],
    },
    category: {
      type: "string",
      required: [true, "Please enter product category"],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
