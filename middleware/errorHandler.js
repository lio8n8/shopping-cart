const logger = require('../utils/logger');

module.exports.notFound = (req, res, next) => {
    res.status(404);
    logger.getLogger('error').error(`[${req.method}] - [${req.url}] - [${res.statusCode}] - ${req.url}`);
    res.json({ error: 'Not found' });

    return;
};

module.exports.internalServerError = (err, req, res, next) => {
    res.status(err.status || 500);
    logger.getLogger('error').error(`[${req.method}] - [${req.url}] - [${res.statusCode}] - ${err.message}`);
    res.json({ error: 'Internal server error' });

    return;
};
