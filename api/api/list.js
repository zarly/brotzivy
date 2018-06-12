
const {URL} = require('url');
const {Report} = require('../models/report');

module.exports = async function reports (ctx, next) {
    const query = ctx.request.query;

    const reports = await Report.findAndCountAll({
        where: {
            host: query.host
        },
        limit: 20,
    });
    ctx.body = reports;
};
