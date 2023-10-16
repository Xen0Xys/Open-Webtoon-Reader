const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV2");

module.exports = (sequelize) => {
    const Episodes = sequelize.define("episodes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        webtoon_id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        number: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        image_number: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        thumbnail: {
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
                fields: ["webtoon_id", "number"]
            }
        ]
    });
    const Webtoons = getModel(sequelize, "webtoons.js");
    Episodes.belongsTo(Webtoons, {foreignKey: "webtoon_id"});
    return Episodes;
};
