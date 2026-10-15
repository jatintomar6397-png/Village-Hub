(function() {
    'use strict';
    
    const BASE = window.location.origin;
    const TOKEN_KEY = 'vh_token';
    const USER_KEY = 'vh_user';

    // Helper: make fetch requests with auth header
    const request = async (method, endpoint, body = null) => {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const opts = { method, headers };
        if (body && method !== 'GET') opts.body = JSON.stringify(body);
        
        const resp = await fetch(`${BASE}${endpoint}`, opts);
        const data = await resp.json();
        
        if (!resp.ok) throw new Error(data.message || 'Request failed');
        return data;
    };

    window.VillageHubAPI = {
        // --- Auth ---
        getToken: () => localStorage.getItem(TOKEN_KEY),
        
        getUser: () => {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        },
        
        clearToken: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        },
        
        login: async (email, password) => {
            const result = await request('POST', '/api/auth/login', { email, password });
            if (result.success && result.data) {
                localStorage.setItem(TOKEN_KEY, result.data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
            }
            return result;
        },
        
        signup: async (name, email, password) => {
            const result = await request('POST', '/api/auth/signup', { name, email, password });
            if (result.success && result.data) {
                localStorage.setItem(TOKEN_KEY, result.data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
            }
            return result;
        },
        
        logout: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.reload();
        },
        
        // --- Villages ---
        getVillages: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return request('GET', `/api/villages${query ? '?' + query : ''}`);
        },
        
        createVillage: (data) => request('POST', '/api/villages', data),
        
        updateVillage: (id, data) => request('PUT', `/api/villages/${id}`, data),
        
        deleteVillage: (id) => request('DELETE', `/api/villages/${id}`),
        
        // --- Complaints ---
        createComplaint: (data) => request('POST', '/api/complaints', data),
        
        getComplaints: () => request('GET', '/api/complaints'),
        
        trackComplaint: (query) => request('GET', `/api/complaints/track/${encodeURIComponent(query)}`),
        
        updateComplaintStatus: (id, status) => request('PUT', `/api/complaints/${id}/status`, { status }),
        
        // --- Applications ---
        createApplication: (data) => request('POST', '/api/applications', data),
        
        getApplications: () => request('GET', '/api/applications'),
        
        updateApplicationStatus: (id, status) => request('PUT', `/api/applications/${id}/status`, { status })
    };
})();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const secret = process.env.JWT_SECRET || 'village_hub_super_secret_jwt_key_2024';
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};

module.exports = auth;
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Village = require('../models/Village');
const { connectDB, getMongoConnected, JsonStore } = require('../config/db');

