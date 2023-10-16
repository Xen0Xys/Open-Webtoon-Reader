const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV2");

module.exports = (sequelize) => {
    return sequelize.define("webtoons", {
        id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        author: {
            type: DataTypes.STRING(30),
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
            type: DataTypes.BLOB,
            allowNull: false
        },
        background_banner: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        top_banner: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        mobile_banner: {
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
                fields: ["title", "language"]
            }
        ]
    });
};
