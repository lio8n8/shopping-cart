const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: email => {
                // TODO: Check
                return /^[\w-\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/.test(email);
            },
        }
    },
    psw: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    imgUrl: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    isLocked: {
        type: Boolean
    },
    info: {
        firstName: { type: String },
        lastName: { type: String },
        comapany: { type: String },
        occupation: { type: String }
    },
    prefs: {
        lang: { type: String },
        currency: {
            type: String,
            enum: ['EUR', 'USD', 'UAH']
        },
        isNotificationEnabled: { type: Boolean },
        isSubscriptionEnabled: { type: Boolean }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('psw')) {
        return next();
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.psw, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.psw = hash;
            next();
        });
    });
});

UserSchema.methods.comparePasswords = function (textPsw) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(textPsw, this.psw, (err, isMatch) => {
            if (err) {
                reject(err);
            }

            resolve(isMatch);
        });
    });
}

module.exports = mongoose.model('User', UserSchema);
