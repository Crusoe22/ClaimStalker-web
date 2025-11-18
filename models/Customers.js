module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Customers", {
        customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        //agency_id: DataTypes.INTEGER,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        email: DataTypes.STRING,
        address_line1: DataTypes.STRING,
        address_line2: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zip_code: DataTypes.STRING
    }, {
        tableName: "customers",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
};
