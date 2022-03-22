const jwt = require("jsonwebtoken");
const { check } = require("../lib/check");
const secret = "wss_book";

function creacteToken(email, nickname) {
    let payload = {
        email: email,
        nickname: nickname,
        time: new Date().getTime(),
        timeout: 1000 * 60 * 60 * 24 * 7,
    };
    return jwt.sign(payload, secret);
}

function setToken(token, ctx) {
    ctx.cookies.set("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookie有效时长
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // cookie失效时间
        httpOnly: true, // 是否只用于http请求中获取
        overwrite: false, // 是否允许重写
    });
}

function remove(ctx) {
    ctx.cookies.set("token", "", { maxAge: 0 });
}

function verify(token, ctx) {
    try {
        check(!!token);
        const tokenItem = jwt.verify(token, secret);
        const { time, timeout } = tokenItem;
        const nowTime = Date.now();
        check(time + timeout >= nowTime);
        return tokenItem;
    } catch (error) {
        ctx.status = 403;
        ctx.body = {...error };
        console.trace(err);
    }
}

module.exports = {
    creacteToken,
    verify,
    setToken,
    remove,
};