const router = require('express').Router();
const cartRepository = require('../repositories/Cart');
const validators = require('../validators');
const checkAuth = require('../middleware/checkAuth');
const validateObjectId = require('../middleware/validateObjectId');
const configs = require('../configs');

/**
 * @api {get} /api/carts Get carts
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "totalQty": 1,
 *      "totalPrice": 807,
 *      "_id": "5c83882bc9a3ec2764bef811",
 *      "user": "5c83882bc9a3ec2764bef80f",
 *      "productLineItems": {
 *          "5c83882bc9a3ec2764bef810": {
 *              "title": "Asperiores aut quasi praesentium.",
 *              "price": 807,
 *              "totalPrice": 807,
 *              "qty": 1
 *          }
 *      }
 *     },
 *     {
 *      "totalQty": 0,
 *      "totalPrice": 0,
 *      "_id": "5c83882bc9a3ec2764bef813",
 *      "user": "5c83882bc9a3ec2764bef812"
 *     }]
 *
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', checkAuth.user, async (req, res, next) => {
    try {
        const limit = (req.params.limit && req.params.limit <= configs.LIMIT) || configs.LIMIT;
        const skip = req.params.from || 0;
        const products = await cartRepository.find({ skip, limit });

        return res.status(200).json(products);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {get} /api/carts/:id Get cart
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccess {Object} productLineItems Product line items
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 1,
 *      "totalPrice": 383,
 *      "_id":  "5c838b6e25623c2aa0aa68c8",
 *      "user": "5c838b6e25623c2aa0aa68c6",
 *      "productLineItems": {
 *          "5c838b6e25623c2aa0aa68c7": { 
 *              "title": "Ullam dolor ea facere reprehenderit aspernatur qui vitae reprehenderit eos.",
 *              "price": 383,
 *              "totalPrice": 383,
 *              "qty": 1
 *          }
 *      }
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:id', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;
        const cart = await cartRepository.findById(id);

        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {post} /api/carts Create cart with product
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {Object} Product 
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccess {Object} productLineItems Product line items
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 1,
 *      "totalPrice": 768,
 *      "_id": "5c838dca13dca32cb95d0010",
 *      "user": "5c838dc913dca32cb95d000e",
 *      "productLineItems": {
 *          "5c838dc913dca32cb95d000f": {
 *          "title": "Sint voluptas sit voluptates.",
 *          "price": 768,
 *          "totalPrice": 768,
 *          "qty": 1
 *          }
 *      }
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
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

/**
 * @api {put} /api/carts/:id/addproduct Add product
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {Object} product Product 
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccess {Object} productLineItems Product line items
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 1,
 *      "totalPrice": 768,
 *      "_id": "5c838dca13dca32cb95d0010",
 *      "user": "5c838dc913dca32cb95d000e",
 *      "productLineItems": {
 *          "5c838dc913dca32cb95d000f": {
 *          "title": "Sint voluptas sit voluptates.",
 *          "price": 768,
 *          "totalPrice": 768,
 *          "qty": 1
 *          }
 *      }
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
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

/**
 * @api {put} /api/carts/:id/removeproduct Remove product
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {String} productId Product id
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccess {Object} [productLineItems] Product line items
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 1,
 *      "totalPrice": 768,
 *      "_id": "5c838dca13dca32cb95d0010",
 *      "user": "5c838dc913dca32cb95d000e",
 *      "productLineItems": {
 *          "5c838dc913dca32cb95d000f": {
 *          "title": "Sint voluptas sit voluptates.",
 *          "price": 768,
 *          "totalPrice": 768,
 *          "qty": 1
 *          }
 *      }
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put('/:id/removeproduct', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const userId = req.tokenPayload.id;
        const { productId } = req.body;
        const cart = await cartRepository.removeProduct(cartId, productId, userId, _checkUserAccess);

        return res.status(200).json(cart);
    } catch (e) {
        console.log(e);
        return next(e);
    }
});

/**
 * @api {put} /api/carts/:id/removepli Remove product line item
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {String} productId Product id
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccess {Object} [productLineItems] Product line items
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 1,
 *      "totalPrice": 768,
 *      "_id": "5c838dca13dca32cb95d0010",
 *      "user": "5c838dc913dca32cb95d000e",
 *      "productLineItems": {
 *          "5c838dc913dca32cb95d000f": {
 *          "title": "Sint voluptas sit voluptates.",
 *          "price": 768,
 *          "totalPrice": 768,
 *          "qty": 1
 *          }
 *      }
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put('/:id/removepli', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const userId = req.tokenPayload.id;
        const { productId } = req.body;
        const cart = await cartRepository.removeProductLineItem(cartId, productId, userId, _checkUserAccess);

        return res.status(200).json(cart);
    } catch (e) {
        return next(e);
    }
});

/**
 * @api {put} /api/carts/:id/reset Reset cart
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiSuccess {String} _id Cart id
 * @apiSuccess {Number} totalQty Quantity of products in cart
 * @apiSuccess {Number} totalPrice Price of all products in cart
 * @apiSuccess {String} user User id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "totalQty": 0,
 *      "totalPrice": 0,
 *      "_id": "5c838dca13dca32cb95d0010",
 *      "user": "5c838dc913dca32cb95d000e",
 *      "productLineItems": {}
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
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

/**
 * @api {delete} /api/carts/:id Delete cart
 * @apiGroup Carts
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/:id', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;
        await cartRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
});

function _checkUserAccess(userId, cart) {
    if (userId != cart.user.toString()) {
        throw new Error('Permission denied!');
    }
}

module.exports = router;
