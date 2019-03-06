const jwt = require('jsonwebtoken');
const configs = require('../../configs');

class TokenService {
    getToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                isAdmin: !!(user.isAdmin)
            },
            user.isAdmin ? configs.JSON_WEBTOKEN_SECRET_ADMIN : configs.JSON_WEBTOKEN_SECRET,
            {
                expiresIn: configs.JSON_WEBTOKEN_EXPIRATION
            }
        );
    }
}

module.exports = TokenService;
