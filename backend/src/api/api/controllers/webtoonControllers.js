const sequelize = require("../../../common/database/sequelize");
const validators = require("../../../common/utils/validators");
const {listValidator} = require("../validators/commonValidators");
const {getDataUrl} = require("../../../lib/utils/utils");

/**
 * Find all models with options
 * @param model Sequelize model
 * @param customOptions
 * @param values Values from listValidator
 * @param attributes Attributes to select or exclude
 * @param excluded Attributes to exclude
 * @returns {Promise<Model[]>} List of models
 */
async function findAllWithOptions(model, customOptions, values, attributes, excluded){
    const options = {
        attributes: excluded ? null : attributes ? attributes : null,
        exclude: excluded ? excluded : null,
        limit: values.limit,
        offset: values.limit && values.page ? (values.page - 1) * values.limit : null,
        order: values.order.split(";").map((order) => order.split(",")),
        ...customOptions
    };
    try{
        return await model.findAll(options);
    } catch (e){
        console.log(e);
        return null;
    }
}

async function getWebtoons(req, res) {
    const values = validators.validate(listValidator, req.query, res);
    if(!values)
        return;
    const webtoons = await findAllWithOptions(sequelize.models.webtoons, null, values, ["id", "title", "author", "language", "thumbnail"], false);
    if(!webtoons)
        return res.status(500).json({message: "Internal server error"});
    if(!webtoons.length)
        return res.status(404).json({message: "Webtoons not found"});
    const jsonWebtoons = webtoons.map((webtoon) => webtoon.toJSON());
    for (const webtoon of jsonWebtoons){
        webtoon.episode_count = await sequelize.models.episodes.count({where: {webtoon_id: webtoon.id}});
        const genreIds = await sequelize.models.webtoon_genres.findAll({where: {webtoon_id: webtoon.id}, attributes: ["genre_id"]});
        webtoon.genres = [];
        for(const genreId of genreIds){
            const genre = await sequelize.models.genres.findOne({where: {id: genreId.genre_id}});
            webtoon.genres.push(genre.name);
        }
        webtoon.thumbnail = getDataUrl(webtoon.thumbnail);
    }
    res.status(200).json(jsonWebtoons);
}

async function getWebtoonEpisodes(req, res){
    const webtoonId = req.params.webtoon_id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id: webtoonId}});
    if(!webtoon)
        return res.status(404).json({message: "Webtoon not found"});
    const values = validators.validate(listValidator, req.query, res);
    if(!values)
        return;
    const episodes = await findAllWithOptions(sequelize.models.episodes, {where: {webtoon_id: webtoonId}}, values, null, false);
    const jsonEpisodes = episodes.map((episode) => episode.toJSON());
    for(const episode of jsonEpisodes)
        episode.thumbnail = getDataUrl(episode.thumbnail);
    if(!episodes)
        return res.status(500).json({message: "Internal server error"});
    if(episodes.length === 0)
        return res.status(204);
    const jsonWebtoon = webtoon.toJSON();
    jsonWebtoon.background_banner = getDataUrl(jsonWebtoon.background_banner);
    jsonWebtoon.top_banner = getDataUrl(jsonWebtoon.top_banner);
    jsonWebtoon.mobile_banner = getDataUrl(jsonWebtoon.mobile_banner);
    jsonWebtoon.thumbnail = getDataUrl(jsonWebtoon.thumbnail);
    return res.status(200).json({
        webtoon: jsonWebtoon,
        episodes: jsonEpisodes
    });
}

async function getEpisodeImages(req, res){
    const webtoonId = req.params.webtoon_id;
    const episodeNumber = req.params.episode_number;
    const episode = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoonId, number: episodeNumber}});
    if(!episode)
        return res.status(404).json({message: "Episode not found"});
    const images = await sequelize.models.images.findAll({where: {episode_id: episode.id}, order: [["number", "ASC"]], attributes: ["image"]});
    const jsonImages = images.map((image) => getDataUrl(image.image));
    if(jsonImages.length === 0)
        return res.status(204).json();
    res.status(200).json(jsonImages);
}

module.exports = {
    getWebtoons,
    getWebtoonEpisodes,
    getEpisodeImages
};
