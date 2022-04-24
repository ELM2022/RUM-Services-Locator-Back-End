const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const adminPostRules = () => {
    return [
        body('admin_email').notEmpty().isEmail().withMessage("Admin email must be a valid email."),
        body('admin_password').notEmpty().isLength({ min: 5 }).isAlphanumeric('es-ES', { ignore: ' _' })
            .withMessage("Admin password must be alphanumeric and have a min length of 5 characters."),
        body('admin_name').notEmpty().isAlpha('es-ES', { ignore: ' .' }).withMessage("Admin first name must be a string with only letters."),
        body('admin_last_name').notEmpty().isAlpha('es-ES', { ignore: ' ' }).withMessage("Admin last name must be a string with only letters.")
    ]
}

const adminUpdateRules = () => {
    return [
        body('admin_email').notEmpty().isEmail().withMessage("Admin email must be a valid email."),
        body('admin_name').notEmpty().isAlpha('es-ES', { ignore: ' .' }).withMessage("Admin first name must be a string with only letters."),
        body('admin_last_name').notEmpty().isAlpha('es-ES', { ignore: ' ' }).withMessage("Admin last name must be a string with only letters.")
    ]
}

const adminPasswordUpdateRules = () => {
    return [
        body('admin_password').notEmpty().isLength({ min: 5 }).isAlphanumeric('es-ES', { ignore: ' _' })
            .withMessage("Admin password must be alphanumeric and have a min length of 5.")
    ]
}

module.exports = {
    adminPostRules,
    adminUpdateRules,
    adminPasswordUpdateRules
}