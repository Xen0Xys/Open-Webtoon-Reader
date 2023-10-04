const {DataTypes} = require("sequelize");
const {getModel} = require("../../handlers/modelsHandler");

module.exports = (sequelize) => {
    const Favorites = sequelize.define("favorites", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        webtoon_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false
    });
    const Users = getModel(sequelize, "users.js");
    const Webtoons = getModel(sequelize, "webtoons.js");
    Favorites.belongsTo(Users, {foreignKey: "user_id"});
    Favorites.belongsTo(Webtoons, {foreignKey: "webtoon_id"});
    return Favorites;
};
