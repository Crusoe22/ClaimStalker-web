const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Login-tut")
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.log("Database cannot be Connected:", error);
    });

// Create Schema for Login
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create User Collection
const UserCollection = mongoose.model("users", LoginSchema);

// Claim Data Schema
const ClaimSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    policyNumber: { type: String, required: true },
    insuranceCompany: { type: String, required: true },
    claimDate: { type: Date, required: true },
    autoLoss: { type: String, required: true },
    propertyLoss: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }
});

// Create Claim Collection
const ClaimCollection = mongoose.model("claimdata", ClaimSchema);

// Export collections
module.exports = { UserCollection, ClaimCollection };
