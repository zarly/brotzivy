
const {URL} = require('url');
const {User} = require('../models/user');

async function signup (ctx, next) {
    ctx.body = null;
};

async function signin (ctx, next) {
    ctx.body = null;
};

async function signout (ctx, next) {
    ctx.body = null;
};

async function me (ctx, next) {
    ctx.body = null;
};

module.exports = {
    signup,
    signin,
    signout,
    me,
};
