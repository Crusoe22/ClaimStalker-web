const express = require("express");
const router = express.Router();


const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// Initialize S3 Client (new code)
//const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
//const client = new S3Client{ClientParams};

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
})

//const s3 = new S3Client({ region: "us-east-1" });

router.get("/download/*", async (req, res) => {
  try {
    const fileKey = req.params.fileKey;

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 86400 });
    res.redirect(url);

  } catch (err) {
    console.error(err);
    res.status(500).send("Cannot create download link.");
  }
});

module.exports = router;
