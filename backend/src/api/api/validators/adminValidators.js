const joi = require('joi');

const createAccountValidator = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    avatar: joi.string().required()
});

const updatePasswordValidator = joi.object({
    password: joi.string().required()
});

const startDownloadValidator = joi.object({
    webtoonName: joi.string().required(),
    language: joi.string().required().max(10),
    startEpisode: joi.number().required().min(1)
});

module.exports = {
    createAccountValidator,
    updatePasswordValidator,
    startDownloadValidator
}
