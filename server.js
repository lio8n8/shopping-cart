const https = require('http');
const fs = require('fs');
const app = require('./app');
const logger = require('./utils/logger');

const server = https.createServer(app);

server.on('close', () => {
    logger.getLogger('error').info('Server closed closed');
});

server.on('SIGINT', () => {
    server.close('Server closed (SIGINT)');
});

server.listen(app.get('port'), err => {
    if (err) {
        logger.getLogger('error').error(err);
    }

    logger.getLogger('debug').info(`App started on port ${app.get('port')}...`);
});
