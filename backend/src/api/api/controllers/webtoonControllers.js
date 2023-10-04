const sequelize = require("../../../common/database/sequelize");

async function getWebtoons(req, res) {
    const webtoons = await sequelize.models.webtoons.findAll({attributes: ["title", "author", "language", "genre_id", "thumbnail"]});
    res.status(200).json(webtoons);
}

async function getWebtoonEpisodes(req, res){
    const webtoonId = req.params.webtoon_id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id: webtoonId}});
    const episodes = await sequelize.models.episodes.findAll({where: {webtoon_id: webtoonId}});
    return res.status(200).json({
        background_banner: webtoon.background_banner,
        top_banner: webtoon.top_banner,
        mobile_banner: webtoon.mobile_banner,
        episodes
    });
}

async function getEpisodeImages(req, res){
    const webtoonId = req.params.webtoon_id;
    const episodeNumber = req.params.episode_number;
    const episodeId = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoonId, number: episodeNumber}});
    const images = await sequelize.models.images.findAll({where: {episode_id: episodeId.id}, order: [["number", "ASC"]], attributes: ["image"]});
    res.status(200).json(images);
}

module.exports = {
    getWebtoons,
    getWebtoonEpisodes,
    getEpisodeImages
};
