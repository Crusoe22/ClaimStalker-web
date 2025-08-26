const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
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

// Test connection
sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Database connection error:', err));

module.exports = { Claim, sequelize };
