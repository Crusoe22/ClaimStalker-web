
const express = require("express");
const router = express.Router();
const path = require("path");

// Import things used inside the route
const { CustomerClaims } = require("../db/db");
const { s3, PutObjectCommand, bucketName, bucketRegion } = require("../s3");  
const upload = require("../middleware/upload");   // your multer config
const randomImageName = require("../utils/randomImageName");

router.post("/submit-customer-claim", upload.array('photos', 12), async (req, res) => {
  try {
    const {
      policyNumber,
      firstname,
      lastname,
      email,
      phone,
      claimDate,
      address_1,
      address_2,
      state,
      zip_code,
      description
    } = req.body;

    // Upload each file to S3
    const uploadedImageURLs = [];

    for (const file of req.files) {
      const extension = path.extname(file.originalname);
      const Key = `claims/${Date.now()}-${randomImageName()}${extension}`;
      //const Key = `claims/${Date.now()}-${randomImageName()}`; //file.originalname

      const uploadParams = {
        Bucket: bucketName,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype
      };

      // Upload to S3
      await s3.send(new PutObjectCommand(uploadParams));

      // Create PUBLIC URL (or signed URL if bucket private)
      const publicUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${Key}`;
      uploadedImageURLs.push(publicUrl);
    }

    // Save claim in DB
    const newClaim = await CustomerClaims.create({
      policy_number: policyNumber,
      first_name: firstname,
      last_name: lastname,
      email,
      phone,
      claim_date: claimDate,
      address_1,
      address_2,
      state,
      zip_code,
      description,
      photo_urls: uploadedImageURLs   // 💾 Save S3 URLs
    });

    res.json({
      success: true,
      message: "Your claim has been submitted and images uploaded!",
      claim_id: newClaim.claim_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to submit claim." });
  }
});


module.exports = router;