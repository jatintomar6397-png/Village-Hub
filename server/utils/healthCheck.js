// Health check script - verifies backend is alive and restarts if needed
const { execSync, spawn } = require('child_process');
const path = require('path');

const BASE = 'http://localhost:5000';
const PROJECT_DIR = path.join(__dirname, '..', '..');

async function checkHealth() {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    try {
        // Test 1: Stats endpoint
        const statsResp = await fetch(`${BASE}/api/stats`);
        const stats = await statsResp.json();
        if (!stats.success) throw new Error('Stats endpoint returned failure');

        // Test 2: Villages endpoint
        const villagesResp = await fetch(`${BASE}/api/villages`);
        const villages = await villagesResp.json();
        if (!villages.success || !villages.data || villages.data.length < 46) {
            throw new Error(`Villages count wrong: ${villages.data?.length}`);
        }

        // Test 3: Auth login
        const loginResp = await fetch(`${BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@villagehub.in', password: 'Admin@VillageHub2024' })
        });
        const login = await loginResp.json();
        if (!login.success || !login.data?.token) throw new Error('Admin login failed');

        // Test 4: Static HTML serving
        const htmlResp = await fetch(`${BASE}/index.html`);
        if (!htmlResp.ok) throw new Error('Static file serving broken');

        console.log(`[${timestamp}] ✅ HEALTHY — Stats: ${stats.data.villages} villages, ${stats.data.complaints} complaints, ${stats.data.users} users`);
        return true;

    } catch (err) {
        console.log(`[${timestamp}] ❌ DOWN — ${err.message}`);
        console.log(`[${timestamp}] 🔄 Attempting restart...`);
        
        try {
            // Try to kill any existing node server on port 5000
            try {
                execSync('cmd /c "for /f \\"tokens=5\\" %a in (\'netstat -aon ^| findstr :5000 ^| findstr LISTENING\') do taskkill /F /PID %a"', { stdio: 'ignore' });
            } catch (e) { /* no process to kill */ }

            // Restart server
            const child = spawn('node', ['server/server.js'], {
                cwd: PROJECT_DIR,
                detached: true,
                stdio: 'ignore'
            });
            child.unref();

            // Wait 3 seconds then verify
            await new Promise(r => setTimeout(r, 3000));

            const verifyResp = await fetch(`${BASE}/api/stats`);
            const verify = await verifyResp.json();
            if (verify.success) {
                console.log(`[${timestamp}] ✅ RESTARTED successfully!`);
                return true;
            }
        } catch (restartErr) {
            console.log(`[${timestamp}] ❌ RESTART FAILED — ${restartErr.message}`);
        }
        return false;
    }
}

checkHealth();
