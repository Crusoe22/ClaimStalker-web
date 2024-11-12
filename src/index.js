const express = require("express");
const path = require("path");
const { UserCollection, ClaimCollection } = require("./config"); // Import collections as per your config.js file
const bcrypt = require('bcrypt');

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
        res.send("Registration successful!");
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

// Claim submission route
app.post("/submit-claim", async (req, res) => {
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
        const savedClaim = await ClaimCollection.create(claimData);
        console.log("Claim saved successfully:", savedClaim);
        res.send("Claim submitted successfully!");
    } catch (error) {
        console.error("Error saving claim:", error);
        res.status(500).send("An error occurred while submitting your claim.");
    }
});

//TODO: Add email sending finctionality with EmailJS

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



// Send email button
function sendMail() {
    console.log("sendMail function is called"); // Add this line
    var params = {
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      policyNumber: document.getElementById("policyNumber").value,
      insuranceCompany: document.getElementById("insuranceCompany").value,
      claimDate: document.getElementById("claimDate").value,
      autoLoss: document.getElementById("autoLoss").value,
      propertyLoss: document.getElementById("propertyLoss").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      phone: document.getElementById("phone").value, // added phone number
    };
  
    const serviceID = "service_y39lgic";
    const templateID = "template_4xdsmtr";
  
    emailjs.send(serviceID, templateID, params)
      .then(res => {
          document.getElementById("email").value = "";
          document.getElementById("name").value = "";
          document.getElementById("policyNumber").value = "";
          document.getElementById("insuranceCompany").value = "";
          document.getElementById("claimDate").value = "";
          document.getElementById("autoLoss").value = "";
          document.getElementById("propertyLoss").value = "";
          document.getElementById("location").value = "";
          document.getElementById("description").value = "";
          document.getElementById("phone").value = ""; // reset phone field
          console.log(res);
          alert("Your claim was sent successfully!");
      })
      .catch(err => console.log(err));
}



// Define port for the application
const port = 5500;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
