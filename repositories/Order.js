const Crud = require('./Crud');
const OrderModel = require('../models/Order');

class Order extends Crud {
    constructor() {
        super(OrderModel);
    }
}

module.exports = new Order();
