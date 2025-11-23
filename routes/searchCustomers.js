const express = require("express");
const router = express.Router();
const { Customers } = require("../config/db");
const { Op } = require("sequelize");

// Search multiple customers (ID, last name, or email)
router.get("/customers/search-multiple", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.json({ success: true, customers: [] });
        }

        const customers = await Customers.findAll({
            where: {
                [Op.or]: [
                    { customer_id: query },
                    { last_name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            order: [["customer_id", "ASC"]]
        });

        return res.json({
            success: true,
            customers
        });

    } catch (err) {
        console.error(err);
        return res.json({ success: false, error: "Search failed" });
    }
});

module.exports = router;