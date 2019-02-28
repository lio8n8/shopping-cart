const mongodb = require('./mongodb');

module.exports.mongodb = {
    init: () => {
        mongodb.init();
    },
    getConnection: () => mongodb.getConnection()
};
