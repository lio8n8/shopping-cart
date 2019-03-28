const Crud = require('./Crud');
const ProductModel = require('../models/Product');

class Product extends Crud {
    constructor() {
        super(ProductModel);
    }
}

module.exports = new Product();
