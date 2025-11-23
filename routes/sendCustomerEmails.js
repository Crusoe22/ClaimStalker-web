const express = require("express");
const router = express.Router();
//const nodemailer = require("nodemailer");
const { Customers } = require("../config/db");
const transporter = require("../config/mailer");

// Endpoint to send email to all customers
router.post('/send-customer-claim-submit', async (req, res) => {
  try {
    // Fetch all customers
    const customers = await Customers.findAll();

    if (!customers.length) {
      return res.json({ message: 'No customers found to send emails.' });
    }

    // Send emails in parallel for speed
    await Promise.all(customers.map(async (customer) => {
      if (!customer.email) return; // skip if no email

      const name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer';
      const mailOptions = {
        from: '"CLAIM STALKER" <noreply@claimstalker.com>',
        to: customer.email,
        subject: 'Submit Your Insurance Claim',
        text: `Hello ${name},\n\nPlease click the link below to submit your claim: "https://claimstalker-web.onrender.com/customer-claim-submit"\n`,
        html: `
          <p>Hello <b>${name}</b>,</p>
          <p>Please click the link below to submit your insurance claim:</p>
          <p><a href="https://claimstalker-web.onrender.com/customer-claim-submit">Submit Claim</a></p>
          <p>Thank you!</p>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${customer.email}: ${info.response}`);
      } catch (err) {
        console.error(`Failed to send email to ${customer.email}:`, err);
      }
    }));

    res.json({ message: `Emails sent (or attempted) to ${customers.length} customers.` });
  } catch (err) {
    console.error('Error sending customer emails:', err);
    res.status(500).json({ message: 'Server error while sending emails.' });
  }
});

module.exports = router;