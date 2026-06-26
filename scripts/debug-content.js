const fs = require('fs');
const html = fs.readFileSync('public/sach-tuyen-sinh-doi-tac.html', 'utf8');

// Split by page boundary
const parts = html.split('<div class="page');
// Remove first part (before first page)
parts.shift();

console.log('Total pages:', parts.length);

// For each school page, check the actual content length
// Find the school name and page type

let currentSchool = '';
let currentPageType = '';

for (let i = 0; i < parts.length; i++) {
  const content = parts[i];
  const pageNum = i + 1;
  
  // Find school number and name
  const schNum = content.match(/sch-num[^>]*>(\d+)<\//);
  const schName = content.match(/sch-name">([^<]+)/);
  const isDocs = content.includes('Hồ sơ cần lưu ý');
  const isTiep = content.includes('(tiếp)');
  
  if (schNum || schName || isDocs) {
    const name = schName ? schName[1] : (schNum ? 'School #' + schNum[1] : '');
    const type = isDocs ? 'DOCS' : (isTiep ? 'PAGE2' : 'PAGE1');
    
    // Count list items
    const docItems = content.match(/<li>/g);
    const itemCount = docItems ? docItems.length : 0;
    
    const contentText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const textLen = contentText.length;
    
    console.log(`P${String(pageNum).padStart(2)} ${name.padEnd(15)} ${type.padEnd(5)} items=${itemCount} chars=${textLen}`);
  } else {
    // Non-school page (overview, conditions, etc.)
    const badgeMatch = content.match(/section-badge[^>]*>([^<]+)/);
    const badge = badgeMatch ? badgeMatch[1].trim() : '-';
    const titleMatch = content.match(/page-title[^>]*>([^<]+)/);
    const title = titleMatch ? titleMatch[1].trim().substring(0, 30) : '-';
    const contentText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`P${String(pageNum).padStart(2)} ${badge.padEnd(10)} ${title.padEnd(25)} chars=${contentText.length}`);
  }
}
