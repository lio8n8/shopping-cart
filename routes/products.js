const router = require('express').Router();
const productRepository = require('../repositories/Product');
const validators = require('../validators');
const configs = require('../configs');

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

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await productRepository.findById(id);

        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        const product = await productRepository.createOne(data);

        return res.status(201).json(product);
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const product = await productRepository.updateOne({ _id: id }, data);

        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await productRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
