/**
 * Aggressively remove ALL data-ab CSS rules using line-by-line parsing
 */
const fs = require('fs');
let css = fs.readFileSync('public/styles.css', 'utf8');

// Strategy: find all blocks starting with html[data-ab- and remove them
// including their content up to the matching closing brace
let result = '';
let i = 0;
let inABBlock = false;
let braceDepth = 0;

while (i < css.length) {
  // Check if we're starting a data-ab block
  if (!inABBlock && css.substring(i).startsWith('html[data-ab-')) {
    inABBlock = true;
    braceDepth = 0;
    // Skip rest of this line (selector)
    while (i < css.length && css[i] !== '\n') i++;
    continue;
  }
  
  if (inABBlock) {
    if (css[i] === '{') braceDepth++;
    if (css[i] === '}') {
      braceDepth--;
      if (braceDepth <= 0) {
        // End of block - also skip trailing newlines
        inABBlock = false;
        i++;
        while (i < css.length && css[i] === '\n') i++;
        continue;
      }
    }
    i++;
    continue;
  }
  
  result += css[i];
  i++;
}

// Remove empty media query blocks that might be left
result = result.replace(/@media[^{]*\{\s*\}/g, '');

// Remove any inline /* data-ab */ comments
result = result.replace(/\/\*\s*data-ab[^*]*\*\//g, '');

// Clean up excess blank lines
result = result.replace(/\n{4,}/g, '\n\n\n');

fs.writeFileSync('public/styles.css', result, 'utf8');

const remaining = (result.match(/data-ab/g) || []).length;
const removed = css.length - result.length;
console.log(`Removed ${removed} bytes`);
console.log(`Remaining data-ab: ${remaining}`);
console.log(remaining === 0 ? 'CLEAN' : 'ISSUES');
