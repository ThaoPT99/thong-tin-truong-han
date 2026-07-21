const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');

const openScripts = (h.match(/<script\b/g) || []).length;
const closeScripts = (h.match(/<\/script>/g) || []).length;
console.log('Open <script> tags:   ', openScripts);
console.log('Close </script> tags:', closeScripts);
console.log('Balanced:', openScripts === closeScripts ? 'YES' : 'NO');

console.log('Has </head>:', h.includes('</head>') ? 'YES' : 'NO');
console.log('Has <head><body> bug:', h.includes('<head><body>') ? 'YES - BUG!' : 'NO - OK');
console.log('Has <body><html> bug:', h.includes('<body><html>') ? 'YES - BUG!' : 'NO - OK');
console.log('Ends with </body></html>:', h.trim().endsWith('</body></html>') ? 'YES' : 'NO');
console.log('Has DOCTYPE:', h.startsWith('<!DOCTYPE html>') ? 'YES' : 'NO');

const badClose = h.match(/\.js"><script>/g);
console.log('Bad .js"><script> closes:', badClose ? badClose.length : 0);

const hasOpenHead = (h.match(/<head>/g) || []).length;
const hasCloseHead = (h.match(/<\/head>/g) || []).length;
console.log('Open <head>:', hasOpenHead, '| Close </head>:', hasCloseHead);
console.log('Head tags balanced:', hasOpenHead === hasCloseHead ? 'YES' : 'NO');

// Check first 500 chars
console.log('\n=== FIRST 500 CHARS ===');
console.log(h.substring(0, 500));

// Check script area
const scriptSection = h.substring(Math.max(0, h.indexOf('ab-test.js') - 50), h.indexOf('ab-test.js') + 200);
console.log('\n=== SCRIPT SECTION (ab-test.js) ===');
console.log(scriptSection);

// Check last 300 chars
console.log('\n=== LAST 300 CHARS ===');
console.log(h.substring(h.length - 300));
