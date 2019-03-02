const router = require('express').Router();
const Joi = require('joi');
const userRepository = require('../repositories/User');
const validators = require('../validators');
const configs = require('../configs');

router.get('/', async (req, res, next) => {
    try {
        const limit = (req.params.limit && req.params.limit <= configs.LIMIT) || configs.LIMIT;
        const skip = req.params.from || 0;
        const users = await userRepository.find({ skip, limit });

        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userRepository.findById(id);

        return res.status(200).json(user);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        const result = Joi.validate(data, validators.signup);

        if (result.error) {
            res.status(400).json({ error: result.error.details[0].message });
        }

        const user = await userRepository.createOne(data);

        return res.status(201).json(user);
    } catch (e) {
        if (e.name === 'MongoError' && e.code === 11000) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await userRepository.updateOne({ _id: id }, data);

        return res.status(200).json(user);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await userRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
