const {getWebtoons, findWebtoon, getWebtoonInfos} = require("./utils/webtoon");
const {saveAsFiles} = require("./utils/saving/filesSaving");
require("dotenv").config();

// Init database
require("./lib");
require("../common/database/sequelize");
const {saveInDatabase, stopDownload, stopDbDownload} = require("./utils/saving/databaseSaving");
const {findWebtoonInCache, startDownload, addDownloadToQueue, isCacheLoaded} = require("./lib");
const {sleep} = require("./utils/utils");

async function debug(){
    while(!isCacheLoaded())
        await sleep(1000);
    const target1 = findWebtoonInCache("The Gamer", "fr");
    const target2 = findWebtoonInCache("Lillow fast kitchen", "fr");
    // console.log(target1);
    // console.log(target2);
    addDownloadToQueue(target1, 1);
    // addDownloadToQueue(target2, 1);
}

// Tests
debug();
