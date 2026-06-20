const fs = require('fs');
const path = require('path');

const targetDirs = ['frontend/src', 'backend', 'ai-models'];
const extensions = ['.tsx', '.ts', '.js', '.jsx', '.json', '.html', '.md', '.py'];

const replacements = [
    { regex: /The Lal Street AI/gi, replace: "Tradox Capital AI" },
    { regex: /The Lal Street/gi, replace: "Tradox Capital" },
    { regex: /Lal Street AI/gi, replace: "Tradox Capital AI" },
    { regex: /Lal Street/gi, replace: "Tradox Capital" },
    { regex: /\bLSII\b/g, replace: "Tradox" },
    { regex: /\bTLS\b/g, replace: "TC" },
    { regex: /[\w.-]+@thelalstreet\.com/gi, replace: "support@tradoxcapital.com" },
    { regex: /thelalstreet\.com/gi, replace: "tradoxcapital.com" }
];

let modifiedFiles = [];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    replacements.forEach(r => {
        content = content.replace(r.regex, r.replace);
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedFiles.push(filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.next', 'venv', '.git'].includes(file)) {
                traverse(fullPath);
            }
        } else {
            if (extensions.some(ext => fullPath.endsWith(ext))) {
                replaceInFile(fullPath);
            }
        }
    }
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        traverse(dir);
    }
});

console.log("Modified files:\n" + modifiedFiles.join('\n'));
