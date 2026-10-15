const express = require('express');
const Village = require('../models/Village');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');

const router = express.Router();
const villageStore = new JsonStore('villages');

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

router.get('/', async (req, res) => {
    try {
        const { district, status, search } = req.query;
        const isMongoConnected = getMongoConnected();

        if (isMongoConnected) {
            let filter = {};
            if (district) filter.district = district;
            if (status) filter.status = status;
            if (search) filter.name = { $regex: search, $options: 'i' };

            const villages = await Village.find(filter);
            return res.json({ success: true, data: villages, count: villages.length });
        } else {
            let villages = villageStore.getAll();
            if (district) villages = villages.filter(v => v.district === district);
            if (status) villages = villages.filter(v => v.status === status);
            if (search) villages = villages.filter(v => v.name && v.name.toLowerCase().includes(search.toLowerCase()));

            return res.json({ success: true, data: villages, count: villages.length });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let village;
        if (isMongoConnected) {
            village = await Village.findById(req.params.id);
        } else {
            village = villageStore.getById(req.params.id);
        }
        
        if (!village) return res.status(404).json({ success: false, message: 'Village not found' });
        return res.json({ success: true, data: village });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', [auth, admin], async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let newVillage;
        if (isMongoConnected) {
            newVillage = new Village(req.body);
            await newVillage.save();
        } else {
            newVillage = { _id: generateId(), ...req.body, createdAt: new Date() };
            villageStore.create(newVillage);
        }
        return res.json({ success: true, data: newVillage });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let updatedVillage;
        if (isMongoConnected) {
            updatedVillage = await Village.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else {
            updatedVillage = villageStore.update(req.params.id, req.body);
        }
        
        if (!updatedVillage) return res.status(404).json({ success: false, message: 'Village not found' });
        return res.json({ success: true, data: updatedVillage });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        if (isMongoConnected) {
            const result = await Village.findByIdAndDelete(req.params.id);
            if (!result) return res.status(404).json({ success: false, message: 'Village not found' });
        } else {
            const success = villageStore.delete(req.params.id);
            if (!success) return res.status(404).json({ success: false, message: 'Village not found' });
        }
        return res.json({ success: true, message: 'Village deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
