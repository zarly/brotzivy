
const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const apiRouter = require('./api');
const passport = require('koa-passport'); //реализация passport для Koa
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

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

app.use(passport.initialize()); // TODO: https://habr.com/post/324066/
// https://mherman.org/blog/2018/01/02/user-authentication-with-passport-and-koa/

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }
      
      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
      }
      return done(null, user);
    });
  }
  )
);

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
