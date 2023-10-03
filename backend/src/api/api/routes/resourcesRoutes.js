const {getWebtoonResources, getEpisodeResources, getEpisodeResourcesContent} = require("../controllers/resourcesControllers");

module.exports = (router) => {
    router.get("/resources/webtoon/:id", async (req, res) => {
        await getWebtoonResources(req, res)
    });
    router.get("/resources/episodes/:id", async (req, res) => {
        await getEpisodeResources(req, res)
    });
    router.get("/resources/episodes/content/:id", async (req, res) => {
        await getEpisodeResourcesContent(req, res)
    });
}
