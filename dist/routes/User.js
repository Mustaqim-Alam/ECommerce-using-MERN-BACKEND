import express from "express";
import { newUser } from "../controllers/User.js";
const app = express();
// route - /api/v1/users/new
app.post("/new", newUser);
export default app;
