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

    find(query) {
        let { skip, limit } = query;

        return this.model.find(
            {},
            { __v: 0 },
            {
                limit,
                skip: skip * limit
            }).exec();
    }

    createOne(data) {
        return (new this.model(data)).save();
    }

    updateOne(item, data) {
        return this.model.findOneAndUpdate(item, data, { new: true }).exec();
    }

    deleteOne(filter) {
        return this.model.findOneAndRemove(filter).exec();
    }
}

module.exports = Crud;
