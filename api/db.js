
const path = require('path');
const config = require('config').db;
const Sequelize = require('sequelize');

const db = new Sequelize(config.database, config.username, process.env.PG_PASSWORD, config.config);

require('./models/user').init(db);
require('./models/report').init(db);

module.exports = db;
