const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');

const router = express.Router();
const appStore = new JsonStore('applications');

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, village, requestedRole, message } = req.body;
        const isMongoConnected = getMongoConnected();
        let newApp;
        
        if (isMongoConnected) {
            newApp = new Application({ name, email, phone, village, requestedRole, message });
            await newApp.save();
        } else {
            newApp = {
                _id: generateId(),
                name, email, phone, village, requestedRole, message,
                status: 'Pending',
                createdAt: new Date()
            };
            appStore.create(newApp);
        }
        return res.json({ success: true, data: newApp });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', [auth, admin], async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let apps;
        
        if (isMongoConnected) {
            apps = await Application.find();
        } else {
            apps = appStore.getAll();
        }
        
        return res.json({ success: true, data: apps, count: apps.length });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id/status', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        const isMongoConnected = getMongoConnected();
        let updatedApp;
        
        if (isMongoConnected) {
            updatedApp = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        } else {
            updatedApp = appStore.update(req.params.id, { status });
        }
        
        if (!updatedApp) return res.status(404).json({ success: false, message: 'Application not found' });
        return res.json({ success: true, data: updatedApp });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
