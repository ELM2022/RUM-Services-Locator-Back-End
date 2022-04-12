const express = require('express');
const router = express.Router();

const adminUpdatesController = require('../controllers/adminUpdatesController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { adminUpdatePostRules } = require('../middlewares/validationRules/adminUpdateValidation');

router.get("/admin/updates/all", adminUpdatesController.getAllAdminUpdates);
router.get("/admin/updates/:auid", adminUpdatesController.getAdminUpdateById);
router.post("/admin/updates", adminUpdatePostRules(), validateRoute, adminUpdatesController.addAdminUpdate);

module.exports = router;