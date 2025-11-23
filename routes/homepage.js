const express = require("express");
const router = express.Router();
const { User } = require("../db/db"); // import your User model
const { checkLogin } = require("../middleware/auth"); // import your auth middleware


// Homepage (protected) — include user object
router.get("/homepage", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.redirect("/login");
    res.render("homepage", { user });
  } catch (err) {
    console.error("Homepage error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;