/* eslint-disable no-undef */
// Importing modules
const express = require("express");
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const app = express();

// Load webtoon cache
require("../lib/lib");

// Init database
require("../common/database/sequelize");

// Importing middlewares
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Init middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(morgan("dev"));

const router = express.Router();
require("../common/handlers/routesHandler")(router);
app.use("/api/v1", router);

// Default route
app.use(({res}) => res.status(404).json({message: "Route not found"}));

const log = (secure) => console.log(`Server started on ${secure ? "https" : "http"}://${process.env.BIND_ADDRESS}:${process.env.PORT}`);

// Start server
if(process.env.SSL.toLowerCase() === "false"){
    app.listen(parseInt(process.env.PORT), process.env.BIND_ADDRESS, () => {
        log(false);
    });
}else{
    const passphrase = process.env.SSL_PASSPHRASE;
    if(passphrase === ""){
        https.createServer({
            key: fs.readFileSync(process.env.SSL_KEY_FILE),
            cert: fs.readFileSync(process.env.SSL_CERT_FILE)
        }, app).listen(parseInt(process.env.PORT), () => {
            log(true);
        });
    }else{
        https.createServer({
            key: fs.readFileSync(process.env.SSL_KEY_FILE),
            cert: fs.readFileSync(process.env.SSL_CERT_FILE),
            passphrase: process.env.SSL_PASSPHRASE
        }, app).listen(parseInt(process.env.PORT), () => {
            log(true);
        });
    }
}

module.exports = app;
