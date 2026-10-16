/**
 * Village Hub — Site Settings API Routes
 * Handles: Logo/branding management, site configuration
 */
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { JsonStore } = require('../config/db');

const router = express.Router();
const settingsStore = new JsonStore('site_settings');

const isSchemaError = (err) => err && (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache')));

// GET /api/settings — get all site settings (public)
router.get('/', async (req, res) => {
    try {
        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin.from('site_settings').select('setting_key, setting_value');
            if (!error) {
                const settings = {};
                (data || []).forEach(s => { settings[s.setting_key] = s.setting_value; });
                return res.json({ success: true, data: settings });
            }
            if (!isSchemaError(error)) throw error;
        }

        // Fallback to local JsonStore
        const items = settingsStore.getAll();
        const settings = { logo_url: 'assets/logo.png', site_name: 'Village Hub' };
        items.forEach(s => { settings[s.setting_key] = s.setting_value; });
        return res.json({ success: true, data: settings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/settings/:key — update a setting (admin only)
router.put('/:key', [auth, admin], async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        if (value === undefined) {
            return res.status(400).json({ success: false, message: 'Value is required' });
        }

        const updateData = {
            setting_key: key,
            setting_value: value,
            updated_by: req.user.email || req.user.id
        };

        if (isConfigured && supabaseAdmin) {
            const { data, error } = await supabaseAdmin
                .from('site_settings')
                .update({ setting_value: value, updated_by: updateData.updated_by })
                .eq('setting_key', key)
                .select()
                .maybeSingle();

            if (!error) {
                if (data) return res.json({ success: true, data });
                const { data: newData, error: insertErr } = await supabaseAdmin
                    .from('site_settings')
                    .insert(updateData)
                    .select()
                    .single();
                if (!insertErr) return res.json({ success: true, data: newData });
                if (!isSchemaError(insertErr)) throw insertErr;
            } else if (!isSchemaError(error)) {
                throw error;
            }
        }

        // Fallback to JsonStore
        const items = settingsStore.getAll();
        const existing = items.find(i => i.setting_key === key);
        if (existing) {
            const updated = settingsStore.update(existing._id || existing.id, updateData);
            return res.json({ success: true, data: updated });
        } else {
            const created = settingsStore.create(updateData);
            return res.json({ success: true, data: created });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
