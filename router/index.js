const Router = require("koa-router");
const api = new Router();
const user = require("./user");
const book = require("./book");

api.use("/user", user.routes(), user.allowedMethods());
api.use("/book", book.routes(), book.allowedMethods());

module.exports = api;