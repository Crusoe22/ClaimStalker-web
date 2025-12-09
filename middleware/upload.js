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

const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fileType = require("file-type"); // CommonJS

// Memory storage
const storage = multer.memoryStorage();

// Random filename generator
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Allowed types
const allowedExts = [".jpg", ".jpeg", ".png", ".gif"];
const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 12,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(ext)) {
      return cb(new Error("Only image files are allowed"));
    }

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Invalid MIME type"));
    }

    // Async check for file content
    fileType.fromBuffer(file.buffer)
      .then(type => {
        if (!type || !allowedMimes.includes(type.mime)) {
          cb(new Error("File content does not match image type"));
        } else {
          cb(null, true);
        }
      })
      .catch(err => cb(new Error("Error validating file: " + err.message)));
  },
});

module.exports = {
  upload,
  randomImageName,
};
