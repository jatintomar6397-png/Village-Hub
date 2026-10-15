const express = require('express');
const User = require('../models/User');
const Village = require('../models/Village');
const Complaint = require('../models/Complaint');
const Application = require('../models/Application');
const { getMongoConnected, JsonStore } = require('../config/db');

const router = express.Router();
const userStore = new JsonStore('users');
const villageStore = new JsonStore('villages');
const complaintStore = new JsonStore('complaints');
const appStore = new JsonStore('applications');

router.get('/', async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        let stats = { villages: 0, complaints: 0, applications: 0, users: 0, completedProjects: 0 };
        
        if (isMongoConnected) {
            const [villages, complaints, applications, users, completedProjects] = await Promise.all([
                Village.countDocuments(),
                Complaint.countDocuments(),
                Application.countDocuments(),
                User.countDocuments(),
                Village.countDocuments({ status: 'Completed' })
            ]);
            stats = { villages, complaints, applications, users, completedProjects };
        } else {
            const villages = villageStore.getAll();
            stats.villages = villages.length;
            stats.complaints = complaintStore.getAll().length;
            stats.applications = appStore.getAll().length;
            stats.users = userStore.getAll().length;
            stats.completedProjects = villages.filter(v => v.status === 'Completed').length;
        }
        
        return res.json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
