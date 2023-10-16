const {DataTypes} = require("sequelize");
const {getModel} = require("../../../handlers/modelsHandlerV1");

module.exports = (sequelize) => {
    const States = sequelize.define("states", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        episode_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100
            }

        }
    },
    {
        underscored: true,
        createdAt: false,
        updatedAt: false
    });
    const Users = getModel(sequelize, "users.js");
    const Episodes = getModel(sequelize, "episodes.js");
    States.belongsTo(Users, {foreignKey: "user_id"});
    States.belongsTo(Episodes, {foreignKey: "episode_id"});
    return States;
};
