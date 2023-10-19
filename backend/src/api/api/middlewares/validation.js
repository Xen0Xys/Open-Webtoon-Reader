function reqValidation(validator){
    return async (req, res, next) => {
        const {reqValues, error} = validator.validate(req.params);
        if(error){
            res.status(400).json({message: error.details[0].message});
            return;
        }
        req.reqValues = reqValues;
        next();
    };
}

function bodyValidation(validator){
    return async (req, res, next) => {
        const {bodyValues, error} = validator.validate(req.body);
        if(error){
            res.status(400).json({message: error.details[0].message});
            return;
        }
        req.bodyValues = bodyValues;
        next();
    };
}

module.exports = {
    reqValidation,
    bodyValidation
};
