const Router = require("koa-router");
const { delS3 } = require("../db/aws");
const book = new Router();
const { catchError, generateOk } = require("../lib/check");
const {
    getbooks,
    search,
    del,
    verifyUpload,
    upload,
    download,
    edit,
} = require("../server/book");
const { verify } = require("../server/token");

// 获取书籍列表
book.post("/getbooks", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        const tokenItem = verify(token, ctx);
        const { email } = tokenItem;

        const { page, pageSize } = ctx.request.body;
        ctx.body = generateOk(await getbooks(email, page, pageSize, ctx));
    } catch (error) {
        catchError(error, ctx);
    }
});

// 搜索书籍
book.post("/search", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        const tokenItem = verify(token, ctx);
        const { email } = tokenItem;

        const { keyword, page, pageSize } = ctx.request.body;
        ctx.body = generateOk(await search(keyword, page, pageSize, email, ctx));
    } catch (error) {
        catchError(error, ctx);
    }
});

// 上传书籍
book.post("/upload", async(ctx) => {
    try {
        const { title, author, publisher } = ctx.request.body;
        const token = ctx.cookies.get("token");
        const tokenItem = verify(token, ctx);
        const { email } = tokenItem;
        const url = await upload(title, author, publisher, email, ctx);
        ctx.body = generateOk(url);
    } catch (error) {
        catchError(error, ctx);
    }
});

// 确认上传成功
book.post("/verify", async(ctx) => {
    try {
        const { id } = ctx.request.body;
        verifyUpload(id, ctx);
        ctx.body = generateOk("上传成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

// 下载书籍
book.post("/download", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        verify(token, ctx);
        const { id } = ctx.request.body;
        const url = await download(id);

        ctx.body = generateOk(url);
    } catch (error) {
        catchError(error, ctx);
    }
});

// 修改书籍信息
book.post("/edit", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        verify(token, ctx);
        const { id, title, author, publisher } = ctx.request.body;
        edit(id, title, author, publisher);
        ctx.body = "修改成功";
    } catch (error) {
        catchError(error, ctx);
    }
});

// 删除书籍
book.post("/delete", async(ctx) => {
    try {
        const { id } = ctx.request.body;
        const token = ctx.cookies.get("token");
        verify(token, ctx);
        del(id, ctx);
        delS3(id + ".epub");
        ctx.body = generateOk("删除成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

book.get("/test", async(ctx) => {
    const date = new Date();
    console.log("test log : ".date);
    ctx.body = "test api";
});

module.exports = book;