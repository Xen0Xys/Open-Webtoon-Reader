/* eslint-disable no-undef */
const {Sequelize} = require("sequelize");

let db1;
let db2;
db1 = new Sequelize({
    dialect: "sqlite",
    storage: "database_1.db",
    logging: false
});
db2 = new Sequelize({
    dialect: "sqlite",
    storage: "database_2.db",
    logging: false
});

require("../../common/handlers/modelsHandlerV1").loadModels(db1);
require("../../common/handlers/modelsHandlerV2").loadModels(db2);

console.log("Loading V1 database");
db1.sync().then(async () => {
    console.log("Loading V2 database");
    db2.sync().then(async () => {
        console.log("Databases loaded");
        migrateAll().then(() => {
            console.log("Migration done");
        });
    });
});

async function migrateAll(){
    await migrateGenres();
    await migrateWebtoons();
    await migrateWebtoonGenres();
    await migrateUsers();
    await migrateStates();
    await migrateFavorites();
    await migrateEpisodes();
    await migrateImages();
}

async function migrateGenres(){
    const genres = await db1.models.genres.findAll();
    const jsonGenres = genres.map(genre => {
        return {
            id: genre.id,
            name: genre.name
        };
    });
    await db2.models.genres.bulkCreate(jsonGenres);
}

async function migrateWebtoons(){
    const webtoons = await db1.models.webtoons.findAll();
    const jsonWebtoons = webtoons.map(webtoon => {
        return {
            id: webtoon.id,
            title: webtoon.title,
            author: webtoon.author,
            language: webtoon.language,
            link: webtoon.link,
            thumbnail: migrateImage(webtoon.thumbnail),
            background_banner: migrateImage(webtoon.background_banner),
            top_banner: migrateImage(webtoon.top_banner),
            mobile_banner: migrateImage(webtoon.mobile_banner)
        };
    });
    await db2.models.webtoons.bulkCreate(jsonWebtoons);
}

async function migrateWebtoonGenres(){
    const webtoonGenres = await db1.models.webtoon_genres.findAll();
    const jsonWebtoonGenres = webtoonGenres.map(webtoonGenre => {
        return {
            id: webtoonGenre.id,
            webtoon_id: webtoonGenre.webtoon_id,
            genre_id: webtoonGenre.genre_id
        };
    });
    await db2.models.webtoon_genres.bulkCreate(jsonWebtoonGenres);
}

async function migrateUsers(){
    const users = await db1.models.users.findAll();
    const jsonUsers = users.map(user => {
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            avatar: migrateImage(user.avatar)
        };
    });
    await db2.models.users.bulkCreate(jsonUsers);
}

async function migrateStates(){
    const states = await db1.models.states.findAll();
    const jsonStates = states.map(state => {
        return {
            id: state.id,
            user_id: state.user_id,
            episode_id: state.episode_id,
            state: state.state
        };
    });
    await db2.models.states.bulkCreate(jsonStates);
}

async function migrateFavorites(){
    const favorites = await db1.models.favorites.findAll();
    const jsonFavorites = favorites.map(favorite => {
        return {
            id: favorite.id,
            user_id: favorite.user_id,
            webtoon_id: favorite.webtoon_id
        };
    });
    await db2.models.favorites.bulkCreate(jsonFavorites);
}

async function migrateEpisodes(){
    const episodes = await db1.models.episodes.findAll();
    const jsonEpisodes = episodes.map(episode => {
        return {
            id: episode.id,
            webtoon_id: episode.webtoon_id,
            title: episode.title,
            image_number: episode.image_number,
            number: episode.number,
            thumbnail: migrateImage(episode.thumbnail)
        };
    });
    await db2.models.episodes.bulkCreate(jsonEpisodes);
}

async function migrateImages() {
    const batchSize = 1000;
    let offset = 0;
    let totalCount = await db1.models.images.count();
    const promises = [];
    const maxBatchCount = 10;
    let currentBatchCount = 0;
    while (offset < totalCount) {
        promises.push(migrateImageBatch(batchSize, offset));
        currentBatchCount++;
        offset += batchSize;
        if (currentBatchCount >= maxBatchCount) {
            await Promise.all(promises);
            promises.length = 0;
            currentBatchCount = 0;
        }
    }
    await Promise.all(promises);
}

async function migrateImageBatch(batchSize, offset) {
    const images = await db1.models.images.findAll({
        limit: batchSize,
        offset: offset,
    });
    const jsonImages = images.map((image) => {
        return {
            id: image.id,
            episode_id: image.episode_id,
            number: image.number,
            image: migrateImage(image.image),
        };
    });
    await db2.models.images.bulkCreate(jsonImages);
}

function migrateImage(dataUrl) {
    const parts = dataUrl.split(";base64,");
    if (parts.length !== 2)
        throw new Error("Bad URL format");
    const data = parts[1];
    return Buffer.from(data, "base64");
}
