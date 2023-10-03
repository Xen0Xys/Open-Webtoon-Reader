const axios = require("axios");
const {JSDOM} = require("jsdom");

async function getEpisodeLinks(webtoonLink, webtoonId, episodeNumber){
    const baseUrl = webtoonLink.replace(`/list?title_no=${webtoonId}`, "");
    const url = baseUrl + `/episode-${episodeNumber}/viewer?title_no=${webtoonId}&episode_no=${episodeNumber}`;
    const response = await axios.get(url);
    const htmlContent = response.data;
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const imagesNode = document.querySelector("div#_imageList");
    const images = imagesNode.querySelectorAll("img");
    const links = [];
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const link = image.getAttribute("data-url");
        links.push(link);
    }
    return links;
}

/**
 * Get an episode list with links, thumbnails and titles from a webtoon link
 * @param webtoonLink {string} Webtoon link
 * @returns {Promise<*[]>} List of episodes
 */
async function getEpisodes(webtoonLink){
    const webtoonId = webtoonLink.split("?title_no=")[1];
    const baseUrl = webtoonLink.replace(`/list?title_no=${webtoonId}`, "");
    const url = baseUrl + `/episode-1/viewer?title_no=${webtoonId}&episode_no=1`;
    const response = await axios.get(url);
    const htmlContent = response.data;
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const epDiv = document.querySelector("div.episode_cont");
    const epList = epDiv.querySelector("ul").querySelectorAll("li");
    const episodes = [];
    for (let i = 0; i < epList.length; i++) {
        const a = epList[i].querySelector("a");
        const episodeLink = a.href;
        const episodeThumbnail = a.querySelector("span.thmb").querySelector("img").getAttribute("data-url");
        const episodeTitle = a.querySelector("span.subj").textContent;
        episodes.push({
            link: episodeLink,
            thumbnail: episodeThumbnail,
            title: episodeTitle
        });
    }
    return episodes;
}

module.exports = {
    getEpisodeLinks,
    getEpisodes
};
