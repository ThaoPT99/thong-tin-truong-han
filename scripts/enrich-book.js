/**
 * enrich-book.js
 * 
 * Reads SACH_VISA_D2-6_18_TRUONG_HAN.html, fetches API data,
 * and adds missing sections (advantages, tuition, documents) + images.
 * 
 * Usage: node scripts/enrich-book.js
 */

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'SACH_VISA_D2-6_18_TRUONG_HAN.html');
const API_URL = 'https://thongtintruonghan.vercel.app/api/schools';

// ─── Unsplash image URLs ───
const IMG = {
  campus: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=70',
  study: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&q=70',
  library: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=70',
  students: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=70',
  lab: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=70',
  korea: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&q=70',
  seoul: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=70',
  busan: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=400&q=70',
  tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70',
  culture: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=70',
};

// Map school index to a nice decorative image
const SCHOOL_IMAGES = [
  null, // 1-indexed
  IMG.campus, IMG.study, IMG.library, IMG.students,
  IMG.lab, IMG.korea, IMG.seoul, IMG.busan,
  IMG.tech, IMG.culture, IMG.campus, IMG.study,
  IMG.library, IMG.students, IMG.lab, IMG.korea,
  IMG.seoul, IMG.busan
];

// Region image map
const REGION_IMAGES = {
  'seoul': IMG.seoul,
  'busan': IMG.busan,
  'gyeonggi': IMG.campus,
  'incheon': IMG.campus,
  'gangwon': IMG.korea,
  'chungcheong': IMG.library,
  'jeolla': IMG.culture,
  'gyeongsang': IMG.tech,
  'gwangju': IMG.korea,
};

function getSchoolImage(apiSchool, idx) {
  // Try to pick based on region
  const region = (apiSchool.region || '').toLowerCase();
  for (const [key, url] of Object.entries(REGION_IMAGES)) {
    if (region.includes(key)) return url;
  }
  // Fallback to index-based
  return SCHOOL_IMAGES[(idx % 18) + 1] || IMG.campus;
}

