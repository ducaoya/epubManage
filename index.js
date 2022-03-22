const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const api = require("./router");
const Router = require("koa-router");
const router = new Router();

app.use(bodyParser());
router.use("/api", api.routes(), api.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log("project is running at port 3000,http://127.0.0.1:3000");
});