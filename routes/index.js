const welcome = require('./welcome');

module.exports.init = app => {
    app.use('/', welcome);
};
