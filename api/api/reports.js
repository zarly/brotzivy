
const {URL} = require('url');
const {Report} = require('../models/report');

module.exports = async function reports (ctx, next) {
    const query = ctx.request.query;
    console.log('query =', query);

    const reports = await Report.findAndCountAll({
        limit: 20,
    });
    ctx.body = reports;
};
