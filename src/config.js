// config.js
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
}, {
    tableName: "Claims" // specify custom table name
});

/*
// Define User model
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: "Users" // specify custom table name
}
);*/

// Define User model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: "Users"
});

// Export models + sequelize instance
module.exports = { Claim, User, sequelize };
