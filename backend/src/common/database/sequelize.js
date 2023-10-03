/* eslint-disable no-undef */
const {Sequelize} = require("sequelize");

let sequelize;
if(process.env.DB_TYPE.toLowerCase() === "sqlite")
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "database.db",
        logging: process.env.DB_LOGGING.toLowerCase() === "true"
    });
else
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,
        logging: process.env.DB_LOGGING.toLowerCase() === "true"
    });

// Loading models
require("../handlers/modelsHandler").loadModels(sequelize);

sequelize.sync().then(async () => {
    console.log("Database synchronized");
});

module.exports = sequelize;
