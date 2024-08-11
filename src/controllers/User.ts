import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { newUserRequestBody } from "../types/Types.js";
import { tryCatch } from "../middlewares/Error.js";

export const newUser = tryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    // throw new Error("Invalid user request");

    // Destructure necessary fields from the request body
    const { _id, name, email, dob, photo, gender } = req.body;

    //Finding user by id in database
    let user = await User.findById(_id);

    //Condition if user exists
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
      });
    }

    if (!_id || !name || !email || !dob || !photo || !gender)
      return next(new Error("Please add all fields!"));

    //If user not exist
    // Create a new user document in the database using the User model
    user = await User.create({
      _id,
      name,
      email,
      dob: new Date(dob),
      photo,
      gender,
    });

    // Send a successful response with a welcome message
    return res.status(200).json({
      seccess: true,
      message: `Welcome ${user.name}`,
    });
  }
);

export const getAllUsers = tryCatch(async (req, res, next) => {
  const users = await User.find({})
  console.log(users);
  
  return res.send(201).json({
    success: true,
    users
  });
});
