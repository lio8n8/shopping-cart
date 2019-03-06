const router = require('express').Router();
const Joi = require('joi');
const userRepository = require('../repositories/User');
const validators = require('../validators');
const tokenService = require('../services/tokenService');
const validateObjectId = require('../middleware/validateObjectId');
const checkAuth = require('../middleware/checkAuth');
const configs = require('../configs');

// TODO: Should be visible only for admins.
router.get('/', async (req, res, next) => {
    try {
        const limit = (req.params.limit && req.params.limit <= configs.LIMIT) || configs.LIMIT;
        const skip = req.params.from || 0;
        const users = await userRepository.find({ skip, limit });

        return res.status(200).json(users);
    } catch (e) {
        return next(e);
    }
});

router.get('/:id', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userRepository.findById(id);
        _compareIds(req, id);

        return res.status(200).json(user);
    } catch (e) {
        return next(e);
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

        return res.header('x-auth-token', tokenService.getToken(user)).status(201).json(user);
    } catch (e) {
        if (e.name === 'MongoError' && e.code === 11000) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        return next(e);
    }
});

router.put('/:id', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        _compareIds(req, id);

        const user = await userRepository.updateOne({ _id: id }, data);

        return res.status(200).json(user);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;

        _compareIds(req, id);
        await userRepository.deleteOne({ _id: id });

        return res.status(204).end();
    } catch (e) {
        return next(e);
    }
});

router.post('/signin', async (req, res, next) => {
    const { email, psw } = req.body;

    if (!email || !psw) {
        return res.status(400).json({ error: 'Empty fields' });
    }

    try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(401).json('Wrong email or password.');
        }

        const isMatched = await user.comparePasswords(psw);
        if (isMatched) {

            return res.header('x-auth-token', tokenService.getToken(user)).status(200).json({
                user: {
                    _id: user._id,
                    email: user.email
                }
            });
        }

        return res.status(401).json('Wrong email or password.');
    } catch (e) {
        console.log(e);
        return next(e);
    }
});

router.put('/:id/changepsw', [validateObjectId, checkAuth.user], async (req, res, next) => {
    try {
        const id = req.params.id;
        _compareIds(req, id);

        const { currentPsw, newPsw } = req.body;
        const user = await userRepository.findById(id, true);
        const isMatched = await user.comparePasswords(currentPsw);

        if (!isMatched) {
            return res.status(401).json('Wrong password.');
        }

        user.psw = newPsw;
        await user.save();

        return res.status(204).end();
    } catch (e) {
        return next(e);
    }
});

// TODO: Move to utils?
function _compareIds(req, id) {
    if (!req.tokenPayload.id || req.tokenPayload.id !== id) {
        return res.status(403).json({ error: 'Permission denied!' });
    }
}

module.exports = router;
