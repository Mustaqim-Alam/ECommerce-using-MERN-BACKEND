import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    OrderInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      Cuntry: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "shipped", " delivered"],
        default: "processing",
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: {
      name: String,
      photo: String,
      Price: Number,
      quantity: Number,
      productId:{
        type:mongoose.Types.ObjectId,
        ref:"Product "
      }
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", schema);
