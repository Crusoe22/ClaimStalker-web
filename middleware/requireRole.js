module.exports = function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }

    if (!req.user.role) {
      return res.status(403).send("Role not assigned");
    }

    const allowed = Array.isArray(roles) ? roles : [roles];

    if (!allowed.includes(req.user.role)) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
};
