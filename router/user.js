const Router = require("koa-router");
const user = new Router();
const { getUser, addUser } = require("../server/user");
const { check, catchError, generateOk } = require("../lib/check");
const { creacteToken, setToken, remove, verify } = require("../server/token");

// 注册
user.post("/signup", async(ctx) => {
    try {
        const { email, nickname, pwd } = ctx.request.body;
        check(!!email, "邮箱不能为空");
        check(!!pwd, "密码不能为空");
        const results = await getUser(email, ctx);
        check(!!results.results[0], "邮箱已存在");
        await addUser(email, nickname || "", pwd, ctx);
        ctx.body = generateOk("注册成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

// 登录
user.post("/login", async(ctx) => {
    try {
        const { email, pwd } = ctx.request.body;
        check(!!email, "邮箱不能为空");
        check(!!pwd, "密码不能为空");
        const results = await getUser(email, ctx);
        check(pwd === results.results[0].password, "密码错误");

        // 生成token
        const token = creacteToken(email, results.results[0].nickname);

        setToken(token, ctx);
        ctx.body = generateOk("登录成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

user.post("/getinfo", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        const { email } = verify(token, ctx);
        console.log("===========>");
        const results = await getUser(email, ctx);
        ctx.body = generateOk({...results.results[0] });
    } catch (error) {
        catchError(error, ctx);
    }
});

user.post("/logout", async(ctx) => {
    try {
        const token = ctx.cookies.get("token");
        verify(token, ctx);
        ctx.cookies.set("token");
        remove(ctx);
        ctx.body = generateOk("登出成功");
    } catch (error) {
        catchError(error, ctx);
    }
});

module.exports = user;