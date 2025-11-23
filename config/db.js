const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
});

// Load all models
const Claim = require('../models/Claim')(sequelize, DataTypes);
const User = require('../models/User')(sequelize, DataTypes);
const Customers = require('../models/Customers')(sequelize, DataTypes);
const CustomerClaims = require('../models/customer_submitted_claims')(sequelize, DataTypes);

module.exports = {
    sequelize,
    Claim,
    User,
    Customers,
    CustomerClaims
};
