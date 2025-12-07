module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Claim', {
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        policyNumber: DataTypes.STRING,
        insuranceCompany: DataTypes.STRING,
        claimDate: DataTypes.DATE,
        autoLoss: DataTypes.STRING,
        propertyLoss: DataTypes.STRING,
        location: DataTypes.STRING,
        description: DataTypes.STRING,
        photo_urls: { type: DataTypes.ARRAY(DataTypes.STRING)}
    }, {
        tableName: "Claims"
    });
};
