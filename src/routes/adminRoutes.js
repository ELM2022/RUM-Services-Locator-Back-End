const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { adminPostRules, adminUpdateRules } = require('../middlewares/validationRules/adminValidation');

router.get("/admin", adminController.getAllAdmins);
router.get("/admin/active", adminController.getActiveAdmins);
router.get("/admin/:aid", adminController.getAdminById);
router.post("/admin", adminPostRules(), validateRoute, adminController.addAdmin);
router.put("/admin/:aid", adminUpdateRules(), validateRoute, adminController.updateAdmin);
router.put("/admin/:aid/delete", adminController.deleteAdmin);

module.exports = router;