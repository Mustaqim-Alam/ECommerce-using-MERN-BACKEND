import mongoose from "mongoose";
export const connectdb = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
        dbName: "ECoomerce_MERN",
    })
        .then((c) => console.log(`DB connection established with ${c.connection.host}`))
        .catch((err) => console.log(err));
};
