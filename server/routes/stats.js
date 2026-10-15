const express = require('express');
const User = require('../models/User');
const Village = require('../models/Village');
const Complaint = require('../models/Complaint');
const Application = require('../models/Application');
const { getMongoConnected, JsonStore } = require('../config/db');
const { supabaseAdmin, isConfigured } = require('../config/supabase');

const router = express.Router();
const userStore = new JsonStore('users');
const villageStore = new JsonStore('villages');
const complaintStore = new JsonStore('complaints');
const appStore = new JsonStore('applications');
const isProduction = process.env.NODE_ENV === 'production';

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    if (isConfigured && supabaseAdmin) {
      const [villagesRes, complaintsRes, appsRes, profilesRes, completedRes] = await Promise.all([
        supabaseAdmin.from('villages').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('complaints').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('applications').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('villages').select('*', { count: 'exact', head: true }).eq('status', 'Completed')
      ]);

      const stats = {
        villages: villagesRes.count || 0,
        complaints: complaintsRes.count || 0,
        applications: appsRes.count || 0,
        users: profilesRes.count || 0,
        completedProjects: completedRes.count || 0
      };

      return res.json({ success: true, data: stats });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let stats = { villages: 0, complaints: 0, applications: 0, users: 0, completedProjects: 0 };

    if (isMongo) {
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
