const express = require("express");
const router = express.Router();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// ===============================
// Download route
// ===============================
router.get("/download", async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).send("Missing file URL");

    // Extract key from the S3 URL
    // "https://bucket.s3.amazonaws.com/claims/filename.jpg"
    const key = fileUrl.replace(/^.*amazonaws\.com\//, "");

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Redirect user to download the object
    return res.redirect(signedUrl);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Error downloading file");
  }
});

module.exports = router;


