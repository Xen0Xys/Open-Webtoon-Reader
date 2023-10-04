const {getWebtoons, getWebtoonEpisodes, getEpisodeImages} = require("../controllers/webtoonControllers");

module.exports = (router) => {
    router.get("/webtoons", async (req, res) => {
        await getWebtoons(req, res);
    });
    router.get("/webtoons/:webtoon_id/episodes", async (req, res) => {
        await getWebtoonEpisodes(req, res);
    });
    router.get("/webtoons/:webtoon_id/episode/:episode_number", async (req, res) => {
        await getEpisodeImages(req, res);
    });
};
