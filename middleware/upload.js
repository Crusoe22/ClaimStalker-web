/*
// middleware/upload.js
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

// Memory storage for Multer (we will upload to S3 later)
const storage = multer.memoryStorage();

// Generate a random filename
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Optional: filter by file type (images only)
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10MB per file
  },
});

module.exports = {
  upload,
  randomImageName,
};
*/

// middleware/upload.js
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fileType = require("file-type"); // npm install file-type

// Memory storage for Multer (we will upload to S3 directly)
const storage = multer.memoryStorage();

// Generate a random filename
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Allowed extensions & MIME types
const allowedExts = [".jpg", ".jpeg", ".png", ".gif"];
const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 12, // maximum 12 files
  },
  fileFilter: async (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname).toLowerCase();

      // 1️⃣ Check file extension
      if (!allowedExts.includes(ext)) {
        return cb(new Error("Only image files are allowed (jpg, jpeg, png, gif)"));
      }

      // 2️⃣ Check MIME type from multer
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error("File type mismatch — not a valid image"));
      }

      // 3️⃣ Optional: verify actual file content
      // file.buffer contains the file in memory
      const type = await fileType.fromBuffer(file.buffer);
      if (!type || !allowedMimes.includes(type.mime)) {
        return cb(new Error("Invalid image content detected"));
      }

      cb(null, true); // file is valid
    } catch (err) {
      cb(new Error("Error validating file: " + err.message));
    }
  },
});

module.exports = {
  upload,
  randomImageName,
};
