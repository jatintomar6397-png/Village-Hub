const express = require('express');
const Village = require('../models/Village');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMongoConnected, JsonStore } = require('../config/db');
const { supabaseAdmin, isConfigured } = require('../config/supabase');

const router = express.Router();
const villageStore = new JsonStore('villages');
const isProduction = process.env.NODE_ENV === 'production';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// GET /api/villages
router.get('/', async (req, res) => {
  try {
    const { district, status, search } = req.query;

    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('villages').select('*');
      if (district) query = query.eq('district', district);
      if (status) query = query.eq('status', status);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query.order('id', { ascending: true });
      if (error) throw error;
      return res.json({ success: true, data: data || [], count: (data || []).length });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    if (isMongo) {
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

// GET /api/villages/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('villages')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Village not found' });
      return res.json({ success: true, data });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let village;
    if (isMongo) {
      village = await Village.findById(id);
    } else {
      village = villageStore.getById(id);
    }

    if (!village) return res.status(404).json({ success: false, message: 'Village not found' });
    return res.json({ success: true, data: village });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/villages (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    if (isConfigured && supabaseAdmin) {
      const villageData = {
        name: req.body.name,
        district: req.body.district,
        tehsil: req.body.tehsil || '',
        population: String(req.body.population || '0'),
        problems: req.body.problems || '',
        status: req.body.status || 'Under Assessment',
        progress: Number(req.body.progress) || 0,
        latitude: Number(req.body.latitude) || 28.65,
        longitude: Number(req.body.longitude) || 77.65,
        schools: Number(req.body.schools) || 0,
        hospitals: Number(req.body.hospitals) || 0
      };

      const { data, error } = await supabaseAdmin
        .from('villages')
        .insert(villageData)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let newVillage;
    if (isMongo) {
      newVillage = new Village(req.body);
      await newVillage.save();
    } else {
      newVillage = { _id: generateId(), ...req.body, createdAt: new Date() };
      villageStore.create(newVillage);
    }
    return res.status(201).json({ success: true, data: newVillage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/villages/:id (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const updateData = {};
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.district !== undefined) updateData.district = req.body.district;
      if (req.body.tehsil !== undefined) updateData.tehsil = req.body.tehsil;
      if (req.body.population !== undefined) updateData.population = String(req.body.population);
      if (req.body.problems !== undefined) updateData.problems = req.body.problems;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.progress !== undefined) updateData.progress = Number(req.body.progress);
      if (req.body.latitude !== undefined) updateData.latitude = Number(req.body.latitude);
      if (req.body.longitude !== undefined) updateData.longitude = Number(req.body.longitude);
      if (req.body.schools !== undefined) updateData.schools = Number(req.body.schools);
      if (req.body.hospitals !== undefined) updateData.hospitals = Number(req.body.hospitals);

      const { data, error } = await supabaseAdmin
        .from('villages')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'Village not found' });
      return res.json({ success: true, data });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    let updatedVillage;
    if (isMongo) {
      updatedVillage = await Village.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updatedVillage = villageStore.update(id, req.body);
    }

    if (!updatedVillage) return res.status(404).json({ success: false, message: 'Village not found' });
    return res.json({ success: true, data: updatedVillage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/villages/:id (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('villages')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Village not found' });
      return res.json({ success: true, message: 'Village deleted' });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    if (isMongo) {
      const result = await Village.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ success: false, message: 'Village not found' });
    } else {
      const success = villageStore.delete(id);
      if (!success) return res.status(404).json({ success: false, message: 'Village not found' });
    }
    return res.json({ success: true, message: 'Village deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
