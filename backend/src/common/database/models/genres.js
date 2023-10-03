const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("genres", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false
    });
};
