import express from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  newUser,
} from "../Controllers/user.js";
import { adminOnly } from "../Middlewares/auth.js";

const app = express();

// Define a POST route to handle the creation of a new user
app.post("/new", newUser);

// Route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);

// Route - /api/v1/user/dynamicId
app.route("/:id").get(getUserById).delete(adminOnly, deleteUserById);

export default app;
