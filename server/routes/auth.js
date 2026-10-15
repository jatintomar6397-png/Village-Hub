const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getMongoConnected, JsonStore } = require('../config/db');

const router = express.Router();
const userStore = new JsonStore('users');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'village_hub_secret', { expiresIn: '7d' });
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isMongoConnected = getMongoConnected();
        
        if (isMongoConnected) {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ success: false, message: 'User already exists' });
            
            // Password hashing handled by User model pre-save hook
            user = new User({ name, email, password });
            await user.save();
            
            const token = generateToken(user._id, user.role);
            return res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
        } else {
            const users = userStore.getAll();
            const exists = users.find(u => u.email === email);
            if (exists) return res.status(400).json({ success: false, message: 'User already exists' });
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const newUser = { _id: generateId(), name, email, password: hashedPassword, role: 'user', createdAt: new Date() };
            userStore.create(newUser);
            
            const token = generateToken(newUser._id, newUser.role);
            return res.json({ success: true, data: { token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } } });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const isMongoConnected = getMongoConnected();
        
        if (isMongoConnected) {
            const user = await User.findOne({ email });
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            
            const token = generateToken(user._id, user.role);
            return res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
        } else {
            const users = userStore.getAll();
            const user = users.find(u => u.email && email && u.email.toLowerCase() === email.toLowerCase());
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            
            const token = generateToken(user._id, user.role);
            return res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const isMongoConnected = getMongoConnected();
        
        if (isMongoConnected) {
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
