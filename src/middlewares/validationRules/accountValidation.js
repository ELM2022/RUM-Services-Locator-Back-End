const { body } = require('express-validator');

const loginTokenRules = () => {
    return [
        body('token').notEmpty().isLength(6).isAlphanumeric().withMessage("Login token must be alphanumeric and have a length of 6 characters.")
    ]
}

const recoverPasswRules = () => {
    return [
        body('admin_email').notEmpty().isEmail().withMessage("Admin email must be a valid email address.")
    ]
}

const resetPasswRules = () => {
    return [
        body('admin_password').notEmpty().isLength({ min: 5 }).isAlphanumeric('es-ES', { ignore: ' _' })
            .withMessage("Admin password must be alphanumeric and have a min length of 5 characters."),
        body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.admin_password) {
                throw new Error('Password confirmation does not match password.');
            }
            return true;
        })
    ]
}

module.exports = {
    recoverPasswRules,
    resetPasswRules,
    loginTokenRules
}