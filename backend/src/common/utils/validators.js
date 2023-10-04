function validate(validator, _object, res){
    const {value, error} = validator.validate(_object);
    if(error){
        res.status(400).json({message: error.details[0].message});
        return null;
    }
    return value;
}

module.exports = {
    validate
};
