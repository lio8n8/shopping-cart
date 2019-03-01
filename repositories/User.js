const Crud = require('./Crud');
const UserModel = require('../models/User');

class User extends Crud {
    constructor() {
        super();
        this.model = UserModel;
    }
}

module.exports = new User();
