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
