const { body } = require('express-validator');
const db = require('../../configs/db').pool;

const pendingAdminPostRules = () => {
    return [
        body('pending_admin.admin_id').isInt().withMessage("Admin id must be an integer."),
        body('pending_admin.pending_email').notEmpty().isEmail().withMessage("Pending admin email must be a valid email."),
        body('pending_admin.admin_id').custom(value => {
            return db.promise().query("SELECT * FROM Administrator WHERE admin_id = ?", [value]).then(result => {
                if (result[0][0] === undefined) {
                    return Promise.reject("Admin id does not exist.");
                }
            });
        }).withMessage("Source administrator does not exist.")
    ]
}

module.exports = {
    pendingAdminPostRules
}