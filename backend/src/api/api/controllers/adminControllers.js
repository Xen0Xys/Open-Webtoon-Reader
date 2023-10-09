const validators = require("../../../common/utils/validators");
const {createAccountValidator, updatePasswordValidator, startDownloadValidator} = require("../validators/adminValidators");
const sequelize = require("../../../common/database/sequelize");
const encryption = require("../../../common/utils/encryption");
const {getDownloadState, stopDbDownload} = require("../../../lib/utils/saving/databaseSaving");
const {updateWebtoonCache, isCacheLoaded, isDownloading} = require("../../../lib/lib");

async function createAccount(req, res){
    const value = await validators.validate(createAccountValidator, req.body, res);
    if(!value)
        return;
    if(await sequelize.models.users.findOne({where: {username: value.username}}))
        return res.status(400).json({message: "Username already taken"});
    const hashedPassword = await encryption.hash(value.password);
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
    if(!users.length)
        return res.status(404).json({message: "No users found"});
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
    const hashedPassword = await encryption.hash(value.password);
    await user.update({password: hashedPassword});
    res.status(200).json({message: "Password updated"});
}

function fetchDownloadState(req, res){
    const state = getDownloadState();
    if(!state)
        return res.status(404).json({message: "Download not found"});
    res.status(200).json({state});
}

async function startDownload(req, res){
    const {isCacheLoaded, isDownloading, startDownload, findWebtoonInCache} = require("../../../lib/lib");
    if(!isCacheLoaded())
        return res.status(400).json({message: "Webtoon cache not loaded"});
    const value = await validators.validate(startDownloadValidator, req.body, res);
    if(!value)
        return;
    if(isDownloading())
        return res.status(400).json({message: "Download already started"});
    const target = findWebtoonInCache(value.webtoonName, value.language);
    if(!target)
        return res.status(404).json({message: "Webtoon not found"});
    startDownload(target, value.startEpisode);
    res.status(200).json({message: "Download started"});
}

function stopDownload(req, res){
    stopDbDownload();
    res.status(200).json({message: "Download stopped"});
}

async function updateWebtoon(req, res){
    const {isDownloading, startDownload, findWebtoonInCache} = require("../../../lib/lib");
    if(isDownloading())
        return res.status(400).json({message: "Download already started"});
    const webtoonId = req.params.webtoon_id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id: webtoonId}});
    if(!webtoon)
        return res.status(404).json({message: "Webtoon not found"});
    const lastEpisode = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoon.id}, order: [["number", "DESC"]]});
    if(!lastEpisode)
        return res.status(404).json({message: "Webtoon not found"});
    const target = findWebtoonInCache(webtoon.title, webtoon.language);
    if(!target)
        return res.status(404).json({message: "Webtoon not found"});
    startDownload(target, lastEpisode.number);
    res.status(200).json({message: "Download started"});
}

function updateCache(req, res){
    if(!isCacheLoaded())
        return res.status(400).json({message: "Webtoon cache is currently loading"});
    updateWebtoonCache();
    res.status(200).json({message: "Cache update started"});
}

module.exports = {
    createAccount,
    deleteAccount,
    getAccounts,
    updatePassword,
    fetchDownloadState,
    startDownload,
    stopDownload,
    updateWebtoon,
    updateCache
};