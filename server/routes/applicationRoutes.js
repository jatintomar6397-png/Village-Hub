const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', applicationController.createApplication);
router.get('/', auth, admin, applicationController.getApplications);
router.put('/:id/status', auth, admin, applicationController.updateApplicationStatus);

module.exports = router;