const VILLAGES = [
    { name: "Lakhan", district: "Hapur", tehsil: "Simbhawali", population: "1,520", problems: "Jal Jeevan Mission RO Drinking Water & Pipe Leakage", status: "Completed", progress: 100, latitude: 28.7300, longitude: 77.7800 },
    { name: "Hindalpur", district: "Hapur", tehsil: "Hapur", population: "2,240", problems: "Primary School Classroom Infrastructure & STEM Lab", status: "In Progress", progress: 70, latitude: 28.7050, longitude: 77.7550 },
    { name: "Galand", district: "Hapur", tehsil: "Dhaulana", population: "3,150", problems: "Solid Waste Segregation & Solar Streetlighting Grid", status: "Completed", progress: 100, latitude: 28.6900, longitude: 77.7100 },
    { name: "Sapnawat", district: "Hapur", tehsil: "Dhaulana", population: "3,810", problems: "Primary Health Sub-Center & Emergency Ambulance Access", status: "Under Assessment", progress: 25, latitude: 28.6700, longitude: 77.7400 },
    { name: "Basatpur", district: "Hapur", tehsil: "Hapur", population: "1,180", problems: "Village Solar Micro-Grid Electrification", status: "Completed", progress: 100, latitude: 28.7150, longitude: 77.7900 },
    { name: "Masota", district: "Hapur", tehsil: "Dhaulana", population: "940", problems: "Amrit Sarovar Pond Rejuvenation & Rainwater Filtration", status: "Under Assessment", progress: 15, latitude: 28.7400, longitude: 77.7200 },
    { name: "Anwarpur", district: "Hapur", tehsil: "Simbhawali", population: "1,760", problems: "Digital Anganwadi & Child Nutrition Center", status: "Completed", progress: 100, latitude: 28.7500, longitude: 77.7600 },
    { name: "Atrolli", district: "Hapur", tehsil: "Hapur", population: "1,320", problems: "Solar Powered Drip Irrigation Pump Set", status: "Under Assessment", progress: 30, latitude: 28.6800, longitude: 77.8100 },
    { name: "Sikhera", district: "Hapur", tehsil: "Hapur", population: "2,890", problems: "Renewable Biomass & Solar Power Grid", status: "In Progress", progress: 75, latitude: 28.7600, longitude: 77.7100 },
    { name: "Garhmukteshwar", district: "Hapur", tehsil: "Garhmukteshwar", population: "8,450", problems: "Ganges Riverfront Sewage Treatment & Water Sanitation", status: "Completed", progress: 100, latitude: 28.7833, longitude: 78.0833 },
    { name: "Brajghat", district: "Hapur", tehsil: "Garhmukteshwar", population: "4,200", problems: "Eco-Tourism Streetlighting & Ghat Sanitation", status: "In Progress", progress: 80, latitude: 28.7900, longitude: 78.1000 },
    { name: "Simbhawali", district: "Hapur", tehsil: "Simbhawali", population: "6,700", problems: "Sugar Belt Farmers Agro-Tech & Soil Testing Hub", status: "In Progress", progress: 65, latitude: 28.7167, longitude: 77.9000 },
    { name: "Bhowapur", district: "Ghaziabad", tehsil: "Ghaziabad", population: "4,500", problems: "Underground Drainage System & Sewer Line Upgrade", status: "Completed", progress: 100, latitude: 28.6500, longitude: 77.3800 },
    { name: "Chijjarsi", district: "Ghaziabad", tehsil: "Ghaziabad", population: "6,200", problems: "Public Digital Library & Youth Vocational Skills Center", status: "In Progress", progress: 85, latitude: 28.6320, longitude: 77.3750 },
    { name: "Dasna Rural", district: "Ghaziabad", tehsil: "Ghaziabad", population: "8,900", problems: "Community Water ATM & Historic Pond Desilting", status: "Completed", progress: 100, latitude: 28.6800, longitude: 77.5300 },
    { name: "Muradnagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", population: "9,200", problems: "Upper Ganges Canal Water Filtration & Bio-Filter", status: "In Progress", progress: 70, latitude: 28.7800, longitude: 77.5000 },
    { name: "Modinagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", population: "11,500", problems: "Women Self-Help Group (SHG) Handloom Training Center", status: "Completed", progress: 100, latitude: 28.8333, longitude: 77.5833 },
    { name: "Loni Rural", district: "Ghaziabad", tehsil: "Loni", population: "14,200", problems: "Air Pollution Dust Barrier & Green Belt Plantation", status: "Under Assessment", progress: 40, latitude: 28.7500, longitude: 77.2833 },
    { name: "Patla", district: "Ghaziabad", tehsil: "Modi Nagar", population: "4,900", problems: "Model Anganwadi Infrastructure & Infant Care Unit", status: "Completed", progress: 100, latitude: 28.8600, longitude: 77.5200 },
    { name: "Behta Hajipur", district: "Ghaziabad", tehsil: "Loni", population: "12,400", problems: "Municipal Solid Waste Management Plant", status: "Completed", progress: 100, latitude: 28.7200, longitude: 77.2900 },
    { name: "Khera", district: "Meerut", tehsil: "Meerut", population: "2,400", problems: "Rural Youth Sports Complex & Skill Center", status: "Completed", progress: 100, latitude: 28.9800, longitude: 77.7000 },
    { name: "Hastinapur Rural", district: "Meerut", tehsil: "Mawana", population: "8,200", problems: "Wildlife Sanctuary Buffer Road & Eco-Sanitation", status: "In Progress", progress: 75, latitude: 29.1700, longitude: 78.0200 },
    { name: "Sardhana Rural", district: "Meerut", tehsil: "Mawana", population: "6,500", problems: "Organic Farming Training & Soil Health Center", status: "In Progress", progress: 60, latitude: 29.1500, longitude: 78.0000 },
    { name: "Meerut Rural", district: "Meerut", tehsil: "Meerut", population: "10,800", problems: "Rural Health Clinic & Telemedicine Hub", status: "Completed", progress: 100, latitude: 28.9800, longitude: 77.7000 },
    { name: "Daurala", district: "Meerut", tehsil: "Daurala", population: "3,600", problems: "Water Conservation Ponds & Drip Irrigation System", status: "Under Assessment", progress: 20, latitude: 29.0500, longitude: 77.7500 }
];const BASE = 'http://localhost:5000';
let passCount = 0;
let failCount = 0;
let adminToken = '';
let userToken = '';
let testVillageId = '';
let testComplaintId = '';
let testComplaintDbId = '';
let testAppId = '';

