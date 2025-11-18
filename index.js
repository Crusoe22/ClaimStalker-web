// index.js — cleaned and organized version
const express = require("express");
const path = require("path");
const { sequelize, Claim, User, Customers } = require("./models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const session = require("express-session");
const { body, validationResult } = require("express-validator");



// Nodemailer transporter (reuse your /submit-and-send-email config)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



const app = express();

/* ---------------------------
   Basic middleware
   --------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

const flash = require('connect-flash');
app.use(flash());

// static files (public and CSS folder)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages-css")));

// view engine
app.set("view engine", "ejs");

/* ---------------------------
   Helper middleware
   --------------------------- */
function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

/* ---------------------------
   PUBLIC ROUTES (no login)
   --------------------------- */

// Home / marketing page
app.get("/", (req, res) => res.render("main"));

// Public claim form (for emailed customers)
app.get("/customer-claim-submit-public", (req, res) => {
  res.render("customer-claim-submit");
});

// Public form could POST directly to /submit-and-send-email from client JS.
// (If you prefer to keep a dedicated public POST route, you can forward.)
app.post("/customer-claim-submit-public", async (req, res, next) => {
  // If you prefer forwarding, just call the same handler by continuing to /submit-and-send-email.
  req.url = "/submit-and-send-email";
  next();
});

// Login & Signup pages (render)
app.get("/login", (req, res) => res.render("login", { error: null, old: {} }));
app.get("/signup", (req, res) => res.render("signup", { error: null, old: {} }));

/* ---------------------------
   AUTH: Signup & Login POST
   --------------------------- */

// Signup with validation
app.post(
  "/signup",
  [
    body('username').trim().notEmpty().withMessage('Username is required.').isLength({ min: 3 }),
    body('name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').trim().isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('phone').trim().matches(/^\(\d{3}\)\d{3}-\d{4}$/).withMessage('Phone must be in format (555)123-4567.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character (@$!%*?&).'),
    body('confirm_password').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach(err => { if (!errorMap[err.param]) errorMap[err.param] = err.msg; });
      return res.render('signup', { error: Object.values(errorMap).join(' '), old: req.body });
    }

    try {
      const data = {
        username: req.body.username.trim(),
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        password: await bcrypt.hash(req.body.password, 10)
      };

      const existing = await User.findOne({ where: { username: data.username } });
      if (existing) return res.render('signup', { error: 'Username already taken. Please choose another.', old: req.body });

      await User.create(data);
      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/login');
    } catch (err) {
      console.error("Signup error:", err);
      return res.render('signup', { error: 'An error occurred during registration.', old: req.body });
    }
  }
);

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.render("login", { error: "Please enter username and password.", old: req.body });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.render("login", { error: "Username not found.", old: req.body });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.render("login", { error: "Incorrect password.", old: req.body });

    req.session.userId = user.id;
    res.redirect("/homepage");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
});

/* ---------------------------
   PUBLIC CLAIM SUBMISSION HANDLER
   ---------------------------
   This route is PUBLIC so emailed customers can POST here.
   It saves the claim (Sequelize Claim model) and sends confirmation email.
*/
app.post("/submit-and-send-email", async (req, res) => {
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

/* ---------------------------
   PROTECTED ROUTES
   (Anything below here requires login)
   --------------------------- */
app.use(checkLogin);

// Internal (employee) claim form (protected)
app.get("/customer-claim-submit", (req, res) => {
  res.render("customer-claim-submit");
});

app.get('/send-customer-claim-submit', (req, res) => {
    res.render('send-customer-claim-submit');
});

app.get('/claimsubmit-page', (req, res) => {
    res.render('claimsubmit-page');
});

// Homepage (protected) — include user object
app.get("/homepage", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.redirect("/login");
    res.render("homepage", { user });
  } catch (err) {
    console.error("Homepage error:", err);
    res.status(500).send("Server error");
  }
});

// Account page
app.get("/account", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.redirect("/login");
    res.render("account-page", { user });
  } catch (err) {
    console.error("Account error:", err);
    res.status(500).send("Server error");
  }
});

// Customer manager & admin pages
app.get("/customer-manager", (req, res) => res.render("customer-manager"));
app.get("/email-page", (req, res) => res.render("index"));

// View claims UI
app.get("/viewclaims-page", (req, res) => res.render("viewclaims-page", { claims: [], searchType: null, searchValue: null }));

// Fetch claims (protected search)
app.get("/view-claim", async (req, res) => {
  const { searchType, searchValue, policyNumber } = req.query;
  try {
    let where = {};
    if (policyNumber) where.policyNumber = policyNumber;
    else if (searchType === 'policyNumber') where.policyNumber = searchValue;
    else if (searchType === 'name') where.name = { [Op.iLike]: `%${searchValue}%` };
    else if (searchType === 'phone') where.phone = { [Op.iLike]: `%${searchValue}%` };

    const claims = await Claim.findAll({ where });
    res.render("viewclaims-page", { claims, searchType, searchValue });
  } catch (err) {
    console.error("view-claim error:", err);
    res.status(500).send("Server error");
  }
});

// Export claims to Excel (protected)
app.get("/export-claims", async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    let where = {};
    if (searchType === "policyNumber") where.policyNumber = searchValue;
    else if (searchType === "name") where.name = { [Op.iLike]: `%${searchValue}%` };
    else if (searchType === "phone") where.phone = { [Op.iLike]: `%${searchValue}%` };

    const claims = await Claim.findAll({ where });
    const Excel = require("exceljs");
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Claims");

    sheet.addRow(["Policy Number", "Name", "Email", "Phone", "Insurance Company", "Date of Loss", "Location", "Auto Loss", "Property Loss", "Description"]);
    claims.forEach(c => sheet.addRow([c.policyNumber, c.name, c.email, c.phone, c.insuranceCompany, c.claimDate ? c.claimDate.toDateString() : "", c.location, c.autoLoss ? "Yes" : "No", c.propertyLoss ? "Yes" : "No", c.description]));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=claims_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Error exporting claims.");
  }
});

// Customers API (protected)
app.get("/customers/search", async (req, res) => {
  const { query } = req.query;
  try {
    const customer = await Customers.findOne({
      where: {
        [Op.or]: [
          { customer_id: query },
          { last_name: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    if (!customer) return res.json({ success: false });
    res.json({ success: true, customer });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/customers/save", async (req, res) => {
  const data = req.body;
  try {
    if (data.customer_id) {
      await Customers.update(data, { where: { customer_id: data.customer_id } });
      return res.json({ success: true, message: "Customer updated successfully." });
    } else {
      await Customers.create(data);
      return res.json({ success: true, message: "Customer created successfully." });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});





// Endpoint to send email to all customers
app.post('/send-customer-claim-submit', async (req, res) => {
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


// Serve EJS page
app.set('view engine', 'ejs');
app.get('/send-customer-claim-submit-page', (req, res) => {
  res.render('send-customer-claim-submit');
});




/* ---------------------------
   Start server
   --------------------------- */
const port = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}).catch(err => {
  console.error("Failed to sync database:", err);
});
