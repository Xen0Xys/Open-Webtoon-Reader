const joi = require("joi");

const loginUserValidator = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
});

const stateValidator = joi.object({
    state: joi.number().required().min(0).max(100)
});

module.exports = {
    loginUserValidator,
    stateValidator
};
