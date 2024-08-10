import express from "express";
import userRoute from "./routes/User.js";
import { connectdb } from "./utils/Features.js";
const app = express();
connectdb();
const port = 9900;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API is working with /api/v1");
});
// using routes
app.use("/api/v1/user", userRoute);
app.listen(port, () => {
    console.log("App is listening on http://localhost:" + port);
});
