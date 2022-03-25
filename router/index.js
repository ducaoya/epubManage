const Router = require("koa-router");
const api = new Router();
const user = require("./user");
const book = require("./book");
const history = require("./history");

api.use("/user", user.routes(), user.allowedMethods());
api.use("/book", book.routes(), book.allowedMethods());
api.use("/history", history.routes(), history.allowedMethods());

module.exports = api;