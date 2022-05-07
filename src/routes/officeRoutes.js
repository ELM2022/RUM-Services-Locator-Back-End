const express = require('express');
const router = express.Router();

const officeController = require('../controllers/officeController');
const categoryController = require('../controllers/categoryController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { officePostRules, officeUpdateRules } = require('../middlewares/validationRules/officeValidation');

router.get("/offices", officeController.getAllOffices);
router.get("/offices/active", officeController.getActiveOffices);
router.get("/offices/:oid", officeController.getOfficeById);
router.post("/offices", officePostRules(), validateRoute, officeController.addOffice);
router.put("/offices/:oid", officeUpdateRules(), validateRoute, officeController.updateOffice);
router.put("/offices/:oid/delete", officeController.deleteOffice);

router.get('/offices/category/all', officeController.getOfficesWithCategory);
router.post("/offices/:oid/category", categoryController.addOfficeCategories);
router.get("/offices/:oid/category", categoryController.getCategoriesByOfficeId);
router.delete("/offices/:oid/category", categoryController.deleteAllOfficeCategories);
// router.delete("/offices/:oid/category/all", categoryController.deleteAllOfficeCategories);
router.get('/offices/category/match', officeController.getOfficeByCategory);
router.get('/offices/category/membership', officeController.getAllOfficeCategoryMemberships);

module.exports = router;