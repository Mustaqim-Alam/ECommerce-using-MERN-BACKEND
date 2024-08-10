import mongoose from "mongoose";
export const connectdb = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
        dbName: "ECommerce_MERN",
    })
        .then((c) => console.log(`DB connection established with ${c.connection.host}`))
        .catch((err) => console.log(err));
};
