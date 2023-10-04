const axios = require("axios");
const sharp = require("sharp");
const {ref} = require("joi");

async function getImage(imageLink, format = "webp", referer = "https://www.webtoons.com/fr/"){
    switch (format.toLowerCase()){
    case "webp":
        return await getBufferedImage(imageLink, referer);
    case "dataurl":
        return `data:image/webp;base64,${(await getBufferedImage(imageLink, referer)).toString("base64")}`;
    default:
        throw new Error("Invalid format");
    }
}

async function getBufferedImage(imageLink, referer = "https://www.webtoons.com/fr/"){
    const response = await axios.get(imageLink, {
        responseType: "arraybuffer",
        headers: {
            "Referer": referer
        }
    });
    return await sharp(Buffer.from(response.data, "binary")).toFormat("webp").toBuffer();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    getImage,
    sleep,
    random
};
