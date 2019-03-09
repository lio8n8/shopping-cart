const router = require('express').Router();
const categoryRepository = require('../repositories/Category');
const validators = require('../validators');
const checkAuth = require('../middleware/checkAuth');
const validateObjectId = require('../middleware/validateObjectId');
const configs = require('../configs');

router.get('/', (req, res, next) => {
    throw new Error('Not yet implemented!');
});

router.get('/:id', (req, res, next) => {
    throw new Error('Not yet implemented!');
});

/**
 * @api {post} /api/categories Create category
 * @apiGroup Carts
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

router.put('/:id', (req, res, next) => {
    throw new Error('Not yet implemented!');
});

router.delete('/:id', (req, res, next) => {
    throw new Error('Not yet implemented!');
});

module.exports = router;
