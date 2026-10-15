require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting on API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Serve static frontend files from project root
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/villages', require('./routes/villages'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/stats', require('./routes/stats'));

// Catch-all: serve index.html for any non-API, non-static route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log('\n======================================================================');
        console.log('  VILLAGE HUB — Backend Server');
        console.log('======================================================================');
        console.log(`  Local:  http://localhost:${PORT}`);
        console.log(`  API:    http://localhost:${PORT}/api/stats`);
        console.log('======================================================================\n');
    });
};

startServer();
