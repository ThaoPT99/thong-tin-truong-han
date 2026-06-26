const API_BASE = 'https://thongtintruonghan.vercel.app/api';

async function main() {
  const res = await fetch(API_BASE + '/schools?_=' + Date.now());
  const json = await res.json();
  const raw = json.data || [];
  
  function stripFastgo(text) {
    if (!text) return '';
    return String(text)
      .replace(/[Ff][Aa][Ss][Tt][Gg][Oo]/g, '')
      .replace(/\(\s*\)/g, '').replace(/\(\s*,/g, '(')
      .replace(/\s{2,}/g, ' ').replace(/-\s*$/g, '')
      .replace(/,\s*,/g, ',').replace(/;\s*;/g, ';').trim();
  }
  function sanitizeData(obj) {
    if (typeof obj === 'string') return stripFastgo(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeData);
    if (obj && typeof obj === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(obj)) result[k] = sanitizeData(v);
      return result;
    }
    return obj;
  }

  const regionOrder = ['seoul','near-seoul','incheon','gyeonggi','busan','gwangju',
    'chungcheongbuk','chungcheongnam','jeollanam','jeollabuk',
    'gyeongsangnam','gyeongsangbuk','gangwon','province'];
  
  const schools = sanitizeData(raw).map(s => ({
    name: s.name || '',
    region: s.region || '',
    tuition: s.tuition || '',
    ktx: s.ktx || '',
    majors: (s.majors || []).map(m => typeof m === 'string' ? m : m.text || '').filter(Boolean),
    conversion: (s.conversion || []).map(c => typeof c === 'string' ? c : c.text || '').filter(Boolean),
    documents: (s.documents || []).map(d => typeof d === 'string' ? d : d.text || '').filter(Boolean),
  }));
  
  schools.sort((a, b) => {
    const ai = regionOrder.indexOf(a.region), bi = regionOrder.indexOf(b.region);
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return (a.name || '').localeCompare(b.name || '', 'vi');
  });

  console.log('=== School data for estimation check ===\n');
  schools.forEach((s, i) => {
    if (!s.documents.length) return;
    
    // Calculate with MORE accurate characters-per-line
    const lineH = 19, secH = 28, gap = 12;
    
    // Page 2 base (without docs)
    let baseH = 45; // title row
    baseH += Math.ceil((s.majors || []).length / 2) * lineH + secH; // majors
    const convLines = (s.conversion || []).reduce((sum, c) => sum + 1 + c.split('\n').length + Math.floor(c.length / 45), 0);
    baseH += Math.max(convLines * lineH, 40) + secH + gap; // conversion
    const tuiLines = (s.tuition || '').split('\n').length + Math.floor((s.tuition || '').length / 45);
    const ktxLines = (s.ktx || '').split('\n').length + Math.floor((s.ktx || '').length / 45);
    baseH += Math.max(tuiLines, ktxLines) * 21 + secH + gap; // tuition/ktx
    baseH += 25 + gap; // partners
    baseH += 80; // note card
    
    // Docs
    const docLines = s.documents.reduce((sum, d) => sum + 1 + d.split('\n').length + Math.floor(d.length / 90), 0);
    const docH = docLines * lineH + secH;
    const totalWithDocs = baseH + gap + docH;
    
    // Docs character breakdown
    console.log(`#${i+1} ${s.name.padEnd(16)} majors=${(s.majors||[]).length} docs=${s.documents.length}`);
    console.log(`   p2 base=${baseH}px  docs=${docH}px (${docLines} lines)  total=${totalWithDocs}px`);
    console.log(`   free=${900-baseH}px  ${totalWithDocs <= 930 ? '✅ CAN FIT ON 2 PAGES' : '❌ NEEDS 3 PAGES'}`);
    
    // Show doc text lengths to understand
    const docLengths = s.documents.map(d => ({ text: d.replace(/\n/g, '\\n').substring(0, 50) + '...', len: d.length, lines: 1 + d.split('\n').length + Math.floor(d.length / 90) }));
    console.log(`   docs breakdown:`);
    docLengths.forEach(d => console.log(`     [${d.len} chars ~${d.lines} lines] ${d.text}`));
    console.log('');
  });
}

main().catch(e => { console.error(e); process.exit(1); });
