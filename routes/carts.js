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
        const cart = null;

        if (product) {
            cart = await cartRepository.createOneWithProduct(userId, product);
        } else {
            cart = await cartRepository.createOne({ user: userId });
        }

        return res.status(201).json(cart);
    } catch (e) {
        console.log(e);
        return next(e);
    }
});

router.put('/:id', [validateObjectId, checkAuth.user], (req, res, next) => {
    throw new Error('Not yet implemented!');
});

router.delete('/:id', [validateObjectId, checkAuth.user], (req, res, next) => {
    throw new Error('Not yet implemented!');
});

module.exports = router;
