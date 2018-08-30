
const {URL} = require('url');
const {User} = require('../models/user');

async function checkInviteCode (code) {
    if (code === '231') {
        return {valid: true, inviter: -1};
    } else {
        console.log('error: invalid invite code', code);
        return {valid: false};
    }
}

async function signup (ctx, next) {
    try {
        const data = ctx.request.body;
        const inviteData = await checkInviteCode(data.inviteCode);
        if (!inviteData.valid) throw {message: 'Неверный инвайт-код'};

        const user = await User.create({
            displayName: data.displayName
        });
        const token = '231-' + Math.random().toFixed(10).substr(2);
        ctx.body = {user, token};
    }
    catch (error) {
        ctx.status = 400;
        ctx.body = {
            error: {
                code: error.code,
                message: error.message,
            }
        };
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
