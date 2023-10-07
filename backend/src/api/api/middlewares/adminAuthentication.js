const {compareHash} = require("../../../common/utils/encryption");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(401).json({message: "No admin key provided"});
    const adminKey = authHeader.split(" ")[1];
    if(!adminKey) return res.status(401).json({message: "No admin key provided"});
    if(await compareHash(adminKey, process.env.ADMIN_KEY))
        return next();
    return res.status(401).json({message: "Invalid admin key"});
};
