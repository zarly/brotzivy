
const {URL} = require('url');
const {Report} = require('../models/report');

async function ping (ctx, next) {
    ctx.body = {pong: true};
};

module.exports = {
    ping,
};
