import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: "string",
        required: [true, "Please enter product name"],
    },
    photo: {
        type: "string",
        required: [true, "Please enter product photo"],
    },
    stock: {
        type: "string",
        required: [true, "Please enter stock details"],
    },
    category: {
        type: "string",
        required: [true, "Please enter product category"],
    },
}, {
    timestamps: true,
});
export const product = mongoose.model("Product", schema);
