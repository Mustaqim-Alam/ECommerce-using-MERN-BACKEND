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
export const newUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, name, email, dob, photo, gender } = req.body;
        const user = yield User.create({
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
    catch (error) {
        return res.status(200).json({
            seccess: true,
            message: error.message,
        });
    }
});
