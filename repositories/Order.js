const Crud = require('./Crud');
const OrderModel = require('../models/Order');

class Order extends Crud {
    constructor() {
        super();
        this.model = OrderModel;
    }
}

module.exports = new Order();
