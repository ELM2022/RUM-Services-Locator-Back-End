const express = require('express');
const router = express.Router();

const officeUpdatesController = require('../controllers/officeUpdatesController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { officeUpdatePostRules } = require('../middlewares/validationRules/officeUpdateValidation');

router.get("/offices/updates/all", officeUpdatesController.getAllOfficeUpdates);
router.get("/offices/updates/:ouid", officeUpdatesController.getOfficeUpdateById);
router.post("/offices/updates", officeUpdatePostRules(), validateRoute, officeUpdatesController.addOfficeUpdate);

module.exports = router;