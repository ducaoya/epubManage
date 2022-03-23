const db = require("../db");
const moment = require("moment");
const { dbCatchError } = require("../lib/check");

async function getUser(email, ctx) {
    try {
        let sql = `select * from wss_user where email = '${email}'`;
        return await db.query(sql);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

async function addUser(email, nickname, password, ctx) {
    try {
        const date = moment(Date.now()).format("yy-MM-DD hh:mm:ss");
        let sql = `insert into wss_user (email,nickname,password,joined_date) 
                    value('${email}','${nickname}','${password}','${date}')`;
        return await db.query(sql);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

module.exports = {
    getUser,
    addUser,
};