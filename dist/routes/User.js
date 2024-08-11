import express from "express";
import { getAllUsers, newUser } from "../controllers/User.js";
const app = express();
// Define a POST route to handle the creation of a new user
app.post("/new", newUser);
app.get("/all", getAllUsers);
export default app;
