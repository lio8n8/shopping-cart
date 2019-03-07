const Crud = require('./Crud');
const CartModel = require('../models/Cart');

class Cart extends Crud {
    constructor() {
        super();
        this.model = CartModel;
    }

    createOneWithProduct(userId, product) {
        const cart = new this.model({ user: userId });
        cart.addProduct(product);

        return cart.save();
    }

    async resetCart(cartId, userId, checkUserAccess) {
        const cart = await this.model.findById(cartId);
        checkUserAccess(userId, cart);
        cart.reset();

        return cart.save();
    }
}

module.exports = new Cart();
