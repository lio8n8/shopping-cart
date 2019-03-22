const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
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
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['PayPal']
    },
    paymentStatus: {
        type: Number,
        required: true,
        default: 101,
        enum: [101, 201, 301, 401]
    },
    shipping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipping'
    }
});

module.exports = mongoose.model('Order', OrderSchema);
