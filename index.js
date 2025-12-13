// index.js — CommonJS version (require everywhere)

const express = require("express");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const session = require("express-session");
//const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const checkLogin = require("./middleware/auth");
const transporter = require("./config/mailer");
const submitCustomerClaimRoute = require("./routes/submitCustomerClaim");
const submitAndSendEmailRoute = require("./routes/submitAndSendEmail");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const homepageRoute = require("./routes/homepage");
const accountRoute = require("./routes/account");
const viewClaimsRoutes = require("./routes/viewClaims");
const exportClaimsRoutes = require("./routes/exportClaims");
const sendCustomerEmailsRoutes = require("./routes/sendCustomerEmails");
const searchCustomersRoutes = require("./routes/searchCustomers");
const saveCustomerRoutes = require("./routes/saveCustomer");
const tempPhotoLink = require("./routes/tempPhotoLink");
const requireRole = require("./middleware/requireRole");



// Load env
dotenv.config();



// Sequelize models (unchanged)
const { sequelize, Claim, User, Customers, CustomerClaims } =
  require("./config/db");

// Express app
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/images", express.static(path.join(__dirname, "images")));


/*
const {
  s3,
  PutObjectCommand,
  bucketName,
  bucketRegion,
  randomImageName
} = require("./config/s3");
*/


// Multer setup for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// Multer for file uploads
//const upload = multer({ dest: "uploads/" });



//const app = express();

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
   PUBLIC ROUTES (no login)
   --------------------------- */

// Home / marketing page
app.get("/", (req, res) => res.render("main"));

// Public claim form (for emailed customers)
app.get("/customer-claim-submit", (req, res) => {
  res.render("customer-claim-submit");
});


// Login & Signup pages (render)
app.get("/login", (req, res) => res.render("login", { error: null, old: {} }));
app.get("/signup", (req, res) => res.render("signup", { error: null, old: {} }));

/* ---------------------------
   AUTH: Signup & Login POST
   --------------------------- */

// Signup
app.use("/", signupRoute);
  
// Login
app.use("/", loginRoute);

/* ---------------------------
   PUBLIC CLAIM SUBMISSION HANDLER
   ---------------------------
   This route is PUBLIC so emailed customers can POST here.
   It saves the claim (Sequelize Claim model) and sends confirmation email.
*/

app.use("/", submitCustomerClaimRoute);




/* ---------------------------
   PROTECTED ROUTES
   (Anything below here requires login)
   --------------------------- */


app.use(checkLogin);

// Claim submission with email (protected)
app.use("/", submitAndSendEmailRoute);

// Internal (employee) claim form (protected)
/* app.get("/customer-claim-submit", (req, res) => {
  res.render("customer-claim-submit");
}); */

app.get('/send-customer-claim-submit', (req, res) => {
    res.render('send-customer-claim-submit');
});

app.get('/claimsubmit-page', requireRole(["admin", "employee"]), (req, res) => {
    res.render('claimsubmit-page');
});

// Homepage (protected) — include user object
app.use("/", homepageRoute);

// Account page
app.use("/", accountRoute);


// Customer manager & admin pages
app.get("/customer-manager", requireRole("admin"), (req, res) => res.render("customer-manager"));
app.get("/email-page", requireRole("admin"), (req, res) => res.render("index"));

// View claims UI
app.get("/viewclaims-page", (req, res) => res.render("viewclaims-page", { claims: [], searchType: null, searchValue: null }));

// Fetch claims (protected search)
app.use("/", viewClaimsRoutes);



// Export claims to Excel (protected)
app.use("/", requireRole("admin"), exportClaimsRoutes);


// Search multiple customers (ID, last name, or email)
app.use("/", searchCustomersRoutes);


app.use("/", saveCustomerRoutes);



// Download photos (signed S3 link)
app.use("/", tempPhotoLink);

// Endpoint to send email to all customers
app.use("/", requireRole("admin"), sendCustomerEmailsRoutes);


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
