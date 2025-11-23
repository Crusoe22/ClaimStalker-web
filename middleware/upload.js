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
