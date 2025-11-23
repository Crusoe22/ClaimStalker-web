const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const { Claim } = require("../db/db");  // import your Claim model


router.post("/submit-and-send-email", async (req, res) => {
  try {
    // Accept either firstname+lastname or single 'name'
    let name = req.body.name;
    if (!name && req.body.firstname) {
      name = `${req.body.firstname || ""} ${req.body.lastname || ""}`.trim();
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
      description: req.body.description || null
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