const router = require('express').Router();
const productRepository = require('../repositories/Product');
const validators = require('../validators');
const checkAuth = require('../middleware/checkAuth');
const validateObjectId = require('../middleware/validateObjectId');
const configs = require('../configs');

/**
 * @apiDefine ApiProductSuccessResponse
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "price": 420,
 *      "isOnline": false,
 *      "_id": "5c83a5056f5a5b3e96db07cf",
 *      "name": "Laudantium totam",
 *      "title": "Laudantium totam in magnam quisquam cupiditate id amet repellat.",
 *      "description":"Possimus recusandae facere quia architecto quaerat. Recusandae excepturi iusto nobis dicta quia. Laudantium totam 
 *                     et ut quae aliquid. Dolorem est ipsa. Quam beatae unde et inventore.","shortDescription":"Occaecati dolorem ab et 
 *                     suscipit quia. Quis et suscipit atque neque asperiores eius ut non minus. Rem nisi dolor corrupti tenetur accusamus.
 *                     Rem ducimus sit aliquid.",
 *      "createdBy": "5c83a5056f5a5b3e96db07ce"
 *    }
 */

/**
 * @apiDefine ApiProductSuccessFields
 * 
 * @apiSuccess {String} _id Product id
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} name Produc name
 * @apiSuccess {String} title Produc title
 * @apiSuccess {String} description Product description
 * @apiSuccess {String} createdBy Admin id
 * @apiSuccess {Boolean} isOnline Default false
 */

/**
 * @api {get} /api/products Get products
 * @apiGroup Products
 * 
 * @apiSuccess {Array} Products Array of products
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "price": 420,
 *      "isOnline": false,
 *      "_id": "5c83a5056f5a5b3e96db07cf",
 *      "name": "Laudantium totam",
 *      "title": "Laudantium totam in magnam quisquam cupiditate id amet repellat.",
 *      "description":"Possimus recusandae facere quia architecto quaerat. Recusandae excepturi iusto nobis dicta quia. Laudantium totam 
 *                     et ut quae aliquid. Dolorem est ipsa. Quam beatae unde et inventore.","shortDescription":"Occaecati dolorem ab et 
 *                     suscipit quia. Quis et suscipit atque neque asperiores eius ut non minus. Rem nisi dolor corrupti tenetur accusamus.
 *                     Rem ducimus sit aliquid.",
 *      "createdBy": "5c83a5056f5a5b3e96db07ce"
 *    }]
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', async (req, res, next) => {
    try {
        const limit = (req.params.limit && req.params.limit <= configs.LIMIT) || configs.LIMIT;
        const skip = req.params.from || 0;
        const products = await productRepository.find({ skip, limit });

        return res.status(200).json(products);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {get} /api/products/:id Get product
 * @apiGroup Products
 * 
 * @apiUse ApiProductSuccessFields
 * @apiUse ApiProductSuccessResponse
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await productRepository.findById(id);

        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {post} /api/products Create product
 * @apiGroup Products
 * @apiPermission admin
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {Number} price Product price
 * @apiParam {String} name Produc name
 * @apiParam {String} title Produc title
 * @apiParam {String} description Product description
 * 
 * @apiUse ApiProductSuccessFields
 * @apiUse ApiProductSuccessResponse
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', checkAuth.admin, async (req, res, next) => {
    try {
        const data = req.body;
        const userId = req.tokenPayload.id;
        const product = await productRepository.createOne(Object.assign(data, { createdBy: userId }));

        return res.status(201).json(product);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {put} /api/products/:id Update product
 * @apiGroup Products
 * @apiPermission admin
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {Number} price Product price
 * @apiParam {String} name Produc name
 * @apiParam {String} title Produc title
 * @apiParam {String} description Product description
 * 
 * @apiUse ApiProductSuccessFields
 * @apiUse ApiProductSuccessResponse
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put('/:id', [validateObjectId, checkAuth.admin], async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const product = await productRepository.updateOne({ _id: id }, data);

        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {delete} /api/products/:id Delete product
 * @apiGroup Products
 * @apiPermission admin
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
router.delete('/:id', [validateObjectId, checkAuth.admin], async (req, res, next) => {
    try {
        const id = req.params.id;
        await productRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
