const loadFiles = require("./filesHandler");

module.exports = (router) => {
    console.log("------ Loading routes ------");
    const files = loadFiles("./src/api/api/routes", true);
    files.forEach(file => {
        try{
            require(`../../../src/api/api/routes/${file}`)(router);
            console.log(`✅  Route ${file} registered!`);
        } catch (e){
            console.error(`❌  Error while registering route ${file}: ${e}`);
        }
    });
};
