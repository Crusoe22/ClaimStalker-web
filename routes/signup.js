const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
//const argon2 = require('argon2');
const { body, validationResult } = require("express-validator");

const { User } = require("../config/db"); // import your User model


// Signup with validation
router.post(
  "/signup",
  [
    body('name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').trim().isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('phone').trim().matches(/^\(\d{3}\)\d{3}-\d{4}$/).withMessage('Phone must be in format (555)123-4567.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%_*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character (@$!%_*?&).'),
    body('confirm_password').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach(err => { if (!errorMap[err.param]) errorMap[err.param] = err.msg; });
      return res.render('signup', { error: Object.values(errorMap).join(' '), old: req.body });
    }

    try {
      const data = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        password: await bcrypt.hash(req.body.password, 10)
      };


      await User.create(data);
      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/login');
    } catch (err) {
      console.error("Signup error:", err);
      return res.render('signup', { error: 'An error occurred during registration.', old: req.body });
    }
  }
);

module.exports = router;