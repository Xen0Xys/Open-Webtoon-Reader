const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("genres", {
        id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false
    });
};
