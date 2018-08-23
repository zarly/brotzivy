
const db = require('./db');
const app = require('./server');
const apiRouter = require('./api');
const config = require('config');

async function init () {
    await db.sync();
    app.context.db = db;

    app.use(apiRouter.routes());

    app.listen(config.port, function () {
        console.log(`app listening at port ${config.port}`);
    });
}

init();
