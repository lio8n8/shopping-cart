const Crud = require('./Crud');
const CategoryModel = require('../models/Category');

class Category extends Crud {
    constructor() {
        super();
        this.model = CategoryModel;
    }
}

module.exports = new Category();
