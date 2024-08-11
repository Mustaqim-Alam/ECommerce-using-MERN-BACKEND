import express from "express";
import { deleteUserById, getAllUsers, getUserById, newUser, } from "../controllers/User.js";
const app = express();
// Define a POST route to handle the creation of a new user
app.post("/new", newUser);
// Route - /api/v1/user/all
app.get("/all", getAllUsers);
// Route - /api/v1/user/dynamicId
app.route("/:id").get(getUserById).delete(deleteUserById);
export default app;
