const fs = require('fs');
const path = require('path');

const targetDirs = ['frontend', 'backend', 'ai-models'];
const searchPatterns = [
    { name: 'Lal Street', regex: /Lal\s*Street/i },
    { name: 'TLS', regex: /\bTLS\b/g },
    { name: 'LSII', regex: /\bLSII\b/g },
    { name: 'Email', regex: /[\w.-]+@thelalstreet\.com/i },
    { name: 'Domain', regex: /thelalstreet\.com/i }
];
const excludeDirs = ['node_modules', '.next', 'venv', '.git'];
const extenstions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json', '.py'];

let auditLog = {};

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.includes(file)) {
                searchFiles(fullPath);
            }
        } else {
            if (extenstions.some(ext => fullPath.endsWith(ext))) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                
                searchPatterns.forEach(pattern => {
                    if (pattern.regex.test(content)) {
                        if (!auditLog[fullPath]) auditLog[fullPath] = [];
                        if (!auditLog[fullPath].includes(pattern.name)) {
                            auditLog[fullPath].push(pattern.name);
                        }
                    }
                });
            }
        }
    }
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        searchFiles(dir);
    }
});

console.log(JSON.stringify(auditLog, null, 2));
