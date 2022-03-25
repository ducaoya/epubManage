const { createMongo } = require("../db/mongodb");
const moment = require("moment");
const { dbCatchError } = require("../lib/check");
const { ObjectID } = require("bson");

// 获取历史记录
async function get(email, ctx) {
    try {
        const history = (await createMongo()).collection("history");
        const results = await history.find({ email });
        const historys = [];
        await results.forEach((item) => {
            historys.push(item);
        });
        return historys;
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 添加历史记录
async function add(email, bookId, bookName, ctx) {
    try {
        const history = (await createMongo()).collection("history");
        // email,bookId,bookName.date,
        await history.findOneAndDelete({ bookId });
        const date = moment(Date.now()).format("yy-MM-DD hh:mm:ss");
        const results = await history.insertOne({
            email,
            bookId,
            bookName,
            date,
        });
        console.log("add result :", results);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 删除历史记录
async function del(id, ctx) {
    try {
        const history = (await createMongo()).collection("history");
        const results = await history.findOneAndDelete({ _id: ObjectID(id) });
        console.log("delete result :", results);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

module.exports = {
    get,
    add,
    del,
};