const Crud = require('./Crud');
const CartModel = require('../models/Cart');

class Cart extends Crud {
    constructor() {
        super();
        this.model = CartModel;
    }
}

module.exports = new Cart();
