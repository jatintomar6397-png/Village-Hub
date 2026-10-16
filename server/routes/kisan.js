/**
 * Village Hub — Kisan Corner API Routes
 * Handles: Crop Calendar, Mandi Prices, Weather Advisories, Crop Production Stats
 */
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { JsonStore } = require('../config/db');

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';

// Helper: build a generic CRUD for a Supabase table with JsonStore fallback
const crudFor = (tableName, allowedFields) => {
    const store = new JsonStore(tableName);

    const pickFields = (body) => {
        const data = {};
        allowedFields.forEach(f => {
            if (body[f] !== undefined) data[f] = body[f];
        });
        return data;
    };

    const isSchemaError = (err) => err && (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache')));

    return {
        // GET all records with optional filters
        getAll: async (req, res) => {
            try {
                if (isConfigured && supabaseAdmin) {
                    let query = supabaseAdmin.from(tableName).select('*');
                    if (req.query.district) query = query.eq('district', req.query.district);
                    if (req.query.crop_name) query = query.eq('crop_name', req.query.crop_name);
                    if (req.query.crop_season) query = query.eq('crop_season', req.query.crop_season);
                    if (req.query.commodity) query = query.eq('commodity', req.query.commodity);
                    if (req.query.search) query = query.or(`crop_name.ilike.%${req.query.search}%,district.ilike.%${req.query.search}%`);
                    const { data, error } = await query.order('id', { ascending: true });
                    if (!error) {
                        return res.json({ success: true, data: data || [], count: (data || []).length });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                // Fallback to local JsonStore
                let items = store.getAll();
                if (req.query.district) items = items.filter(i => i.district === req.query.district);
                if (req.query.crop_name) items = items.filter(i => i.crop_name === req.query.crop_name);
                if (req.query.crop_season) items = items.filter(i => i.crop_season === req.query.crop_season);
                if (req.query.commodity) items = items.filter(i => i.commodity === req.query.commodity);
                if (req.query.search) {
                    const s = req.query.search.toLowerCase();
                    items = items.filter(i => (i.crop_name && i.crop_name.toLowerCase().includes(s)) || (i.district && i.district.toLowerCase().includes(s)));
                }
                return res.json({ success: true, data: items, count: items.length });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        },

        // GET single record
        getOne: async (req, res) => {
            try {
                const { id } = req.params;
                if (isConfigured && supabaseAdmin) {
                    const { data, error } = await supabaseAdmin.from(tableName).select('*').eq('id', id).maybeSingle();
                    if (!error) {
                        if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
                        return res.json({ success: true, data });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                const item = store.getById(id);
                if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, data: item });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        },

        // POST create record (admin only)
        create: async (req, res) => {
            try {
                const record = pickFields(req.body);
                if (req.user) record.updated_by = req.user.email || req.user.id;

                if (isConfigured && supabaseAdmin) {
                    const { data, error } = await supabaseAdmin.from(tableName).insert(record).select().single();
                    if (!error) {
                        return res.status(201).json({ success: true, data });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                const created = store.create(record);
                return res.status(201).json({ success: true, data: { ...created, id: created._id } });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        },

        // PUT update record (admin only)
        update: async (req, res) => {
            try {
                const { id } = req.params;
                const record = pickFields(req.body);
                if (req.user) record.updated_by = req.user.email || req.user.id;

                if (isConfigured && supabaseAdmin) {
                    const { data, error } = await supabaseAdmin.from(tableName).update(record).eq('id', id).select().maybeSingle();
                    if (!error) {
                        if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
                        return res.json({ success: true, data });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                const updated = store.update(id, record);
                if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, data: { ...updated, id: updated._id } });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        },

        // DELETE record (admin only)
        remove: async (req, res) => {
            try {
                const { id } = req.params;
                if (isConfigured && supabaseAdmin) {
                    const { data, error } = await supabaseAdmin.from(tableName).delete().eq('id', id).select();
                    if (!error) {
                        if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Record not found' });
                        return res.json({ success: true, message: 'Record deleted' });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                const deleted = store.delete(id);
                if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, message: 'Record deleted' });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        }
    };
};

// --- Crop Calendar ---
const cropCalendarFields = ['crop_name', 'crop_season', 'sowing_period', 'growth_stages', 'harvesting_period',
    'recommended_varieties', 'estimated_yield', 'advisory', 'district', 'reporting_year',
    'source', 'source_url', 'last_updated_date', 'is_verified'];
const cropCalendar = crudFor('crop_calendar', cropCalendarFields);

router.get('/crop-calendar', cropCalendar.getAll);
router.get('/crop-calendar/:id', cropCalendar.getOne);
router.post('/crop-calendar', [auth, admin], cropCalendar.create);
router.put('/crop-calendar/:id', [auth, admin], cropCalendar.update);
router.delete('/crop-calendar/:id', [auth, admin], cropCalendar.remove);

// --- Mandi Prices ---
const mandiFields = ['commodity', 'variety', 'mandi_name', 'district', 'min_price', 'max_price',
    'modal_price', 'price_unit', 'price_date', 'source', 'source_url', 'data_type', 'is_verified'];
const mandiPrices = crudFor('mandi_prices', mandiFields);

router.get('/mandi-prices', mandiPrices.getAll);
router.get('/mandi-prices/:id', mandiPrices.getOne);
router.post('/mandi-prices', [auth, admin], mandiPrices.create);
router.put('/mandi-prices/:id', [auth, admin], mandiPrices.update);
router.delete('/mandi-prices/:id', [auth, admin], mandiPrices.remove);

// --- Weather Advisories ---
const weatherFields = ['district', 'block_name', 'advisory_type', 'title', 'description',
    'temperature_min', 'temperature_max', 'rainfall_info', 'warnings', 'forecast_period',
    'source', 'source_url', 'advisory_date', 'is_verified'];
const weatherAdvisories = crudFor('weather_advisories', weatherFields);

router.get('/weather', weatherAdvisories.getAll);
router.get('/weather/:id', weatherAdvisories.getOne);
router.post('/weather', [auth, admin], weatherAdvisories.create);
router.put('/weather/:id', [auth, admin], weatherAdvisories.update);
router.delete('/weather/:id', [auth, admin], weatherAdvisories.remove);

// --- Crop Production Stats ---
const prodFields = ['crop_name', 'agricultural_year', 'cultivated_area', 'production', 'yield',
    'area_unit', 'production_unit', 'yield_unit', 'district', 'geographic_level',
    'source', 'source_url', 'reporting_date', 'is_verified'];
const prodStats = crudFor('crop_production_stats', prodFields);

router.get('/production-stats', prodStats.getAll);
router.get('/production-stats/:id', prodStats.getOne);
router.post('/production-stats', [auth, admin], prodStats.create);
router.put('/production-stats/:id', [auth, admin], prodStats.update);
router.delete('/production-stats/:id', [auth, admin], prodStats.remove);

module.exports = router;
