const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Claim } = require("../config/db"); // Import your models

// Fetch claims (protected search)
router.get("/view-claim", async (req, res) => {
  const { searchType, searchValue, policyNumber } = req.query;
  try {
    let where = {};
    if (policyNumber) where.policyNumber = policyNumber;
    else if (searchType === 'policyNumber') where.policyNumber = searchValue;
    else if (searchType === 'name') where.name = { [Op.iLike]: `%${searchValue}%` };
    else if (searchType === 'phone') where.phone = { [Op.iLike]: `%${searchValue}%` };

    const claims = await Claim.findAll({ where });
    res.render("viewclaims-page", { claims, searchType, searchValue });
  } catch (err) {
    console.error("view-claim error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;