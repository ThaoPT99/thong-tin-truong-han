// scripts/cleanup-icons.js — Pass 2: clean up whitespace and empty elements
const fs = require('fs');
const path = require('path');

const FILES = [
  'public/js/checklist.js',
  'public/js/render.js',
  'public/js/interview.js',
  'public/js/ai-chat.js',
  'public/js/advisor.js',
  'public/js/knowledge-base.js',
  'public/js/application.js',
  'public/index.html',
  'api/deepseek.js',
  'public/styles.css',
  'public/checklist.css',
];

function cleanup(text) {
  let r = text;
  
  // 1. Fix leading space after opening tag: `> text` -> `>text`
  r = r.replace(/>\s+([^\s<])/g, '>$1');
  
  // 2. Fix trailing space before closing tag: `text </` -> `text</`
  r = r.replace(/\s+<\//g, '</');
  
  // 3. Fix leading space in attribute values: value=" text" -> value="text"
  r = r.replace(/="\s+/g, '="');
  
  // 4. Fix trailing space in attribute values: value="text " -> value="text"
  r = r.replace(/\s+"/g, '"');
  
  // 5. Remove empty spans that had only emoji: <span></span>
  r = r.replace(/<span>\s*<\/span>/g, '');
  
  // 6. Fix: `>  <` cases (space between tags)
  r = r.replace(/>\s+</g, '><');
  
  // 7. Fix step icons that are now empty — replace with ''
  // In STEPS array, icon: '' should not have a space
  r = r.replace(/icon:\s*''/g, "icon: ''");
  
  // 8. Fix CSS content: '' (was content: 'emoji')
  // Already valid, no change needed
  
  // 9. Remove leading spaces in template literal content after ${...} 
  // e.g., `${done ? '✓' : step.icon} ` -> only if followed by closing brace
  // This is tricky, skip for now
  
  return r;
}

let totalChanges = 0;
for (const filePath of FILES) {
  try {
    const fullPath = path.resolve(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) continue;
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = cleanup(content);
    
    if (content !== newContent) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ ${filePath} — cleaned`);
      totalChanges++;
    } else {
      console.log(`⏭️ ${filePath} — no changes`);
    }
  } catch (err) {
    console.error(`❌ ${filePath}: ${err.message}`);
  }
}

console.log(`\n📊 Files cleaned: ${totalChanges}/${FILES.length}`);
