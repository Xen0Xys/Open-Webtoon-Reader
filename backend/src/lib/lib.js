const fs = require("fs");
const Queue = require("./utils/models/queue");
const {getWebtoons, findWebtoon} = require("./utils/webtoon");
const saver = require("./utils/saving/databaseSaving");

const downloadQueue = new Queue();
let currentDownload = null;

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
let cacheLoading = false;
let cacheLoaded = false;
let downloadStarted = false;

async function loadWebtoonCache(){
    webtoons = {};
    cacheLoaded = false;
    cacheLoading = true;
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
    cacheLoading = false;
    console.log("Webtoon cache loaded");
}

/**
 * Save webtoon cache
 */
function saveWebtoonCache(){
    fs.mkdirSync("./.cache", {recursive: true});
    fs.writeFileSync("./.cache/webtoons.json", JSON.stringify(webtoons));
}

/**
 * Update webtoon cache
 * @returns {Promise<void>}
 */
async function updateWebtoonCache(){
    fs.rmSync("./.cache/webtoons.json");
    await loadWebtoonCache();
}

/**
 * Check if webtoon cache is loaded
 * @returns {boolean} True if cache is loaded
 */
function isCacheLoaded(){
    return cacheLoaded;
}

/**
 * Check if a download is started
 * @returns {boolean} True if a download is started
 */
function isDownloading(){
    return downloadStarted;
}

/**
 * Find a webtoon from cache
 * @param webtoonName Webtoon name
 * @param language Language
 * @returns {*|{error: string}|{error: string}}
 */
function findWebtoonInCache(webtoonName, language){
    return findWebtoon(webtoons[language], webtoonName);
}

function addDownloadToQueue(webtoon, startEpisode){
    downloadQueue.enqueue({webtoon, startEpisode});
    if(!downloadStarted)
        startDownload();
}

function getDownloadQueue(){
    return downloadQueue.getElements();
}

function startDownload(){
    downloadStarted = true;
    const {webtoon, startEpisode} = downloadQueue.dequeue();
    currentDownload = webtoon;
    saver.saveInDatabase(webtoon, startEpisode).then(() => {
        onDownloadEnd();
    }).catch((err) => {
        console.error(err);
        onDownloadEnd();
    });
}

function onDownloadEnd(){
    if(downloadQueue.isEmpty()){
        downloadStarted = false;
        currentDownload = null;
        console.log("Download queue is empty");
        return;
    }
    startDownload();
}

function clearDownloadQueue(){
    downloadQueue.clear();
    if(currentDownload)
        saver.stopDbDownload();
    downloadStarted = false;
    currentDownload = null;
}

function getCurrentDownload(){
    return currentDownload;
}

if(!cacheLoading && !cacheLoaded)
    loadWebtoonCache().then(() => {});

module.exports = {
    isCacheLoaded,
    isDownloading,
    findWebtoonInCache,
    updateWebtoonCache,
    addDownloadToQueue,
    getDownloadQueue,
    clearDownloadQueue,
    getCurrentDownload
};
