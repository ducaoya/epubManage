const Router = require("koa-router");
const history = new Router();
const { catchError, generateOk } = require("../lib/check");
const { add, del, get } = require("../server/history");
const { verify } = require("../server/token");

// 添加历史记录
history.post("/add", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        const { email } = verify(token, ctx);
        const { bookId, bookName } = ctx.request.body;
        await add(email, bookId, bookName, ctx);
        ctx.body = generateOk("添加成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

// 删除历史记录
history.post("/del", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        verify(token, ctx);
        const { id } = ctx.request.body;
        await del(id, ctx);
        ctx.body = generateOk("删除成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

// 获取历史记录
history.post("/get", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        const { email } = verify(token, ctx);
        const results = await get(email, ctx);
        ctx.body = generateOk(results);
    } catch (error) {
        catchError(error, ctx);
    }
});

module.exports = history;