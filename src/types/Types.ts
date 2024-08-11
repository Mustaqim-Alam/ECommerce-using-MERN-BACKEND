import { NextFunction, Request, Response } from "express";

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

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
