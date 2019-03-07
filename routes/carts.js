const router = require('express').Router();
const cartRepository = require('../repositories/Cart');
const validators = require('../validators');
const checkAuth = require('../middleware/checkAuth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', checkAuth.user, (req, res, next) => {
    throw new Error('Not yet implemented!');
});

router.get('/:id', [validateObjectId, checkAuth.user], (req, res, next) => {
    throw new Error('Not yet implemented!');
});

router.post('/', checkAuth.user, async (req, res, next) => {
    try {
        const product = req.body.product;
        const userId = req.tokenPayload.id;
        let cart = null;

        if (product) {
            cart = await cartRepository.createOneWithProduct(userId, product);
        } else {
            cart = await cartRepository.createOne({ user: userId });
        }

        return res.status(201).json(cart);
    } catch (e) {
        return next(e);
    }
});

router.put('/:id/addproduct', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const userId = req.tokenPayload.id;
        const product = req.body;
        const cart = await cartRepository.addProduct(cartId, product, userId, _checkUserAccess);

        return res.status(200).json(cart);
    } catch (e) {
        return next(e);
    }
});

router.put('/:id/removeproduct', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const userId = req.tokenPayload.id;
        const { productId } = req.body;
        const cart = await cartRepository.removeProduct(cartId, productId, userId, _checkUserAccess);

        return res.status(200).json(cart);
    } catch (e) {
        return next(e);
    }
});

router.put('/:id/reset', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const userId = req.tokenPayload.id;
        await cartRepository.resetCart(cartId, userId, _checkUserAccess);

        return res.status(200).end();
    } catch (e) {
        return next(e);
    }
});

router.delete('/:id', [validateObjectId, checkAuth.user], (req, res, next) => {
    throw new Error('Not yet implemented!');
});

function _checkUserAccess(userId, cart) {
    if (userId != cart.user.toString()) {
        throw new Error('Permission denied!');
    }
}

module.exports = router;
