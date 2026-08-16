import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting MITS CCMS Backend Server and Frontend Dev Server...\n');

const server = spawn(process.execPath, ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
});

const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const vite = spawn(process.execPath, [viteBin], {
  cwd: rootDir,
  stdio: 'inherit',
});

const cleanup = () => {
  try {
    server.kill();
    vite.kill();
  } catch (e) {}
};

process.on('SIGINT', () => { cleanup(); process.exit(); });
process.on('SIGTERM', () => { cleanup(); process.exit(); });
