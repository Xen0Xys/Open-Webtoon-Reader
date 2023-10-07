const jwt = require("jsonwebtoken");
const sequelize = require("../../../common/database/sequelize");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(401).json({message: "No token provided"});
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message: "No token provided"});
    let decodedToken;
    try{
        decodedToken = await jwt.verify(token, process.env.PRIVATE_KEY);
    }catch(e){
        return res.status(401).json({message: "Invalid token"});
    }
    if(!decodedToken) return res.status(401).json({message: "Invalid token"});
    const userId = decodedToken.userId;
    const user = await sequelize.models.users.findOne({where: {id: userId}});
    if(!user) return res.status(404).json({message: "User not found"});
    const jsonUser = user.toJSON();
    delete jsonUser.password;
    req.user = jsonUser;
    next();
};
