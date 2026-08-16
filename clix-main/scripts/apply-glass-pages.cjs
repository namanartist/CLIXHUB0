/**
 * Apply uni-pill-card glass styling across dashboard pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'components', 'pages');

const REPLACEMENTS = [
  [/bg-\[var\(--bg-surface\)\]\s+glass/g, 'uni-pill-card'],
  [/bg-\[var\(--bg-surface\)\]\s+glass\/50/g, 'uni-pill-card'],
  [/rounded-\[2rem\]\s+border\s+border-\[var\(--border-color\)\]/g, 'uni-pill-card border border-[var(--border-color)]'],
  [/rounded-\[2\.5rem\]\s+border\s+border-\[var\(--border-color\)\]/g, 'uni-pill-card border border-[var(--border-color)]'],
  [/rounded-\[3rem\]\s+border\s+border-\[var\(--border-color\)\]/g, 'uni-pill-card border border-[var(--border-color)]'],
  [/rounded-\[1\.5rem\]\s+border\s+border-\[var\(--border-color\)\]/g, 'uni-pill-card border border-[var(--border-color)]'],
  [/rounded-2xl\s+bg-\[var\(--bg-surface\)\]/g, 'uni-pill-card'],
  [/rounded-3xl\s+bg-\[var\(--bg-surface\)\]/g, 'uni-pill-card'],
  [/rounded-\[3\.5rem\]\s+border/g, 'uni-pill-card border'],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, 'utf8');
  const orig = src;
  for (const [re, rep] of REPLACEMENTS) {
    src = src.replace(re, rep);
  }
  if (src !== orig) {
    fs.writeFileSync(file, src);
    changed++;
    console.log('Updated:', path.relative(process.cwd(), file));
  }
}
console.log(`Done. ${changed} files updated.`);
