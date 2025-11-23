
const crypto = require("crypto");
// AWS S3 SDK (CommonJS style)
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Load env (optional if already loaded in index.js)
require("dotenv").config();

// AWS S3 credentials from environment variables
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

// Random filename generator
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Create S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});

module.exports = {
  s3,
  PutObjectCommand,
  bucketName,
  bucketRegion,
  randomImageName
};