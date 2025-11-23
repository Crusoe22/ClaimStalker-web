const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { User } = require("../config/db"); // import your User model

// Login
router.post("/login", async (req, res) => {
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

module.exports = router;