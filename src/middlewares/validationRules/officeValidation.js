const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const officePostRules = () => {
    return [
        body('office.office_name').notEmpty().isAlpha('es-ES', { ignore: ' -' }).withMessage("Office name must be a string with only letters."),
        body('office.office_description').notEmpty().isAlphanumeric('es-ES', { ignore: ' ,.' }).withMessage("Office description must be a string with only letters or numbers."),
        body('office.office_schedule').notEmpty(),
        body('office.office_latitude').isFloat().withMessage("Office latitude must be a float number."),
        body('office.office_longitude').isFloat().withMessage("Office longitude must be a float number."),
        body('office.office_floor_number').optional(),
        body('office.office_room_code').optional(),
        body('office.office_email').optional(),
        body('office.office_phone_number').optional(),
        body('office.office_extension_number').optional(),
        body('office.office_website').optional()
    ]
}

const officeUpdateRules = () => {
    return [
        body('office.office_name').notEmpty().isAlpha('es-ES', { ignore: ' .-/' }).withMessage("Office name must be a string with only letters."),
        body('office.office_description').notEmpty().isAlphanumeric('es-ES', { ignore: ' ,.;' }).withMessage("Office description must be a string with only letters or numbers."),
        body('office.office_schedule').notEmpty(),
        body('office.office_latitude').isFloat().withMessage("Office latitude must be a float number."),
        body('office.office_longitude').isFloat().withMessage("Office longitude must be a float number."),
        body('office.office_floor_number').optional(),
        body('office.office_room_code').optional(),
        body('office.office_email').optional(),
        body('office.office_phone_number').optional(),
        body('office.office_extension_number').optional(),
        body('office.office_website').optional()
    ]
}

module.exports = {
    officePostRules,
    officeUpdateRules
}