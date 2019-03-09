const router = require('express').Router();
const categoryRepository = require('../repositories/Category');
const validators = require('../validators');
const checkAuth = require('../middleware/checkAuth');
const validateObjectId = require('../middleware/validateObjectId');
const configs = require('../configs');

router.get('/', async (req, res, next) => {
    try {
        const limit = (req.params.limit && req.params.limit <= configs.LIMIT) || configs.LIMIT;
        const skip = req.params.from || 0;
        const categories = await categoryRepository.find({ skip, limit });

        return res.status(200).json(categories);
    } catch (e) {
        return next(e);
    };
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await categoryRepository.findById(id);

        return res.status(200).json(category);
    } catch (e) {
        return next(e);
    }
});

/**
 * @api {post} /api/categories Create category
 * @apiGroup Categories
 * @apiPermission admin
 * @apiHeaderExample {json} Authorization:
 *     {
 *       "authorization": "Bearer {token}"
 *     }
 * @apiParam {String} title Category title 
 * @apiParam {String} description Category description
 * @apiParam {String} [parent] Id of parent category
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5c8400435d401713089d96cd",
 *      "title": "Similique facilis animi praesentium est.",
 *      "description": "Exercitationem voluptatem quo voluptas tempora quia nesciunt quisquam. Fugit sapiente est dicta reiciendis nam 
 *      sit consequuntur magni. Corrupti sunt et iste assumenda dolores voluptas. Sed illo eum maxime aut sit quo maxime. 
 *    }
 * @apiErrorExample {json} Not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', checkAuth.admin, async (req, res, next) => {
    try {
        const category = req.body;
        const userId = req.tokenPayload.id;

        category.createdBy = userId;
        const data = await categoryRepository.createOne(category);
        return res.status(201).json(data);
    } catch (e) {
        return next(e);
    }
});

router.put('/:id', [validateObjectId, checkAuth.admin], async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const category = await categoryRepository.updateOne({ _id: id }, data);

        return res.status(200).json(category);
    } catch (e) {
        next(e);
    }
});

/**
 * @api {delete} /api/categories/:id Delete category
 * @apiGroup Categories
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
        await categoryRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
