
/* ---------------------------
   Helper middleware
   --------------------------- 
function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

module.exports = checkLogin;*/

const { User } = require("../config/db");

async function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }

  try {
    // Load user from DB
    const user = await User.findByPk(req.session.userId);

    if (!user) {
      req.session.destroy();
      return res.redirect("/login");
    }

    // Attach user object for downstream middleware
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).send("Authentication error");
  }
}

module.exports = checkLogin;
