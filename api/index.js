
const db = require('./db');
const {app, start} = require('./server');

async function init () {
    await db.sync();
    app.context.db = db;
    const server = await start();
    return {
        db,
        server
    };
}

if (require.main === module) {
    init();
} else {
    module.exports = {init};
}
