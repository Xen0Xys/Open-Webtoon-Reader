/* eslint-disable no-undef */
const fs = require("fs");
const {getEpisodeLinks, getEpisodes} = require("../episodes");
const {getWebtoonInfos} = require("../webtoon");
const {getImage, sleep, random} = require("../utils");

async function saveAsFiles(webtoon, fromEp = 1, toEp = null){
    fromEp--;
    webtoon = await getWebtoonInfos(webtoon);
    let path = `${process.env.SAVE_PATH}/${webtoon.title}`;
    await initWebtoonDirectory(webtoon, path)
    const episodes = await getEpisodes(webtoon.link);
    if(!toEp) toEp = episodes.length - 1;
    for(let i = fromEp; i <= toEp; i++)
        try{
            await saveEpisode(webtoon, episodes, path, i)
        }catch(e){
            i--;
            console.log("Error, retrying in 10s");
            await sleep(10000);
        }
    console.log("Done");
}

async function initWebtoonDirectory(webtoon, path){
    fs.mkdirSync(`${path}`, {recursive: true});
    fs.writeFileSync(`${path}/thumbnail.webp`, await getImage(webtoon.thumbnail));
    fs.writeFileSync(`${path}/background_banner.webp`, await getImage(webtoon.banner.backgroundBanner));
    fs.writeFileSync(`${path}/top_banner.webp`, await getImage(webtoon.banner.topBanner));
    fs.writeFileSync(`${path}/mobile_banner.webp`, await getImage(webtoon.banner.mobileBanner));
}

async function saveEpisode(webtoon, episodes, path, epNumber){
    console.log(`Saving episode ${epNumber + 1}/${episodes.length}`);
    const episodePath = `${path}/${epNumber + 1}`;
    fs.mkdirSync(episodePath, {recursive: true});
    fs.writeFileSync(`${episodePath}/title.txt`, episodes[epNumber].title);
    const links = await getEpisodeLinks(webtoon.link, webtoon.id, epNumber + 1);
    if(isEpisodeSaved(episodePath, links.length)) {
        console.log(`Episode ${epNumber + 1} already saved`);
        await sleep(random(500, 1500));
        return;
    }
    fs.writeFileSync(`${episodePath}/thumbnail.webp`, await getImage(episodes[epNumber].thumbnail));
    for(let j = 0; j < links.length; j++)
        await saveEpisodePart(episodes, links, episodePath, epNumber, j)
    let waitingRandom = random(8000, 12000);
    console.log(`Episode ${epNumber + 1}/${episodes.length} saved, awaiting ${Math.round(waitingRandom/1000)}s for next...`);
    await sleep(waitingRandom);
}

async function saveEpisodePart(episodes, links, episodePath, epNumber, partNumber){
    const link = links[partNumber];
    const buffer = await getImage(link);
    fs.writeFileSync(`${episodePath}/${partNumber}.webp`, buffer);
    console.log(`Saved image ${partNumber + 1}/${links.length} for episode ${epNumber + 1}/${episodes.length}`);
    await sleep(random(0, 500));
}

function isEpisodeSaved(path, imgNumber){
    for(let i = 0; i < imgNumber; i++)
        if(!fs.existsSync(`${path}/${i}.webp`))
            return false;
    return true;
}

module.exports = {
    saveAsFiles
};
