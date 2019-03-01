const log4js = require('log4js');

class Logger {
    constructor() {
        this.log4js = log4js;
    }

    configure() {
        this.log4js.configure({
            appenders: {
                console: {
                    type: 'console'
                },
                debug: getLoggerConfigs('debug'),
                error: getLoggerConfigs('error')
            },
            categories: {
                default: { appenders: ['console'], level: 'all' },
                debug: 'debug',
                error: 'error'
            }
        });
    }

    getLoggerConfigs(subfolder) {
        const currentDate = new Date();

        return {
            type: 'file',
            filename: `logs/${subfolder}_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}.log`
        };
    }

    getLogger(type) {
        return this.log4js.getLogger(type);
    }
}

module.exports = Logger;
