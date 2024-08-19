var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utilityClass.js";
import { tryCatch } from "./error.js";
// Middleware for accessing the admin interface
export const adminOnly = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please login as Admin", 401));
    const user = yield User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found in Admin", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("Only admin can access this page", 401));
    next();
}));
