
const koaBody  = require('koa-body');
const Router = require('koa-router');
const router = new Router();

router
    .get('/reports', require('./reports'))
    .post('/write', koaBody(), require('./write'));

module.exports = router;
