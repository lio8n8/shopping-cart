const Joi = require('joi');

module.exports.signup = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    psw: Joi.string().min(5).max(255).required(),
    confirmPsw: Joi.any().valid(Joi.ref('psw')).required().options({
        language:
            { any: { allowOnly: 'The passwords are not matched' } }
    }).label('Password Confirmation'),
    name: Joi.string().min(3).max(255)
};
