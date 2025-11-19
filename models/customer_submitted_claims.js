/*
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("customer_submitted_claims", {
    claim_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    policy_number: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    claim_date: DataTypes.DATE,
    address_1: DataTypes.TEXT,
    address_2: DataTypes.TEXT,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    description: DataTypes.TEXT,
    photo_urls: DataTypes.ARRAY(DataTypes.TEXT),
  }, {
    timestamps: true
  });
};*/

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("CustomerSubmittedClaims", {
        claim_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        policy_number: { type: DataTypes.STRING, allowNull: false },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        claim_date: { type: DataTypes.DATEONLY, allowNull: false },
        address_1: { type: DataTypes.TEXT, allowNull: false },
        address_2: { type: DataTypes.TEXT },
        state: { type: DataTypes.STRING },
        zip_code: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT, allowNull: false },
        photo_urls: { type: DataTypes.ARRAY(DataTypes.STRING) }
    }, {
        tableName: "customer_submitted_claims",
        timestamps: true,            // enable timestamps
        createdAt: "created_at",     // map to existing column
        updatedAt: "updated_at"      // map to existing column
    });
};
