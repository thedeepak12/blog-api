import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Cleaning dist directory...');
fs.removeSync(join(__dirname, 'dist'));

console.log('Installing admin dependencies...');
execSync('npm install --prefix admin', { stdio: 'inherit' });

console.log('Building admin app...');
execSync('npm run build --prefix admin', { stdio: 'inherit' });

console.log('Installing blog dependencies...');
execSync('npm install --prefix blog', { stdio: 'inherit' });

console.log('Building blog app...');
execSync('npm run build --prefix blog', { stdio: 'inherit' });

console.log('Copying _redirects file...');
fs.copyFileSync(
  join(__dirname, '_redirects'),
  join(__dirname, 'dist', '_redirects')
);
