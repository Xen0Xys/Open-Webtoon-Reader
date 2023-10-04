const adminAuthentication = require("../middlewares/adminAuthentication")
const {getWebtoons} = require("../controllers/webtoonControllers");
const {createAccount, deleteAccount, getAccounts, updatePassword, fetchDownloadState, startDownload, stopDownload} = require("../controllers/adminControllers");

module.exports = (router) => {
    router.get("/admin/webtoons", adminAuthentication, async (req, res) => {
        await getWebtoons(req, res);
    });
    router.post("/admin/user", adminAuthentication, async (req, res) => {
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
    router.get("/admin/download", adminAuthentication, (req, res) => {
        fetchDownloadState(req, res);
    });
    router.post("/admin/download", adminAuthentication, async (req, res) => {
        await startDownload(req, res);
    });
    router.delete("/admin/download", adminAuthentication, (req, res) => {
        stopDownload(req, res);
    });
};
