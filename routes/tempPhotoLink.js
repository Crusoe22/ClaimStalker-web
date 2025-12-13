/*
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


*/

const express = require("express");
const router = express.Router();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Claim } = require("../config/db"); // adjust path if needed

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

/**
 * SECURE download route
 * GET /download/:claimId
 */
router.get("/download/:claimId", async (req, res) => {
  try {
    const { claimId } = req.params;

    if (!claimId) {
      return res.status(400).send("Missing claim ID");
    }

    // 1️⃣ Fetch claim from DB
    const claim = await Claim.findByPk(claimId);

    if (!claim || !claim.photoKey) {
      return res.status(404).send("File not found");
    }

    // 2️⃣ OWNERSHIP CHECK (CRITICAL)
    if (
      claim.userId !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send("Unauthorized");
    }

    // 3️⃣ Generate signed URL (short-lived)
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: claim.photoKey, // stored S3 key, NOT full URL
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // ⏱️ 5 minutes
    });

    // 4️⃣ Redirect securely
    return res.redirect(signedUrl);

  } catch (err) {
    console.error("Secure download error:", err);
    res.status(500).send("Error downloading file");
  }
});

module.exports = router;
