const axios = require("axios");
const {JSDOM} = require("jsdom");

const genres = [
    "drama",
    "fantasy",
    "comedy",
    "action",
    "slice_of_life",
    "romance",
    "super_hero",
    "thriller",
    "sports",
    "sf",
    "horror",
    "tiptoon",
    "local"
];

function parseWebtoonStars(stars){
    let copy = stars;
    let multiplier = 1;
    if(copy.endsWith("M")){
        multiplier = 1000000;
        copy = copy.replace("M", "");
    }
    copy = copy.replace(" ", "");
    const number = parseFloat(copy) * multiplier;
    return {
        raw: stars,
        number
    };
}

async function getWebtoons(language="en") {
    const url = `https://www.webtoons.com/${language}/genres/`;
    const webtoons = [];
    for(const genre of genres){
        const response = await axios.get(url + genre);
        const htmlContent = response.data;
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        // For all ul with class=card_lst
        const uls = document.querySelectorAll("ul.card_lst");
        for (let i = 0; i < uls.length; i++) {
            const ul = uls[i];
            const lis = ul.querySelectorAll("li");
            for (let j = 0; j < lis.length; j++) {
                const li = lis[j];
                const genre = ul.previousElementSibling.textContent.trim();
                const a = li.querySelector("a");
                const title = a.querySelector("p.subj").textContent;
                const author = a.querySelector("p.author").textContent;
                const stars = a.querySelector("p.grade_area").querySelector("em").textContent;
                const link = a.href;
                const id = link.split("?title_no=")[1];
                const thumbnail = a.querySelector("img").src;
                const webtoon = {
                    title,
                    author,
                    link,
                    thumbnail,
                    stars: parseWebtoonStars(stars),
                    genre,
                    id
                };
                webtoons.push(webtoon);
            }
        }
    }
    return webtoons;
}

async function parseMobileWebtoonBanner(mobileWebtoonDom){
    const bannerNode = mobileWebtoonDom.querySelector("#header");
    const style = bannerNode.getAttribute("style");
    return style.split("url(")[1].split(")")[0];
}

async function parseWebtoonBanner(webtoonDom, mobileWebtoonDom){
    const bannerNode = webtoonDom.querySelector("div.detail_bg");
    const style = bannerNode.getAttribute("style");
    const backgroundBanner = style.split("url(")[1].split(")")[0];
    const thmbNode = webtoonDom.querySelector("span.thmb");
    const topBanner = thmbNode.querySelector("img").src;
    return {
        backgroundBanner,
        topBanner,
        mobileBanner: await parseMobileWebtoonBanner(mobileWebtoonDom)
    };
}

async function getWebtoonInfos(webtoon){
    const url = webtoon.link;
    const mobileUrl = url.replace("www.webtoons", "m.webtoons") + "&webtoon-platform-redirect=true";
    const response = await axios.get(url);
    const htmlContent = response.data;
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const mobileResponse = await axios.get(mobileUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        }
    });
    const mobileHtmlContent = mobileResponse.data;
    const mobileDom = new JSDOM(mobileHtmlContent);
    const mobileDocument = mobileDom.window.document;
    const epList = document.querySelector("ul#_listUl");
    const episode = epList.querySelector("li");
    const a = episode.querySelector("a");
    const epNumber = parseInt(a.querySelector("span.tx").textContent.replace("#", ""));
    return {
        ...webtoon,
        epNumber,
        banner: await parseWebtoonBanner(document, mobileDocument)
    };
}

/**
 * This function try to find a webtoon in a list of webtoons (not exactly the same name)
 * @param webtoons
 * @param name
 */
function findWebtoon(webtoons, name){
    return webtoons.find(webtoon => {
        return webtoon.title.toLowerCase().includes(name.toLowerCase());
    });
}

module.exports = {
    getWebtoons,
    getWebtoonInfos,
    findWebtoon
};
