const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');
const { supabaseAdmin, isConfigured } = require('../config/supabase');

const router = express.Router();
const appStore = new JsonStore('applications');
const isProduction = process.env.NODE_ENV === 'production';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const formatApplication = (a) => ({
  _id: a.id,
  id: a.id,
  name: a.name,
  email: a.email,
  phone: a.phone || '',
  village: a.village,
  requestedRole: a.requested_role || a.requestedRole || 'Volunteer',
  message: a.message || '',
  status: a.status,
  createdAt: a.created_at || a.createdAt,
  updatedAt: a.updated_at || a.updatedAt
});

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, village, requestedRole, message } = req.body;

    if (!name || !email || !village) {
      return res.status(400).json({ success: false, message: 'Name, email, and village are required' });
    }

    if (isConfigured && supabaseAdmin) {
      const insertData = {
        name,
        email,
        phone: phone || '',
        village,
        requested_role: requestedRole || 'Volunteer',
        message: message || '',
        status: 'Pending'
      };

      const { data, error } = await supabaseAdmin
        .from('applications')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data: formatApplication(data) });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let newApp;
    if (isMongo) {
      newApp = new Application({ name, email, phone, village, requestedRole, message });
      await newApp.save();
    } else {
      newApp = {
        _id: generateId(),
        name, email, phone, village, requestedRole, message,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      appStore.create(newApp);
    }
    return res.status(201).json({ success: true, data: newApp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/applications (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formatted = (data || []).map(formatApplication);
      return res.json({ success: true, data: formatted, count: formatted.length });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let apps;
    if (isMongo) {
      apps = await Application.find();
    } else {
      apps = appStore.getAll();
    }

    return res.json({ success: true, data: apps, count: apps.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/applications/:id/status (admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .update({ status })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Application not found' });
      return res.json({ success: true, data: formatApplication(data) });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let updatedApp;
    if (isMongo) {
      updatedApp = await Application.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      updatedApp = appStore.update(id, { status });
    }

    if (!updatedApp) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.json({ success: true, data: updatedApp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
