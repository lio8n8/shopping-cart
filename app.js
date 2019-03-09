const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const db = require('./db');
const router = require('./routes');
const configs = require('./configs');
const handlers = require('./middleware/errorHandler');
const corsHeaders = require('./middleware/corsHeaders');
const app = express();

app.enable('trust proxy');
app.set('port', configs.NODE_JS_PORT);

app.use(express.static('public'));
app.use('/docs', express.static('public/docs'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(corsHeaders);

db.mongodb.init();
router.init(app);

app.use(handlers.notFound);
app.use(handlers.internalServerError);

module.exports = app;
