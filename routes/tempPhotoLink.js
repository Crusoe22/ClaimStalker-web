/*const express = require("express");
const router = express.Router();


//const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
//const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// Initialize S3 Client (new code)
//const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
//const client = new S3Client{ClientParams};

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

// new code
import { getSignedUrl, S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";




router.get("/api/posts", async (req, res) => {
  const posts = await PutBucketVersioningCommand.posts.findMany({orderBy: {created: "desc"}})

  for (const post of posts) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: post.imageName,
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    post.imageUrl = url;
  }
  res.send({ posts });
});

module.exports = router;
*/



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



/*
function extractKey(fullUrl) {
  if (!fullUrl) return "";
  fullUrl = fullUrl.replace(/^\{|\}$/g, "");
  const parts = fullUrl.split(".amazonaws.com/");
  return parts[1] || "";
}


//const s3 = new S3Client({ region: "us-east-1" });

/*
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


router.get("/download/*", async (req, res) => {
  try {
    const fullUrl = req.query.url;
    const fileKey = extractKey(fullUrl);

    if (!fileKey) return res.status(400).send("Invalid file URL");

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

*/