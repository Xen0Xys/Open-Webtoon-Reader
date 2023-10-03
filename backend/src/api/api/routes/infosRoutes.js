const {getWebtoons, getWebtoonById, getWebtoonEpisodes, getGenres} = require("../controllers/infosControllers");

module.exports = (router) => {
    router.get("/genres", async (req, res) => {
        await getGenres(req, res);
    });
    router.get("/webtoons", async (req, res) => {
        await getWebtoons(req, res);
    });
    router.get("/webtoons/:id", async (req, res) => {
        await getWebtoonById(req, res);
    });
    router.get("/webtoons/:id/episodes", async (req, res) => {
        await getWebtoonEpisodes(req, res);
    });
};
