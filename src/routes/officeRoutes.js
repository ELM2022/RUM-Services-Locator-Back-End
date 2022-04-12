const express = require('express');
const router = express.Router();

const officeController = require('../controllers/officeController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { officePostRules, officeUpdateRules } = require('../middlewares/validationRules/officeValidation');

router.get("/offices", officeController.getAllOffices);
router.get("/offices/:oid", officeController.getOfficeById);
router.post("/offices", officePostRules(), validateRoute, officeController.addOffice);
router.put("/offices/:oid", officeUpdateRules(), validateRoute, officeController.updateOffice);
router.put("/offices/delete/:oid", officeController.deleteOffice);

module.exports = router;