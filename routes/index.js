const welcome = require('./welcome');
const users = require('./users');
const products = require('./products');
const carts = require('./carts');
const orders = require('./orders');
const history = require('./history');
const logs = require('./logs');

module.exports.init = app => {
    app.use('/api/users', users);
    app.use('/api/products', products);
    app.use('/api/carts', carts);
    app.use('/api/orders', orders);
    app.use('/api/history', history);
    app.use('/api/logs', logs);
    app.use('/', welcome);
};
