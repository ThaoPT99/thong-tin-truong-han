const fs = require('fs');
const html = fs.readFileSync('public/sach-tuyen-sinh-doi-tac.html', 'utf8');

// Split into pages
const pages = html.split(/<div class="page/);
console.log('Total pages found:', pages.length - 1);

// Check pages 12-16 for context
for (let p = 12; p <= 16 && p < pages.length; p++) {
  const content = pages[p];
  const schNumMatch = content.match(/sch-num[^>]*>(\d+)<\//);
  const nameMatch = content.match(/sch-name">([^<]+)/);
  const docSection = content.includes('H\u1ed3 s\u01a1 c\u1ea7n l\u01b0u \u00fd') ? ' [DOCS PAGE]' : '';
  const tiep = content.includes('(ti\u1ebfp)') ? ' (ti\u1ebfp)' : '';
  console.log('Page ' + p + ': School #' + (schNumMatch ? schNumMatch[1] : '?') + ' ' + (nameMatch ? nameMatch[1] : '?') + tiep + docSection);
}

// Get school order
console.log('\n=== School order ===');
let schoolNum = 0;
html.replace(/sch-name">([^<]+)/g, (match, name) => {
  schoolNum++;
  console.log('School #' + schoolNum + ': ' + name);
});

// Get content sizes per school page
console.log('\n=== Content sizes per school page ===');
const schoolPages = {};
for (let p = 6; p < pages.length; p++) {
  const content = pages[p];
  const schNumMatch = content.match(/sch-num[^>]*>(\d+)<\//);
  if (schNumMatch) {
    const num = schNumMatch[1];
    if (!schoolPages[num]) schoolPages[num] = [];
    schoolPages[num].push({ pageNum: p, contentLength: content.length, isDocs: content.includes('H\u1ed3 s\u01a1 c\u1ea7n l\u01b0u \u00fd') });
  }
}

Object.entries(schoolPages).forEach(([num, entries]) => {
  console.log('School #' + num + ': ' + entries.map(e => 'page ' + e.pageNum + ' (len=' + e.contentLength + ')' + (e.isDocs ? ' [docs]' : '')).join(', '));
});
