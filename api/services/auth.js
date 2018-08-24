
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const jwt = require('jsonwebtoken'); // аутентификация по JWT для http
const {User} = require('../models/user');

const jwtStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: "mysecretkey" // ключ для подписи JWT
}, function (payload, done) {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, function (email, password, done) {
    User.findOne({email}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
        }
        return done(null, user);
    });
});

module.exports = {
    jwtStrategy,
    localStrategy,
};
