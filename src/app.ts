import { config } from "dotenv";
import { errorMiddleware } from "./Middlewares/error.js";
import { connectdb } from "./Utils/features.js";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import orderRoutes from "./Routes/orders.js";
import productRoute from "./Routes/products.js";
import userRoute from "./Routes/user.js";
import paymentRoute from "./Routes/payment.js";

const app = express();

config({
  path: "./.env",
});

//Assigning port for server
const port = process.env.PORT || 9900;

//Database connection
const mongo_uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
connectdb(mongo_uri);

//Middleware for JSON Parsing
app.use(express.json());
app.use(morgan("dev"));

// Using nodeCache for storing copies of data in a temporary storage location
export const myCache = new NodeCache();

app.get("/", (req, res) => {
  res.send("API is working with /api/v1");
});

app.get("api/v1");

// Using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoute);

// Custom Error Handling middleware
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);
app.listen(port, () => {
  console.log("App is listening on http://localhost:" + port);
});
