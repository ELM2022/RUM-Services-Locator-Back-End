const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const buildingPostRules = () => {
    return [
        body('building_name').isString().notEmpty().isAlpha('es-ES', { ignore: ' ' }).withMessage("Building name must be a string with only letters."),
        body('building_latitude').isFloat().withMessage("Building latitude must be a float number."),
        body('building_longitude').isFloat().withMessage("Building longitude must be a float number.")
    ]
}

const buildingUpdateRules = () => {
    return [
        body('building_name').isString().notEmpty().isAlpha('es-ES', {ignore: " "}).withMessage("Building name must be a string with only letters."),
        body('building_latitude').isFloat().withMessage("Building latitude must be a float number."),
        body('building_longitude').isFloat().withMessage("Building longitude must be a float number."),
    ]
}

module.exports = {
    buildingPostRules,
    buildingUpdateRules
}