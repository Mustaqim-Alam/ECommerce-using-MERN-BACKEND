import express from "express";
import userRoute from "./routes/User.js";
import { connectdb } from "./utils/Features.js";
import { errorMiddleware } from "./middlewares/Error.js";
import { getAllUsers } from "./controllers/User.js";

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
