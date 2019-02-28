const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db');
const router = require('./routes');
const logger = require('./services/logger');
const configs = require('./configs');
const app = express();

app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', configs.NODE_JS_PORT);
app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', configs.ACCESS_CONTROL_ALLOWED_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    next();
});

db.mongodb.init();
router.init(app);

app.use(function (req, res) {
    res.status(404);
    logger.getLogger('error').error(`[${req.method}] - [${req.url}] - [${res.statusCode}] - ${req.url}`);
    res.json({ error: 'Not found' });

    return;
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    logger.getLogger('error').error(`[${req.method}] - [${req.url}] - [${res.statusCode}] - ${err.message}`);
    res.json({ error: 'Internal server error' });

    return;
});

module.exports = app;
