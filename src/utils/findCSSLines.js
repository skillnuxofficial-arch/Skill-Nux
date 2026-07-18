import fs from 'fs';

const content = fs.readFileSync('src/index.css', 'utf-8');
const lines = content.split('\n');

console.log("Searching for sidebar in index.css:");
lines.forEach((line, idx) => {
  if (line.includes('.sidebar') || line.includes('.main-content') || line.includes('.dashboard-container')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
