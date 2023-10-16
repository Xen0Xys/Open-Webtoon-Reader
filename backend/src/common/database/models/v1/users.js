const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        underscored: true,
        createdAt: true,
        updatedAt: true
    });
};
