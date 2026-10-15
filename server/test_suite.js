const BASE = 'http://localhost:5000';
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
        console.log(`  \u2705 ${name}`);
    } catch (err) {
        failCount++;
        console.log(`  \u274c ${name}: ${err.message}`);
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
