
const path = require('path');
const config = require('config').db;
const Sequelize = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, `../../${config.name}.sqlite`),
});

require('./models/user').init(db);
require('./models/report').init(db);

module.exports = db;
