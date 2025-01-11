const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const serve = require('koa-static');
const path = require('path');
const router = require('koa-router')();
const setupRouter = require('./router');

module.exports = (server, options) => {
  const app = new Koa();
  app.proxy = true;
  app.silent = true;

  app.use(async (ctx, next) => {
    ctx.storage = options.storage;
    // ctx.getLogs = logger.getLogs;
    // ctx.scripts = scripts;
    // ctx.dataSource = dataSource;
    await next();
  });
  
  onerror(app);
  setupRouter(router);
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(serve(path.join(__dirname, '../../public')));
  server.on('request', app.callback());
};
