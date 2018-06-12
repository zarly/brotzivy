
const db = require('./db');
const app = require('./server');
const apiRouter = require('./api');

async function init () {
    await db.sync();
    app.context.db = db;

    app.use(apiRouter.routes());

    app.listen(9000, function () {
        console.log('app listening at port 9000');
    });
}

init();
