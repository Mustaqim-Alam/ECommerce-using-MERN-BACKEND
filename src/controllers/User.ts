import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { newUserRequestBody } from "../types/Types.js";
import ErrorHandler from "../utils/utilityClass.js";
import { tryCatch } from "../middlewares/Error.js";

export const newUser = tryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    // throw new Error("Invalid user request");
    const { _id, name, email, dob, photo, gender } = req.body;

    const user = await User.create({
      _id,
      name,
      email,
      dob: new Date(dob),
      photo,
      gender,
    });

    return res.status(200).json({
      seccess: true,
      message: `Welcome ${user.name}`,
    });
  }
);
