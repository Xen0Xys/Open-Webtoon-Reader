const {updatePasswordValidator, startDownloadValidator} = require("../validators/adminValidators");
const {getDownloadState, stopDbDownload} = require("../../../lib/utils/saving/databaseSaving");
const sequelize = require("../../../common/database/sequelize");
const encryption = require("../../../common/utils/encryption");
const validators = require("../../../common/utils/validators");
const downloadLib = require("../../../lib/lib");

async function createAccount(req, res){
    if(await sequelize.models.users.findOne({where: {username: req.bodyValues.username}}))
        return res.status(400).json({message: "Username already taken"});
    const hashedPassword = await encryption.hash(req.bodyValues.password);
    const userModel = await sequelize.models.users.create({
        username: req.bodyValues.username,
        password: hashedPassword,
        avatar: req.bodyValues.avatar
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

function getDownloadQueue(req, res){
    const currentDownload = downloadLib.getCurrentDownload();
    const downloadQueue = downloadLib.getDownloadQueue();
    if(!currentDownload)
        return res.status(204).json();
    const progress = getDownloadState();
    const downloadQueueWithoutStartEpisode = downloadQueue.map((download) => {
        return download.webtoon;
    });
    currentDownload.progress = progress;
    res.status(200).json({currentDownload, downloadQueue: downloadQueueWithoutStartEpisode});
}

function isWebtoonInDownloadQueue(webtoon){
    const currentDownload = downloadLib.getCurrentDownload();
    if(currentDownload && currentDownload.title === webtoon.title && currentDownload.language === webtoon.language)
        return true;
    const downloadQueue = downloadLib.getDownloadQueue();
    for(const download of downloadQueue)
        if(download.webtoon.title === webtoon.title && download.webtoon.language === webtoon.language)
            return true;
    return false;
}

async function addDownload(req, res){
    if(!downloadLib.isCacheLoaded())
        return res.status(425).json({message: "Webtoon cache not loaded"});
    const value = await validators.validate(startDownloadValidator, req.body, res);
    if(!value)
        return;
    const webtoon = downloadLib.findWebtoonInCache(value.webtoonTitle, value.language);
    if(webtoon.error)
        return res.status(400).json({message: webtoon.error});
    if(isWebtoonInDownloadQueue(webtoon))
        return res.status(409).json({message: "Webtoon already in download queue"});
    downloadLib.addDownloadToQueue(webtoon, value.startEpisode);
    res.status(200).json({message: "Download added to queue"});
}

function stopCurrentDownload(req, res){
    stopDbDownload();
    res.status(200).json({message: "Download stopped"});
}

function clearDownloadQueue(req, res){
    if(downloadLib.getDownloadQueue().length === 0)
        return res.status(400).json({message: "Download queue is empty"});
    downloadLib.clearDownloadQueue();
    res.status(200).json({message: "Download queue cleared"});
}

async function updateWebtoon(req, res){
    if(!downloadLib.isCacheLoaded())
        return res.status(425).json({message: "Webtoon cache not loaded"});
    const webtoonId = req.params.webtoon_id;
    const webtoon = await sequelize.models.webtoons.findOne({where: {id: webtoonId}});
    if(!webtoon)
        return res.status(404).json({message: "Webtoon not found"});
    const lastEpisode = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoon.id}, order: [["number", "DESC"]]});
    if(!lastEpisode)
        return res.status(404).json({message: "Last episode not found"});
    const target = downloadLib.findWebtoonInCache(webtoon.title, webtoon.language);
    if(!target)
        return res.status(404).json({message: "Webtoon not found"});
    if(isWebtoonInDownloadQueue(webtoon))
        return res.status(400).json({message: "Webtoon already in download queue"});
    downloadLib.addDownloadToQueue(target, lastEpisode.number);
    res.status(200).json({message: "Download started"});
}

async function updateAllWebtoons(req, res){
    if(!downloadLib.isCacheLoaded())
        return res.status(425).json({message: "Webtoon cache not loaded"});
    const webtoons = await sequelize.models.webtoons.findAll({attributes: ["id", "title", "language"]});
    if(!webtoons.length)
        return res.status(404).json({message: "No webtoons found"});
    let downloadCount = 0;
    for(const webtoon of webtoons){
        const lastEpisode = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoon.id}, order: [["number", "DESC"]]});
        if(!lastEpisode)
            continue;
        const target = downloadLib.findWebtoonInCache(webtoon.title, webtoon.language);
        if(!target)
            continue;
        if(isWebtoonInDownloadQueue(webtoon))
            continue;
        downloadLib.addDownloadToQueue(target, lastEpisode.number);
        downloadCount++;
    }
    res.status(200).json({message:  `${downloadCount} downloads added to queue`});
}

function updateCache(req, res){
    if(!downloadLib.isCacheLoaded())
        return res.status(425).json({message: "Webtoon cache not loaded"});
    downloadLib.updateWebtoonCache();
    res.status(200).json({message: "Cache update started"});
}

module.exports = {
    createAccount,
    deleteAccount,
    getAccounts,
    updatePassword,
    stopCurrentDownload,
    updateWebtoon,
    updateCache,
    clearDownloadQueue,
    getDownloadQueue,
    addDownload,
    updateAllWebtoons
};
