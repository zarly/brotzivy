
const path = require('path');
const config = require('config').db;
const Sequelize = require('sequelize');

const db = new Sequelize(config.database, config.username, config.password, config.config);

require('./models/user').init(db);
require('./models/report').init(db);

module.exports = db;
