const { spawn } = require('child_process');
const http = require('http');

console.log('Starting Village Hub server for automated test run...');
const serverProcess = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

function waitForServer(retries = 30, delay = 500) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get('http://localhost:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      });
      req.on('error', retry);
      req.end();

      function retry() {
        if (retries <= 0) {
          reject(new Error('Server did not become ready in time'));
        } else {
          retries--;
          setTimeout(attempt, delay);
        }
      }
    };
    attempt();
  });
}

async function run() {
  try {
    await waitForServer();
    console.log('\nServer is ready and /api/health is responding! Executing test suite...\n');

    const testProc = spawn('node', ['server/test_suite.js'], { stdio: 'inherit' });
    testProc.on('exit', (code) => {
      serverProcess.kill('SIGTERM');
      process.exit(code || 0);
    });
  } catch (err) {
    console.error('Failed to run test:', err.message);
    serverProcess.kill('SIGTERM');
    process.exit(1);
  }
}

run();
