const fs = require('fs');
const html = fs.readFileSync('public/sach-tuyen-sinh-doi-tac.html', 'utf8');

// Find all pages with school number and check if they have docs section
const pages = html.split('<div class="page"');
// Remove first page (cover with page-cover)
const regularPages = pages.filter(p => !p.includes('page-cover'));

// Track school pages
const schoolNames = [];
html.replace(/sch-name">([^<]+)/g, (m, name) => { schoolNames.push(name); });

// Count pages per school
const schoolInfo = {};
let idx = 0;
for (let i = 0; i < pages.length; i++) {
  const p = pages[i];
  const numMatch = p.match(/sch-num[^>]*>(\d+)<\//);
  if (numMatch) {
    const num = parseInt(numMatch[1]);
    const isDocs = p.includes('Hồ sơ cần lưu ý');
    const isP1 = !p.includes('(tiếp)');
    if (!schoolInfo[num]) schoolInfo[num] = { name: schoolNames[idx++] || '?', pages: [], hasDocPage: false };
    schoolInfo[num].pages.push(i);
    if (isDocs) schoolInfo[num].hasDocPage = true;
  }
}

Object.entries(schoolInfo).forEach(([num, info]) => {
  const totalPages = info.pages.length;
  console.log(`School #${num} ${info.name.padEnd(15)} ${totalPages} pages${info.hasDocPage ? ' [DOCS]' : ''}`);
});

console.log(`\nTotal schools with 2 pages: ${Object.values(schoolInfo).filter(s => s.pages.length === 2).length}`);
console.log(`Total schools with 3 pages: ${Object.values(schoolInfo).filter(s => s.pages.length === 3).length}`);
