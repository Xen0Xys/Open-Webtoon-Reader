const {DataTypes} = require("sequelize");
const {getModel} = require("../../handlers/modelsHandler");

module.exports = (sequelize) => {
    const Webtoons = sequelize.define("webtoons", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        author: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        genre_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        background_banner: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        top_banner: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        mobile_banner: {
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
                fields: ["title", "language"]
            }
        ]
    });
    const Genres = getModel(sequelize, "genres.js");
    Webtoons.belongsTo(Genres, {foreignKey: "genre_id"});
    return Webtoons;
};
