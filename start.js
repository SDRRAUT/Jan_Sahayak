import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isWin = process.platform === 'win32';

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[32m%s\x1b[0m', '   JanSahayak Platform Startup (localhost:3737)   ');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

// 1. Start Backend API Server
console.log('\x1b[33m%s\x1b[0m', '📡 Starting backend API server on port 3001...');
const backend = spawn(process.execPath, ['server/index.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

backend.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Backend failed to start:', err.message);
});

// 2. Start Vite Dev Server on port 3737
console.log('\x1b[32m%s\x1b[0m', '⚡ Starting frontend on http://localhost:3737 ...\n');
const viteBin = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn(process.execPath, [viteBin, '--port', '3737'], {
  stdio: 'inherit',
  cwd: __dirname
});

frontend.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Frontend failed to start:', err.message);
});

// Graceful cleanup on termination
function cleanup() {
  console.log('\n\x1b[33m%s\x1b[0m', 'Stopping JanSahayak servers...');
  try {
    if (isWin) {
      if (backend.pid) spawn('taskkill', ['/pid', backend.pid, '/f', '/t']);
      if (frontend.pid) spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
    } else {
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
    }
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
