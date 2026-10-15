const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', complaintController.createComplaint);
router.get('/', auth, complaintController.getComplaints);
router.get('/track/:query', complaintController.trackComplaint);
router.get('/:id', complaintController.getComplaintById);
router.put('/:id/status', auth, admin, complaintController.updateComplaintStatus);

module.exports = router;
