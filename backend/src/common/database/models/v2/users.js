const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("users", {
        id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        avatar: {
            type: DataTypes.BLOB,
            allowNull: true
        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false
    });
};