async function request(method, path, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const resp = await fetch(`${BASE}${path}`, opts);
    let data;
    try {
        data = await resp.json();
    } catch (e) {
        data = null;
    }
    return { status: resp.status, data };
}

async function test(name, fn) {
    try {
        await fn();
        passCount++;
        console.log(`  ✅ ${name}`);
    } catch (err) {
        failCount++;
        console.log(`  ❌ ${name}: ${err.message}`);
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

async function runTests() {
    console.log('Starting End-to-End Test Suite...\n');

    // 1. Stats
    await test('Stats: GET /api/stats returns success', async () => {
        const { status, data } = await request('GET', '/api/stats');
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.success, 'Expected success true');
        assert(data.data.villages >= 46, `Expected >= 46 villages, got ${data.data.villages}`);
    });

    // 2. Signup
    const testEmail = `testuser${Date.now()}@example.com`;
    await test('Signup: POST /api/auth/signup with test user', async () => {
        const { status, data } = await request('POST', '/api/auth/signup', {
            name: 'Test User',
            email: testEmail,
            password: 'Password123'
        });
        assert(status === 200 || status === 201, `Expected 200/201, got ${status}`);
        assert(data && data.success, 'Expected success true');
        assert(data.data && data.data.token, 'Expected token in data.data');
        assert(data.data.user && data.data.user.email === testEmail, 'Expected user email match');
        userToken = data.data.token;
    });

    // 3. Duplicate signup
    await test('Duplicate signup: POST /api/auth/signup with same email', async () => {
        const { status } = await request('POST', '/api/auth/signup', {
            name: 'Test User',
            email: testEmail,
            password: 'Password123'
        });
        assert(status === 400 || status === 409, `Expected 400 or 409, got ${status}`);
    });

    // 4. Admin login
    await test('Login: POST /api/auth/login with admin credentials', async () => {
        const { status, data } = await request('POST', '/api/auth/login', {
            email: 'admin@villagehub.in',
            password: 'Admin@VillageHub2024'
        });
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.success, 'Expected success true');
        assert(data.data && data.data.token, 'Expected token in data.data');
        assert(data.data.user.role === 'admin', 'Expected admin role');
        adminToken = data.data.token;
    });

    // 5. Get profile
    await test('Get profile: GET /api/auth/me with userToken', async () => {
        const { status, data } = await request('GET', '/api/auth/me', null, userToken);
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.data && data.data.email === testEmail, 'Expected profile with matching email');
    });

    // 6. List villages
    await test('List villages: GET /api/villages, assert count >= 46', async () => {
        const { status, data } = await request('GET', '/api/villages');
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.data && data.data.length >= 46, `Expected >= 46 villages, got ${data.data.length}`);
    });

    // 7. Filter villages
    await test('Filter villages: GET /api/villages?district=Hapur', async () => {
        const { status, data } = await request('GET', '/api/villages?district=Hapur');
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.data && data.data.length > 0, 'Expected some Hapur villages');
        const allHapur = data.data.every(v => v.district === 'Hapur');
        assert(allHapur, 'Expected all returned villages to be in Hapur');
    });

    // 8. Create village (admin)
    await test('Create village (admin): POST /api/villages with adminToken', async () => {
        const { status, data } = await request('POST', '/api/villages', {
            name: 'Test Village',
            district: 'Test District',
            tehsil: 'Test Tehsil',
            population: '1,000',
            problems: 'Test focus area',
            status: 'Under Assessment',
            progress: 50,
            latitude: 28.0000,
            longitude: 77.0000
        }, adminToken);
        assert(status === 200 || status === 201, `Expected 200/201, got ${status}`);
        assert(data && data.data, 'Expected village data');
        testVillageId = data.data._id || data.data.id;
        assert(testVillageId, 'Expected village ID');
    });

    // 9. Create village (no auth)
    await test('Create village (no auth): POST /api/villages without token, expect 401', async () => {
        const { status } = await request('POST', '/api/villages', {
            name: 'Unauthorized Village',
            district: 'None'
        });
        assert(status === 401 || status === 403, `Expected 401 or 403, got ${status}`);
    });

    // 10. Update village
    await test('Update village: PUT /api/villages/:id with adminToken', async () => {
        if (!testVillageId) throw new Error('No village ID to update');
        const { status, data } = await request('PUT', `/api/villages/${testVillageId}`, {
            population: '2,000'
        }, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.data, 'Expected updated village data');
    });

    // 11. Delete village
    await test('Delete village: DELETE /api/villages/:id with adminToken', async () => {
        if (!testVillageId) throw new Error('No village ID to delete');
        const { status } = await request('DELETE', `/api/villages/${testVillageId}`, null, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
    });

    // 12. Submit complaint
    await test('Submit complaint: POST /api/complaints', async () => {
        const { status, data } = await request('POST', '/api/complaints', {
            name: 'Complainant Test',
            phone: '1234567890',
            district: 'Hapur',
            tehsil: 'Hapur',
            village: 'Galand',
            category: 'Water Supply',
            description: 'No water supply in village'
        });
        assert(status === 200 || status === 201, `Expected 200/201, got ${status}`);
        assert(data && data.data, 'Expected complaint data');
        testComplaintId = data.data.complaintId;
        testComplaintDbId = data.data._id || data.data.id;
        assert(testComplaintId, `Expected complaintId (CMP-XXXX), got: ${JSON.stringify(data.data)}`);
    });

    // 13. Track complaint
    await test('Track complaint: GET /api/complaints/track/:complaintId', async () => {
        if (!testComplaintId) throw new Error('No complaint ID to track');
        const { status, data } = await request('GET', `/api/complaints/track/${testComplaintId}`);
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && data.data && data.data.length > 0, 'Expected at least one complaint');
        assert(data.data[0].complaintId === testComplaintId, 'Expected tracked complaint ID to match');
    });

    // 14. Get complaints (admin)
    await test('Get complaints (admin): GET /api/complaints with adminToken', async () => {
        const { status, data } = await request('GET', '/api/complaints', null, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && Array.isArray(data.data), 'Expected array of complaints');
    });

    // 15. Update complaint status
    await test('Update complaint status: PUT /api/complaints/:id/status with adminToken', async () => {
        const id = testComplaintDbId || testComplaintId;
        if (!id) throw new Error('No complaint ID to update');
        const { status } = await request('PUT', `/api/complaints/${id}/status`, {
            status: 'Resolved'
        }, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
    });

    // 16. Submit application
    await test('Submit application: POST /api/applications', async () => {
        const { status, data } = await request('POST', '/api/applications', {
            name: 'Volunteer Test',
            email: 'volunteer@test.com',
            phone: '0987654321',
            village: 'Galand',
            requestedRole: 'Youth Leader',
            message: 'I want to help my community'
        });
        assert(status === 200 || status === 201, `Expected 200/201, got ${status}`);
        assert(data && data.data, 'Expected application data');
        testAppId = data.data._id || data.data.id;
        assert(testAppId, 'Expected application ID');
    });

    // 17. Get applications (admin)
    await test('Get applications (admin): GET /api/applications with adminToken', async () => {
        const { status, data } = await request('GET', '/api/applications', null, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
        assert(data && Array.isArray(data.data), 'Expected array of applications');
    });

    // 18. Update application status
    await test('Update application status: PUT /api/applications/:id/status with adminToken', async () => {
        if (!testAppId) throw new Error('No application ID to test update');
        const { status } = await request('PUT', `/api/applications/${testAppId}/status`, {
            status: 'Approved'
        }, adminToken);
        assert(status === 200, `Expected 200, got ${status}`);
    });

    console.log(`\n--- Test Summary ---`);
    console.log(`Total: ${passCount + failCount}`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    
    if (failCount > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests();