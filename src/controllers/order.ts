import { tryCatch } from "../Middlewares/error.js";
import { Order } from "../Models/order.js";
import { Product } from "../Models/product.js";
import { NewOrderRequestBody, orderItemType } from "../Types/types.js";

export const newOrder = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>) => {
    const {
      shippingInfo,
      subtoal,
      tax,
      total,
      discount,
      shippingCharge,
      user,
      orderItems,
    } = req.body;

    await Order.create({
      shippingInfo,
      subtoal,
      tax,
      total,
      discount,
      shippingCharge,
      user,
      orderItems,
    });
  }
);

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= 2;
    await product.save();
  }
};
