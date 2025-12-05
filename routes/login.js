const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { User } = require("../config/db");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  // Require email and password
  if (!email || !password) {
    return res.render("login", { 
      error: "Please enter email and password.", 
      old: req.body 
    });
  }

  try {
    // Search by email instead of username
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("login", { 
        error: "Email not found.", 
        old: req.body 
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.render("login", { 
        error: "Incorrect password.", 
        old: req.body 
      });
    }

    req.session.userId = user.id;
    res.redirect("/homepage");

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
});

module.exports = router;
