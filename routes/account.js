const express = require("express");
const router = express.Router();
const { User } = require("../db/db"); // import User model
const { checkLogin } = require("../middleware/auth"); // import auth middleware

// Account page (protected)

// Account page
router.get("/account", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.redirect("/login");
    res.render("account-page", { user });
  } catch (err) {
    console.error("Account error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;