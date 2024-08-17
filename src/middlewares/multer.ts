import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

// Define the storage strategy for Multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Set the destination folder to 'uploads' inside the 'src' directory
    callback(null, "src/uploads");
  },
  filename: function (req, file, callback) {
    // Keep the original file name
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    callback(null, `${id}.${extName}`);
  },
});

// Export the single file upload middleware
export const singleUpload = multer({ storage }).single("photo");
