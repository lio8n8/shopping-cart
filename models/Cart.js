const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    productLineItems: {
        type: Object,
        required: true
    },
    totalQty: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

CartSchema.methods.addProduct = function (product) {
    this.productLineItems = this.productLineItems || {};

    if (this.productLineItems[product._id]) {
        this.productLineItems[product._id].price += product;
        this.productLineItems[product._id].qty++;
    } else {
        this.productLineItems[product._id] = {
            title: product.title,
            price: product.price,
            qty: 1,
            img: product.imgs.sm
        }
    }

    this.totalPrice += product.price;
    this.totalQty++;

    return this;
};

CartSchema.methods.deleteProduct = function (productId) {
    throw new Error('Not yet implemented');
};

CartSchema.methods.deleteProductLineItems = function (oriductId) {
    throw new Error('Not yet implementedI');
};

CartSchema.methods.resetCart = function () {
    this.productLineItems = {};
    this.totalPrice = 0;
    this.totalQty = 0;

    return this.save();
}

module.exports = mongoose.model('Cart', CartSchema);
