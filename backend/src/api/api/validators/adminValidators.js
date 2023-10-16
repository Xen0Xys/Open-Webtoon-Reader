const joi = require("joi");

const createAccountValidator = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    avatar: joi.string().required()
});

const updatePasswordValidator = joi.object({
    password: joi.string().required()
});

const startDownloadValidator = joi.object({
    webtoonTitle: joi.string().required(),
    language: joi.string().required().max(10),
    startEpisode: joi.number().min(1).default(1)
});

module.exports = {
    createAccountValidator,
    updatePasswordValidator,
    startDownloadValidator
};
