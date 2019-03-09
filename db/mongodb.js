const mongoose = require('mongoose');
const logger = require('../utils/logger');
const configs = require('../configs');

module.exports = {
    init: () => {
        mongoose.connect(configs.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

        mongoose.connection.on('connected', () => {
            logger.errorLogger.info(`MongoDB is connected to ${mongoose.connection.db.databaseName}`);
        });

        mongoose.connection.on('error', err => {
            logger.errorLogger.error(err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.errorLogger.info(`MongoDB is disconnected from ${mongoose.connection.db.databaseName}`);
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(function () {
                logger.errorLogger.error('MongoDB is disconnected through app termination');
                process.exit(0);
            });
        });
    },
    getConnection() {
        return mongoose.connection;
    }
}
