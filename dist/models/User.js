import mongoose from "mongoose";
import valiator from "validator";
const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: [true, "Email already exists"],
      validator: valiator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
    },
    role: {
      type: String,
      required: [true, "Please enter role"],
      enum: ["admin", "user"],
      default: "user",
    },
    dob: {
      type: Date,
      required: [true, "Please enter DOB"],
    },
    gender: {
      type: String,
      required: [true, "Please enter gender"],
      enum: ["Male", "Female"],
    },
  },
  {
    timestamps: true,
  }
);
schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});
export const User = mongoose.model("User", schema);
