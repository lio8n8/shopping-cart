const Crud = require('./Crud');
const CategoryModel = require('../models/Category');

class Category extends Crud {
    constructor() {
        super(CategoryModel);
    }
}

module.exports = new Category();
