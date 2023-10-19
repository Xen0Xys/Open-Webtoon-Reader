const adminAuthentication = require("../middlewares/adminAuthentication");
const {getWebtoons} = require("../controllers/webtoonControllers");
const {createAccount, deleteAccount, getAccounts, updatePassword, stopCurrentDownload, updateCache,
    updateWebtoon,
    clearDownloadQueue,
    getDownloadQueue,
    addDownload, updateAllWebtoons
} = require("../controllers/adminControllers");
const {createAccountValidator} = require("../validators/adminValidators");
const {bodyValidation} = require("../middlewares/validation");

module.exports = (router) => {
    router.get("/admin/webtoons", adminAuthentication, async (req, res) => {
        await getWebtoons(req, res);
    });
    router.post("/admin/user", adminAuthentication, bodyValidation(createAccountValidator), async (req, res) => {
        await createAccount(req, res);
    });
    router.delete("/admin/user/:user_id", adminAuthentication, async (req, res) => {
        await deleteAccount(req, res);
    });
    router.get("/admin/users", adminAuthentication, async (req, res) => {
        await getAccounts(req, res);
    });
    router.put("/admin/user/:user_id", adminAuthentication, async (req, res) => {
        await updatePassword(req, res);
    });
    router.get("/admin/downloads", adminAuthentication, (req, res) => {
        getDownloadQueue(req, res);
    });
    router.post("/admin/download", adminAuthentication, async (req, res) => {
        await addDownload(req, res);
    });
    router.delete("/admin/download", adminAuthentication, (req, res) => {
        stopCurrentDownload(req, res);
    });
    router.delete("/admin/downloads", adminAuthentication, (req, res) => {
        clearDownloadQueue(req, res);
    });
    router.post("/admin/download/:webtoon_id", adminAuthentication, async (req, res) => {
        await updateWebtoon(req, res);
    });
    router.post("/admin/downloads", adminAuthentication, async (req, res) => {
        await updateAllWebtoons(req, res);
    });
    router.put("/admin/cache", adminAuthentication, async (req, res) => {
        updateCache(req, res);
    });
};
