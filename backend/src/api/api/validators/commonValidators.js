const joi = require("joi");

const listValidator = joi.object({
    limit: joi.number().integer().min(1).default(null),
    page: joi.number().integer().min(1).default(1),
    order: joi.string().default("id,ASC")
});

module.exports = {
    listValidator
};
