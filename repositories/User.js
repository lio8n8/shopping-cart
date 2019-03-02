const Crud = require('./Crud');
const UserModel = require('../models/User');

class User extends Crud {
    constructor() {
        super();
        this.model = UserModel;
    }

    findById(id) {
        return this.model.find({ _id: id }, { psw: 0 }).exec();
    }

    find(query) {
        let { skip, limit } = query;

        return this.model.find(
            {},
            {
                __v: 0,
                psw: 0
            },
            {
                limit,
                skip: skip * limit
            }).exec();
    }
}

module.exports = new User();
