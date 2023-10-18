const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("webtoons", {
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
};
