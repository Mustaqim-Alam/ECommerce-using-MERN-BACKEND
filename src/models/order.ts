import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      // Changed from 'OrderInfo'
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
      country: {
        // Corrected spelling from 'Cuntry'
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "shipped", "delivered"], // Removed 'processing' as it's not a valid enum
        default: "pending",
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    subTotal: {
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
    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", schema);
