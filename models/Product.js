const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    imgs: {
        lg: {
            title: { type: String },
            imgPath: { type: String }
        },
        md: {
            title: { type: String },
            imgPath: { type: String }
        },
        sm: [{
            title: { type: String },
            imgPath: { type: String }
        }]
    },
    price: {
        type: Double,
        default: 0
    },
    company: {
        type: String
    }
});

module.exports = mongoose.model('Product', ProductSchema);
