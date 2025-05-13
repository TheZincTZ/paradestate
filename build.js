const { execSync } = require('child_process');
const path = require('path');

// Change to client directory
process.chdir(path.join(__dirname, 'client'));

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Run build
console.log('Building React app...');
execSync('CI=false npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 