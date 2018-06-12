
const {URL} = require('url');
const {Report} = require('../models/report');

module.exports = async function write (ctx, next) {
    const body = ctx.request.body;

    const url = new URL(body.url);
    const report = await Report.create({
        host: url.host,
        page: url.pathname,
        query: url.query,
        hash: url.hash,

        message: body.message,
        mark: body.mark,
    });

    ctx.body = report;
};
