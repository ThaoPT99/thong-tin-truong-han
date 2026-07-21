/**
 * Fix HTML structure broken by icon-removal whitespace cleanup.
 *
 * Known issues:
 * 1. `</head>` became `<head>` (missing slash)
 * 2. All `</script>` became `<script>` (missing slash)
 * 3. `</body></html>` became `<body><html>` (missing slash)
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const fixes = [];

// 1. Fix <head><body> → </head><body>  (only the one right before <body>)
const headBodyMatch = html.match(/(<head>)(\s*<body>)/);
if (headBodyMatch) {
  const before = html;
  html = html.replace(/(<head>)(\s*<body>)/, '</head>$2');
  if (before !== html) fixes.push('<head><body> → </head><body>');
}

// 2. Fix all <script> that should be </script>
//    Pattern: look for <script> preceded by .js"> or similar attribute-ending patterns
//    Also fix standalone <script> that should be </script> (closing tags)
let scriptCount = 0;
const scriptPattern = /(?:"[^">]*>|<[^>]*>)\K<script>(?=\s*(?:<!--|$|<script|<link|\.js|<body|<\/body))/g;
// Actually, simpler approach: replace ALL instances of <script> that serve as closing tags
// We can identify them by context: </script> should appear between script openings

// Strategy: find script opening tags, then find the next <script> that should be </script>
// Simpler: just replace specific patterns
html = html.replace(/\.js"><script>/g, '.js"></script>');
// Also handle other attribute endings before <script>
html = html.replace(/\.js"><script>/g, '.js"></script>');

let changed = true;
let maxIter = 50;
while (changed && maxIter-- > 0) {
  changed = false;
  
  // Pattern: after a script src="..." or inline script code, 
  // find <script> that is actually the closing tag </script>
  // Look for: "><script> or ><script> followed by new section
  const newHtml = html.replace(
    /(<\/?script[^>]*>[\s\S]*?)<script>(?=\s*(?:<link|<script|<div|<section|<nav|<main|<footer|<p|<h|<body|<!--|\/\/|function|var |const |let |window\.|document\.|\n\s*var|\n\s*const|\n\s*let))/g,
    '$1</script>'
  );
  if (newHtml !== html) {
    scriptCount++;
    changed = true;
    html = newHtml;
  }
}

if (scriptCount > 0) fixes.push(`Fixed ${scriptCount} </script> closing tags`);

// 3. Fix <body><html> at end → </body></html>
if (html.endsWith('<body><html>\n') || html.endsWith('<body><html>')) {
  html = html.replace(/<body><html>\s*$/, '</body></html>\n');
  fixes.push('<body><html> → </body></html>');
}
// Also check for malformed close near end
html = html.replace(/<body>\s*<html>\s*$/, '</body></html>\n');

// 4. Double-check all script tags are balanced
// Count opening vs closing script tags
const openScripts = (html.match(/<script\b[^>]*>/g) || []).length;
const closeScripts = (html.match(/<\/script>/g) || []).length;
if (openScripts !== closeScripts) {
  console.error(`WARNING: Script tag mismatch: ${openScripts} opening vs ${closeScripts} closing`);
} else {
  fixes.push(`Script tags balanced: ${openScripts} opening + ${closeScripts} closing`);
}

// 5. Verify </head> exists
if (!html.includes('</head>')) {
  fixes.push('WARNING: </head> still missing!');
}
if (html.includes('<head><body>')) {
  fixes.push('WARNING: <head><body> still present!');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('=== Fixes applied ===');
fixes.forEach(f => console.log(' •', f));
console.log(`\nFile size: ${html.length} bytes`);
