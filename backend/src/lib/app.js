const {getWebtoons, findWebtoon, getWebtoonInfos} = require("./utils/webtoon");
const {saveAsFiles} = require("./utils/saving/filesSaving");
require("dotenv").config();

// Init database
require("./lib");
require("../common/database/sequelize");
const {saveInDatabase, stopDownload} = require("./utils/saving/databaseSaving");
const {findWebtoonInCache, startDownload} = require("./lib");

async function debug(){
    // const webtoons = await getWebtoons("fr");
    // // const target = findWebtoon(webtoons, "My giant nerd boyfriend");
    // const target = findWebtoon(webtoons, "Tower of god");
    // if(target.error)
    //     return console.log(target.error);
    // const completeTarget = await getWebtoonInfos(target);
    // console.log(completeTarget);
    // // await saveInDatabase(target);
    const target = findWebtoonInCache("The Gamer", "fr");
    console.log(target);
    await saveInDatabase(target);
}

// Tests
debug();
