const fs = require("fs");
const {getWebtoons, findWebtoon} = require("./utils/webtoon");
const {saveInDatabase} = require("./utils/saving/databaseSaving");

let webtoons = {};
const languages = [
    "fr",
    "en",
    "es",
    "zh-hant",
    "th",
    "de",
    "id"
];
let cacheLoaded = false;
let downloadStarted = false;

async function loadWebtoonCache(){
    webtoons = {};
    cacheLoaded = false;
    console.log("Loading webtoon cache");
    if(fs.existsSync("./.cache/webtoons.json")){
        webtoons = JSON.parse(fs.readFileSync("./.cache/webtoons.json"));
        cacheLoaded = true;
        console.log("Webtoon cache loaded from file");
        return;
    }
    for(const language of languages){
        webtoons[language] = await getWebtoons(language);
        console.log("Webtoons loaded for language " + language);
    }
    saveWebtoonCache();
    cacheLoaded = true;
    console.log("Webtoon cache loaded");
}

function saveWebtoonCache(){
    fs.mkdirSync("./.cache", {recursive: true});
    fs.writeFileSync("./.cache/webtoons.json", JSON.stringify(webtoons));
}

async function updateWebtoonCache(){
    fs.rmSync("./.cache/webtoons.json");
    await loadWebtoonCache();
}

function isCacheLoaded(){
    return cacheLoaded;
}

function isDownloading(){
    return downloadStarted;
}

function findWebtoonInCache(webtoonName, language){
    return findWebtoon(webtoons[language], webtoonName);
}

function startDownload(webtoon, startEpisode){
    downloadStarted = true;
    saveInDatabase(webtoon, startEpisode).then(() => {
        downloadStarted = false;
    }).catch((err) => {
        console.error(err);
        downloadStarted = false;
    });
}

loadWebtoonCache().then(() => {});

module.exports = {
    isCacheLoaded,
    isDownloading,
    findWebtoonInCache,
    startDownload,
    updateWebtoonCache
};
