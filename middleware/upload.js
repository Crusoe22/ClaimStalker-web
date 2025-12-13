//TODO: Add functionality to check MIME type for malicious files

const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

// Memory storage for Multer (we will upload to S3 later)
const storage = multer.memoryStorage();

// Generate a random filename
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Allowed file extensions and MIME types
const allowedExts = [".jpg", ".jpeg", ".png", ".gif"];
const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Check extension
    if (!allowedExts.includes(ext)) {
      return cb(new Error("Only image files are allowed"));
    }

    // Check MIME type
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Invalid MIME type"));
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
