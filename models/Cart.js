const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    productLineItems: {
        type: Object
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
        this.productLineItems[product._id].totalPrice += product.price;
        this.productLineItems[product._id].qty++;
    } else {
        this.productLineItems[product._id] = {
            title: product.title,
            price: product.price,
            totalPrice: product.price,
            qty: 1,
            img: product.imgs.sm
        }
    }

    this.totalPrice += product.price;
    this.totalQty++;

    this.markModified(`productLineItems.${product._id}`);
    return this;
};

CartSchema.methods.removeProduct = function (productId) {
    if (!this.productLineItems[productId]) {
        throw new Error(`Can not find product: ${productId} in cart.`);
    }

    if (this.totalQty <= 1) {
        return this.reset();
    }

    const productPrice = this.productLineItems[productId].price;
    if (this.productLineItems[productId].qty > 1) {
        this.productLineItems[productId].totalPrice -= productPrice;
        this.productLineItems[productId].qty--;
    } else {
        delete this.productLineItems[productId];
    }

    this.totalPrice -= productPrice;
    this.totalQty--;

    this.markModified(`productLineItems.${productId}`);
    return this;
};

CartSchema.methods.removeProductLineItem = function (productId) {
    if (!this.productLineItems[productId]) {
        throw new Error(`Can not find product: ${productId} in cart.`);
    }

    if (this.totalQty <= 1 || Object.keys(this.productLineItems[productId]) <= 1) {
        return this.reset();
    }

    this.totalPrice -= this.productLineItems[productId].totalPrice;
    this.totalQty -= this.productLineItems[productId].qty;

    delete this.productLineItems[productId];
    this.markModified(`productLineItems.${productId}`);

    return this;
};

CartSchema.methods.reset = function () {
    this.productLineItems = {};
    this.totalPrice = 0;
    this.totalQty = 0;

    return this;
}

module.exports = mongoose.model('Cart', CartSchema);
