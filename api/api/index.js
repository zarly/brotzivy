
const koaBody  = require('koa-body');
const Router = require('koa-router');
const router = new Router();

const API_VERSION = 1;

router
    .get(`/v${API_VERSION}/reports/brief`, require('./brief'))
    .get(`/v${API_VERSION}/reports/list`, require('./list'))
    .post(`/v${API_VERSION}/reports/write`, koaBody(), require('./write'));

module.exports = router;
