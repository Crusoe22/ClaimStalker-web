module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        name: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        phone: DataTypes.STRING,
        password: { type: DataTypes.STRING, allowNull: false },
    }, {
        tableName: "Users"
    });
};
