const API_BASE = 'https://thongtintruonghan.vercel.app/api';

async function main() {
  const res = await fetch(API_BASE + '/schools?_=' + Date.now());
  const json = await res.json();
  const raw = json.data || [];

  // Normalize doc text: strip numbering, trim, lowercase
  function normalize(doc) {
    return doc
      .replace(/^[-–—]\s*/, '')
      .replace(/^\d+[.、)\s]*/, '')
      .replace(/^[a-z][.)]\s*/i, '')
      .trim()
      .toLowerCase()
      .substring(0, 80);
  }

  // Collect all unique doc texts across schools
  const allDocs = {};
  const schoolDocs = {};

  raw.forEach(s => {
    const name = s.name || 'Unknown';
    const docs = (s.documents || []).map(d => typeof d === 'string' ? d : d.text || '');
    schoolDocs[name] = docs;

    docs.forEach((d, i) => {
      const key = normalize(d);
      if (!allDocs[key]) {
        allDocs[key] = { count: 0, schools: [], sample: d.substring(0, 80) };
      }
      allDocs[key].count++;
      if (!allDocs[key].schools.includes(name)) {
        allDocs[key].schools.push(name);
      }
    });
  });

  // Group by frequency
  const commonDocs = Object.entries(allDocs)
    .filter(([key, val]) => val.count >= 10)
    .sort((a, b) => b[1].count - a[1].count);

  console.log('=== Documents xuất hiện ở 10+ trường (có thể giống nhau) ===\n');
  commonDocs.forEach(([key, val]) => {
    console.log(`📄 [${val.count}/18 trường] "${val.sample}"`);
    console.log(`   Các trường: ${val.schools.join(', ')}`);
    console.log();
  });

  // Also check: does each school have EXACTLY the same document list?
  const docSets = {};
  raw.forEach(s => {
    const name = s.name || 'Unknown';
    const docs = (s.documents || []).map(d => typeof d === 'string' ? d : d.text || '');
    const docText = docs.map(normalize).filter(Boolean).sort().join(' ||| ');
    if (!docSets[docText]) docSets[docText] = [];
    docSets[docText].push(name);
  });

  console.log('=== Các trường có bộ hồ sơ GIỐNG HỆT nhau ===\n');
  Object.entries(docSets)
    .filter(([key, schools]) => schools.length > 1)
    .forEach(([key, schools]) => {
      console.log(`👥 ${schools.length} trường: ${schools.join(', ')}`);
    });

  // Show schools that have UNIQUE document sets
  const uniqueSchools = Object.entries(docSets).filter(([k, v]) => v.length === 1);
  console.log(`\n=== Tổng kết ===`);
  console.log(`Số bộ hồ sơ giống nhau: ${Object.values(docSets).filter(v => v.length > 1).length} nhóm`);
  console.log(`Số trường có hồ sơ riêng: ${uniqueSchools.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
