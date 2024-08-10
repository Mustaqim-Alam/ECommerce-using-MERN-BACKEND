import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Some internal error occurred!";
  res.status(400).json({
    success: false,
    message: err.message,
  });
};
