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

export interface newProductRequestBody {
  name: string;
  stock: number;
  photo: string;
  category: string;
  price: number;
}

// Type definition for controller functions
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type searchRequestQuery = {
  search?: string;
  category?: string;
  price?: string;
  sort?: string;
  page?: string;
};

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

export type invalidCachedQuery = {
  admin?: boolean;
  user?: boolean;
  product?: boolean;
};

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

export type orderItemType = {
  name: string;
  address: string;
  pincode: number;
  state: string;
  cuntry: string;
  productId: string;
};
