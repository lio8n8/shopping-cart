const log4js = require('log4js');
const configs = require('../../configs');
const env = configs.NODE_JS_ENV;

// Logging levels for log4js: ALL < DEBUG < INFO < WARN < ERROR < FATAL < OFF
const currentDate = new Date();

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        debugLogger: {
            type: 'file',
            filename: `logs/debug_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}.log`
        },
        errorLogger: {
            type: 'file',
            filename: `logs/error_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}.log`
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'all' },
        debugLogger: { appenders: env === 'test' ? ['debugLogger'] : ['debugLogger', 'console'], level: 'debug' },
        errorLogger: { appenders: env === 'test' ? ['errorLogger'] : ['errorLogger', 'console'], level: 'error' }
    }
});

module.exports = {
    consoleLogger: log4js.getLogger(),
    debugLogger: log4js.getLogger('debugLogger'),
    errorLogger: log4js.getLogger('errorLogger')
};
