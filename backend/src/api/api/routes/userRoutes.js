const authentication = require("../middlewares/authentication");
const {loginUser, checkUserLogin, getUserStates, getUserFavorites, createState, updateUserState, addUserFavorite,
    removeUserFavorite
} = require("../controllers/userController");

module.exports = (router) => {
    router.post("/user/login", async (req, res) => {
        await loginUser(req, res);
    });
    router.get("/user/login", authentication, async (req, res) => {
        await checkUserLogin(req, res);
    });
    router.get("/user/states", authentication, async (req, res) => {
        await getUserStates(req, res);
    });
    router.post("/user/state/:episode_id", authentication, async (req, res) => {
        await createState(req, res);
    });
    router.put("/user/state/:episode_id", authentication, async (req, res) => {
        await updateUserState(req, res);
    });
    router.get("/user/favorites", authentication, async (req, res) => {
        await getUserFavorites(req, res);
    });
    router.post("/user/favorite/:webtoon_id", authentication, async (req, res) => {
        await addUserFavorite(req, res);
    });
    router.delete("/user/favorite/:webtoon_id", authentication, async (req, res) => {
        await removeUserFavorite(req, res);
    });
};
