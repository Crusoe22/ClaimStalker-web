const express = require("express");
const path = require("path");
const { UserCollection, ClaimCollection } = require("./config"); // Import collections as per your config.js file
const bcrypt = require('bcrypt');
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
app.get('/account-page', (req, res) => {
    res.render('account-page');
});

app.get('/claimsubmit-page', (req, res) => {
    res.render('claimsubmit-page');
});

app.get('/registerlogin-page', (req, res) => {
    res.render('registerlogin-page');
});

app.get('/homepage', (req, res) => {
    res.render('homepage');
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Email page route
app.get("/email-page", (req, res) => {
    res.render("index"); // Render the email-sending button page
});


// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the username already exists in the database
    const existingUser = await UserCollection.findOne({ name: data.name });
    if (existingUser) {
        return res.send('User already exists. Please choose a different username.');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    try {
        const newUser = await UserCollection.create(data);
        console.log("New user created:", newUser);
        // Send a success message and redirect to login
        res.send('<script>alert("Registration successful! Please log in."); window.location.href = "/login";</script>');
        //alert.send("Registration successful!");//res.send("Registration successful!"); //TODO remove
        //res.render("login", { message: "Registration successful! Please log in." });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("An error occurred during registration.");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const user = await UserCollection.findOne({ name: req.body.username });
        if (!user) {
            return res.send("Username not found.");
        }

        // Compare the hashed password from the database with the plaintext password
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



// Create claim viewer
//const { ClaimCollection } = require("./config");

// Render the viewclaims-page form
app.get("/viewclaims-page", (req, res) => {
    res.render("viewclaims-page", { claim: null });
});

// Search for a claim by policy number
app.get("/view-claim", async (req, res) => {
    const policyNumber = req.query.policyNumber;

    try {
        // Find the claim in the database
        const claim = await ClaimCollection.findOne({ policyNumber: policyNumber });

        // Render the page with claim data if found, or display a message if not found
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
        // Save claim data to the database
        const savedClaim = await ClaimCollection.create(claimData);
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
            user: "nolanmmoss@gmail.com", // Use environment variable for security
            pass: "emet pnlp sdhm fhpk"  // Use environment variable for security
        }
    });

    // Email options
    const mailOptions = {
        from: '"CLAIM STALKER" <nolanmmoss@gmail.com>',
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
                <li>insuranceCompany: ${claimData.insuranceCompany}</li>
                <li>Claim Date: ${claimData.claimDate}</li>
                <li>Auto Loss: ${claimData.autoLoss}</li>
                <li>Property Loss: ${claimData.propertyLoss}</li>
                <li>Location: ${claimData.location}</li>
                <li>Description: ${claimData.description}</li>
            </ul>
        `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send("Email could not be sent.");
        }
        console.log(`Email sent: ${info.response}`);
        res.send("Claim submitted and email sent successfully!"); //TODO: remove this so it doesn't send to secound page. Maybe change to a pop up
    });
});



// Define port for the application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
