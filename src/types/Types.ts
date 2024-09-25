import { NextFunction, Request, Response } from "express";

// Interface for the expected request body when creating a new user
export interface newUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the expected request body when creating a new product
export interface newProductRequestBody {
  name: string;
  stock: number;
  photo: string;
  category: string;
  price: number;
}

// Type definition for controller functions
// A controller function takes a Request, Response, and NextFunction
// and returns a Promise that either resolves to void or a Response.
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

// Search query parameters for filtering products
export type searchRequestQuery = {
  search?: string;
  category?: string;
  price?: string;
  sort?: string;
  page?: string;
};

// Base query structure for MongoDB filtering
export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

// Type for cache invalidation queries
export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  review?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

// Interface for creating a new order
export interface NewOrderRequestBody {
  shippingInfo: {};
  user: string;
  subTotal: number;
  total: number;
  tax: number;
  shippingCharge: number;
  discount: number;
  orderItems: [];
}

// Type for individual order item details
export type orderItemType = {
  name: string;
  address: string;
  pincode: number;
  state: string;
  country: string;
  productId: string;
};
