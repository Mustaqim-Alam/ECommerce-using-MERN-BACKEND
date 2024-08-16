import express from "express";
import { errorMiddleware } from "./Middlewares/error.js";
import { connectdb } from "./Utils/features.js";
import userRoute from "./Routes/user.js";
import productRoute from "./Routes/products.js";
import { singleUpload } from "./Middlewares/multer.js";

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
app.use("/api/v1/product", productRoute);

// Custom Error Handling middleware
// app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("App is listening on http://localhost:" + port);
});
