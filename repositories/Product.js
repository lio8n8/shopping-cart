const Crud = require('./Crud');
const ProductModel = require('../models/Product');

class Product extends Crud {
    constructor() {
        super();
        this.model = ProductModel;
    }
}

module.exports = new Product();
