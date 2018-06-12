
const path = require('path');
const Sequelize = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
});

require('./models/report').init(db);

module.exports = db;
