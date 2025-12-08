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


function extractKey(fullUrl) {
  // remove { } if they exist
  fullUrl = fullUrl.replace(/^\{|\}$/g, "");

  // remove domain, bucket, region
  const parts = fullUrl.split(".amazonaws.com/");
  return parts[1]; // <-- returns only the key
}

//const s3 = new S3Client({ region: "us-east-1" });

router.get("/download/*", async (req, res) => {
  try {
    const fullUrl = req.query.url;  // from your frontend
    const fileKey = extractKey(fullUrl);

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const signed = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.redirect(signed);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating download link");
  }
});


module.exports = router;
