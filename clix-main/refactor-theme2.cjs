const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'components');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Process className strings
    const regex = /className=(?:\{`|["'])(.*?)(?:`\}|["'])/g;
    
    let modified = content.replace(regex, (match, classString) => {
        let newClassString = classString
            .replace(/bg-(slate|gray|zinc|neutral|stone)-900/g, 'bg-[var(--bg-surface)]')
            .replace(/bg-(slate|gray|zinc|neutral|stone)-800/g, 'bg-[var(--bg-surface)]')
            .replace(/border-(slate|gray|zinc|neutral|stone)-800/g, 'border-[var(--border-color)]')
            .replace(/border-(slate|gray|zinc|neutral|stone)-700/g, 'border-[var(--border-color)]')
            .replace(/text-(slate|gray|zinc|neutral|stone)-400/g, 'text-[var(--text-secondary)]')
            .replace(/text-(slate|gray|zinc|neutral|stone)-300/g, 'text-[var(--text-secondary)]');

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

console.log('Starting refactoring 2...');
traverseDirectory(directoryPath);
console.log('Refactoring 2 complete.');
