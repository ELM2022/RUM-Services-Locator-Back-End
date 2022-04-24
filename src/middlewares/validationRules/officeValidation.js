const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const officePostRules = () => {
    return [
        body('office_name').notEmpty().isAlpha('es-ES', { ignore: ' ' }).withMessage("Office name must be a string with only letters."),
        body('office_description').notEmpty().isAlphanumeric('es-ES', { ignore: ' ,' }).withMessage("Office description must be a string with only letters or numbers."),
        body('office_schedule').notEmpty(),
        body('office_latitude').isFloat().withMessage("Office latitude must be a float number."),
        body('office_longitude').isFloat().withMessage("Office longitude must be a float number."),
        body('office_floor_number').isInt().withMessage("Office floor number must be an integer."),
        body('office_room_code').optional().notEmpty(),
        // body('office_email').optional().notEmpty().isEmail().withMessage("Office email must a valid email."),
        // body('office_phone_number').optional().isMobilePhone().withMessage("Office phone number must a valid phone number."),
        // body('office_extension_number').optional().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("Office extension number must be a string with only letters or numbers."),
        // body('office_website').optional().isURL().withMessage("Office website must be a valid URL.")
    ]
}

const officeUpdateRules = () => {
    return [
        body('office_name').notEmpty().isAlpha('es-ES', { ignore: ' ' }).withMessage("Office name must be a string with only letters."),
        body('office_description').notEmpty().isAlphanumeric('es-ES', { ignore: ' ,' }).withMessage("Office description must be a string with only letters or numbers."),
        body('office_schedule').notEmpty(),
        body('office_latitude').isFloat().withMessage("Office latitude must be a float number."),
        body('office_longitude').isFloat().withMessage("Office longitude must be a float number."),
        body('office_floor_number').isInt().withMessage("Office floor number must be an integer."),
        body('office_room_code').optional().notEmpty(),
        // body('office_email').optional().notEmpty().isEmail().withMessage("Office email must a valid email."),
        // body('office_phone_number').optional().isMobilePhone().withMessage("Office phone number must a valid phone number."),
        // body('office_extension_number').optional().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("Office extension number must be a string with only letters or numbers."),
        // body('office_website').optional().isURL().withMessage("Office website must be a valid URL.")
    ]
}

module.exports = {
    officePostRules,
    officeUpdateRules
}