// scripts/fix-attributes.js
// Fix: restore spaces between HTML attributes that were merged by icon removal cleanup
const fs = require('fs');
const path = require('path');

const FILES = [
  'public/index.html',
  'public/js/render.js',
  'public/js/checklist.js',
  'public/js/interview.js',
  'public/js/ai-chat.js',
  'public/js/advisor.js',
  'public/js/knowledge-base.js',
  'public/js/application.js',
  'public/styles.css',
  'public/checklist.css',
  'api/deepseek.js',
];

function fixAttributes(text) {
  let r = text;
  
  // Fix 1: closing double-quote followed immediately by an attribute name (word += )
  // pattern: "word=  →  " word=
  r = r.replace(/"([a-zA-Z][a-zA-Z0-9_-]*=)/g, '" $1');
  
  // Fix 2: closing single-quote followed immediately by an attribute name
  r = r.replace(/'([a-zA-Z][a-zA-Z0-9_-]*=)/g, "' $1");
  
  // Fix 3: closing double-quote followed by boolean attribute (no = sign)
  // pattern: "word>  →  " word>  or  "word  →  " word  
  r = r.replace(/"([a-zA-Z][a-zA-Z0-9_-]*)>/g, '" $1>');
  r = r.replace(/'([a-zA-Z][a-zA-Z0-9_-]*)>/g, "' $1>");
  
  // Fix 4: closing double-quote followed by boolean attr then space
  r = r.replace(/"([a-zA-Z][a-zA-Z0-9_-]+) /g, '" $1 ');
  r = r.replace(/'([a-zA-Z][a-zA-Z0-9_-]+) /g, "' $1 ");
  
  // Collapse any double spaces this might create
  r = r.replace(/ {2,}/g, ' ');
  
  return r;
}

let totalChanges = 0;
for (const filePath of FILES) {
  try {
    const fullPath = path.resolve(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) continue;
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = fixAttributes(content);
    
    if (content !== newContent) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      const diff = newContent.length - content.length;
      console.log(`✅ ${filePath} — fixed, +${diff} bytes`);
      totalChanges++;
    } else {
      console.log(`⏭️ ${filePath} — no changes needed`);
    }
  } catch (err) {
    console.error(`❌ ${filePath}: ${err.message}`);
  }
}

console.log(`\n📊 Files fixed: ${totalChanges}/${FILES.length}`);
