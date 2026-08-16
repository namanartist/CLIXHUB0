const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'components');
const appTsxPath = path.join(__dirname, 'App.tsx');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Process className strings
    const regex = /className=(?:\{`|["'])(.*?)(?:`\}|["'])/g;
    
    let modified = content.replace(regex, (match, classString) => {
        let newClassString = classString
            .replace(/bg-\[#111C44\]/g, 'bg-[var(--bg-surface)] glass')
            .replace(/bg-\[#050505\]/g, 'bg-transparent')
            .replace(/bg-\[#0d121d\]/g, 'bg-[var(--bg-main)]')
            .replace(/border-white\/5/g, 'border-[var(--border-color)]')
            .replace(/border-white\/10/g, 'border-[var(--border-color)]')
            .replace(/border-white\/20/g, 'border-[var(--border-color)]')
            .replace(/bg-white\/5/g, 'bg-[var(--primary-soft)]')
            .replace(/bg-white\/10/g, 'bg-[var(--primary-soft)]')
            .replace(/text-slate-500/g, 'text-[var(--text-secondary)]')
            .replace(/text-slate-400/g, 'text-[var(--text-secondary)]')
            .replace(/text-white\/60/g, 'text-[var(--text-secondary)]')
            .replace(/text-white\/20/g, 'text-[var(--text-secondary)] opacity-50')
            .replace(/bg-slate-900/g, 'bg-[var(--bg-surface)]')
            .replace(/bg-slate-800/g, 'bg-[var(--bg-surface)]');

        if (newClassString.includes('text-white')) {
            const keepsWhite = ['bg-primary', 'bg-blue-', 'bg-indigo-', 'bg-rose-', 'bg-emerald-', 'bg-violet-', 'bg-black', 'bg-[#000]', 'btn-premium'];
            if (!keepsWhite.some(bg => newClassString.includes(bg))) {
                newClassString = newClassString.replace(/\btext-white\b/g, 'text-[var(--text-main)]');
            }
        }

        return match.replace(classString, newClassString);
    });

    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

console.log('Starting refactoring...');
traverseDirectory(directoryPath);
if (fs.existsSync(appTsxPath)) {
    processFile(appTsxPath);
}
console.log('Refactoring complete.');
