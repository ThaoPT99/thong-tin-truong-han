/**
 * cleanup-book-duplicates.js
 * Removes duplicate "Ưu điểm nổi bật" sections that were inserted twice.
 * Also verifies no other duplicate issues exist.
 */
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'SACH_VISA_D2-6_18_TRUONG_HAN.html');

let html = fs.readFileSync(HTML_PATH, 'utf-8');
const original = html;

// Pattern: two consecutive "Ưu điểm nổi bật" sections
// Remove the first one (the duplicate)
const dupPattern = /(<h4 class="section-title">Ưu điểm nổi bật<\/h4>\s*\n\s*<ol class="adv-list">[^]*?<\/ol>)\s*\n\s*<h4 class="section-title">Ưu điểm nổi bật<\/h4>/g;

let count = 0;
html = html.replace(dupPattern, (match, firstBlock) => {
  count++;
  return firstBlock; // keep only the first block
});

console.log(`Removed ${count} duplicate advantages blocks`);

// Also check for sequential duplicate images
const imgDup = /(<div style="height:80px;overflow:hidden;border-radius:4px;margin-bottom:8px;">\s*<img[^>]+>\s*<\/div>)\s*\n\s*<div style="height:80px;overflow:hidden;border-radius:4px;margin-bottom:8px;">/g;
let imgCount = 0;
html = html.replace(imgDup, (match, firstImg) => {
  imgCount++;
  return firstImg;
});
console.log(`Removed ${imgCount} duplicate image blocks`);

if (html !== original) {
  fs.writeFileSync(HTML_PATH, html, 'utf-8');
  console.log('✅ Written cleanup to', HTML_PATH);
} else {
  console.log('ℹ️ No duplicates found');
}

// Verify counts
const advCount = (html.match(/<h4 class="section-title">Ưu điểm nổi bật<\/h4>/g) || []).length;
const docCount = (html.match(/<h4 class="section-title">Hồ sơ cần nộp<\/h4>/g) || []).length;
const imgTags = (html.match(/<div style="height:80px;overflow:hidden;border-radius:4px;margin-bottom:8px;">/g) || []).length;
console.log(`Final counts: Advantages=${advCount}, Documents=${docCount}, Images=${imgTags}`);
