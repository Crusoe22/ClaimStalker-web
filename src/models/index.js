const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
});

// Load all models
const Claim = require('./Claim')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const Customers = require('./Customers')(sequelize, DataTypes);

module.exports = {
    sequelize,
    Claim,
    User,
    Customers
};
