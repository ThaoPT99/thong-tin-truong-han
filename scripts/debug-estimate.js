// Debug: check which schools need separate docs pages
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://thongtintruonghan.vercel.app/api';

function regionLabel(r) {
  const map = { seoul:'Seoul','near-seoul':'Gần Seoul',busan:'Busan',gwangju:'Gwangju',
    province:'Tỉnh khác',incheon:'Incheon',gyeonggi:'Gyeonggi',
    chungcheongbuk:'Chungcheongbuk',chungcheongnam:'Chungcheongnam',
    jeollanam:'Jeollanam',jeollabuk:'Jeollabuk',
    gyeongsangnam:'Gyeongsangnam',gyeongsangbuk:'Gyeongsangbuk',
    gangwon:'Gangwon',daegu:'Daegu',daejeon:'Daejeon',
    ulsan:'Ulsan',sejong:'Sejong',jeju:'Jeju',
  };
  return map[r] || r || 'Đang cập nhật';
}

const regionOrder = ['seoul','near-seoul','incheon','gyeonggi','busan','gwangju',
  'chungcheongbuk','chungcheongnam','jeollanam','jeollabuk',
  'gyeongsangnam','gyeongsangbuk','gangwon','province'];

function needsDocSeparate(s) {
  if (!s.documents || s.documents.length === 0) return false;
  const lineH = 19;
  const secH = 28;
  const gap  = 12;
  let h = 0;
  h += 45;
  h += Math.ceil((s.majors || []).length / 2) * lineH + secH;
  const convLines = (s.conversion || []).reduce((sum, c) => {
      const segs = c.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 45), 0);
    }, 0);
  h += Math.max(convLines * lineH, 40) + secH + gap;
  const docLines = s.documents.reduce((sum, d) => {
      const segs = d.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 90), 0);
    }, 0);
  const docH = docLines * lineH + secH;
  h += docH + gap;
  const tuiLines = (s.tuition || '').split('\n').length + Math.floor((s.tuition || '').length / 45);
  const ktxLines = (s.ktx || '').split('\n').length + Math.floor((s.ktx || '').length / 45);
  h += Math.max(tuiLines, ktxLines) * 21 + secH + gap;
  h += 25 + gap;
  h += 80;
  return h > 940;
}

async function main() {
  console.log('Fetching data...');
  const [res, extrasRes] = await Promise.all([
    fetch(API_BASE + '/schools?_=' + Date.now()),
    fetch(API_BASE + '/schools?include=extras&_=' + Date.now()),
  ]);
  const json = await res.json();
  const raw = json.data || [];
  
  function stripFastgo(text) {
    if (!text) return '';
    return String(text)
      .replace(/[Ff][Aa][Ss][Tt][Gg][Oo]/g, '')
      .replace(/\(\s*\)/g, '')
      .replace(/\(\s*,/g, '(')
      .replace(/\s{2,}/g, ' ')
      .replace(/-\s*$/g, '')
      .replace(/,\s*,/g, ',')
      .replace(/;\s*;/g, ';')
      .trim();
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

  const schools = sanitizeData(raw).map(s => ({
    id: s.slug || s.id,
    name: s.name || '',
    region: s.region || '',
    tuition: s.tuition || '',
    ktx: s.ktx || '',
    majors: (s.majors || []).map(m => typeof m === 'string' ? m : m.text || '').filter(Boolean),
    conversion: (s.conversion || []).map(c => typeof c === 'string' ? c : c.text || '').filter(Boolean),
    documents: (s.documents || []).map(d => typeof d === 'string' ? d : d.text || '').filter(Boolean),
  }));

  schools.sort((a, b) => {
    const ai = regionOrder.indexOf(a.region);
    const bi = regionOrder.indexOf(b.region);
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return (a.name || '').localeCompare(b.name || '', 'vi');
  });

  console.log('\n=== DETAILED ESTIMATION PER SCHOOL ===\n');
  
  let totalExtra = 0;
  schools.forEach((s, i) => {
    if (!s.documents.length) {
      console.log(`#${i+1} ${s.name.padEnd(18)} docs=0      → NO extra page needed (no docs)`);
      return;
    }
    
    const lineH = 19, secH = 28, gap = 12;
    let h = 45;
    h += Math.ceil((s.majors || []).length / 2) * lineH + secH;
    const convLines = (s.conversion || []).reduce((sum, c) => {
      const segs = c.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 45), 0);
    }, 0);
    h += Math.max(convLines * lineH, 40) + secH + gap;
    const docLines = s.documents.reduce((sum, d) => {
      const segs = d.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 90), 0);
    }, 0);
    const docH = docLines * lineH + secH;
    h += docH + gap;
    const tuiLines = (s.tuition || '').split('\n').length + Math.floor((s.tuition || '').length / 45);
    const ktxLines = (s.ktx || '').split('\n').length + Math.floor((s.ktx || '').length / 45);
    h += Math.max(tuiLines, ktxLines) * 21 + secH + gap;
    h += 25 + gap + 80;

    const needsExtra = h > 900;
    if (needsExtra) totalExtra++;
    
    const majors2col = Math.ceil((s.majors || []).length / 2) * lineH + secH;
    console.log(`#${i+1} ${s.name.padEnd(18)} majors=${(s.majors||[]).length} docs=${s.documents.length} majorsH=${majors2col} docH=${docH} convH=${(convLines*lineH)|0} est=${h}px ${needsExtra ? '⚠️ NEEDS EXTRA (p2=' + (h - docH - gap) + 'px w/o docs)' : '✅ FITS on 2 pages'}`);
  });
  
  console.log(`\n=== Total extra pages needed: ${totalExtra} / ${schools.length} schools ===`);
  console.log(`Total school pages: ${schools.length * 2 + totalExtra}`);
  
  // Also check: how many schools would fit without docs on page 2
  console.log('\n=== CHECK: Which schools could merge docs BACK into page 2? ===\n');
  schools.forEach((s, i) => {
    if (!s.documents.length) return;
    const lineH = 19, secH = 28, gap = 12;
    let h = 45;
    h += Math.ceil((s.majors || []).length / 2) * lineH + secH;
    const convLines = (s.conversion || []).reduce((sum, c) => sum + 1 + c.split('\n').length + Math.floor(c.length / 70), 0);
    h += Math.max(convLines * lineH, 40) + secH + gap;
    const tuiLines = (s.tuition || '').split('\n').length + Math.floor((s.tuition || '').length / 75);
    const ktxLines = (s.ktx || '').split('\n').length + Math.floor((s.ktx || '').length / 75);
    h += Math.max(tuiLines, ktxLines) * 21 + secH + gap;
    h += 25 + gap + 80;
    
    const docLines = s.documents.reduce((sum, d) => sum + 1 + d.split('\n').length + Math.floor(d.length / 75), 0);
    const docH = docLines * lineH + secH;
    
    console.log(`#${i+1} ${s.name.padEnd(18)} p2_no_docs=${h}px (free=${900-h}px) docs_height=${docH}px ${h+docH+gap <= 900 ? '✅ CAN MERGE' : '❌ NEEDS EXTRA'}`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
