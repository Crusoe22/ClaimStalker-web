// config.js
const { Sequelize, DataTypes } = require('sequelize');

// Connect to PostgreSQL
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
});

// Define Claim model
const Claim = sequelize.define('Claims', {
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

// Define User model
const User = sequelize.define('Users', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Export models + sequelize instance
module.exports = { Claim, User, sequelize };
