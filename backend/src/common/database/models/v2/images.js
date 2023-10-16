const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV2");

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
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        image: {
            type: DataTypes.BLOB,
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
