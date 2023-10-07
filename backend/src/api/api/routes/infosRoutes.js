const {getWebtoons, getWebtoonEpisodes, getEpisodeImages} = require("../controllers/webtoonControllers");
const authentication = require("../middlewares/authentication");

module.exports = (router) => {
    router.get("/webtoons", authentication, async (req, res) => {
        await getWebtoons(req, res);
    });
    router.get("/webtoons/:webtoon_id/episodes", authentication, async (req, res) => {
        await getWebtoonEpisodes(req, res);
    });
    router.get("/webtoons/:webtoon_id/episode/:episode_number", authentication, async (req, res) => {
        await getEpisodeImages(req, res);
    });
};
