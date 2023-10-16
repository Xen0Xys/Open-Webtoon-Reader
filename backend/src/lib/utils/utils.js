const sharp = require("sharp");
const axiosInstance = require("./axiosInstance");

async function getImage(imageLink, format = "webp", referer = "https://www.webtoons.com/fr/"){
    switch (format.toLowerCase()){
    case "webp":
        return await getBufferedImage(imageLink, referer);
    case "dataurl":
        return getDataUrl(await getBufferedImage(imageLink, referer));
    default:
        throw new Error("Invalid format");
    }
}

function getDataUrl(bufferedImage){
    return `data:image/webp;base64,${bufferedImage.toString("base64")}`;
}

async function getBufferedImage(imageLink, referer = "https://www.webtoons.com/fr/"){
    const response = await axiosInstance.get(imageLink, {
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
    random,
    getDataUrl
};
