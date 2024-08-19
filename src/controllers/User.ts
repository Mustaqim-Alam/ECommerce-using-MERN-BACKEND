import { NextFunction, Request, Response } from "express";
import { User } from "../Models/user.js";
import { newUserRequestBody } from "../Types/types.js";
import { tryCatch } from "../Middlewares/error.js";
import ErrorHandler from "../Utils/utilityClass.js";

export const newUser = tryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {

    // Destructure necessary fields from the request body
    const { _id, name, email, dob, photo, gender,role } = req.body;

    //Finding user by id in database
    let user = await User.findById(_id);

    //Condition if user exists
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
      });
    }

   

    if (!_id || !name || !email || !dob || !photo || !gender || !role)
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
      role
    });

    // Send a successful response with a welcome message
    return res.status(200).json({
      seccess: true,
      message: `Welcome ${user.name}`,
    });
  }
);

// Get all users function
export const getAllUsers = tryCatch(async (req, res, next) => {
  const users = await User.find({});
  console.log(users);

  return res.status(201).json({
    success: true,
    users,
  });
});

//Get user by id
export const getUserById = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new Error("User not found!"));
  return res.status(200).json({
    seccess: true,
    user,
  });
});

// Delete user by id
export const deleteUserById = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    seccess: true,
    message: "User deleted successfully",
  });
});