// ─── Main ───
async function main() {
  console.log('📖 Reading HTML file...');
  let html = fs.readFileSync(HTML_PATH, 'utf-8');
  const originalHtml = html;

  console.log('🌐 Fetching API data...');
  const resp = await fetch(API_URL);
  const apiData = await resp.json();
  const schools = Array.isArray(apiData) ? apiData : (apiData.data || []);
  console.log(`  Found ${schools.length} schools in API`);

  let totalAdded = { tuition: 0, advantages: 0, documents: 0, images: 0 };
  let offsets = []; // track offset adjustments after each school
  let currentOffset = 0;

  for (let si = 0; si < schools.length; si++) {
    const school = schools[si];
    const name = school.name || '';
    
    // Adjust html with current offset from previous insertions
    const workingHtml = html;
    
    // Find school by name in the detail header
    const namePattern = `margin-bottom:4px;">${escapeRegex(name)}</div>`;
    let idx = workingHtml.search(new RegExp(namePattern));
    
    if (idx === -1) {
      // Try matching without diacritics for tricky names
      const simpler = [{from:'Nữ Busan',to:'Nu Busan'},{from:'Dong-Eui',to:'DongEui'}];
      let found = false;
      for (const {from,to} of simpler) {
        if (name.includes(from)) {
          const altName = name.replace(from, to);
          const altPat = `margin-bottom:4px;">${escapeRegex(altName)}</div>`;
          const altIdx = workingHtml.search(new RegExp(altPat));
          if (altIdx !== -1) { idx = altIdx; found = true; break; }
        }
      }
      if (!found) {
        console.log(`  ⚠️  Skipping "${name}" - not found`);
        continue;
      }
    }

    console.log(`  📝 [${si+1}/18] ${name}`);

    const apiSchool = schools.find(s => s.name === name) || school;
    let localOffset = 0;

    // ─── 1. ADD TUITION ROW ───
    const tuition = apiSchool.tuition || '';
    if (tuition && tuition.length > 5) {
      // Find partner row in info-table (within ~2000 chars of school name)
      const section = workingHtml.substring(idx + localOffset, idx + localOffset + 3000);
      const partnerRow = '<tr><td class="info-label">Đối tác VN</td>';
      const pi = section.indexOf(partnerRow);
      
      if (pi !== -1) {
        const absPi = idx + localOffset + pi;
        // Check not already added
        const beforeSlice = workingHtml.substring(Math.max(0, absPi - 300), absPi);
        if (!beforeSlice.includes('Học phí')) {
          // Format tuition - take first meaningful line
          const tLines = tuition.split('\n').filter(l => l.trim().length > 0);
          const tShort = tLines[0] ? tLines[0].substring(0, 150) : '';
          const tuitionHtml = `<tr><td class="info-label">Học phí</td><td>${escapeHtml(tShort)}</td></tr>\n        `;
          html = html.substring(0, absPi) + tuitionHtml + html.substring(absPi);
          localOffset += tuitionHtml.length;
          totalAdded.tuition++;
        }
      }
    }

    // ─── 2. ADD ADVANTAGES ───
    const advantages = apiSchool.advantages || [];
    if (advantages.length > 0) {
      // Find the last </ol> before page closing
      const section = workingHtml.substring(idx + localOffset, idx + localOffset + 8000);
      // Find conv-list closing by looking for a specific pattern
      // conv-list ends with </ol> followed by content-wrap closing and page-number
      const convEndPattern = /<\/ol>\s*\n\s*<\/div>\s*\n\s*<div class="page-number">/;
      const convMatch = section.match(convEndPattern);
      
      if (convMatch) {
        const convEnd = convMatch.index + convMatch[0].indexOf('</ol>') + 5; // position after </ol>
        
        // Check if advantages already exist
        const afterSlice = section.substring(convEnd, convEnd + 300);
        if (!afterSlice.includes('Ưu điểm')) {
          const items = advantages.slice(0, 8).map(a => `<li>${escapeHtml(a.text || a).substring(0, 250)}</li>`).join('\n');
          const advHtml = `\n    <h4 class="section-title">Ưu điểm nổi bật</h4>\n      <ol class="adv-list">${items}</ol>`;
          html = html.substring(0, idx + localOffset + convEnd) + advHtml + html.substring(idx + localOffset + convEnd);
          localOffset += advHtml.length;
          totalAdded.advantages++;
        }
      }
    }

    // ─── 3. ADD DOCUMENTS ON PAGE 2 ───
    const documents = apiSchool.documents || [];
    if (documents.length > 0) {
      // Find page 2 by looking for (tiếp) marker after current school
      // We search after the school name position
      const searchFrom = idx + 200; // skip page 1, look for tiếp on page 2
      const restHtml = workingHtml.substring(searchFrom);
      
      // Pattern: tiếp marker - use literal string search
      const tiepStr = `<span style="font-weight:400;font-size:12px;color:var(--gray);">(tiếp)</span>`;
      const tiepIdx = restHtml.indexOf(tiepStr);
      
      if (tiepIdx !== -1) {
        const absTiep = searchFrom + tiepIdx;
        
        // Find KTX section on page 2 and insert documents before "Đối tác Việt Nam"
        const page2Section = workingHtml.substring(absTiep, absTiep + 4000);
        const partnerStart = page2Section.indexOf('<h4 class="section-title">Đối tác Việt Nam</h4>');
        
        if (partnerStart !== -1) {
          const absPartner = absTiep + partnerStart;
          
          // Check not already added
          const beforeDoc = workingHtml.substring(Math.max(0, absPartner - 400), absPartner);
          if (!beforeDoc.includes('Hồ sơ cần nộp')) {
            const items = documents.slice(0, 10).map(d => `<li>${escapeHtml(d.text || d).substring(0, 200)}</li>`).join('\n');
            const docHtml = `\n    <h4 class="section-title">Hồ sơ cần nộp</h4>\n      <ol class="doc-list">${items}</ol>\n      `;
            html = html.substring(0, absPartner) + docHtml + html.substring(absPartner);
            // Don't update localOffset here since we're working past page 1
            totalAdded.documents++;
          }
        }
      }
    }

    // ─── 4. ADD DECORATIVE IMAGE ON PAGE 2 ───
    // Add a small decorative image near the top of page 2
    const imgUrl = getSchoolImage(apiSchool, si + 1);
    if (imgUrl) {
      // Find page 2 content area
      const searchFrom2 = idx + 200;
      const restHtml2 = workingHtml.substring(searchFrom2);
      const tiepStr2 = `<span style="font-weight:400;font-size:12px;color:var(--gray);">(tiếp)</span>`;
      const tiepIdx2 = restHtml2.indexOf(tiepStr2);
      
      if (tiepIdx2 !== -1) {
        const absTiep2 = searchFrom2 + tiepIdx2;
        // Insert image after the (tiếp) header, before the first section
        const page2Content = workingHtml.substring(absTiep2, absTiep2 + 2000);
        const firstSection = page2Content.indexOf('<h4 class="section-title">');
        
        if (firstSection !== -1) {
          const absSection = absTiep2 + firstSection;
          // Check not already has an image
          const beforeImg = workingHtml.substring(Math.max(0, absSection - 200), absSection);
          if (!beforeImg.includes('<img')) {
            const imgHtml = `\n    <div style="height:80px;overflow:hidden;border-radius:4px;margin-bottom:8px;">\n      <img src="${imgUrl}" alt="" style="width:100%;height:80px;object-fit:cover;">\n    </div>`;
            html = html.substring(0, absSection) + imgHtml + html.substring(absSection);
            totalAdded.images++;
          }
        }
      }
    }
  }

  // ─── 5. SUMMARY ───
  const changesMade = html !== originalHtml;
  if (changesMade) {
    // Verify page structure isn't broken
    const pageCount = (html.match(/<div class="page">/g) || []).length;
    const origPageCount = (originalHtml.match(/<div class="page">/g) || []).length;
    
    console.log(`\n📊 Stats:`);
    console.log(`   Pages: ${origPageCount} → ${pageCount}`);
    console.log(`   Tuition rows: +${totalAdded.tuition}`);
    console.log(`   Advantages: +${totalAdded.advantages}`);
    console.log(`   Documents: +${totalAdded.documents}`);
    console.log(`   Images: +${totalAdded.images}`);
    
    fs.writeFileSync(HTML_PATH, html, 'utf-8');
    console.log(`\n✅ Written to ${HTML_PATH}`);
  } else {
    console.log(`\n❌ No changes made!`);
  }
}

// ─── Helpers ───
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
