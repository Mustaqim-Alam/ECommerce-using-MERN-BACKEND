import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { tryCatch } from "./error.js";

// Middleware for accessing the admin interface
export const adminOnly = tryCatch(async (req, res, next) => {
  const {id} = req.query;
  if (!id) return next(new ErrorHandler("Please login as Admin", 401));

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found in Admin", 401));

  if (user.role !== "admin")
    return next(new ErrorHandler("Only admin can access this page", 401));

  next();
});
