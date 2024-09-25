import { Request } from "express";
import { tryCatch } from "../Middlewares/error.js";
import { Order } from "../Models/order.js";
import { NewOrderRequestBody } from "../Types/types.js";
import { invalidCache, reduceStock } from "../Utils/features.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const newOrder = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      subTotal,
      tax,
      total,
      discount,
      shippingCharge,
      user,
      orderItems,
    } = req.body;

    if (
      !shippingInfo ||
      !subTotal ||
      !tax ||
      !shippingCharge ||
      !discount ||
      !user ||
      !orderItems ||
      !total
    ) {
      console.log("Missing fields in request");
      return next(new ErrorHandler("All fields are required!", 400));
    }

    await Order.create({
      shippingInfo,
      subTotal,
      tax,
      total,
      discount,
      shippingCharge,
      user,
      orderItems,
    });
    reduceStock(orderItems);
    await invalidCache({ product: true, order: true, admin: true });
    return res.status(201).json({
      success: true,
      message: `Order placed successfully`,
    });
  }
);
