
const config = require('config');
const koaBody  = require('koa-body');
const Router = require('koa-router');
const passport = require('koa-passport');
const router = new Router();

const API_PATH = `/v${config.apiVersion}`;

const report = require('./report');
const user = require('./user');
const service = require('./service');

router
    .get(`${API_PATH}/reports/brief`, report.brief)
    .get(`${API_PATH}/reports/list`, report.list)
    .post(`${API_PATH}/reports/write`, koaBody(), report.write)
    .post(`${API_PATH}/user/signup`, koaBody(), user.signup)
    .get(`${API_PATH}/user/signin`, passport.authenticate('local'), user.signin)
    .get(`${API_PATH}/user/signout`, user.signout)
    .get(`${API_PATH}/user/me`, passport.authorize('local'), user.me)
    .get(`${API_PATH}/ping`, service.ping);

module.exports = router;
