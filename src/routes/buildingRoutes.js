const express = require('express');
const router = express.Router();

const buildingController = require('../controllers/buildingController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { buildingPostRules, buildingUpdateRules } = require('../middlewares/validationRules/buildingValidation');

router.get("/buildings", buildingController.getAllBuildings);
router.get("/buildings/:bid", buildingController.getBuildingById);
router.post("/buildings", buildingPostRules(), validateRoute, buildingController.addBuilding);
router.put("/buildings/:bid", buildingUpdateRules(), validateRoute, buildingController.updateBuilding);

module.exports = router;