const {getWebtoons, findWebtoon} = require("./utils/webtoon");
const {saveInDatabase} = require("./utils/saving/databaseSaving");

let webtoons = {}
const languages = [
    "fr",
    "en",
    "es"
]
let cacheLoaded = false;
let downloadStarted = false;

async function loadWebtoonCache(){
    webtoons = {};
    cacheLoaded = false;
    console.log("Loading webtoon cache");
    for(const language of languages){
        webtoons[language] = await getWebtoons(language);
        console.log("Webtoons loaded for language " + language);
    }
    cacheLoaded = true;
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

loadWebtoonCache().then(() => {
    console.log("Webtoon cache loaded");
});

module.exports = {
    isCacheLoaded,
    isDownloading,
    findWebtoonInCache,
    startDownload
}
