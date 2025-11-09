const express = require("express");
const path = require("path");
const { Claim, User, sequelize } = require("./config"); // Updated import for Sequelize models
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const app = express();

// Convert data to JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static("public"));
app.use(express.static("pages-css"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Routes for rendering pages
app.get("/", (req, res) => {
    res.render("main");
});

app.get('/account-page', (req, res) => {
    res.render('account-page');
});

app.get('/claimsubmit-page', (req, res) => {
    res.render('claimsubmit-page');
});

/* Removed registerlogin-page route as separate login and signup routes are implemented
app.get('/registerlogin-page', (req, res) => {
    res.render('registerlogin-page');
});*/

app.get('/homepage', (req, res) => {
    res.render('homepage');
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/customer-claim-submit", (req, res) => {
    res.render("customer-claim-submit");
});

// Email page route
app.get("/email-page", (req, res) => {
    res.render("index");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { name: data.name } });
    if (existingUser) {
        return res.send('User already exists. Please choose a different username.');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    try {
        const newUser = await User.create(data);
        console.log("New user created:", newUser);
        res.send('<script>alert("Registration successful! Please log in."); window.location.href = "/login";</script>');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("An error occurred during registration.");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ where: { name: req.body.username } });
        if (!user) {
            return res.send("Username not found.");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.send("Incorrect password.");
        }

        res.render("homepage");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("An error occurred during login.");
    }
});

// Render the viewclaims-page form
app.get("/viewclaims-page", (req, res) => {
    res.render("viewclaims-page", { claim: null });
});

// Search for a claim by policy number
app.get("/view-claim", async (req, res) => {
    const policyNumber = req.query.policyNumber;

    try {
        const claim = await Claim.findOne({ where: { policyNumber: policyNumber } });
        res.render("viewclaims-page", { claim });
    } catch (error) {
        console.error("Error retrieving claim:", error);
        res.status(500).send("An error occurred while retrieving the claim.");
    }
});

// Route to handle sending email and submitting claim to database
app.post("/submit-and-send-email", async (req, res) => {
    const claimData = {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        policyNumber: req.body.policyNumber,
        insuranceCompany: req.body.insuranceCompany,
        claimDate: req.body.claimDate,
        autoLoss: req.body.autoLoss,
        propertyLoss: req.body.propertyLoss,
        location: req.body.location,
        description: req.body.description
    };

    try {
        const savedClaim = await Claim.create(claimData);
        console.log("Claim saved successfully:", savedClaim);
    } catch (error) {
        console.error("Error saving claim:", error);
        return res.status(500).send("An error occurred while submitting your claim.");
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable for security
            pass: process.env.EMAIL_PASS  // Use environment variable for security
        }
    });

    // Email options
    const mailOptions = {
        from: '"CLAIM STALKER" <noreply@claimstalker.com>',
        to: claimData.email,
        subject: "Claim Submission Notification",
        text: `Hello ${claimData.name},\n\nYour claim has been submitted successfully.`,
        html: `
            <p>Hello <b>${claimData.name}</b>,</p>
            <p>Your claim has been submitted successfully with the following details:</p>
            <ul>
                <li>Email: ${claimData.email}</li>
                <li>Phone Number: ${claimData.phone}</li>
                <li>Policy Number: ${claimData.policyNumber}</li>
                <li>Insurance Company: ${claimData.insuranceCompany}</li>
                <li>Claim Date: ${claimData.claimDate}</li>
                <li>Auto Loss: ${claimData.autoLoss}</li>
                <li>Property Loss: ${claimData.propertyLoss}</li>
                <li>Location: ${claimData.location}</li>
                <li>Description: ${claimData.description}</li>
            </ul>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Email could not be sent." });
    }
    console.log(`Email sent: ${info.response}`);
    res.json({ success: true, message: "Claim submitted and email sent successfully!" });
    });
});

// Sync Sequelize models and start server
const port = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to sync database:", err);
});