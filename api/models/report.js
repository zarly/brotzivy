
const Sequelize = require('sequelize');

function init (db) {
    exports.Report = db.define('report', {
        host: Sequelize.STRING,
        page: Sequelize.STRING,
        query: Sequelize.STRING,
        hash: Sequelize.STRING,
        
        autor: Sequelize.STRING,
        message: Sequelize.TEXT,
        mark: Sequelize.INTEGER,
    }, {
        indexes: [
            {
                fields: ['host']
            }
        ]
    });
}

exports.init = init;
