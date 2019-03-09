const https = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const server = https.createServer(app);

server.on('close', () => {
    logger.errorLogger.info('Server closed closed');
});

server.on('SIGINT', () => {
    server.close('Server closed (SIGINT)');
});

server.listen(app.get('port'), err => {
    if (err) {
        logger.errorLogger.error(err);
    }

    logger.errorLogger.info(`App started on port ${app.get('port')}...`);
});
