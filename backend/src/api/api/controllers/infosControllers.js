const sequelize = require("../../../common/database/sequelize");

async function getGenres(req, res) {
    const genres = await sequelize.models.genres.findAll();
    res.status(200).json(genres);
}

async function getWebtoons(req, res) {
    const webtoons = await sequelize.models.webtoons.findAll();
    const webtoonsWithoutThumbnail = webtoons.map((webtoon) => {
        const { thumbnail, background_banner, top_banner, ...rest } = webtoon.toJSON();
        return rest;
    });
    res.status(200).json(webtoonsWithoutThumbnail);
}

async function getWebtoonById(req, res){
    const id = req.params.id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id}});
    const { thumbnail, background_banner, top_banner, ...rest } = webtoon.toJSON();
    res.status(200).json(rest);
}

async function getWebtoonEpisodes(req, res){
    const id = req.params.id;
    const episodes = await sequelize.models.episodes.findAll({where: {webtoon_id: id}});
    const episodesWithoutThumbnail = episodes.map((episode) => {
        const { thumbnail, ...rest } = episode.toJSON();
        return rest;
    });
    res.status(200).json(episodesWithoutThumbnail);
}

module.exports = {
    getGenres,
    getWebtoons,
    getWebtoonById,
    getWebtoonEpisodes
};
