
const {URL} = require('url');
const {User} = require('../models/user');

async function signup (ctx, next) {
    try {
        ctx.body = await User.create(ctx.request.body);
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err;
    }
};

async function signin (ctx, next) {
    await passport.authenticate('local', function (err, user) {
        if (user == false) {
            ctx.body = "Login failed";
        } else {
            //--payload - информация которую мы храним в токене и можем из него получать
            const payload = {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
            };
            const token = jwt.sign(payload, jwtsecret); //здесь создается JWT

            ctx.body = {user: user.displayName, token: 'JWT ' + token};
        }
    })(ctx, next);
};

async function signout (ctx, next) {
    ctx.body = null;
};

async function me (ctx, next) {
    await passport.authenticate('jwt', function (err, user) {
        if (user) {
            ctx.body = "hello " + user.displayName;
        } else {
            ctx.body = "No such user";
            console.log("err", err);
        }
    })(ctx, next);
};

module.exports = {
    signup,
    signin,
    signout,
    me,
};
