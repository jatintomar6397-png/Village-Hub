require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { connectDB, getMongoConnected } = require('./config/db');
const { isConfigured, testConnection } = require('./config/supabase');

const app = express();

// Trust reverse proxy (Render / Cloudflare) so req.ip is the actual client IP
app.set('trust proxy', 1);

// Configurable CORS
const rawAllowed = process.env.ALLOWED_ORIGINS || '*';
const allowedOrigins = rawAllowed.split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl, same-origin)
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (safe reporting, no secrets exposed)
app.get('/api/health', async (req, res) => {
    let dbStatus = {
        provider: isConfigured ? 'supabase' : (getMongoConnected() ? 'mongodb' : 'json_fallback'),
        connected: false
    };

    if (isConfigured) {
        const conn = await testConnection();
        dbStatus.connected = conn.connected;
    } else if (getMongoConnected()) {
        dbStatus.connected = true;
    } else {
        dbStatus.connected = true; // Local JSON development storage active
    }

    res.json({
        success: true,
        status: 'healthy',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        database: dbStatus
    });
});

// Rate limiting on API routes (safe threshold: 2000 requests per 15 min; skip authenticated admin)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return Boolean(req.headers.authorization || req.path === '/health' || req.path === '/api/health');
    },
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

// New Module Routes
app.use('/api/kisan', require('./routes/kisan'));
app.use('/api/education', require('./routes/education'));
app.use('/api/panchayat-funds', require('./routes/panchayatFunds'));
app.use('/api/settings', require('./routes/settings'));

// Catch-all: serve index.html for any non-API, non-static route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler (safe, no stack traces leaked)
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    if (!isConfigured) {
        // In local mode without Supabase, initialize MongoDB or fallback to JsonStore
        await connectDB();
    } else {
        console.log('Supabase mode active.');
    }

    app.listen(PORT, HOST, () => {
        console.log('\n======================================================================');
        console.log('  VILLAGE HUB — Backend Server');
        console.log('======================================================================');
        console.log(`  Host:   ${HOST}`);
        console.log(`  Port:   ${PORT}`);
        console.log(`  Local:  http://localhost:${PORT}`);
        console.log(`  Health: http://localhost:${PORT}/api/health`);
        console.log(`  API:    http://localhost:${PORT}/api/stats`);
        console.log('======================================================================\n');
    });
};

startServer();
