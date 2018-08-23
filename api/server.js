
const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const apiRouter = require('./api');

const app = new Koa();

app.on('error', err => {
  console.error('server error', err)
});

app.use(cors({
    origin: ctx => ctx.get('origin'),
}));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(apiRouter.routes());

function start () {
  return new Promise((resolve, reject) => {
    const server = app.listen(config.port, function () {
      console.log(`app listening at port ${config.port}`);
      resolve(server);
    });
  });
}

module.exports = {app, start};
