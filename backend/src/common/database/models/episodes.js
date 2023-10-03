const {DataTypes} = require("sequelize");
const {getModel} = require("../../handlers/modelsHandler");

module.exports = (sequelize) => {
    const Episodes = sequelize.define("episodes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        webtoon_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        underscored: true,
        createdAt: true,
        updatedAt: true,
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
