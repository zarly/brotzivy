
const {URL} = require('url');
const {Report} = require('../models/report');

module.exports = async function reports (ctx, next) {
    const query = ctx.request.query;

    const host = await Report.count({
        where: {
            host: query.host
        },
    });
    const page = await Report.count({
        where: {
            host: query.host,
            page: query.page
        },
    });
    ctx.body = {
        host,
        page,
    };
};
