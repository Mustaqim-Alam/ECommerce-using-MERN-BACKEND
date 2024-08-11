import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/Types.js";
import ErrorHandler from "../utils/utilityClass.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Some internal error occurred!";
  err.statusCode ||= 500;
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const tryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next));
  };
