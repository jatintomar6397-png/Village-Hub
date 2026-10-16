/**
 * Village Hub — Panchayat Funds API Routes
 * Handles: Panchayat financial records CRUD + CSV import/export
 */
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { JsonStore } = require('../config/db');

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';
const pfStore = new JsonStore('panchayat_funds');

const ALLOWED_FIELDS = ['gram_panchayat', 'block_name', 'district', 'financial_year',
    'scheme_name', 'fund_source', 'sanctioned_amount', 'released_amount', 'expenditure',
    'balance', 'work_name', 'work_status', 'physical_progress', 'reporting_date',
    'source', 'source_url', 'data_type', 'original_source_value', 'is_admin_edited', 'is_verified'];

const pickFields = (body) => {
    const data = {};
    ALLOWED_FIELDS.forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    return data;
};

const isSchemaError = (err) => err && (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache')));

// GET /api/panchayat-funds — list all with filters
router.get('/', async (req, res) => {
    try {
        if (isConfigured && supabaseAdmin) {
            let query = supabaseAdmin.from('panchayat_funds').select('*');
            if (req.query.district) query = query.eq('district', req.query.district);
            if (req.query.block_name) query = query.eq('block_name', req.query.block_name);
            if (req.query.gram_panchayat) query = query.eq('gram_panchayat', req.query.gram_panchayat);
            if (req.query.financial_year) query = query.eq('financial_year', req.query.financial_year);
            if (req.query.scheme_name) query = query.ilike('scheme_name', `%${req.query.scheme_name}%`);
            if (req.query.search) {
                query = query.or(`gram_panchayat.ilike.%${req.query.search}%,scheme_name.ilike.%${req.query.search}%,work_name.ilike.%${req.query.search}%`);
            }
            const { data, error } = await query.order('id', { ascending: true });
            if (!error) {
                return res.json({ success: true, data: data || [], count: (data || []).length });
            }
            if (!isSchemaError(error)) throw error;
        }

        // Fallback to JsonStore
        let items = pfStore.getAll();
        if (req.query.district) items = items.filter(i => i.district === req.query.district);
        if (req.query.block_name) items = items.filter(i => i.block_name === req.query.block_name);
        if (req.query.gram_panchayat) items = items.filter(i => i.gram_panchayat === req.query.gram_panchayat);
        if (req.query.financial_year) items = items.filter(i => i.financial_year === req.query.financial_year);
        if (req.query.scheme_name) items = items.filter(i => i.scheme_name && i.scheme_name.toLowerCase().includes(req.query.scheme_name.toLowerCase()));
        if (req.query.search) {
            const s = req.query.search.toLowerCase();
            items = items.filter(i => (i.gram_panchayat && i.gram_panchayat.toLowerCase().includes(s)) || (i.scheme_name && i.scheme_name.toLowerCase().includes(s)) || (i.work_name && i.work_name.toLowerCase().includes(s)));
        }
        return res.json({ success: true, data: items, count: items.length });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/panchayat-funds/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('panchayat_funds').select('*').eq('id', id).maybeSingle();
            if (!error) {
                if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, data });
            }
            if (!isSchemaError(error)) throw error;
        }

        const item = pfStore.getById(id);
        if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, data: item });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

// POST /api/panchayat-funds — create (admin only)
router.post('/', [auth, admin], async (req, res) => {
    try {
        const record = pickFields(req.body);
        if (req.user) record.updated_by = req.user.email || req.user.id;

        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('panchayat_funds').insert(record).select().single();
            if (!error) {
                return res.status(201).json({ success: true, data });
            }
            if (!isSchemaError(error)) throw error;
        }

        const created = pfStore.create(record);
        return res.status(201).json({ success: true, data: { ...created, id: created._id } });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

// POST /api/panchayat-funds/import — bulk import (admin only)
router.post('/import', [auth, admin], async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ success: false, message: 'No records provided for import' });
        }
        const sanitized = records.map(r => {
            const rec = pickFields(r);
            if (req.user) rec.updated_by = req.user.email || req.user.id;
            return rec;
        });

        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('panchayat_funds').insert(sanitized).select();
            if (!error) {
                return res.status(200).json({ success: true, data, imported: (data || []).length });
            }
            if (!isSchemaError(error)) throw error;
        }

        const imported = sanitized.map(rec => {
            const c = pfStore.create(rec);
            return { ...c, id: c._id };
        });
        return res.status(200).json({ success: true, data: imported, imported: imported.length });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

// PUT /api/panchayat-funds/:id — update (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const { id } = req.params;
        const record = pickFields(req.body);
        record.is_admin_edited = true;
        if (req.user) record.updated_by = req.user.email || req.user.id;

        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('panchayat_funds').update(record).eq('id', id).select().maybeSingle();
            if (!error) {
                if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, data });
            }
            if (!isSchemaError(error)) throw error;
        }

        const updated = pfStore.update(id, record);
        if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, data: { ...updated, id: updated._id } });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

// DELETE /api/panchayat-funds/:id (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const { id } = req.params;
        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('panchayat_funds').delete().eq('id', id).select();
            if (!error) {
                if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Record not found' });
                return res.json({ success: true, message: 'Record deleted' });
            }
            if (!isSchemaError(error)) throw error;
        }

        const deleted = pfStore.delete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
        return res.json({ success: true, message: 'Record deleted' });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

// GET /api/panchayat-funds/export/csv — export as CSV (admin only)
router.get('/export/csv', [auth, admin], async (req, res) => {
    try {
        let records = [];
        if (isConfigured && supabaseAdmin) {
            let query = supabaseAdmin.from('panchayat_funds').select('*');
            if (req.query.district) query = query.eq('district', req.query.district);
            if (req.query.financial_year) query = query.eq('financial_year', req.query.financial_year);
            const { data, error } = await query.order('id', { ascending: true });
            if (!error) {
                records = data || [];
            } else if (!isSchemaError(error)) {
                throw error;
            }
        }

        if (records.length === 0) {
            records = pfStore.getAll();
            if (req.query.district) records = records.filter(i => i.district === req.query.district);
            if (req.query.financial_year) records = records.filter(i => i.financial_year === req.query.financial_year);
        }

        if (records.length === 0) return res.status(404).json({ success: false, message: 'No records to export' });

        const headers = Object.keys(records[0]).filter(k => k !== 'updated_by');
        const csvRows = [headers.join(',')];
        records.forEach(row => {
            csvRows.push(headers.map(h => {
                const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
                return `"${val.replace(/"/g, '""')}"`;
            }).join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="panchayat_funds_export.csv"`);
        return res.send(csvRows.join('\n'));
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
