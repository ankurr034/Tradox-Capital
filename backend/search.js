const fs = require('fs');
const path = require('path');

const targetDirs = ['frontend', 'backend', 'ai-models'];
const searchPatterns = [/Lal\s*Street/i, /TLS/i];
const excludeDirs = ['node_modules', '.next', 'venv', '.git'];
const extenstions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json', '.py'];

function searchFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(searchFiles(fullPath));
            }
        } else {
            if (extenstions.some(ext => fullPath.endsWith(ext))) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                if (searchPatterns.some(pattern => pattern.test(content))) {
                    results.push(fullPath);
                }
            }
        }
    }
    return results;
}

let allResults = [];
targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        allResults = allResults.concat(searchFiles(dir));
    }
});

console.log(allResults.join('\n'));
