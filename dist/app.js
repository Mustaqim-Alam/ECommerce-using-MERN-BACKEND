import express from "express";
import userRoute from "./Routes/user.js";
import { connectdb } from "./Utils/features.js";
import { errorMiddleware } from "./Middlewares/error.js";
const app = express();
//Database connection
connectdb();
//Assigning port for server
const port = 9900;
//Middleware for JSON Parsing
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API is working with /api/v1");
});
// Using routes
app.use("/api/v1/user", userRoute);
// Custom Error Handling middleware
app.use(errorMiddleware);
app.listen(port, () => {
    console.log("App is listening on http://localhost:" + port);
});
