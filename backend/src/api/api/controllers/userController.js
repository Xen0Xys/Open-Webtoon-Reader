const validators = require("../../../common/utils/validators");
const sequelize = require("../../../common/database/sequelize");
const {loginUserValidator, stateValidator} = require("../validators/userValidators");
const {compareHash, encodeToken} = require("../../../common/utils/encryption");

async function loginUser(req, res){
    const value = await validators.validate(loginUserValidator, req.body, res);
    if(!value)
        return;
    const userModel = await sequelize.models.users.findOne({where: {username: value.username}});
    if(!userModel)
        return res.status(404).json({message: "Username not found"});
    if(!compareHash(userModel.password, value.password))
        return res.status(401).json({message: "Invalid password"});
    const token = await encodeToken({userId: userModel.id}, process.env.PRIVATE_KEY, process.env.TOKEN_DURATION);
    const jsonUser = userModel.toJSON();
    delete jsonUser.password;
    res.status(200).json({user: jsonUser, token, duration: process.env.TOKEN_DURATION});
}

async function checkUserLogin(req, res){
    res.status(200).json(req.user);
}

async function getUserStates(req, res){
    const userId = req.user.id;
    const userStates = await sequelize.models.states.findAll({where: {user_id: userId}});
    if(userStates.length === 0)
        return res.status(204).json();
    res.status(200).json(userStates);
}

async function createState(req, res){
    const userId = req.user.id;
    const episodeId = parseInt(req.params.episode_id);
    const values = await validators.validate(stateValidator, req.body, res);
    if(!values)
        return;
    const userState = await sequelize.models.states.findOne({where: {user_id: userId, episode_id: episodeId}});
    if(userState)
        return res.status(409).json({message: "State already exists"});
    const stateModel = await sequelize.models.states.create({user_id: userId, episode_id: episodeId, state: values.state});
    res.status(201).json(stateModel);
}

async function updateUserState(req, res){
    const userId = req.user.id;
    const episodeId = parseInt(req.params.episode_id);
    const values = await validators.validate(stateValidator, req.body, res);
    if(!values)
        return;
    const userState = await sequelize.models.states.findOne({where: {user_id: userId, episode_id: episodeId}});
    if(!userState)
        return res.status(404).json({message: "State not found"});
    await userState.update({state: values.state});
    res.status(200).json(userState);
}

async function getUserFavorites(req, res){
    const userId = req.user.id;
    const userFavorites = await sequelize.models.favorites.findAll({where: {user_id: userId}});
    if(userFavorites.length === 0)
        return res.status(204).json();
    res.status(200).json(userFavorites);
}

async function addUserFavorite(req, res){
    const userId = req.user.id;
    const webtoonId = parseInt(req.params.webtoon_id);
    const userFavorite = await sequelize.models.favorites.findOne({where: {user_id: userId, webtoon_id: webtoonId}});
    if(userFavorite)
        return res.status(409).json({message: "Webtoon is already in favorites"});
    const favoriteModel = await sequelize.models.favorites.create({user_id: userId, webtoon_id: webtoonId});
    res.status(201).json(favoriteModel);
}

async function removeUserFavorite(req, res){
    const userId = req.user.id;
    const webtoonId = parseInt(req.params.webtoon_id);
    const userFavorite = await sequelize.models.favorites.findOne({where: {user_id: userId, webtoon_id: webtoonId}});
    if(!userFavorite)
        return res.status(404).json({message: "Webtoon is not in favorites"});
    await userFavorite.destroy();
    res.status(200).json({message: "Webtoon removed from favorites"});
}

module.exports = {
    loginUser,
    checkUserLogin,
    getUserStates,
    createState,
    updateUserState,
    getUserFavorites,
    addUserFavorite,
    removeUserFavorite
};
