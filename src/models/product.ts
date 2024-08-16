import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter product photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product photo"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter stock details"],
    },
    category: {
      type: String,
      required: [true, "Please enter product category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
