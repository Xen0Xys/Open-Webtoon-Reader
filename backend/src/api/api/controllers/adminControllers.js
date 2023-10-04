const validators = require('../../../common/utils/validators');
const {createAccountValidator, updatePasswordValidator, startDownloadValidator} = require("../validators/adminValidators");
const sequelize = require("../../../common/database/sequelize");
const encryption = require("../../../common/utils/encryption");
const {getDownloadState, saveInDatabase, stopDbDownload} = require("../../../lib/utils/saving/databaseSaving");
const {getWebtoons, findWebtoon, getWebtoonInfos} = require("../../../lib/utils/webtoon");

async function createAccount(req, res){
    const value = await validators.validate(createAccountValidator, req.body, res);
    if(!value)
        return;
    if(await sequelize.models.users.findOne({where: {username: value.username}}))
        return res.status(400).json({message: "Username already taken"});
    const hashedPassword = await encryption.hash(value.password)
    const userModel = await sequelize.models.users.create({
        username: value.username,
        password: hashedPassword,
        avatar: value.avatar
    });
    const jsonUser = userModel.toJSON();
    delete jsonUser.password;
    res.status(200).json(jsonUser);
}

async function deleteAccount(req, res){
    const userId = req.params.user_id;
    const user = await sequelize.models.users.findOne({where: {id: userId}});
    if(!user)
        return res.status(404).json({message: "User not found"});
    await user.destroy();
    res.status(200).json({message: "User deleted"});
}

async function getAccounts(req, res){
    const users = await sequelize.models.users.findAll({attributes: {exclude: ["password"]}});
    res.status(200).json(users);
}

async function updatePassword(req, res){
    const userId = req.params.user_id;
    const value = await validators.validate(updatePasswordValidator, req.body, res);
    if(!value)
        return;
    const user = await sequelize.models.users.findOne({where: {id: userId}});
    if(!user)
        return res.status(404).json({message: "User not found"});
    const hashedPassword = await encryption.hash(value.password)
    await user.update({password: hashedPassword});
    res.status(200).json({message: "Password updated"});
}

function fetchDownloadState(req, res){
    const state = getDownloadState();
    if(!state)
        return res.status(404).json({message: "Download not found"});
    res.status(200).json({state});
}

// TODO: Load webtoons in cache
async function startDownload(req, res){
    const value = await validators.validate(startDownloadValidator, req.body, res);
    if(!value)
        return;
    if(getDownloadState())
        return res.status(400).json({message: "Download already started"});
    const webtoons = await getWebtoons(value.language);
    const target = findWebtoon(webtoons, value.webtoonName);
    if(!target)
        return res.status(404).json({message: "Webtoon not found"});
    saveInDatabase(target, value.startEpisode);
    res.status(200).json({message: "Download started"});
}

function stopDownload(req, res){
    stopDbDownload();
    res.status(200).json({message: "Download stopped"});
}

module.exports = {
    createAccount,
    deleteAccount,
    getAccounts,
    updatePassword,
    fetchDownloadState,
    startDownload,
    stopDownload
}
