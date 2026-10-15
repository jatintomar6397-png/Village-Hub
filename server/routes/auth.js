const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getMongoConnected, JsonStore } = require('../config/db');
const { supabaseAdmin, supabaseClient, isConfigured } = require('../config/supabase');

const router = express.Router();
const userStore = new JsonStore('users');
const isProduction = process.env.NODE_ENV === 'production';

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'village_hub_super_secret_jwt_key_2024', { expiresIn: '7d' });
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // 1. Supabase Mode
    if (isConfigured && supabaseAdmin) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: 'user' }
      });

      if (authError) {
        const msg = authError.message.includes('already registered') || authError.message.includes('already exists')
          ? 'User already exists'
          : authError.message;
        return res.status(400).json({ success: false, message: msg });
      }

      // Insert profile record
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        name,
        email,
        role: 'user'
      });

      if (profileError) {
        console.error('Profile insertion error:', profileError.message);
      }

      const token = generateToken(authData.user.id, 'user', email);
      return res.status(201).json({
        success: true,
        data: {
          token,
          user: { id: authData.user.id, name, email, role: 'user' }
        }
      });
    }

    // Production check: do not silently fall back to local storage in production
    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    // 2. Development Fallback (Mongoose or JsonStore)
    const isMongo = getMongoConnected();
    if (isMongo) {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ success: false, message: 'User already exists' });

      user = new User({ name, email, password });
      await user.save();

      const token = generateToken(user._id, user.role, user.email);
      return res.status(201).json({
        success: true,
        data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
      });
    } else {
      const users = userStore.getAll();
      const exists = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (exists) return res.status(400).json({ success: false, message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = { _id: generateId(), name, email, password: hashedPassword, role: 'user', createdAt: new Date() };
      userStore.create(newUser);

      const token = generateToken(newUser._id, newUser.role, newUser.email);
      return res.status(201).json({
        success: true,
        data: { token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // 1. Supabase Mode
    if (isConfigured && supabaseClient) {
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData || !authData.user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Fetch profile
      let role = 'user';
      let name = authData.user.user_metadata?.name || '';

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('name, role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profile) {
        role = profile.role || role;
        name = profile.name || name;
      }

      const token = authData.session ? authData.session.access_token : generateToken(authData.user.id, role, email);
      return res.json({
        success: true,
        data: {
          token,
          user: { id: authData.user.id, name, email: authData.user.email, role }
        }
      });
    }

    // Production check
    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    // 2. Development Fallback
    const isMongo = getMongoConnected();
    if (isMongo) {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = generateToken(user._id, user.role, user.email);
      return res.json({
        success: true,
        data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
      });
    } else {
      const users = userStore.getAll();
      const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = generateToken(user._id, user.role, user.email);
      return res.json({
        success: true,
        data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    if (isConfigured && supabaseAdmin) {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', req.user.id)
        .maybeSingle();

      if (error || !profile) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({
        success: true,
        data: { id: profile.id, name: profile.name, email: profile.email, role: profile.role }
      });
    }

    if (isProduction) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please check Supabase configuration.'
      });
    }

    const isMongo = getMongoConnected();
    if (isMongo) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      const user = userStore.getById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
