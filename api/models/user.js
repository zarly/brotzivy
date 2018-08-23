
const Sequelize = require('sequelize');

function init (db) {
    exports.Report = db.define('user', {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        passwordHash: Sequelize.STRING,

        vk: Sequelize.STRING,
        fb: Sequelize.STRING,
        phone: Sequelize.STRING,

        status: Sequelize.INTEGER,
    }, {
        indexes: [
            {
                fields: ['email']
            }
        ]
    });
}

exports.init = init;
