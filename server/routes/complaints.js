const express = require('express');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');
const { supabaseAdmin, isConfigured } = require('../config/supabase');

const router = express.Router();
const complaintStore = new JsonStore('complaints');
const isProduction = process.env.NODE_ENV === 'production';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const generateComplaintId = () => `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

// Map Supabase complaint record for frontend compatibility
const formatComplaint = (c) => ({
  _id: c.id,
  id: c.id,
  complaintId: c.complaint_id || c.complaintId,
  name: c.name,
  phone: c.phone,
  district: c.district,
  tehsil: c.tehsil || '',
  village: c.village,
  category: c.category,
  description: c.description || '',
  image: c.image || null,
  status: c.status,
  userId: c.user_id || c.userId || null,
  createdAt: c.created_at || c.createdAt,
  updatedAt: c.updated_at || c.updatedAt
});

// POST /api/complaints
router.post('/', async (req, res) => {
  try {
    const { name, phone, district, tehsil, village, category, description, image, userId } = req.body;

    if (!name || !phone || !village || !category) {
      return res.status(400).json({ success: false, message: 'Name, phone, village, and category are required' });
    }

    if (isConfigured && supabaseAdmin) {
      const complaintId = generateComplaintId();
      const insertData = {
        complaint_id: complaintId,
        name,
        phone,
        district: district || 'Hapur',
        tehsil: tehsil || '',
        village,
        category,
        description: description || '',
        image: image || null,
        status: 'Submitted',
        user_id: (userId && userId.length === 36) ? userId : null // UUID check
      };

      const { data, error } = await supabaseAdmin
        .from('complaints')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data: formatComplaint(data) });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let newComplaint;
    if (isMongo) {
      newComplaint = new Complaint({ name, phone, district, tehsil, village, category, description, image, userId });
      if (!newComplaint.complaintId) {
        newComplaint.complaintId = generateComplaintId();
      }
      await newComplaint.save();
    } else {
      newComplaint = {
        _id: generateId(),
        complaintId: generateComplaintId(),
        name, phone, district, tehsil, village, category, description, image, userId,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
      complaintStore.create(newComplaint);
    }
    return res.status(201).json({ success: true, data: newComplaint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/complaints (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('complaints').select('*').order('created_at', { ascending: false });

      if (req.user.role !== 'admin') {
        query = query.eq('user_id', req.user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map(formatComplaint);
      return res.json({ success: true, data: formatted, count: formatted.length });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let complaints;
    if (isMongo) {
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

// GET /api/complaints/track/:query
router.get('/track/:query', async (req, res) => {
  try {
    const { query } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('complaints')
        .select('*')
        .or(`complaint_id.eq.${query},phone.eq.${query}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formatted = (data || []).map(formatComplaint);
      return res.json({ success: true, data: formatted });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let matches;
    if (isMongo) {
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

// PUT /api/complaints/:id/status (admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid complaint status' });
    }

    if (isConfigured && supabaseAdmin) {
      // Find and update by UUID or complaint_id
      const { data, error } = await supabaseAdmin
        .from('complaints')
        .update({ status })
        .or(`id.eq.${id},complaint_id.eq.${id}`)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Complaint not found' });
      return res.json({ success: true, data: formatComplaint(data) });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let updatedComplaint;
    if (isMongo) {
      updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      updatedComplaint = complaintStore.update(id, { status });
    }

    if (!updatedComplaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    return res.json({ success: true, data: updatedComplaint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
