class Crud {
    constructor() {
        if (new.target === Crud) {
            throw new Error('Can not construct abstract class.');
        }

        this.model = null;
    }

    findById(id) {
        return this.model.findById(id).exec();
    }

    createOne(data) {
        return (new this.model(data)).save();
    }

    updateOne(item, data) {
        return this.model.findOneAndUpdate(item, data).exec();
    }

    deleteOne(filter) {
        return this.model.findOneAndRemove(filter).exec();
    }
}

module.exports = Crud;
