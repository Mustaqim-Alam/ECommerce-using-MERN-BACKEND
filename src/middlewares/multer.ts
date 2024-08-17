import multer from "multer";
import path from "path";
import uuid from "uuid";

// Define the storage strategy for Multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Set the destination folder to 'uploads' inside the 'src' directory
    callback(null, path.join(process.cwd(), "src", "uploads"));
  },
  filename: function (req, file, callback) {
    // Keep the original file name


    callback(null, file.originalname);
  },
});

// Export the single file upload middleware
export const singleUpload = multer({ storage }).single("photo");
