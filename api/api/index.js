
const koaBody  = require('koa-body');
const Router = require('koa-router');
const router = new Router();

const API_VERSION = 1;
const API_PATH = `/v${API_VERSION}`;

const report = require('./report');
const user = require('./user');
const service = require('./service');

router
    .get(`${API_PATH}/reports/brief`, report.brief)
    .get(`${API_PATH}/reports/list`, report.list)
    .post(`${API_PATH}/reports/write`, koaBody(), report.write)
    .post(`${API_PATH}/user/signup`, koaBody(), user.signup)
    .get(`${API_PATH}/user/signin`, user.signin)
    .get(`${API_PATH}/user/signout`, user.signout)
    .get(`${API_PATH}/user/me`, user.me)
    .get(`${API_PATH}/ping`, service.ping);

module.exports = router;
