const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', villageController.getVillages);
router.get('/:id', villageController.getVillageById);
router.post('/', auth, admin, villageController.createVillage);
router.put('/:id', auth, admin, villageController.updateVillage);
router.delete('/:id', auth, admin, villageController.deleteVillage);

module.exports = router;
