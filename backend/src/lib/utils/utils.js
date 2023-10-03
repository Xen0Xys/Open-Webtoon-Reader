const axios = require("axios");
const sharp = require("sharp");

async function getImage(imageLink, format = "webp"){
    switch (format.toLowerCase()){
    case "webp":
        return await getBufferedImage(imageLink);
    case "dataurl":
        return `data:image/webp;base64,${(await getBufferedImage(imageLink)).toString("base64")}`;
    default:
        throw new Error("Invalid format");
    }
}

async function getBufferedImage(imageLink){
    const response = await axios.get(imageLink, {
        responseType: "arraybuffer",
        headers: {
            "Referer": "https://www.webtoons.com/fr/"
        }
    });
    return await sharp(Buffer.from(response.data, "binary")).toFormat("webp").toBuffer()
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
}
