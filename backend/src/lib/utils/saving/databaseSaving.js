/* eslint-disable no-undef */
const fs = require("fs");
const {getEpisodeLinks, getEpisodes} = require("../episodes");
const {getWebtoonInfos} = require("../webtoon");
const {getImage, sleep, random} = require("../utils");
const sequelize = require("../../../common/database/sequelize");

let downloadState = null;

function stopDbDownload(){
    downloadState = null;
}

function getDownloadState(){
    return downloadState;
}

async function saveInDatabase(webtoon, fromEp = 1, toEp = null){
    downloadState = `${fromEp}/${toEp}`;
    fromEp--;
    webtoon = await getWebtoonInfos(webtoon);
    let path = `${process.env.SAVE_PATH}/${webtoon.title}`;
    await initWebtoonDirectory(webtoon, path);
    const episodes = await getEpisodes(webtoon.link);
    if(!toEp) toEp = episodes.length - 1;
    for(let i = fromEp; i <= toEp && downloadState; i++){
        downloadState = `${i + 1}/${toEp + 1}`;
        try{
            await saveEpisode(webtoon, episodes, path, i);
        }catch(e){
            console.log(e);
            i--;
            console.log("Error, retrying in 10s");
            await sleep(10000);
        }
    }
    if(downloadState === null)
        console.log("Download stopped");
    else{
        downloadState = null;
        console.log("Done");
    }
}

async function initWebtoonDirectory(webtoon, path){
    const dbWebtoon = await sequelize.models.webtoons.findOne({where: {title: webtoon.title}});
    if(dbWebtoon){
        webtoon.dbId = dbWebtoon.id;
        return;
    }
    const title = webtoon.title;
    const author = webtoon.author;
    let genre = await sequelize.models.genres.findOne({where: {name: webtoon.genre}});
    if(!genre)
        genre = await sequelize.models.genres.create({name: webtoon.genre});
    const language = webtoon.language;
    const link = webtoon.link;
    const thumbnail = await getImage(webtoon.thumbnail, "dataurl");
    const backgroundBanner = await getImage(webtoon.banner.backgroundBanner, "dataurl");
    const topBanner = await getImage(webtoon.banner.topBanner, "dataurl");
    const mobileBanner = await getImage(webtoon.banner.mobileBanner, "dataurl");
    const webtoonModel = await sequelize.models.webtoons.create({
        title,
        author,
        genre_id: genre.id,
        language,
        link,
        thumbnail,
        background_banner: backgroundBanner,
        top_banner: topBanner,
        mobile_banner: mobileBanner
    });
    webtoon.dbId = webtoonModel.id;
}

async function saveEpisode(webtoon, episodes, path, epNumber){
    console.log(`Saving episode ${epNumber + 1}/${episodes.length}`);
    const title = episodes[epNumber].title;
    const links = await getEpisodeLinks(webtoon.link, webtoon.id, epNumber + 1);
    if(await isEpisodeSaved(webtoon.dbId, epNumber, links.length)) {
        console.log(`Episode ${epNumber + 1} already saved`);
        // await sleep(random(500, 1500));
        return;
    }
    let episodeModel = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoon.dbId, number: epNumber + 1}});
    if(!episodeModel){
        const thumbnail = await getImage(episodes[epNumber].thumbnail, "dataurl");
        episodeModel = await sequelize.models.episodes.create({
            webtoon_id: webtoon.dbId,
            title,
            number: epNumber + 1,
            image_number: links.length,
            thumbnail
        });
    }
    const lastImage = await sequelize.models.images.findOne({where: {episode_id: episodeModel.id}, order: [["number", "DESC"]]});
    for(let j = lastImage !== null ? lastImage.number : 0; j < links.length && downloadState; j++)
        await saveEpisodePart(episodes, links, episodeModel.id, j, epNumber);
    let waitingRandom = random(2000, 8000);
    console.log(`Episode ${epNumber + 1}/${episodes.length} saved, awaiting ${Math.round(waitingRandom / 1000)}s for next...`);
    await sleep(waitingRandom);
}

async function saveEpisodePart(episodes, links, episodeDbId, partNumber, epNumber){
    const link = links[partNumber];
    const image = await getImage(link, "dataurl", episodes[epNumber].link);
    await sequelize.models.images.create({
        episode_id: episodeDbId,
        number: partNumber + 1,
        image
    });
    console.log(`Saved image ${partNumber + 1}/${links.length} for episode ${epNumber + 1}/${episodes.length}`);
    await sleep(random(0, 250));
}

async function isEpisodeSaved(webtoonDbId, episodeNumber, imgNumber){
    const episode = await sequelize.models.episodes.findOne({where: {webtoon_id: webtoonDbId, number: episodeNumber + 1}});
    if(!episode)
        return false;
    const images = await sequelize.models.images.findAll({where: {episode_id: episode.id}});
    return images.length === imgNumber;
}

module.exports = {
    saveInDatabase,
    stopDbDownload,
    getDownloadState
};
