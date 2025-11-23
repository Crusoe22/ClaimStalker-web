const express = require("express");
const router = express.Router();
const { Customers } = require("../config/db");

router.post("/customers/save", async (req, res) => {
  const data = req.body;
  try {
    if (data.customer_id) {
      await Customers.update(data, { where: { customer_id: data.customer_id } });
      return res.json({ success: true, message: "Customer updated successfully." });
    } else {
      await Customers.create(data);
      return res.json({ success: true, message: "Customer created successfully." });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

module.exports = router;