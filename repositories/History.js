const Crud = require('./Crud');
const HistoryModel = require('../models/History');

class History extends Crud {
    constructor() {
        super();
        this.model = HistoryModel;
    }
}

module.exports = new History();
