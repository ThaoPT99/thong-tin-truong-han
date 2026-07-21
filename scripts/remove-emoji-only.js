/**
 * Remove ONLY emoji characters from public/index.html.
 * Does NOT modify whitespace, HTML structure, or any other content.
 * Safe for restoring the file after git checkout from pre-icon-removal version.
 */
const fs = require('fs');

const filePath = 'public/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// Count and remove emoji using regex that matches emoji codepoints
// This matches standard emoji and variation selectors
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{231A}-\u{23FF}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

const originalLength = html.length;
const matches = html.match(emojiRegex);
const emojiCount = matches ? matches.length : 0;

html = html.replace(emojiRegex, '');

fs.writeFileSync(filePath, html, 'utf8');

const removedBytes = originalLength - html.length;
console.log(`Removed ${emojiCount} emoji characters (${removedBytes} bytes)`);
console.log(`File size: ${html.length} bytes`);

// Verify no structural damage
const oScripts = (html.match(/<script\b/g) || []).length;
const cScripts = (html.match(/<\/script>/g) || []).length;
const oDivs = (html.match(/<div(?:\s[^>]*)?>/g) || []).length;
const cDivs = (html.match(/<\/div>/g) || []).length;
const oIframes = (html.match(/<iframe\b/g) || []).length;
const cIframes = (html.match(/<\/iframe>/g) || []).length;

console.log('\n=== Structure Verification ===');
console.log(`Script tags: ${oScripts} open, ${cScripts} close → ${oScripts === cScripts ? 'OK' : 'MISMATCH!'}`);
console.log(`Div tags: ${oDivs} open, ${cDivs} close → ${oDivs === cDivs ? 'OK' : 'MISMATCH!'}`);
console.log(`Iframe tags: ${oIframes} open, ${cIframes} close → ${oIframes === cIframes ? 'OK' : 'MISMATCH!'}`);
console.log(`Has DOCTYPE: ${html.startsWith('<!DOCTYPE html>') ? 'YES' : 'NO'}`);
console.log(`Has </head>: ${html.includes('</head>') ? 'YES' : 'NO'}`);
console.log(`Ends with </html>: ${html.trim().endsWith('</html>') ? 'YES' : 'NO'}`);
