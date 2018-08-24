
const crypto = require('crypto');
const Sequelize = require('sequelize');

function init (db) {
    const User = db.define('user', {
        displayName: Sequelize.STRING,
        email: Sequelize.STRING,
        passwordHash: Sequelize.STRING,
        salt: Sequelize.STRING,

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

    User.prototype.checkPassword = function checkPassword (password) {
        if (!password) return false;
        if (!this.passwordHash) return false;
        return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
    };

    User.prototype.setPassword = function setPassword (password) {
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    };

    exports.User = User;
    db.User = User;
}

exports.init = init;
