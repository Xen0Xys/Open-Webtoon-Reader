const loadFiles = require("./filesHandler");

let cachedModels = {};
let isLoading = false;

function getModel(sequelize, file) {
    if(isLoading === false)
        throw new Error("Models are not loading yet!");
    if(!cachedModels[file]){
        try{
            cachedModels[file] = require(`../database/models/v2/${file}`)(sequelize);
            console.log(`✅  Model ${file} registered!`);
        } catch (e){
            console.error(`❌  Error while registering model ${file}: ${e}`);
        }
    }
    return cachedModels[file];
}

function loadModels(sequelize) {
    console.log("------ Loading models ------");
    const files = loadFiles("./src/common/database/models/v2", true);
    isLoading = true;
    files.forEach(file => {
        getModel(sequelize, file);
    });
    cachedModels = {};
}

module.exports = {
    getModel,
    loadModels
};
