module.exports = (router) => {
    router.post("/user/login", async (req, res) => {
        // Login
    });
    router.get("/user/login", async (req, res) => {
        // Check token validity
    });
    router.post("/user/state/:episode_id", async (req, res) => {
        // Set state for an episode
    });
    router.post("/user/favorite/:webtoon_id", async (req, res) => {
        // Add webtoon to favorite
    });
};
