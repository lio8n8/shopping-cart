const mongoose = require('mongoose');
const logger = require('../services/logger');
const configs = require('../configs');

module.exports = {
    init: () => {
        mongoose.connect(configs.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

        mongoose.connection.on('connected', () => {
            logger.getLogger('debug').info(`MongoDB is connected to ${mongoose.connection.db.databaseName}`);
        });

        mongoose.connection.on('error', err => {
            logger.getLogger('error').error(err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.getLogger('debug').info(`MongoDB is disconnected from ${mongoose.connection.db.databaseName}`);
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(function () {
                logger.getLogger('error').error('MongoDB is disconnected through app termination');
                process.exit(0);
            });
        });
    },
    getConnection() {
        return mongoose.connection;
    }
}
