const axios = require("axios");

const axiosInstance = axios.create({
    maxSockets: 5,
    maxFreeSockets: 5,
});

axiosInstance.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1";

module.exports = axiosInstance;
