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
};
