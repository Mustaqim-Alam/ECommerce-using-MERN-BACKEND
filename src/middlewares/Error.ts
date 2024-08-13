import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../Types/types.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error message if not provided
  err.message ||= "Some internal error occurred!";
  // Set default status code if not provided
  err.statusCode ||= 500;
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// Utility function to wrap async controller functions for error handling
export const tryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
