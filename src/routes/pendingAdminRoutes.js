const express = require('express');
const router = express.Router();

const pendingAdminController = require('../controllers/pendingAdminController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { pendingAdminPostRules } = require('../middlewares/validationRules/pendingAdminValidation');

router.get("/admin/pending/unresolved", pendingAdminController.getUnresolvedPendingAdmins);
router.get("/admin/pending/all", pendingAdminController.getAllPendingAdmins);
router.get("/admin/pending/:paid", pendingAdminController.getPendingAdminById);
router.post("/admin/pending", pendingAdminPostRules(), validateRoute, pendingAdminController.addPendingAdmin);
router.put("/admin/pending/:paid/delete", pendingAdminController.deletePendingAdmin);

module.exports = router;