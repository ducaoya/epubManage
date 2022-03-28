const uuid = require("uuid");
const db = require("../db");
const s3 = require("../db/aws");
const { dbCatchError } = require("../lib/check");
const moment = require("moment");

// 获取书籍
async function getbooks(email, page, pageSize, ctx) {
    try {
        const sql = ` from ebook where from_user = '${email}' and is_active = 1 `;
        const results1 = await db.query("select count(*) " + sql);
        const results2 = await db.query(
            "select * " + sql + `limit ${(page - 1) * pageSize},${pageSize}`
        );

        return {
            total: results1.results[0]["count(*)"],
            data: results2.results,
        };
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 搜索书籍
async function search(keyword, page, pageSize, email, ctx) {
    try {
        const sql = `from ebook where from_user = '${email}' and is_active = 1 and (author like '%${keyword}%' or title like '%${keyword}%')`;
        const results1 = await db.query("select count(*) " + sql);
        const results2 = await db.query(
            "select * " + sql + `limit ${(page - 1) * pageSize},${pageSize}`
        );

        return {
            total: results1.results[0]["count(*)"],
            data: results2.results,
        };
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 上传书籍
async function upload(
    title,
    author,
    publisher,
    description,
    email,
    published_date,
    ctx
) {
    try {
        const id = uuid.v4();
        const date = moment(Date.now()).format("yy-MM-DD hh:mm:ss");
        const sql = `insert into ebook (id,title,author,publisher,description,from_user,uploaded_date,published_date) value('${id}','${title}','${author}','${publisher}','${description}','${email}','${date}','${published_date}')`;
        await db.query(sql);
        const epubUrl = await s3.putUrl(id + ".epub");
        const imgUrl = await s3.putUrl(id + ".jpg");
        return {
            id,
            epubUrl,
            imgUrl,
        };
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 删除书籍
async function del(id, ctx) {
    try {
        const sql = `delete from ebook where id = '${id}'`;
        await db.query(sql);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

// 确认上传
async function verifyUpload(id, ctx) {
    try {
        const sql = `update ebook set is_active = 1 where id = '${id}'`;
        await db.query(sql);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

async function download(id) {
    const epubUrl = await s3.downloadUrl(id + ".epub");
    const imgUrl = await s3.downloadUrl(id + ".jpg");
    return {
        epubUrl,
        imgUrl,
    };
}

async function edit(
    id,
    title,
    author,
    publisher,
    description,
    published_date,
    ctx
) {
    try {
        const sql1 = `select * from ebook where id = '${id}'`;
        const results1 = await db.query(sql1);

        const sql2 = `update ebook 
                    set title = '${title || results1.results[0].title}' ,
                    author = '${author || results1.results[0].author}',
                    publisher='${publisher || results1.results[0].publisher}', 
                    description='${
                      description || results1.results[0].description
                    }' ,
                    published_date='${
                      published_date || results1.results[0].published_date
                    }'
                    where id = '${id}'`;
        return await db.query(sql2);
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

async function get(id, ctx) {
    try {
        const sql = `select * from ebook where id = '${id}' and is_active = 1 `;
        const results = await db.query(sql);

        return results.results;
    } catch (error) {
        dbCatchError(error, ctx);
    }
}

module.exports = {
    getbooks,
    search,
    upload,
    del,
    verifyUpload,
    download,
    edit,
    get,
};