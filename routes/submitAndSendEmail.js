const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");


const { Claim } = require("../config/db");  // import your Claim model
const { s3, PutObjectCommand, bucketName, bucketRegion } = require("../config/s3");  
const { upload, randomImageName } = require("../middleware/upload");


router.post("/submit-and-send-email", upload.array("photos", 12), async (req, res) => {
  try {

    // Accept either firstname+lastname or single 'name'
    let name = req.body.name;
    if (!name && req.body.firstname) {
      name = `${req.body.firstname || ""} ${req.body.lastname || ""}`.trim();
    }


    // --------------------
    // HANDLE PHOTO UPLOADS
    // --------------------
    let uploadedImageURLs = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const Key = `claims/${Date.now()}-${randomImageName()}${ext}`;

        const uploadParams = {
          Bucket: bucketName,
          Key,
          Body: file.buffer,
          ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const publicUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${Key}`;
        uploadedImageURLs.push(publicUrl);
      }
    }

    const claimData = {
      email: req.body.email || null,
      name: name || null,
      phone: req.body.phone || null,
      policyNumber: req.body.policyNumber || null,
      insuranceCompany: req.body.insuranceCompany || null,
      claimDate: req.body.claimDate || null,
      autoLoss: req.body.autoLoss || false,
      propertyLoss: req.body.propertyLoss || false,
      location: req.body.location || null,
      description: req.body.description || null,
      photo_urls: uploadedImageURLs
    };


    const savedClaim = await Claim.create(claimData);
    console.log("Claim saved:", savedClaim.id || savedClaim);

    // Send confirmation email (if address provided)
    if (claimData.email) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: '"CLAIM STALKER" <noreply@claimstalker.com>',
        to: claimData.email,
        subject: "Claim Submission Notification",
        text: `Hello ${claimData.name || ""},\n\nYour claim has been submitted successfully.`,
        html: `
          <p>Hello <b>${claimData.name || "Customer"}</b>,</p>
          <p>Your claim was received. Summary:</p>
          <ul>
            <li>Policy Number: ${claimData.policyNumber || "—"}</li>
            <li>Date of Loss: ${claimData.claimDate || "—"}</li>
            <li>Location: ${claimData.location || "—"}</li>
            <li>Description: ${claimData.description || "—"}</li>
          </ul>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
      } catch (mailErr) {
        console.error("Email sending error:", mailErr);
        // don't fail the claim save if email fails; return a warning
        return res.status(200).json({ success: true, message: "Claim saved but email failed to send." });
      }
    }

    return res.status(200).json({ success: true, message: "Claim submitted and email (if provided) sent successfully!" });
  } catch (err) {
    console.error("Submit-and-send-email error:", err);
    return res.status(500).json({ success: false, message: "Server error while submitting claim." });
  }
});

module.exports = router;