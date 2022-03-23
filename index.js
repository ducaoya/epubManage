const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const api = require("./router");
const Router = require("koa-router");
const router = new Router();
const cors = require("koa2-cors");

app.use(
    cors({
        origin: "https://wss-ebook.doromolll.xyz", //只允许http://localhost:8080这个域名的请求
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
        allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
        exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
    })
);
app.use(bodyParser());
router.use("/api", api.routes(), api.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log("project is running at port 3000,http://127.0.0.1:3000");
});