const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MediCare AI Monorepo (Backend + Frontend)...');

const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nStopping servers...');
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
