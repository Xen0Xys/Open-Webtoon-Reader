const {getWebtoons, findWebtoon, getWebtoonInfos} = require("./utils/webtoon");
const {saveAsFiles} = require("./utils/saving/filesSaving");
require("dotenv").config();

// Init database
require("../common/database/sequelize");
const {saveInDatabase, stopDownload} = require("./utils/saving/databaseSaving");

async function debug(){
    const webtoons = await getWebtoons("fr");
    const target = findWebtoon(webtoons, "Tower of god");
    const completeTarget = await getWebtoonInfos(target);
    console.log(completeTarget);
    await saveInDatabase(target);
}

// Tests
debug();
