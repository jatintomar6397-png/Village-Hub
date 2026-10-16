/**
 * Village Hub — Education & Healthcare API Routes
 * Handles: School Info, Healthcare Facilities
 */
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { JsonStore } = require('../config/db');

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';

// --- Generic CRUD helper with JsonStore fallback ---
const crudFor = (tableName, allowedFields) => {
    const store = new JsonStore(tableName);

    const pickFields = (body) => {
        const data = {};
        allowedFields.forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
        return data;
    };

    const isSchemaError = (err) => err && (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache')));

    return {
        getAll: async (req, res) => {
            try {
                if (isConfigured && supabaseAdmin) {
                    let query = supabaseAdmin.from(tableName).select('*');
                    if (req.query.district) query = query.eq('district', req.query.district);
                    if (req.query.village) query = query.eq('village', req.query.village);
                    if (req.query.block_name) query = query.eq('block_name', req.query.block_name);
                    const facilityType = req.query.facility_type || (tableName === 'healthcare_facilities' ? req.query.type : null);
                    if (facilityType) query = query.eq('facility_type', facilityType);
                    const schoolType = req.query.school_type || (tableName === 'school_info' ? req.query.type : null);
                    if (schoolType) query = query.eq('school_type', schoolType);
                    if (req.query.search) {
                        const s = req.query.search;
                        if (tableName === 'school_info') {
                            query = query.or(`school_name.ilike.%${s}%,district.ilike.%${s}%,village.ilike.%${s}%`);
                        } else {
                            query = query.or(`facility_name.ilike.%${s}%,district.ilike.%${s}%,village.ilike.%${s}%`);
                        }
                    }
                    const { data, error } = await query.order('id', { ascending: true });
                    if (!error) {
                        return res.json({ success: true, data: data || [], count: (data || []).length });
                    }
                    if (!isSchemaError(error)) throw error;
                }

                // Fallback to local JsonStore
                let items = store.getAll();
                if (req.query.district) items = items.filter(i => i.district === req.query.district);
                if (req.query.village) items = items.filter(i => i.village === req.query.village);
                if (req.query.block_name) items = items.filter(i => i.block_name === req.query.block_name);
                const facilityType = req.query.facility_type || (tableName === 'healthcare_facilities' ? req.query.type : null);
                if (facilityType) items = items.filter(i => i.facility_type === facilityType);
                const schoolType = req.query.school_type || (tableName === 'school_info' ? req.query.type : null);
                if (schoolType) items = items.filter(i => i.school_type === schoolType);
                if (req.query.search) {
                    const s = req.query.search.toLowerCase();
                    if (tableName === 'school_info') {
                        items = items.filter(i => (i.school_name && i.school_name.toLowerCase().includes(s)) || (i.district && i.district.toLowerCase().includes(s)) || (i.village && i.village.toLowerCase().includes(s)));
                    } else {
                        items = items.filter(i => (i.facility_name && i.facility_name.toLowerCase().includes(s)) || (i.district && i.district.toLowerCase().includes(s)) || (i.village && i.village.toLowerCase().includes(s)));
                    }
                }
                return res.json({ success: true, data: items, count: items.length });
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        },
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
            } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
        },
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
            } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
        },
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
            } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
        },
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
            } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
        }
    };
};

// --- School Info Routes ---
const schoolFields = ['school_name', 'school_type', 'village', 'block_name', 'district',
    'total_students', 'boys_enrolment', 'girls_enrolment', 'total_teachers', 'facilities',
    'academic_year', 'geographic_level', 'govt_school_count', 'private_school_count',
    'source', 'source_url', 'last_verified_date', 'is_verified'];
const schools = crudFor('school_info', schoolFields);

router.get('/schools', schools.getAll);
router.get('/schools/:id', schools.getOne);
router.post('/schools', [auth, admin], schools.create);
router.put('/schools/:id', [auth, admin], schools.update);
router.delete('/schools/:id', [auth, admin], schools.remove);

// --- Healthcare Facilities Routes ---
const healthcareFields = ['facility_name', 'facility_type', 'village', 'block_name', 'district',
    'contact_details', 'services', 'doctors_count', 'staff_count', 'bed_capacity',
    'operational_status', 'geographic_level', 'reporting_date', 'source', 'source_url',
    'last_verified_date', 'is_verified'];
const healthcare = crudFor('healthcare_facilities', healthcareFields);

router.get('/healthcare', healthcare.getAll);
router.get('/healthcare/:id', healthcare.getOne);
router.post('/healthcare', [auth, admin], healthcare.create);
router.put('/healthcare/:id', [auth, admin], healthcare.update);
router.delete('/healthcare/:id', [auth, admin], healthcare.remove);

module.exports = router;
