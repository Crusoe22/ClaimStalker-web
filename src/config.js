const { Sequelize, DataTypes } = require('sequelize');

// Connect to PostgreSQL
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
});

// Define Claim model
const Claim = sequelize.define('Claim', {
    email: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    policyNumber: { type: DataTypes.STRING, allowNull: false },
    insuranceCompany: { type: DataTypes.STRING, allowNull: false },
    claimDate: { type: DataTypes.DATE, allowNull: false },
    autoLoss: { type: DataTypes.STRING, allowNull: false },
    propertyLoss: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
});

// Export the model
module.exports = { Claim, sequelize };