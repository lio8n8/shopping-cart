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
        sm: {
            title: { type: String },
            imgPath: { type: String }
        },
        samples: [{
            title: { type: String },
            imgPath: { type: String }
        }]
    },
    price: {
        type: Number,
        default: 0
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
    },
    company: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', ProductSchema);
