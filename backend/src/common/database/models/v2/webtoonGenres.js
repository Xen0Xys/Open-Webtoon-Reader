const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV2");

module.exports = (sequelize) => {
    const webtoonGenres = sequelize.define("webtoon_genres", {
        id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        webtoon_id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        genre_id: {
            type: DataTypes.SMALLINT.UNSIGNED,
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
                fields: ["webtoon_id", "genre_id"]
            }
        ]
    });
    const Webtoons = getModel(sequelize, "webtoons.js");
    const Genres = getModel(sequelize, "genres.js");
    webtoonGenres.belongsTo(Webtoons, {foreignKey: "webtoon_id"});
    webtoonGenres.belongsTo(Genres, {foreignKey: "genre_id"});
    return webtoonGenres;
};
