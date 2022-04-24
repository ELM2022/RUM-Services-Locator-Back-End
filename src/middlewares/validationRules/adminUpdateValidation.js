const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const adminUpdatePostRules = () => {
    return [
        // body('update_datetime').notEmpty().isISO8601('yyyy-mm-dd').matches('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$').withMessage("Admin record update must have valid timestamp."),     // also verify if proper datetime object
        body('update_justification').notEmpty().withMessage("Admin record update must have justification."),
        body('office_id').custom(value => {
            return db.promise().query("SELECT * FROM Office WHERE office_id = ?", [value]).then(result => {
                if (result[0] === undefined) {
                    return Promise.reject("Office id does not exist.");
                } 
            });
        }),
        body('admin_id').custom(value => {
            return db.promise().query("SELECT * FROM Administrator WHERE admin_id = ?", [value]).then(result => {
                if (result[0] === undefined) {
                    return Promise.reject("Admin id does not exist.");
                } 
            });
        })
    ]
}

module.exports = {
    adminUpdatePostRules
}