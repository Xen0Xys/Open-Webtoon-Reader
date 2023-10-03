const sequelize = require("../../../common/database/sequelize");

async function getWebtoonResources(req, res){
    const id = req.params.id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id}});
    const { thumbnail, background_banner, top_banner } = webtoon.toJSON();
    res.status(200).json({thumbnail, background_banner, top_banner});
}

async function getEpisodeResources(req, res){
    const id = req.params.id;
    const episode = await sequelize.models.episodes.findOne({where: {id}});
    const { thumbnail } = episode.toJSON();
    res.status(200).json({thumbnail});
}

async function getEpisodeResourcesContent(req, res){
    const id = req.params.id;
    const images = await sequelize.models.images.findAll({where: {episode_id: id}});
    const imagesWithoutEpisodeId = images.map((image) => {
        const { id, episode_id, ...rest } = image.toJSON();
        return rest;
    });
    res.status(200).json(imagesWithoutEpisodeId);
}

module.exports = {
    getWebtoonResources,
    getEpisodeResources,
    getEpisodeResourcesContent
}
