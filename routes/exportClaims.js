const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Claim } = require("../config/db");
const Excel = require("exceljs");

// Export claims to Excel (protected)
router.get("/export-claims", async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    let where = {};
    if (searchType === "policyNumber") where.policyNumber = searchValue;
    else if (searchType === "name") where.name = { [Op.iLike]: `%${searchValue}%` };
    else if (searchType === "phone") where.phone = { [Op.iLike]: `%${searchValue}%` };

    const claims = await Claim.findAll({ where });
    const Excel = require("exceljs");
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Claims");

    sheet.addRow(["Policy Number", "Name", "Email", "Phone", "Insurance Company", "Date of Loss", "Location", "Auto Loss", "Property Loss", "Description"]);
    claims.forEach(c => sheet.addRow([c.policyNumber, c.name, c.email, c.phone, c.insuranceCompany, c.claimDate ? c.claimDate.toDateString() : "", c.location, c.autoLoss ? "Yes" : "No", c.propertyLoss ? "Yes" : "No", c.description]));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=claims_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Error exporting claims.");
  }
});

module.exports = router;