const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV1");

module.exports = (sequelize) => {
    const Images = sequelize.define("images", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        episode_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ["episode_id", "number"]
            }
        ]
    });
    const Episodes = getModel(sequelize, "episodes.js");
    Images.belongsTo(Episodes, {foreignKey: "episode_id"});
    return Images;
};
