const configs = require('../configs');

module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', configs.ACCESS_CONTROL_ALLOWED_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    next();
};
