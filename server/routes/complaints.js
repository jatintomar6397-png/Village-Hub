const express = require('express');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');

const router = express.Router();
const complaintStore = new JsonStore('complaints');

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const generateComplaintId = () => `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

router.post('/', async (req, res) => {
    try {
        const { name, phone, district, tehsil, village, category, description, image, userId } = req.body;
        const isMongoConnected = getMongoConnected();
        
        let newComplaint;
        if (isMongoConnected) {
            newComplaint = new Complaint({ name, phone, district, tehsil, village, category, description, image, userId });
            if(!newComplaint.complaintId) {
                newComplaint.complaintId = generateComplaintId();
            }
            await newComplaint.save();
        } else {
            newComplaint = {
                _id: generateId(),
                complaintId: generateComplaintId(),
                name, phone, district, tehsil, village, category, description, image, userId,
                status: 'Submitted',
                createdAt: new Date()
            };
            complaintStore.create(newComplaint);
        }
        return res.json({ success: true, data: newComplaint });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let complaints;
        
        if (isMongoConnected) {
            if (req.user.role === 'admin') {
                complaints = await Complaint.find();
            } else {
                complaints = await Complaint.find({ userId: req.user.id });
            }
        } else {
            const allComplaints = complaintStore.getAll();
            if (req.user.role === 'admin') {
                complaints = allComplaints;
            } else {
                complaints = allComplaints.filter(c => c.userId === req.user.id);
            }
        }
        
        return res.json({ success: true, data: complaints, count: complaints.length });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/track/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const isMongoConnected = getMongoConnected();
        let matches;
        
        if (isMongoConnected) {
            matches = await Complaint.find({ $or: [{ complaintId: query }, { phone: query }] });
        } else {
            const allComplaints = complaintStore.getAll();
            matches = allComplaints.filter(c => c.complaintId === query || c.phone === query);
        }
        
        return res.json({ success: true, data: matches });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id/status', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        const isMongoConnected = getMongoConnected();
        let updatedComplaint;
        
        if (isMongoConnected) {
            updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
        } else {
            updatedComplaint = complaintStore.update(req.params.id, { status });
        }
        
        if (!updatedComplaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
        return res.json({ success: true, data: updatedComplaint });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
