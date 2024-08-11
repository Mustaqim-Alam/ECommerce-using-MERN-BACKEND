var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/User.js";
import { tryCatch } from "../middlewares/Error.js";
import ErrorHandler from "../utils/utilityClass.js";
export const newUser = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error("Invalid user request");
    // Destructure necessary fields from the request body
    const { _id, name, email, dob, photo, gender } = req.body;
    //Finding user by id in database
    let user = yield User.findById(_id);
    //Condition if user exists
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`,
        });
    }
    // let emailid = req.body.email;
    // if (emailid) return res.status(400).json({
    //   "success": true,
    //   "message": "Email allready exists"
    // })
    if (!_id || !name || !email || !dob || !photo || !gender)
        return next(new Error("Please add all fields!"));
    //If user not exist
    // Create a new user document in the database using the User model
    user = yield User.create({
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
}));
// Get all users function
export const getAllUsers = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find({});
    console.log(users);
    return res.status(201).json({
        success: true,
        users,
    });
}));
//Get user by id
export const getUserById = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield User.findById(id);
    if (!user)
        return next(new Error("User not found!"));
    return res.status(200).json({
        seccess: true,
        user,
    });
}));
// Delete user by id
export const deleteUserById = tryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    yield user.deleteOne();
    return res.status(200).json({
        seccess: true,
        message: "User deleted successfully",
    });
}));
