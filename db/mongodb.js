const mongodb = require("mongodb");

const url =
    "mongodb://wusansi:534534534111@wss-ebook-mongodb.doromolll.xyz:9023";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function createMongo() {
    try {
        const client = new mongodb.MongoClient(url, {...options });
        await client.connect();
        console.log("mongodb : 连接成功");
        return client.db("wss-ebook");
    } catch (error) {
        console.log("mongodb : 连接失败");
        console.error(error);
    }
}

module.exports = { createMongo };