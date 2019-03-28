const Crud = require('./Crud');
const UserModel = require('../models/User');

class User extends Crud {
    constructor() {
        super(UserModel);
    }

    findById(id, isShowPsw = false) {
        return this.model.findOne({ _id: id }, { psw: isShowPsw ? 1 : 0 }).exec();
    }

    findByEmail(email) {
        return this.model.findOne({ email }).exec();
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
