import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';  // <-- change here

// Folder to scan (your src folder)
const SRC_DIR = path.resolve('./src');

// Get all JS/JSX/TS/TSX files
const files = globSync(`${SRC_DIR}/**/*.{js,jsx,ts,tsx}`, { nodir: true });

let errors = [];

function checkImport(file, importPath) {
  const dir = path.dirname(file);
  const fullPath = path.resolve(dir, importPath);

  // Split into parts and check each folder/file
  const parts = fullPath.split(path.sep);
  let current = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const list = fs.existsSync(current) ? fs.readdirSync(current) : [];
    const found = list.find(f => f === parts[i]);
    if (!found) {
      errors.push(`${file} → import path case mismatch: ${importPath}`);
      break;
    }
    current = path.join(current, found);
  }
}

// Scan each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const regex = /import\s+(?:[\w{}\s,*]+)\s+from\s+['"](.+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    // Only check relative imports
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      checkImport(file, importPath);
    }
  }
}

if (errors.length === 0) {
  console.log('✅ All imports match case exactly.');
} else {
  console.log('❌ Case mismatches found:');
  errors.forEach(e => console.log(e));
  process.exit(1);
}
