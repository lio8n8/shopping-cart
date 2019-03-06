const jwt = require('jsonwebtoken');
const configs = require('../configs');

module.exports.user = (req, res, next) => {
    try {
        req.tokenPayload = _decode(req, configs.JSON_WEBTOKEN_SECRET);
        next();
    } catch (e) {
        return res.status(403).json({ error: 'Permission denied!' });
    }
};

module.exports.admin = (req, res, next) => {
    try {
        const decoded = _decode(req, configs.JSON_WEBTOKEN_SECRET_ADMIN);

        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Permission denied!' });
        }

        req.tokenPayload = decoded;
        next();
    } catch (e) {
        return res.status(403).json({ error: 'Permission denied!' });
    }
};

function _decode(req, jsonWebtokenSecret) {
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, jsonWebtokenSecret);
}
