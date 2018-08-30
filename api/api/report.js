
const {URL} = require('url');
const {Report} = require('../models/report');

async function list (ctx, next) {
    const query = ctx.request.query;

    const reports = await Report.findAndCountAll({
        where: {
            host: query.host,
            page: query.page
        },
        limit: 50,
    });
    ctx.body = reports;
};

async function write (ctx, next) {
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

async function brief (ctx, next) {
    const query = ctx.request.query;

    // const host = await Report.count({
    //     where: {
    //         host: query.host
    //     },
    // });
    const page = await Report.count({
        where: {
            host: query.host,
            page: query.page
        },
    });
    ctx.body = {
        // host,
        page,
    };
};

module.exports = {
    list,
    write,
    brief,
};
