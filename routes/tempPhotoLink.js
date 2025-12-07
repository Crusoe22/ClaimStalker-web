const express = require("express");
const router = express.Router();

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: "us-east-1" });

// /download/someFile.jpg
router.get("/download/:fileKey", async (req, res) => {
  try {
    const fileKey = req.params.fileKey; // Example: 83hg92fd-photo.jpg

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileKey,
    });

    // Create temporary signed URL (valid 60s)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    res.redirect(signedUrl);

  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).send("Unable to generate download link.");
  }
});

module.exports = router;
