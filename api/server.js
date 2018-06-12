
const Koa = require('koa');
const cors = require('@koa/cors');

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

module.exports = app;
