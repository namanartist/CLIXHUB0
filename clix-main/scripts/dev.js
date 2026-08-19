import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting MITS CCMS Backend Server and Frontend Dev Server...\n');

const server = spawn(process.execPath, ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
});

function findViteBin(startDir) {
  let currentDir = startDir;
  while (true) {
    const candidate = path.join(currentDir, 'node_modules', 'vite', 'bin', 'vite.js');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }
  return null;
}

const viteBin = findViteBin(rootDir);
const vite = viteBin
  ? spawn(process.execPath, [viteBin], {
      cwd: rootDir,
      stdio: 'inherit',
    })
  : spawn('npx', ['vite'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    });

const cleanup = () => {
  try {
    server.kill();
    vite.kill();
  } catch (e) {}
};

process.on('SIGINT', () => { cleanup(); process.exit(); });
process.on('SIGTERM', () => { cleanup(); process.exit(); });

