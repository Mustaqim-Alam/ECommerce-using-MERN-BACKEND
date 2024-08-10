import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { newUserRequestBody } from "../types/Types.js";

export const newUser = async (
  req: Request<{}, {}, newUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    return next(new Error("My error"));
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
  } catch (error) {
    return res.status(200).json({
      seccess: true,
      message: error,
    });
  }
};
