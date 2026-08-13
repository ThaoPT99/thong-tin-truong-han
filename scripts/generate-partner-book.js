#!/usr/bin/env node
/**
 * scripts/generate-partner-book.js
 *
 * Fetches school data from the API and generates a static A4 book HTML file
 * for partners/recruitment use.  No company branding — clean, neutral, professional.
 *
 * Usage:  node scripts/generate-partner-book.js
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://thongtintruonghan.vercel.app/api';
const OUTPUT = path.join(__dirname, '..', 'public', 'sach-tuyen-sinh-doi-tac.html');

// ─── Images ────────────────────────────────────────────────
const IMG = {
  cover:   'https://vklinks.vn/wp-content/uploads/2024/04/3ff5e169da27d72f19690e4ff551164c-819x1024.jpeg',
  study:   'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
  campus:  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
  korea:   'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
};

// ─── Link Catalog/Video đã sửa tay trong file (ưu tiên hơn API) ───
// Người dùng đã chỉnh sửa trực tiếp các link này trong sach-tuyen-sinh-doi-tac.html.
// Khi chạy lại script, các link này luôn được giữ nguyên (không phụ thuộc API).
// Muốn đổi link: sửa ở đây HOẶC xoá dòng tương ứng để dùng link từ API.
const LINK_OVERRIDES = {
  'DongDuk': { catalog: 'https://drive.google.com/file/d/1jjenscO1WB2cBjLkAut7IxTSCLxDHUEt/view', video: 'https://www.youtube.com/watch?v=2BQlcfA0yMI', videoTitle: '2026년 동덕여자대학교 공식 홍보영상' },
  'Induk': { catalog: 'https://ipsi.induk.ac.kr/ajax/CM_BB01_SVC/CM_BB01_R97.do?TABLE_ID=AP_BBS&PK_COL=46063&ATCH_SN=1&isTemp=false', video: 'https://www.youtube.com/watch?v=o6kt2V8GaBA', videoTitle: '2025학년도 인덕대학교 대표 홍보영상' },
  'Sangmyung': { catalog: 'https://drive.google.com/file/d/1U79U2e7tqad3s4rHVBWOh1v7-bqe4Y76/view', video: 'https://www.youtube.com/watch?v=OG9F7sETG3M', videoTitle: '2026 상명대학교 홍보영상' },
  'KyungGin': { catalog: 'https://drive.google.com/file/d/1koKmGXVjZmSBtiSRcqaMuf3blbO_w4W0/view', video: 'https://www.youtube.com/watch?v=Tu4Z6SDDleQ', videoTitle: '경인여자대학교 홍보영상' },
  'Dongnam': { catalog: 'https://www.dongnam.ac.kr/bbs/ilec/243/VnpTRXpmaWJwL0JtVGlHK0tuVGtZQT09/download.do', video: 'https://www.youtube.com/watch?v=ssuiG3ITuL8', videoTitle: '2024 동남보건대학교 홍보영상' },
  'Osan': { video: 'https://www.youtube.com/watch?v=Cz18VV91EvI', videoTitle: 'Introduction to Osan University Facilities' },
  'YeonSung': { catalog: 'https://www.yeonsung.ac.kr/sites/en/file/23ys_ko_school.pdf', video: 'https://www.youtube.com/watch?v=uOYHoDm_oMY', videoTitle: '2022 연성대학교 공식홍보영상' },
  'Busan Catholic': { catalog: 'https://drive.google.com/file/d/1c4XfGO424-5OINQI9YuaCNPYY4WXNeaC/view', video: 'https://www.youtube.com/watch?v=n1TR_jnKlqs', videoTitle: '부산가톨릭대학교 개교 60주년 홍보' },
  'Dong-Eui': { catalog: 'https://drive.google.com/file/d/1OvD9XCX6dLBaIR6IKTdgtnfoT-Op3gU-/view', video: 'https://www.youtube.com/watch?v=EVspM9Kpw_I', videoTitle: '동의대학교 2019 공식 홍보영상' },
  'Nữ Busan': { catalog: 'https://www.bwc.ac.kr/ipsi/upload/2027_guidelines.pdf', video: 'https://www.youtube.com/watch?v=Te_5wn3_ekU', videoTitle: '부산여자대학교 대학홍보영상' },
  'Gwangju': { catalog: 'https://ie.gwangju.ac.kr/pages/gw_ie/file/file_2026_3.pdf', video: 'https://www.youtube.com/watch?v=18R7PuUszhs', videoTitle: '2025학년도 광주대학교 홍보영상' },
  'Nambu': { video: 'https://www.youtube.com/watch?v=7KnbZz5KT4c', videoTitle: '남부대학교 소개' },
  'Daewon': { catalog: 'https://drive.google.com/file/d/1UY4eFsyTNxAiOxseN5Ofxu5hfPNGE_P5/view', video: 'https://www.youtube.com/watch?v=Qcui82cohB4', videoTitle: '대원대학교 홍보영상' },
  'Sengmyung': { catalog: 'https://biz.semyung.ac.kr/cmm/fms/FileDown.do?atchFileId=FILE_000000000223232&fileSn=0', video: 'https://www.youtube.com/watch?v=0TCsIPRjYQw', videoTitle: '2025 세명대학교 홍보영상' },
  'Suncheon Jeil': { catalog: 'https://drive.google.com/file/d/1xVMO320agblD8atS_Mvj8jFenFePBDOz/view', video: 'https://www.youtube.com/watch?v=mua0KiVG_ok', videoTitle: '순천제일대학교 홍보영상' },
  'Jeonju': { catalog: 'https://drive.google.com/file/d/1SRni65v84X5v6ujbKBsdLHbj2JHAZGpo/view', video: 'https://www.youtube.com/watch?v=DLkiMasLb3o', videoTitle: 'Welcome to Jeonju University | Study in Korea' },
  'Gimhae': { catalog: 'https://drive.google.com/file/d/1Yy3ceBqYGYelV-tmfAl-9ZVprNvctmhN/view', video: 'https://www.youtube.com/watch?v=F7yRdJEyvd4', videoTitle: '2024학년도 김해대학교 공식 홍보영상' },
  'Catholic Kwandong': { catalog: 'https://drive.google.com/file/d/1-udyYf1vbgkUrX1QMPNpsfJnUyxoUXfA/view', video: 'https://www.youtube.com/watch?v=xrbkiw3GTvM', videoTitle: '가톨릭관동대학교 70주년 기념 공식 홍보영상' },
};

// ─── Helpers ───────────────────────────────────────────────
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sentenceBullets(text) {
  if (!text) return '';
  return '<p>' + esc(text) + '</p>';
}

function renderList(items, empty) {
  if (!items || !items.length) return '<span class="muted">Đang cập nhật</span>';
  return '<ol class="num-list">' + items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ol>';
}

function renderBullets(items, empty) {
  if (!items || !items.length) return '<span class="muted">Đang cập nhật</span>';
  return '<ul class="dot-list compact">' + items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';
}

// Chuẩn hoá các mã lệch (typo) trong text MOU cũ về mã chuẩn
const PARTNER_TYPO_MAP = { KTTU: 'KTTT', BCIT: 'BGIT', HPC: 'HPC-HP' };

// Hiển thị đối tác VN với TÊN ĐẦY ĐỦ + mã viết tắt trong ngoặc, dạng 2 cột
function renderPartnerTags(school) {
  const seen = {};
  const tags = [];
  const add = (code, name) => {
    const cc = PARTNER_TYPO_MAP[code] || code;
    if (!cc || seen[cc]) return;
    seen[cc] = true;
    const match = (school.partners || []).find(x => x.code === cc || x.name === cc);
    tags.push({ code: cc, name: (match && match.name) || name || '' });
  };
  // Ưu tiên dữ liệu partners (code + name) từ DB
  (school.partners || []).forEach(p => add(p.code, p.name));
  // MOU text chỉ chứa mã — map qua partners nếu có tên (kèm sửa mã lệch)
  if (school.mou) {
    school.mou.split(',').forEach(p => {
      const c = p.trim();
      if (c) add(c, '');
    });
  }
  if (!tags.length) return '<span class="muted">Đang cập nhật</span>';
  return '<div style="display:flex;flex-wrap:wrap;gap:3px 14px;">' + tags.map(t => {
    const codeHtml = t.code ? ' <span style="color:#64748b;font-size:9px;">(' + esc(t.code) + ')</span>' : '';
    return '<div style="flex:0 0 calc(50% - 7px);min-width:0;line-height:1.6;">' + (t.name ? esc(t.name) : esc(t.code)) + codeHtml + '</div>';
  }).join('') + '</div>';
}

function regionLabel(r) {
  const map = {
    seoul:'Seoul','near-seoul':'Gần Seoul',busan:'Busan',gwangju:'Gwangju',
    province:'Tỉnh khác',incheon:'Incheon',gyeonggi:'Gyeonggi',
    chungcheongbuk:'Chungcheongbuk',chungcheongnam:'Chungcheongnam',
    jeollanam:'Jeollanam',jeollabuk:'Jeollabuk',
    gyeongsangnam:'Gyeongsangnam',gyeongsangbuk:'Gyeongsangbuk',
    gangwon:'Gangwon',daegu:'Daegu',daejeon:'Daejeon',
    ulsan:'Ulsan',sejong:'Sejong',jeju:'Jeju',
  };
  return map[r] || r || 'Đang cập nhật';
}

// Grid khu vực trang 6 — màu sắc & thứ tự theo đúng file đã sửa tay
const GRID_NAME_OVERRIDE = { KyungGin: 'KyungGin (Nữ)' };
// Thứ tự hiển thị trong ô "Khác" — giữ nguyên như file sửa tay
const KHAC_ORDER = ['Suncheon Jeil', 'Catholic Kwandong', 'Daewon', 'Jeonju', 'Sengmyung', 'Gimhae'];

function renderRegionGrid(schools) {
  const groups = [
    { label: 'Seoul',   border: '#2563eb', bg: 'linear-gradient(135deg,#dbeafe,#eff6ff)', color: '#1d4ed8', regions: ['seoul'] },
    { label: 'Incheon', border: '#059669', bg: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', color: '#065f46', regions: ['incheon'] },
    { label: 'Gyeonggi',border: '#0891b2', bg: 'linear-gradient(135deg,#dbeafe,#eff6ff)', color: '#0f766e', regions: ['gyeonggi'] },
    { label: 'Busan',   border: '#d97706', bg: 'linear-gradient(135deg,#fef3c7,#fffbeb)', color: '#92400e', regions: ['busan'] },
    { label: 'Gwangju', border: '#7c3aed', bg: 'linear-gradient(135deg,#ede9fe,#f5f3ff)', color: '#6b21a8', regions: ['gwangju'] },
  ];
  const mainRegions = new Set(['seoul','incheon','gyeonggi','busan','gwangju']);
  // Các khu vực còn lại gộp vào "Khác"
  const khac = schools.filter(s => !mainRegions.has(s.region));
  // Sắp theo thứ tự file sửa tay; trường lạ xếp cuối theo tên
  khac.sort((a, b) => {
    const ai = KHAC_ORDER.indexOf(a.name);
    const bi = KHAC_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return (a.name || '').localeCompare(b.name || '', 'vi');
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  const cells = [];
  groups.forEach(g => {
    const list = schools.filter(s => g.regions.includes(s.region));
    if (!list.length) return;
    cells.push({ label: g.label, border: g.border, bg: g.bg, color: g.color, list });
  });
  if (khac.length) {
    cells.push({ label: 'Khác', border: '#be123c', bg: 'linear-gradient(135deg,#fce7f3,#fdf2f8)', color: '#be123c', list: khac });
  }
  const displayName = s => GRID_NAME_OVERRIDE[s.name] || s.name;
  return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;">' +
    cells.map(c =>
      '<div style="padding:6px 10px;background:' + c.bg + ';border-radius:4px;border-left:3px solid ' + c.border + ';">' +
        '<div style="font-family:&#39;Montserrat&#39;,sans-serif;font-weight:700;font-size:9px;color:' + c.color + ';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">📍 ' + esc(c.label) + '</div>' +
        '<div style="font-size:10px;color:#333;line-height:1.5;">' + c.list.map(s => esc(displayName(s))).join(' · ') + '</div>' +
      '</div>'
    ).join('') +
  '</div>';
}

function regionClass(r) {
  if (!r) return '';
  if (['seoul','near-seoul','incheon','gyeonggi'].includes(r)) return 'region-' + r;
  if (r === 'busan' || r === 'gwangju') return 'region-' + r;
  if (r.includes('chungcheong')) return 'region-chungcheong';
  if (r.includes('gyeongsang')) return 'region-gyeongsang';
  if (r.includes('jeolla')) return 'region-jeolla';
  return 'region-province';
}

// ─── Page wrapper ─────────────────────────────────────────
let PAGE_NUM = 0;

function page(content, opts = {}) {
  PAGE_NUM++;
  const extraClass = opts.cover ? ' page-cover' : '';
  return `<div class="page${extraClass}">
  ${opts.cover ? '' : `<div class="page-header">
    <div class="ph-left"><span class="ph-logo">📘</span> Cẩm nang Tuyển sinh Du học Hàn Quốc</div>
    <div class="ph-right">VISA D2-6</div>
  </div>`}
  ${opts.cover ? '' : '<div class="side-bar"></div>'}
  <div class="page-body${opts.cover ? ' page-body-cover' : ''}">
    ${content}
  </div>
  ${opts.cover ? '' : `<div class="page-footer-bar"></div>
  <div class="page-num">${PAGE_NUM}</div>`}
</div>`;
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  console.log('📡 Fetching data from API…');
  const [res, extrasRes] = await Promise.all([
    fetch(API_BASE + '/schools?_=' + Date.now()),
    fetch(API_BASE + '/schools?include=extras&_=' + Date.now()),
  ]);
  if (!res.ok) throw new Error('Schools API error: ' + res.status);
  if (!extrasRes.ok) throw new Error('Extras API error: ' + extrasRes.status);
  const json = await res.json();
  const extrasJson = await extrasRes.json();
  const raw = json.data || [];
  const visaChecklist = (extrasJson.data && extrasJson.data.visaChecklist) || [];
  console.log(`   → ${raw.length} schools received`);
  console.log(`   → ${visaChecklist.length} visa checklist items received`);

    // ─── Helper to strip Fastgo from text ───
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

  // ─── Recursively strip Fastgo from all strings in an object ───
  function sanitizeData(obj) {
    if (typeof obj === 'string') return stripFastgo(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeData);
    if (obj && typeof obj === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(obj)) {
        result[k] = sanitizeData(v);
      }
      return result;
    }
    return obj;
  }

  // Transform
  const allSchools = sanitizeData(raw).map(s => ({
    id: s.slug || s.id,
    name: s.name || '',
    visaType: s.visa_type || s.visaType || '',
    nameKr: s.name_kr || '',
    nameEn: s.name_en || '',
    system: s.system || '',
    quota: s.quota || 0,
    region: s.region || '',
    location: s.location || '',
    intro: s.intro || '',
    tuition: s.tuition || '',
    ktx: s.ktx || '',
    insurance: s.insurance || '',
    schedule: s.schedule || '',
    website: s.website || '',
    catalogUrl: s.catalog_url || '',
    videoUrl: s.video_url || '',
    videoTitle: s.video_title || '',
    conditions: (s.conditions || []).map(c => typeof c === 'string' ? c : c.text || '').filter(Boolean),
    majors: (s.majors || []).map(m => typeof m === 'string' ? m : m.text || '').filter(Boolean),
    advantages: (s.advantages || []).map(a => typeof a === 'string' ? a : a.text || '').filter(Boolean),
    conversion: (s.conversion || []).map(c => typeof c === 'string' ? c : c.text || '').filter(Boolean),
    documents: (s.documents || []).map(d => typeof d === 'string' ? d : d.text || '').filter(Boolean),
    partners: (s.partners || []).map(p => ({ code: p.code || '', name: p.name || '' })),
    mou: s.mou || '',
  }));

  // Ưu tiên link đã sửa tay trong file (nếu có) hơn dữ liệu API
  allSchools.forEach(s => {
    const ov = LINK_OVERRIDES[s.name];
    if (!ov) return;
    if (ov.catalog) s.catalogUrl = ov.catalog;
    if (ov.video) s.videoUrl = ov.video;
    if (ov.videoTitle) s.videoTitle = ov.videoTitle;
  });

  // Cẩm nang chỉ dành cho chương trình D2-6 (18 trường)
  const schools = allSchools.filter(s => s.visaType === 'D2-6');
  console.log(`   → ${schools.length} D2-6 schools (excluded ${allSchools.length - schools.length} non-D2-6)`);

  // Sort by region then name
  const regionOrder = ['seoul','near-seoul','incheon','gyeonggi','busan','gwangju',
    'chungcheongbuk','chungcheongnam','jeollanam','jeollabuk',
    'gyeongsangnam','gyeongsangbuk','gangwon','province'];
  schools.sort((a, b) => {
    const ai = regionOrder.indexOf(a.region);
    const bi = regionOrder.indexOf(b.region);
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return (a.name || '').localeCompare(b.name || '', 'vi');
  });

  // ─── Estimate page 2 height (with docs) to decide if a separate docs page is needed ───
  function needsDocSeparate(s, forceMerge) {
    if (forceMerge) return false;
    if (!s.documents || s.documents.length === 0) return false;
    const lineH = 19; // px per line for 11px font × ~1.6 line-height
    const secH = 28;  // section-title height (incl margin)
    const gap  = 12;  // gap between sections
    let h = 0;
    // Title row
    h += 45;
    // Majors (2-column): ceil(n/2) rows × lineH + section-title
    h += Math.ceil((s.majors || []).length / 2) * lineH + secH;
    // Conversion: sum of line counts × lineH + section-title
    // Split by newline, then count wrapping per segment for accuracy
    const convLines = (s.conversion || []).reduce((sum, c) => {
      const segs = c.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 45), 0);
    }, 0);
    h += Math.max(convLines * lineH, 40) + secH + gap;
    // Documents: sum of line counts × lineH + section-title
    // Split by newline, then count wrapping per segment for accuracy
    const docLines = s.documents.reduce((sum, d) => {
      const segs = d.split('\n');
      return sum + segs.reduce((s, seg) => s + 1 + Math.floor(seg.length / 90), 0);
    }, 0);
    const docH = docLines * lineH + secH;
    h += docH + gap;
    // Tuition (body-text, 12px font, 1.7 line-height ≈ 20.4px/line)
    const tuiLines = (s.tuition || '').split('\n').length + Math.floor((s.tuition || '').length / 45);
    const ktxLines = (s.ktx || '').split('\n').length + Math.floor((s.ktx || '').length / 45);
    h += Math.max(tuiLines, ktxLines) * 21 + secH + gap;
    // Partners (tên đầy đủ, 2 cột)
    const partnerRows = Math.ceil(Math.max((s.partners || []).length, s.mou ? 15 : 0) / 2);
    h += partnerRows * 18 + secH + gap;
    // Note card
    h += 80;
    // Available content height in print: ~940px (1017 − header 23 − body pad 48 − footer 8)
    return h > 940;
  }

  // ─── Build pages ────────────────────────────────────
  const pages = [];
  PAGE_NUM = 0;

  // Decide per-school: which schools need a separate docs page?
  // Sangmyung (idx=2) forced to merge for testing
  const schoolsNeedDocPage = schools.filter((s, i) => needsDocSeparate(s, i === 2));
  const schoolsWithExtraPages = schoolsNeedDocPage.length;

  // ═══ COVER ══════════════════════════════════════════
  pages.push(page(`
    <div class="cover-wrap">
      <div class="cover-accent-line"></div>
      <div class="cover-bg-img" style="background-image:url('${IMG.cover}');"></div>
      <div class="cover-overlay"></div>
      <div class="cover-inner">
        <div class="cover-badge">TÀI LIỆU DÀNH CHO ĐỐI TÁC</div>
        <div class="cover-title"><span class="gold">Cẩm nang</span><br>Tuyển sinh<br>Du học Hàn Quốc</div>
        <div class="cover-divider"></div>
        <div class="cover-visa">VISA D2-6</div>
        <div class="cover-subtitle"><strong>${schools.length} trường</strong> đối tác · Chương trình trao đổi sinh viên</div>
        <div class="cover-tagline">
          <h3>Thông tin chi tiết ${schools.length} trường</h3>
          <p>Điều kiện, chuyên ngành, học phí, hồ sơ và hướng dẫn tuyển sinh dành cho đối tác</p>
        </div>
      </div>
      <div class="cover-bottom-bar">
        <span>Lộ trình rõ ràng</span>
        <span class="sep">|</span>
        <span>Học chuyên ngành sớm</span>
        <span class="sep">|</span>
        <span>Cơ hội việc làm</span>
      </div>
    </div>
  `, { cover: true }));

  // ═══ TOC ════════════════════════════════════════════
  const totalSchools = schools.length;
  const schoolTotalPages = totalSchools * 2 + schoolsWithExtraPages;
  const compPage = 6 + 1 + schoolTotalPages;
  const checklistPage = compPage + 1;
  const faqPage = compPage + 1 + 2;
  const appendixPage = compPage + 1 + 2 + 1;
  pages.push(page(`
    <div class="toc-overlay-row">
      <div class="toc-overlay-badge">NỘI DUNG</div>
      <div class="toc-overlay-title">MỤC LỤC</div>
      <div class="toc-overlay-sub">Cẩm nang Tuyển sinh Du học Hàn Quốc — Visa D2-6</div>
    </div>

    <div class="toc-sections">
      <div class="toc-group">
        <div class="toc-group-title">📖 GIỚI THIỆU</div>
        <div class="toc-group-items">
          ${[
            { icon: '📌', label: 'Tổng quan chương trình D2-6', page: 3, badge: 'Phần 1', desc: 'Đối tượng, hình thức, quy mô & lợi ích' },
            { icon: '📋', label: 'Điều kiện & Hồ sơ tuyển sinh', page: 4, badge: 'Phần 2', desc: 'Điều kiện đầu vào, bộ hồ sơ D2-6' },
            { icon: '🔄', label: 'Lộ trình xử lý & Định hướng dài hạn', page: 5, badge: 'Phần 3', desc: '5 bước xử lý hồ sơ, lộ trình visa D2-6→E7' },
          ].map(item =>
            `<div class="toc-item">
              <div class="toc-item-icon">${item.icon}</div>
              <div class="toc-item-body">
                <span class="toc-item-label">${item.label}</span>
                <span class="toc-item-desc">${item.desc}</span>
              </div>
              <div class="toc-item-right">
                <span class="toc-item-page">tr. ${item.page}</span>
                <span class="toc-item-badge">${item.badge}</span>
              </div>
            </div>`
          ).join('')}
        </div>
      </div>

      <div class="toc-group">
        <div class="toc-group-title">🏫 DANH MỤC TRƯỜNG</div>
        <div class="toc-group-items">
          <div class="toc-item toc-item-schools">
            <div class="toc-schools-icon">🏫</div>
            <div class="toc-item-body" style="justify-content:center;">
              <span class="toc-item-label" style="font-size:14px;">Danh bạ <strong>${totalSchools} trường</strong> Hàn Quốc</span>
              <span class="toc-item-desc">Thông tin chi tiết từng trường — chuyên ngành, học phí, KTX, hồ sơ</span>
            </div>
            <div class="toc-item-right" style="justify-content:center;">
              <span class="toc-item-page">tr. 6 → ${6 + schoolTotalPages - 1}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="toc-group">
        <div class="toc-group-title">🔍 TRA CỨU</div>
        <div class="toc-group-items">
          ${[
            { icon: '📊', label: 'Bảng so sánh các trường', page: compPage, badge: 'Phần 5', desc: 'So sánh nhanh 18 trường theo tiêu chí' },
            { icon: '✅', label: 'Checklist hồ sơ Visa D2-6', page: checklistPage, badge: 'Phần 6', desc: 'Danh sách đầy đủ hồ sơ cần chuẩn bị' },
            { icon: '💡', label: 'Lưu ý dành cho đối tác', page: faqPage, badge: 'Phần 7', desc: 'Kỳ tuyển sinh, thời gian xử lý, FAQ' },
            { icon: '📎', label: 'Phụ lục — Thông tin & Liên hệ', page: appendixPage, badge: 'Phụ lục', desc: 'Website, cộng đồng, cập nhật dữ liệu' },
          ].map(item =>
            `<div class="toc-item">
              <div class="toc-item-icon">${item.icon}</div>
              <div class="toc-item-body">
                <span class="toc-item-label">${item.label}</span>
                <span class="toc-item-desc">${item.desc}</span>
              </div>
              <div class="toc-item-right">
                <span class="toc-item-page">tr. ${item.page}</span>
                <span class="toc-item-badge">${item.badge}</span>
              </div>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>

    <div class="toc-stats">
      <div class="toc-stat"><span class="toc-stat-num">${totalSchools}</span><span class="toc-stat-label">Trường</span></div>
      <div class="toc-stat"><span class="toc-stat-num">${pages.length + 1}</span><span class="toc-stat-label">Trang</span></div>
      <div class="toc-stat"><span class="toc-stat-num">${schoolsWithExtraPages}</span><span class="toc-stat-label">Trường có hồ sơ riêng</span></div>
      <div class="toc-stat"><span class="toc-stat-num">6+</span><span class="toc-stat-label">Khu vực</span></div>
    </div>
  `));

  // ═══ SECTION: OVERVIEW ══════════════════════════════
  pages.push(page(`
    <span class="section-badge">PHẦN 1</span>
    <h2 class="page-title" style="margin-top:2px;">Tổng quan chương trình D2-6</h2>
    <div class="body-text">
      <p>Visa D2-6 là diện du học trao đổi sinh viên, dựa trên thỏa thuận hợp tác (MOU) giữa trường tại Việt Nam và trường tại Hàn Quốc. Đây là chương trình phù hợp cho học sinh muốn có lộ trình học tập rõ ràng, với sự bảo trợ từ các trường đối tác.</p>
      <p>Điểm quan trọng của diện D2-6 là học sinh cần có trường tiếp nhận phù hợp, bộ hồ sơ chứng minh được mục đích học thật, và lộ trình chuyển đổi chuyên ngành rõ ràng sau khi hoàn thành chương trình.</p>
    </div>
    <div class="card-grid-2">
      <div class="info-card"><strong>🎯 Đối tượng</strong><br>Học sinh tốt nghiệp THPT hoặc đang học CĐ/ĐH tại Việt Nam.</div>
      <div class="info-card"><strong>📋 Hình thức</strong><br>D2-6 → D2-1 (CĐ) hoặc D2-6 → D2-2 (ĐH). Chuyển tiếp chuyên ngành.</div>
      <div class="info-card"><strong>🏫 Quy mô</strong><br>${schools.length} trường đối tác trên khắp Hàn Quốc.</div>
      <div class="info-card"><strong>🤝 Đối tác VN</strong><br>15+ trường CĐ/ĐH tại Việt Nam đã ký MOU.</div>
    </div>
    <span class="section-badge">PHẦN 1</span>
    <h2 class="page-title" style="margin-top:2px;">Lợi ích chương trình D2-6</h2>
    <div class="card-grid-2">
      <div class="info-card"><strong>📌 Lộ trình rõ ràng</strong><br>Hồ sơ có cơ sở từ chương trình hợp tác, giúp câu chuyện học tập dễ giải thích.</div>
      <div class="info-card"><strong>🎓 Học chuyên ngành sớm</strong><br>Học chuyên ngành thay vì chỉ học tiếng dài hạn.</div>
      <div class="info-card"><strong>💼 Cơ hội việc làm</strong><br>Thuận lợi hơn khi tìm thực tập, làm thêm hoặc việc làm sau tốt nghiệp.</div>
      <div class="info-card"><strong>🔄 Nền tảng chuyển đổi</strong><br>Sau D2-6 có thể lên D2-1/D2-2, rồi D10 (tìm việc) hoặc E7 (chuyên môn).</div>
    </div>
  `));

  // ═══ SECTION: CONDITIONS & DOCUMENTS ═══════════════
  pages.push(page(`
    <span class="section-badge">PHẦN 2</span>
    <h2 class="page-title" style="margin-top:2px;">Điều kiện &amp; Hồ sơ</h2>
    <h3 class="section-subtitle">Điều kiện tuyển sinh</h3>
    <div class="body-text">
      <p>Các điều kiện cần kiểm tra trước khi tư vấn và nộp hồ sơ cho học sinh:</p>
    </div>
    <div class="card-stack">
      <div class="info-card"><strong>📊 Học lực</strong><br>GPA ≥ 5.0, bảng điểm, số buổi nghỉ hợp lý.</div>
      <div class="info-card"><strong>🗣️ Tiếng Hàn</strong><br>TOPIK 2, Sejong 2B hoặc năng lực giao tiếp cơ bản.</div>
      <div class="info-card"><strong>💰 Tài chính</strong><br>Sổ tiết kiệm, xác nhận số dư, thu nhập gia đình minh bạch.</div>
      <div class="info-card"><strong>🏛️ Trường liên kết</strong><br>MOU, thư mời, giấy tờ trường Hàn phải khớp nhau.</div>
      <div class="info-card"><strong>🛂 Lịch sử visa</strong><br>Giải trình nếu từng trượt visa, chọn trường phù hợp.</div>
    </div>
    <h3 class="section-subtitle" style="margin-top:10px;">Bộ hồ sơ D2-6</h3>
    <div class="card-grid-2">
      <div class="info-card"><strong>📚 Học tập</strong><br>Bằng THPT/CĐ/ĐH, học bạ, bảng điểm, kế hoạch học tập.</div>
      <div class="info-card"><strong>🪪 Nhân thân</strong><br>Hộ chiếu, CCCD, khai sinh, sổ hộ khẩu, giấy tờ gia đình.</div>
      <div class="info-card"><strong>💵 Tài chính</strong><br>Sổ TK ≥ 10,000 USD, xác nhận số dư, sao kê, tài sản.</div>
      <div class="info-card"><strong>🏫 Trường</strong><br>Thư mời, MOU, quyết định cử đi, mẫu theo yêu cầu từng kỳ.</div>
    </div>
    <div class="warn-box">⚠️ Không dùng danh sách này thay thế việc kiểm tra yêu cầu mới nhất từ trường và ĐSQ/LSQ Hàn Quốc. Yêu cầu có thể thay đổi theo từng kỳ.</div>
  `));

  // ═══ SECTION: ROUTE ═══════════════════════════════
  pages.push(page(`
    <span class="section-badge">PHẦN 3</span>
    <h2 class="page-title" style="margin-top:2px;">Lộ trình xử lý hồ sơ</h2>
    <div class="body-text"><p>Quy trình <strong>5 bước</strong> dành cho đối tác khi tiếp nhận và xử lý hồ sơ học sinh đăng ký chương trình D2-6.</p></div>

    <div class="timeline">
      <div class="tl-step">
        <div class="tl-marker">
          <div class="tl-dot">1</div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="tl-card-header">
            <span class="tl-step-num">Bước 1</span>
            <span class="tl-step-time">⏱ 1-3 ngày</span>
          </div>
          <div class="tl-card-title">Đánh giá hồ sơ</div>
          <div class="tl-card-body">
            <div class="tl-tag-list">
              <span class="tl-tag">📊 Học lực GPA ≥ 5.0</span>
              <span class="tl-tag">🗣️ Tiếng Hàn (TOPIK 2+)</span>
              <span class="tl-tag">💰 Tài chính minh bạch</span>
              <span class="tl-tag">🛂 Lịch sử visa</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tl-step">
        <div class="tl-marker">
          <div class="tl-dot">2</div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="tl-card-header">
            <span class="tl-step-num">Bước 2</span>
            <span class="tl-step-time">⏱ 3-7 ngày</span>
          </div>
          <div class="tl-card-title">Chọn trường phù hợp</div>
          <div class="tl-card-body">
            <div class="tl-tag-list">
              <span class="tl-tag">📍 Khu vực mong muốn</span>
              <span class="tl-tag">💰 Học phí & KTX</span>
              <span class="tl-tag">🎓 Chuyên ngành đào tạo</span>
              <span class="tl-tag">📋 Điều kiện đầu vào</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tl-step">
        <div class="tl-marker">
          <div class="tl-dot">3</div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="tl-card-header">
            <span class="tl-step-num">Bước 3</span>
            <span class="tl-step-time">⏱ 1-2 tuần</span>
          </div>
          <div class="tl-card-title">Chuẩn bị giấy tờ</div>
          <div class="tl-card-body">
            <div class="tl-tag-list">
              <span class="tl-tag">📚 Học tập (bằng, bảng điểm)</span>
              <span class="tl-tag">🪪 Nhân thân (hộ chiếu, CCCD)</span>
              <span class="tl-tag">💰 Tài chính (sổ TK, sao kê)</span>
              <span class="tl-tag">🏫 MOU & thư mời trường</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tl-step">
        <div class="tl-marker">
          <div class="tl-dot">4</div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="tl-card-header">
            <span class="tl-step-num">Bước 4</span>
            <span class="tl-step-time">⏱ 1-3 tuần</span>
          </div>
          <div class="tl-card-title">Nộp trường & Xử lý</div>
          <div class="tl-card-body">
            <div class="tl-tag-list">
              <span class="tl-tag">📤 Nộp hồ sơ sang trường</span>
              <span class="tl-tag">📞 Theo dõi & bổ sung</span>
              <span class="tl-tag">🎙 Phỏng vấn (nếu có)</span>
              <span class="tl-tag">📩 Nhận thư mời nhập học</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tl-step">
        <div class="tl-marker">
          <div class="tl-dot">5</div>
        </div>
        <div class="tl-card">
          <div class="tl-card-header">
            <span class="tl-step-num">Bước 5</span>
            <span class="tl-step-time">⏱ 2-4 tuần</span>
          </div>
          <div class="tl-card-title">Nộp Visa D2-6</div>
          <div class="tl-card-body">
            <div class="tl-tag-list">
              <span class="tl-tag">✅ Kiểm tra hồ sơ lần cuối</span>
              <span class="tl-tag">🏛️ Nộp tại ĐSQ/LSQ Hàn Quốc</span>
              <span class="tl-tag">⏳ Chờ kết quả (2-4 tuần)</span>
              <span class="tl-tag">✈️ Nhập học tại Hàn Quốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tl-footer">
      <div class="tl-footer-stat"><span class="toc-stat-num">5</span><span class="toc-stat-label">Bước xử lý</span></div>
      <div class="tl-footer-stat"><span class="toc-stat-num">4-8</span><span class="toc-stat-label">Tuần tổng thời gian</span></div>
      <div class="tl-footer-stat"><span class="toc-stat-num">${totalSchools}</span><span class="toc-stat-label">Trường có thể nộp</span></div>
    </div>

    <div class="warn-box" style="margin-top:8px;">📌 <strong>Lưu ý:</strong> Thời gian xử lý mỗi bước có thể thay đổi tùy theo trường và kỳ tuyển sinh. Luôn kiểm tra hạn nộp hồ sơ cụ thể với từng trường.</div>
  `));

  // ═══ SECTION: TIMELINE + SCHOOL DIRECTORY INTRO (merged) ═
  pages.push(page(`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <span style="display:inline-block;width:4px;height:18px;background:linear-gradient(180deg,var(--accent),var(--gold));border-radius:2px;"></span>
      <span class="section-badge" style="margin-bottom:0;">PHẦN 3</span>
    </div>
    <h2 class="page-title" style="margin-top:2px;font-size:24px;">Định hướng dài hạn</h2>
    <div class="body-text" style="margin-bottom:8px;"><p>D2-6 không nên được nhìn như "đi cho nhanh", mà là bước đầu của lộ trình học chuyên ngành và phát triển sự nghiệp tại Hàn Quốc.</p></div>
    <div class="route-bar" style="margin-bottom:8px;">
      <div class="route-step r1"><span class="ri">🛂</span><span class="rl">D2-6</span><span class="rd">Trao đổi MOU</span></div>
      <div class="route-arrow">›</div>
      <div class="route-step r2"><span class="ri">🎓</span><span class="rl">D2-1/D2-2</span><span class="rd">CĐ (2-3n) / ĐH (4n)</span></div>
      <div class="route-arrow">›</div>
      <div class="route-step r3"><span class="ri">💼</span><span class="rl">D-10</span><span class="rd">Tìm việc (≤2 năm)</span></div>
      <div class="route-arrow">›</div>
      <div class="route-step r4"><span class="ri">🏆</span><span class="rl">E-7</span><span class="rd">Làm việc chuyên môn</span></div>
    </div>
    <div class="tip-box" style="margin-bottom:8px;padding:8px 10px;">⚡ <strong>Lời khuyên:</strong> Hãy định hướng ngay từ đầu về mục tiêu dài hạn. Chọn trường và ngành có tiềm năng chuyển E7.</div>

    <div style="margin:8px 0;border-top:1px solid var(--light-gray);"></div>

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
      <span style="display:inline-block;width:4px;height:18px;background:linear-gradient(180deg,var(--accent),var(--gold));border-radius:2px;"></span>
      <span class="section-badge" style="margin-bottom:0;">PHẦN 4</span>
    </div>
    <h2 class="page-title" style="margin-top:2px;font-size:20px;">Danh bạ ${schools.length} trường Hàn Quốc</h2>
    <div class="body-text" style="margin-bottom:6px;font-size:12px;">
      <p>Danh sách đầy đủ <strong>${schools.length} trường</strong> đang tuyển sinh D2-6. Chi tiết từng trường ở các trang sau.</p>
    </div>

    ${renderRegionGrid(schools)}

    <div class="toc-stats">
      <div class="toc-stat"><span class="toc-stat-num">${schools.length}</span><span class="toc-stat-label">Trường đối tác</span></div>
      <div class="toc-stat"><span class="toc-stat-num">6+</span><span class="toc-stat-label">Khu vực khác nhau</span></div>
      <div class="toc-stat"><span class="toc-stat-num">15+</span><span class="toc-stat-label">Đối tác VN</span></div>
    </div>

    <div style="margin-top:6px;padding:5px 8px;background:var(--off-white);border:1px solid var(--light-gray);border-radius:4px;font-size:9px;color:var(--gray);text-align:center;">
      📄 Xem chi tiết từng trường tại các trang 7 → ${6 + schoolTotalPages - 1}
    </div>
  `));

  // ═══ SCHOOL PAGES (2 per school) ══════════════════
  let prevRegion = '';
  schools.forEach((s, idx) => {
    const isNewRegion = s.region && s.region !== prevRegion;
    const regionBanner = isNewRegion
      ? `<div class="region-divider"><span class="rd-icon">📍</span><span class="rd-name">KHU VỰC ${esc(regionLabel(s.region).toUpperCase())}</span><span class="rd-count">${schools.filter(s2 => s2.region === s.region).length} trường</span></div>`
      : '';
    prevRegion = s.region;
    const badges = [];
    badges.push('<span class="sch-badge badge-system">' + esc(s.system || 'CĐ') + '</span>');
    badges.push('<span class="sch-badge badge-region">' + esc(regionLabel(s.region)) + '</span>');
    if (s.quota) badges.push('<span class="sch-badge badge-quota">Chỉ tiêu: ' + esc(s.quota) + '</span>');

    const hasVideo = s.videoUrl;
    const hasCatalog = s.catalogUrl;

    const imgSrc = (idx % 3 === 0) ? IMG.study : (idx % 3 === 1) ? IMG.campus : IMG.korea;

    // ─── Page 1: School info + conditions + advantages ───
    pages.push(page(`
      ${regionBanner}
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:10px;">
        <div class="sch-num">${idx + 1}</div>
        <div style="flex:1;">
          <div class="sch-name">${esc(s.name)}</div>
          ${s.nameKr ? '<div class="sch-name-kr">' + esc(s.nameKr.substring(0, 120)) + '</div>' : ''}
          ${s.nameEn ? '<div class="sch-name-en">' + esc(s.nameEn.substring(0, 120)) + '</div>' : ''}
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:36px;color:var(--accent);line-height:1;">${idx + 1}</div>
          <div style="font-size:10px;color:var(--gray);text-transform:uppercase;letter-spacing:0.5px;">/ ${schools.length}</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">${badges.join('')}</div>

      <div class="info-table-wrap">
        <table class="info-table">
          <tr><td class="il">Hệ học</td><td>${esc(s.system || 'Đang cập nhật')}</td></tr>
          <tr><td class="il">Khu vực</td><td>${esc(regionLabel(s.region))} ${s.location ? '— ' + esc(s.location.substring(0, 80)) : ''}</td></tr>
          <tr><td class="il">Chỉ tiêu</td><td>${s.quota ? esc(s.quota) : 'Đang cập nhật'}</td></tr>
          ${s.website ? '<tr><td class="il">Website</td><td>' + esc(s.website.substring(0, 60)) + '</td></tr>' : ''}
          ${s.schedule ? '<tr><td class="il">Lịch học</td><td>' + esc(s.schedule.substring(0, 60)) + '</td></tr>' : ''}
          ${s.insurance ? '<tr><td class="il">Bảo hiểm</td><td>' + esc(s.insurance.substring(0, 60)) + '</td></tr>' : ''}
          ${hasCatalog ? '<tr><td class="il">Catalog</td><td><a href="' + esc(s.catalogUrl) + '" target="_blank">Xem catalog</a></td></tr>' : ''}
          ${hasVideo ? '<tr><td class="il">Video</td><td><a href="' + esc(s.videoUrl) + '" target="_blank">' + esc(s.videoTitle || 'Xem giới thiệu') + '</a></td></tr>' : ''}
        </table>
      </div>

      ${s.intro ? '<div class="intro-box">' + sentenceBullets(s.intro) + '</div>' : ''}

      <div style="display:flex;gap:14px;margin-top:10px;">
        <div style="flex:1;">
          <h4 class="section-title">📋 Điều kiện</h4>
          ${renderList(s.conditions, 'Đang cập nhật')}
        </div>
        <div style="flex:1;">
          <h4 class="section-title">⭐ Ưu điểm</h4>
          ${renderBullets(s.advantages, 'Đang cập nhật')}
        </div>
      </div>
    `));

    // Decide: should docs go on page 2 or a separate page 3?
    // Sangmyung (idx=2) forced to merge for testing
    const needsSeparate = needsDocSeparate(s, idx === 2);

    // ─── Page 2: Majors + Conversion + Tuition + KTX + Partners + Note + (Docs if fits) ───
    pages.push(page(`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div class="sch-num" style="width:34px;height:34px;font-size:14px;">${idx + 1}</div>
        <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:16px;color:var(--navy);">${esc(s.name)} <span style="font-weight:400;color:var(--gray);font-size:12px;">(tiếp)</span></div>
      </div>

      <div style="display:flex;gap:14px;">
        <div style="flex:1;">
          <h4 class="section-title">🎓 Chuyên ngành</h4>
          ${renderBullets(s.majors, 'Đang cập nhật')}
        </div>
        <div style="flex:1;">
          <h4 class="section-title">🔄 Lộ trình chuyển đổi</h4>
          ${renderList(s.conversion, 'Đang cập nhật')}
        </div>
      </div>

      <div style="display:flex;gap:14px;margin-top:12px;">
        <div style="flex:1;">
          <h4 class="section-title">💰 Học phí</h4>
          ${s.tuition ? '<div class="body-text">' + esc(s.tuition).replace(/\n/g, '<br>') + '</div>' : '<span class="muted">Đang cập nhật</span>'}
        </div>
        <div style="flex:1;">
          <h4 class="section-title">🏠 Ký túc xá</h4>
          ${s.ktx ? '<div class="body-text">' + esc(s.ktx).replace(/\n/g, '<br>') + '</div>' : '<span class="muted">Đang cập nhật</span>'}
        </div>
      </div>

      ${(s.partners && s.partners.length) || s.mou ? `
      <div style="margin-top:12px;">
        <h4 class="section-title">🤝 Đối tác Việt Nam</h4>
        <div class="partner-box">${renderPartnerTags(s)}</div>
      </div>
      ` : ''}

      ${!needsSeparate && s.documents.length > 0 ? `
      <div style="margin-top:12px;">
        <h4 class="section-title">📄 Hồ sơ cần lưu ý</h4>
        ${renderList(s.documents, '')}
      </div>
      ` : ''}

      <div style="margin-top:12px;display:flex;align-items:center;gap:12px;padding:10px;background:#f5f6fa;border-radius:6px;">
        <img src="${imgSrc}" alt="" style="width:70px;height:50px;border-radius:4px;object-fit:cover;">
        <div style="font-size:10px;color:var(--gray);line-height:1.5;">
          <strong style="color:var(--navy);">💡 Ghi chú:</strong> Liên hệ để cập nhật thông tin tuyển sinh mới nhất và hướng dẫn nộp hồ sơ chi tiết.
        </div>
      </div>
    `));

    // ─── Page 3 (extra): Documents only — only for schools that truly need it ───
    if (needsSeparate) {
      pages.push(page(`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div class="sch-num" style="width:34px;height:34px;font-size:14px;">${idx + 1}</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:16px;color:var(--navy);">${esc(s.name)} <span style="font-weight:400;color:var(--gray);font-size:12px;">(tiếp)</span></div>
        </div>

        <h4 class="section-title" style="margin-top:4px;">📄 Hồ sơ cần lưu ý</h4>
        <div style="margin-top:4px;">
          ${renderList(s.documents, '')}
        </div>
      `));
    }
  });

  // ═══ PAGE: VISA CHECKLIST ═══════════════════════
  if (visaChecklist.length > 0) {
    const groupOrder = ['Hồ sơ visa','Hồ sơ học tập','Hồ sơ tài chính','Hồ sơ nhân thân','Hồ sơ bổ sung'];
    const grouped = {};
    visaChecklist.forEach(item => {
      const g = item.groupName || 'Khác';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(item);
    });

    function levelClass(level) {
      if (!level) return '';
      const l = level.toLowerCase();
      if (l.includes('bắt buộc') || l.includes('bat buoc')) return 'cl-level-bat-buoc';
      if (l.includes('nên') || l.includes('nen')) return 'cl-level-nen-co';
      return 'cl-level-tuy';
    }

    function renderChecklistPage(groupNames, isFirst) {
      let rows = [];

      groupNames.forEach(gName => {
        if (!grouped[gName]) return;
        const items = grouped[gName];
        rows.push(`<tr><td class="cl-group-label" colspan="4">📁 ${esc(gName)} (${items.length} mục)</td></tr>`);
        items.forEach(item => {
          const levelHtml = item.level
            ? `<span class="cl-level ${levelClass(item.level)}">${esc(item.level)}</span>`
            : '';
          const noteHtml = item.note ? `<br><span class="checklist-note">💡 ${esc(item.note)}</span>` : '';
          rows.push(`<tr><td class="cl-stt">${esc(item.stt)}</td><td>${esc(item.content)}${noteHtml}</td><td>${levelHtml}</td></tr>`);
        });
      });

      return page(`
        <span class="section-badge">PHẦN 6</span>
        <h2 class="page-title" style="margin-top:2px;">Checklist hồ sơ Visa D2-6${isFirst ? '' : ' <span style="font-weight:400;font-size:13px;color:var(--gray);">(tiếp)</span>'}</h2>
        ${isFirst ? `<div class="body-text" style="margin-bottom:6px;">
          <p>Danh sách <strong>${visaChecklist.length} mục</strong> hồ sơ cần chuẩn bị cho quy trình xin Visa D2-6, phân loại theo nhóm.</p>
        </div>` : ''}
        <table class="checklist-table">
          <thead><tr><th style="width:22px;">#</th><th>Nội dung</th><th style="width:80px;">Phân loại</th></tr></thead>
          <tbody>${rows.join('')}</tbody>
        </table>
        <div class="warn-box">⚠️ Danh sách mang tính tham khảo. Yêu cầu có thể thay đổi theo từng kỳ và từng trường. Luôn kiểm tra hướng dẫn mới nhất từ ĐSQ/LSQ Hàn Quốc.</div>
      `);
    }

    // Phân trang: [visa + học tập] [tài chính] [nhân thân + bổ sung] — giống file đã sửa tay
    const availableGroups = groupOrder.filter(g => grouped[g] && grouped[g].length > 0);
    let checklistPages = [];
    if (availableGroups.length >= 5) {
      checklistPages = [availableGroups.slice(0, 2), availableGroups.slice(2, 3), availableGroups.slice(3)];
    } else {
      // Fallback: mỗi trang tối đa ~18 mục, không cắt giữa nhóm
      const MAX_ITEMS_PER_PAGE = 18;
      let curPage = [];
      let curCount = 0;
      availableGroups.forEach(g => {
        const items = grouped[g] || [];
        if (!items.length) return;
        if (curPage.length && curCount + items.length > MAX_ITEMS_PER_PAGE) {
          checklistPages.push(curPage);
          curPage = [];
          curCount = 0;
        }
        curPage.push(g);
        curCount += items.length;
      });
      if (curPage.length) checklistPages.push(curPage);
    }

    checklistPages.forEach((groups, idx) => {
      pages.push(renderChecklistPage(groups, idx === 0));
    });
  }

  // ═══ PAGE: COMPARISON TABLE (chia 2 trang nếu cần) ══════
  const tableRows = schools.map((s, i) => {
    const tuitionShort = (s.tuition || '').replace(/\n/g, ' ').substring(0, 35) || '—';
    const ktxShort = (s.ktx || '').replace(/\n/g, ' ').substring(0, 30) || '—';
    let partnerStr = '—';
    if (s.partners.length) partnerStr = s.partners.length + ' đối tác VN';
    else if (s.mou) partnerStr = esc(s.mou.substring(0, 18));
    return `<tr class="${regionClass(s.region)}">
      <td>${i + 1}</td>
      <td><strong>${esc(s.name)}</strong></td>
      <td>${esc(s.system || '—').substring(0, 20)}</td>
      <td>${esc(regionLabel(s.region))}</td>
      <td>${esc(tuitionShort)}</td>
      <td>${esc(ktxShort)}</td>
      <td>${s.majors.length}</td>
      <td>${partnerStr}</td>
    </tr>`;
  });

  const legendHtml = `
    <div class="table-legend">
      <strong>Khu vực:</strong>
      <span class="legend-item" style="border-left-color:#2563eb;">Seoul</span>
      <span class="legend-item" style="border-left-color:#0f766e;">Gần Seoul</span>
      <span class="legend-item" style="border-left-color:#d97706;">Busan</span>
      <span class="legend-item" style="border-left-color:#7c3aed;">Gwangju</span>
      <span class="legend-item" style="border-left-color:#0891b2;">Chungcheong</span>
      <span class="legend-item" style="border-left-color:#be123c;">Gyeongsang</span>
      <span class="legend-item" style="border-left-color:#15803d;">Gangwon</span>
    </div>`;

  // 18 dòng → chia 9 + 9 (trang 2 có tiêu đề "(tiếp)")
  const perPage = Math.ceil(tableRows.length / 2);
  const chunks = [tableRows.slice(0, perPage), tableRows.slice(perPage)].filter(c => c.length);
  chunks.forEach((chunk, idx) => {
    const isFirst = idx === 0;
    pages.push(page(`
      ${isFirst ? '<span class="section-badge">PHẦN 5</span>' : ''}
      ${isFirst
        ? '<h2 class="page-title" style="margin-top:2px;">Bảng so sánh các trường</h2>'
        : '<h4 class="section-subtitle" style="margin-top:2px;">Bảng so sánh các trường <span style="font-weight:400;color:var(--gray);font-size:12px;">(tiếp)</span></h4>'}
      <table class="compare-table">
        <thead><tr>
          <th>#</th>
          <th>Trường</th>
          <th>Hệ</th>
          <th>Khu vực</th>
          <th>Học phí</th>
          <th>KTX</th>
          <th>Ngành</th>
          <th>Đối tác</th>
        </tr></thead>
        <tbody>${chunk.join('')}</tbody>
      </table>
      ${legendHtml}
    `));
  });

  // ═══ PAGE: FAQ / PARTNER NOTES ══════════════════
  const semesterInfo = 'Kỳ tháng 3/2027';
  const semesterNote = 'Hiện tại đang tuyển sinh kỳ tháng 3/2027. Thông tin kỳ tuyển sinh có thể thay đổi, vui lòng kiểm tra website để cập nhật mới nhất.';
  pages.push(page(`
    <span class="section-badge">📌 LƯU Ý</span>
    <h2 class="page-title" style="margin-top:2px;">Dành cho đối tác</h2>
    <div class="body-text"><p>Những điểm cần lưu ý khi tư vấn và xử lý hồ sơ D2-6 cho học sinh.</p></div>

    <div style="margin-top:8px;">
      <h4 class="section-title">📅 Kỳ tuyển sinh</h4>
      <div class="faq-card">
        <strong>${semesterInfo}</strong>
        <p>${semesterNote}</p>
      </div>
    </div>

    <div style="margin-top:10px;">
      <h4 class="section-title">⏱ Thời gian xử lý</h4>
      <div class="faq-grid">
        <div class="faq-card"><strong>Đánh giá hồ sơ</strong><p>1-3 ngày</p></div>
        <div class="faq-card"><strong>Chọn trường</strong><p>3-7 ngày</p></div>
        <div class="faq-card"><strong>Chuẩn bị giấy tờ</strong><p>1-2 tuần</p></div>
        <div class="faq-card"><strong>Xử lý visa</strong><p>2-4 tuần</p></div>
      </div>
    </div>

    <div style="margin-top:10px;">
      <h4 class="section-title">❓ Câu hỏi thường gặp</h4>
      <div class="faq-item">
        <strong>Học sinh cần Topik mấy?</strong>
        <p>Đa số trường yêu cầu Topik 2 hoặc Sejong 2B. Một số trường không yêu cầu chứng chỉ tiếng khi tham gia chương trình D2-6.</p>
      </div>
      <div class="faq-item">
        <strong>Có cần phỏng vấn ĐSQ không?</strong>
        <p>Hầu hết các trường D2-6 không yêu cầu phỏng vấn tại Đại sứ quán. Hồ sơ được xét duyệt qua trường và cơ quan xuất nhập cảnh.</p>
      </div>
      <div class="faq-item">
        <strong>Học sinh có thể đi làm thêm không?</strong>
        <p>Sau khi có chứng minh thư ngoại quốc (ARC), học sinh được phép làm thêm theo quy định của Bộ Lao động Hàn Quốc.</p>
      </div>
      <div class="faq-item">
        <strong>Thời gian học D2-6 kéo dài bao lâu?</strong>
        <p>Thông thường 6 tháng đến 1 năm, sau đó chuyển tiếp lên chuyên ngành D2-1 (CĐ) hoặc D2-2 (ĐH).</p>
      </div>
      <div class="faq-item">
        <strong>Học phí trung bình một năm bao nhiêu?</strong>
        <p>Dao động từ 1.800.000 KRW đến 6.000.000 KRW/năm tùy trường, tùy ngành. Hầu hết các trường đều có học bổng giảm 50% cho sinh viên D2-6 ngay kỳ đầu.</p>
      </div>
      <div class="faq-item">
        <strong>Có thể đổi trường sau khi sang Hàn không?</strong>
        <p>Việc đổi trường cần có sự đồng ý của trường đang theo học và trường tiếp nhận. Cần làm thủ tục chuyển trường qua cơ quan xuất nhập cảnh và gia hạn visa nếu cần.</p>
      </div>
    </div>
  `));

  // ═══ PAGE: BACK COVER ══════════════════════════════
  const backImg = 'https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/h%C3%ACnh%20%E1%BA%A3nh%20h%C3%A0n%20qu%E1%BB%91c/1/hinh-anh-han-quoc-1.jpg';
  pages.push(page(`
    <div class="backcover-wrap">
      <div class="backcover-bg" style="background-image:url('${backImg}');"></div>
      <div class="backcover-overlay"></div>
      <div class="backcover-accent-bar"></div>

      <div class="backcover-top">
        <div class="backcover-badge">📖 PHỤ LỤC</div>
        <div class="backcover-title">Thông tin &amp; Liên hệ</div>
        <div class="backcover-divider"></div>
      </div>

      <div class="backcover-stats">
        <div class="bc-stat"><span class="bc-stat-num">${schools.length}</span><span class="bc-stat-label">Trường đối tác</span></div>
        <div class="bc-stat"><span class="bc-stat-num">${visaChecklist.length}</span><span class="bc-stat-label">Mục checklist</span></div>
        <div class="bc-stat"><span class="bc-stat-num">6+</span><span class="bc-stat-label">Khu vực khác nhau</span></div>
      </div>

      <div class="backcover-quote">
        <div class="bc-quote-mark">"</div>
        <p>Đồng hành cùng đối tác trong việc cung cấp thông tin tuyển sinh chính xác, kịp thời và toàn diện về chương trình Visa D2-6 tại Hàn Quốc.</p>
        <div class="bc-quote-author">Du học Hàn Quốc</div>
      </div>

      <div class="backcover-cards">
        <a class="bc-card" href="https://thongtintruonghan.vercel.app" target="_blank">
          <span class="bc-card-icon">🌐</span>
          <span class="bc-card-title">Website tra cứu</span>
          <span class="bc-card-desc">So sánh trường, công cụ tư vấn, cập nhật mới nhất</span>
          <span class="bc-card-link">thongtintruonghan.vercel.app →</span>
        </a>
        <a class="bc-card" href="https://zalo.me/g/4x7gts4riwvmxthrcaaq" target="_blank">
          <span class="bc-card-icon">💬</span>
          <span class="bc-card-title">Cộng đồng Zalo</span>
          <span class="bc-card-desc">Cập nhật tuyển sinh, catalog, tư vấn trực tiếp</span>
          <span class="bc-card-link">Tham gia nhóm Zalo →</span>
        </a>
      </div>

      <div class="backcover-footer">
        <div class="bc-footer-line"></div>
        <div class="bc-footer-text">Cẩm nang Tuyển sinh Du học Hàn Quốc — Visa D2-6</div>
        <div class="bc-footer-sub">Dữ liệu được cập nhật định kỳ · Phiên bản mới nhất</div>
      </div>
    </div>
  `, { cover: true }));

  // ═══ ASSEMBLE HTML ═══════════════════════════════
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cẩm nang Tuyển sinh Du học Hàn Quốc</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Noto+Sans:wght@400;600;700&family=Libre+Baskerville:ital@0;1&display=swap" rel="stylesheet">
<style>

:root {
  --navy:  #1B3A6B;
  --accent:#C0272D;
  --blue:  #2E6DB4;
  --gold:  #C9A84C;
  --white: #fff;
  --off-white: #f7f8fa;
  --gray:  #6b7280;
  --light-gray: #e8ecf0;
  --text:  #1a1a2e;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  background: #e9eef5;
  font-family: 'Noto Sans', sans-serif;
  font-size: 14px;
  color: var(--text);
  line-height: 1.65;
}

/* ─── Print button ─── */
.print-btn {
  position: fixed; top: 16px; right: 16px; z-index: 9999;
  background: var(--accent); color: white;
  border: none; padding: 10px 22px; border-radius: 6px;
  font-family: 'Montserrat', sans-serif; font-weight: 700;
  cursor: pointer; font-size: 13px; letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(192,39,45,0.4);
}
.print-btn:hover { background: #a01f24; }

/* ─── Page ─── */
.page {
  width: 595px;
  min-height: 842px;
  background: white;
  margin: 0 auto 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  page-break-after: always;
}
@media print {
  body {
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    margin: 0;
    size: A4;
  }
  .print-btn { display: none; }
  .page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    padding: 14mm 18mm;
    margin: 0;
    box-shadow: none;
    page-break-after: always;
  }
  .page-body {
    padding: 8px 0 40px;
    min-height: 0;
  }
  .side-bar { display: none; }
  .backcover-stats {
    backdrop-filter: none;
    background: rgba(255,255,255,0.15);
  }
  .bc-card {
    background: rgba(255,255,255,0.12);
  }
  .page-body-cover {
    padding: 0;
    min-height: 0;
  }
  .page-cover {
    display: flex;
    flex-direction: column;
  }
  .page-cover .page-body-cover {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .page-cover .cover-wrap {
    flex: 1;
    min-height: 0;
    height: auto;
  }
  .page-cover .backcover-wrap {
    flex: 1;
    min-height: 0;
    height: auto;
  }
  .page-header {
    padding: 6px 0;
  }
  .cover-overlay {
    background: linear-gradient(135deg, rgba(13,27,51,0.65) 0%, rgba(13,27,51,0.85) 100%);
  }
  .cover-tagline {
    backdrop-filter: none;
    background: rgba(27,58,107,0.9);
  }
  .cover-bottom-bar {
    backdrop-filter: none;
    background: rgba(10,22,40,0.9);
  }
  .cover-accent-line {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* ─── Header ─── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 24px;
  border-bottom: 1px solid var(--light-gray);
  font-size: 11px;
  color: var(--gray);
}
.ph-left { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.ph-logo { font-size: 14px; }
.ph-right { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; color: var(--accent); }

/* ─── Side accent ─── */
.side-bar {
  position: absolute; right:0; top:0; bottom:0;
  width: 6px; background: var(--accent);
}

/* ─── Body ─── */
.page-body {
  padding: 12px 20px 40px;
  min-height: 760px;
  position: relative;
}
.page-body-cover { padding: 0; min-height: 842px; }

/* ─── Footer ─── */
.page-footer-bar {
  position: absolute; bottom:0; left:0; right:0;
  height: 8px; background: var(--accent);
}
.page-num {
  position: absolute; bottom: 16px; left:50%; transform:translateX(-50%);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 11px; color: var(--gray);
}

/* ─── Cover ─── */
.cover-wrap {
  min-height: 842px; position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  background: #0d1b33;
}
.cover-bg-img {
  position: absolute; inset:0;
  background-size: cover; background-position: center;
  opacity: 1;
}
.cover-overlay {
  position: absolute; inset:0; z-index:1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255,255,255,0.15) 100%);
}
.cover-accent-line {
  position: absolute; top: 0; left: 0; right: 0; z-index:3;
  height: 5px;
  background: linear-gradient(90deg, var(--accent), var(--gold), var(--accent));
}
.cover-inner {
  position: relative; z-index:2;
  flex:1; display:flex; flex-direction:column;
  padding: 50px 44px; justify-content: center;
}
.cover-badge {
  display: inline-block; align-self:flex-start;
  padding: 6px 18px;
  background: rgba(0,0,0,0.55);
  border: 1px solid var(--gold);
  color: var(--gold);
  border-radius: 999px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 9px; letter-spacing: 2.5px;
  text-transform: uppercase; margin-bottom: 24px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.6);
}
.cover-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 48px; line-height: 1.08;
  color: white; margin-bottom: 4px;
  letter-spacing: -1px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.4);
}
.cover-title .gold { color: var(--gold); }
.cover-divider {
  width: 60px; height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--accent));
  margin: 12px 0 14px;
  border-radius: 2px;
}
.cover-subtitle {
  font-size: 13px; color: rgba(255,255,255,0.85);
  margin-bottom: 10px; line-height: 1.6;
  max-width: 420px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.cover-subtitle strong { color: var(--gold); }
.cover-visa {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 60px; line-height: 1;
  color: var(--accent); letter-spacing: -2px;
  text-transform: uppercase; margin-bottom: 18px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.4);
}
.cover-tagline {
  display: inline-block; align-self:flex-start;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  padding: 14px 22px; max-width: 340px;
  border-radius: 6px;
}
.cover-tagline h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; font-size: 11px; color: var(--gold);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 4px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}
.cover-tagline p {
  font-family: 'Libre Baskerville', serif;
  font-style: italic; font-size: 10px; color: rgba(255,255,255,0.9);
  line-height: 1.5;
  text-shadow: 0 1px 8px rgba(0,0,0,0.4);
}
.cover-bottom-bar {
  position: absolute; bottom:0; left:0; right:0; z-index:3;
  background: rgba(10,22,40,0.75);
  backdrop-filter: blur(4px);
  height: 44px;
  display: flex; align-items: center; justify-content: center; gap: 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.cover-bottom-bar span {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 9px; color: rgba(255,255,255,0.8);
  letter-spacing: 2.5px; text-transform: uppercase;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.cover-bottom-bar .sep { color: rgba(255,255,255,0.15); }

/* ─── Titles ─── */
.page-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 28px; line-height: 1.15;
  color: var(--accent); text-transform: uppercase;
  margin-bottom: 10px; letter-spacing: -0.3px;
}
.toc-title { text-align: center; font-size: 36px; margin: 20px 0; }
.section-badge {
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 10px; letter-spacing: 1.5px;
  color: var(--accent); text-transform: uppercase;
  margin-bottom: 2px;
}
.section-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 13px; text-transform: uppercase;
  color: var(--navy); margin: 10px 0 4px;
  letter-spacing: 0.5px;
}
.section-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 11px; text-transform: uppercase;
  color: var(--accent); letter-spacing: 0.3px;
  border-bottom: 2px solid var(--accent);
  padding-bottom: 2px; margin: 8px 0 4px;
}

/* ─── Body text ─── */
.body-text { font-size: 13px; line-height: 1.7; color: #2a2a3a; }
.body-text p { margin-bottom: 6px; }
  position: relative;
}
.toc-overlay-row {
  margin-top: -50px;
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, var(--navy) 0%, #264d8a 100%);
  border-radius: 8px;
  padding: 18px 20px 14px;
  margin-left: 8px;
  margin-right: 8px;
}
.toc-overlay-badge {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 8px; letter-spacing: 2px;
  color: var(--gold); text-transform: uppercase;
  margin-bottom: 2px;
}
.toc-overlay-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 32px;
  color: white; line-height: 1.1;
  letter-spacing: -0.5px;
}
.toc-overlay-sub {
  font-size: 9px; color: rgba(255,255,255,0.5);
  margin-top: 2px;
}

.toc-sections {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.toc-group {
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  overflow: hidden;
}
.toc-group-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; font-size: 10px;
  color: var(--navy);
  padding: 6px 12px;
  background: var(--off-white);
  border-bottom: 1px solid var(--light-gray);
  letter-spacing: 0.5px;
}
.toc-group-items {
  display: flex;
  flex-direction: column;
}
.toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-bottom: 1px solid #f0f0f4;
  text-decoration: none;
  transition: background 0.15s;
}
.toc-item:last-child { border-bottom: none; }
.toc-item-icon {
  font-size: 18px;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}
.toc-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.toc-item-label {
  font-weight: 700;
  font-size: 11px;
  color: var(--navy);
  line-height: 1.3;
}
.toc-item-desc {
  font-size: 10px;
  color: var(--gray);
  line-height: 1.3;
  margin-top: 1px;
}
.toc-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
.toc-item-page {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 11px;
  color: var(--accent);
}
.toc-item-badge {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 8px;
  color: var(--gray);
  background: var(--off-white);
  padding: 1px 6px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.toc-item-schools {
  padding: 12px;
  background: linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%);
}
.toc-schools-icon {
  font-size: 32px;
  width: 44px;
  text-align: center;
}

.toc-stats {
  display: flex;
  gap: 0;
  margin-top: 12px;
  background: var(--off-white);
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  overflow: hidden;
}
.toc-stat {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-right: 1px solid var(--light-gray);
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.toc-stat:last-child { border-right: none; }
.toc-stat-num {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
}
.toc-stat-label {
  font-size: 9px;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ─── Section hero ─── */
.section-hero {
  width: 100%; height: 90px;
  background-size: cover; background-position: center;
  border-radius: 4px; margin-bottom: 6px;
}

/* ─── Info cards ─── */
.info-card {
  padding: 10px 12px;
  background: var(--off-white);
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 12px; line-height: 1.55;
  margin-bottom: 6px;
}
.info-card strong { color: var(--navy); display: block; margin-bottom: 2px; }
.card-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 6px 0; }
.card-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin: 6px 0; }
.card-stack { margin: 6px 0; }
.warn-box {
  padding: 10px 12px;
  border-left: 3px solid var(--gold);
  background: #fffbeb;
  font-size: 11px; margin: 8px 0; line-height: 1.55;
}
.tip-box {
  padding: 10px 12px;
  border-left: 3px solid var(--blue);
  background: #f0f7ff;
  font-size: 11px; margin: 8px 0; line-height: 1.55;
}

/* ─── Timeline (Route) ─── */
.timeline {
  margin: 10px 0;
  position: relative;
}
.tl-step {
  display: flex;
  gap: 14px;
  margin-bottom: 6px;
}
.tl-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 28px;
  flex-shrink: 0;
}
.tl-dot {
  width: 28px; height: 28px;
  background: var(--navy);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 12px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.tl-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(180deg, var(--navy) 0%, var(--accent) 100%);
  margin: 2px 0;
  min-height: 20px;
}
.tl-card {
  flex: 1;
  background: var(--off-white);
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 2px;
}
.tl-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}
.tl-step-num {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.5px;
}
.tl-step-time {
  font-size: 10px;
  color: var(--gray);
  font-weight: 600;
}
.tl-card-title {
  font-weight: 700;
  font-size: 12px;
  color: var(--navy);
  margin-bottom: 5px;
  line-height: 1.3;
}
.tl-card-body {
  font-size: 10px;
  color: var(--text);
  line-height: 1.5;
}
.tl-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tl-tag {
  background: white;
  border: 1px solid var(--light-gray);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  color: #333;
  line-height: 1.3;
}
.tl-footer {
  display: flex;
  gap: 0;
  margin-top: 8px;
  background: var(--off-white);
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  overflow: hidden;
}
.tl-footer-stat {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-right: 1px solid var(--light-gray);
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.tl-footer-stat:last-child { border-right: none; }

/* ─── Route bar ─── */
.route-bar {
  display: flex; align-items: stretch; gap: 0;
  margin: 10px 0; page-break-inside: avoid;
}
.route-step {
  flex: 1; padding: 10px 6px; text-align: center;
}
.route-step .ri { font-size: 20px; display: block; margin-bottom: 2px; }
.route-step .rl { font-weight: 800; font-size: 12px; display: block; }
.route-step .rd { font-size: 9px; color: var(--gray); display: block; line-height: 1.4; }
.route-arrow {
  display: flex; align-items: center;
  font-size: 20px; color: var(--gray); padding: 0 2px;
}
.r1 { background: #dbeafe; border-radius: 6px 0 0 6px; } .r1 .rl { color: #1d4ed8; }
.r2 { background: #e0f2fe; } .r2 .rl { color: #0369a1; }
.r3 { background: #ccfbf1; } .r3 .rl { color: #0f766e; }
.r4 { background: #fef3c7; border-radius: 0 6px 6px 0; } .r4 .rl { color: #b45309; }

/* ─── Lists ─── */
ol.num-list { padding-left: 18px; font-size: 12px; line-height: 1.6; }
ol.num-list li { margin-bottom: 3px; }
ul.dot-list { padding-left: 16px; font-size: 12px; line-height: 1.55; }
ul.dot-list li { margin-bottom: 2px; }
ul.dot-list.compact { column-count: 2; column-gap: 12px; }
.muted { color: var(--gray); font-style: italic; font-size: 10px; }

/* ─── School ─── */
.sch-num {
  width: 40px; height: 40px;
  background: var(--navy); color: white;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 16px;
  flex-shrink: 0;
}
.sch-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 20px; color: var(--navy); line-height: 1.15;
}
.sch-name-kr { font-size: 12px; color: var(--gray); }
.sch-name-en { font-size: 11px; color: var(--gray); }
.sch-badge {
  display: inline-block;
  padding: 2px 8px; border-radius: 999px;
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-system { background: #dbeafe; color: #1d4ed8; }
.badge-region { background: #d1fae5; color: #065f46; }
.badge-quota { background: #fef3c7; color: #92400e; }

.info-table-wrap { margin: 6px 0; }
.info-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.info-table td { padding: 4px 8px; border-bottom: 1px solid var(--light-gray); vertical-align: top; }
.info-table .il { font-weight: 700; color: var(--navy); width: 85px; font-size: 10px; white-space: nowrap; }
.info-table tr:nth-child(even) td { background: var(--off-white); }
.info-table a { color: var(--blue); }

.intro-box {
  padding: 8px 10px;
  background: #f0f4ff;
  border: 1px solid #dbeafe;
  border-radius: 4px;
  margin: 6px 0;
  font-size: 11px;
}
.intro-box ul { padding-left: 14px; }
.intro-box li { margin-bottom: 3px; line-height: 1.5; }

.partner-box {
  font-size: 11px; line-height: 1.7; color: var(--navy); padding: 4px 0;
}

/* ─── Checklist table ─── */
.checklist-table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 6px 0; }
.checklist-table th {
  background: var(--navy); color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; padding: 5px 6px; text-align: left;
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;
}
.checklist-table td { padding: 3px 6px; border-bottom: 1px solid var(--light-gray); vertical-align: top; line-height: 1.4; font-size: 10px; }
.checklist-table tr:nth-child(even) td { background: var(--off-white); }
.checklist-table .cl-stt { width: 22px; text-align: center; font-weight: 700; color: var(--accent); font-size: 9px; }
.checklist-table .cl-level {
  display: inline-block;
  padding: 1px 5px; border-radius: 3px;
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.3px;
}
.cl-level-bat-buoc { background: #fee2e2; color: #b91c1c; }
.cl-level-nen-co { background: #fef3c7; color: #92400e; }
.cl-level-tuy { background: #e0e7ff; color: #3730a3; }
.cl-group-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; font-size: 10px; text-transform: uppercase;
  color: var(--navy); letter-spacing: 0.3px;
  background: var(--off-white) !important;
  padding: 5px 6px !important;
  border-bottom: 2px solid var(--accent) !important;
}
.checklist-note { font-size: 9px; color: var(--gray); font-style: italic; }

/* ─── Compare table ─── */
.compare-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.compare-table th {
  background: var(--navy); color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; padding: 6px 5px; text-align: left;
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;
}
.compare-table td { padding: 4px 5px; border-bottom: 1px solid var(--light-gray); vertical-align: top; line-height: 1.4; }
.compare-table tr:nth-child(even) td { background: var(--off-white); }
.compare-table .region-seoul { border-left: 3px solid #2563eb; }
.compare-table .region-near-seoul, .compare-table .region-gyeonggi, .compare-table .region-incheon { border-left: 3px solid #0f766e; }
.compare-table .region-busan { border-left: 3px solid #d97706; }
.compare-table .region-gwangju { border-left: 3px solid #7c3aed; }
.compare-table .region-province { border-left: 3px solid #64748b; }
.compare-table .region-chungcheong, .compare-table .region-chungcheongbuk, .compare-table .region-chungcheongnam { border-left: 3px solid #0891b2; }
.compare-table .region-gyeongsang, .compare-table .region-gyeongsangnam, .compare-table .region-gyeongsangbuk { border-left: 3px solid #be123c; }
.compare-table .region-gangwon { border-left: 3px solid #15803d; }

.table-legend { font-size: 9px; color: var(--gray); text-align: center; margin-top: 8px; }
.legend-item { display: inline-block; border-left: 3px solid; padding-left: 4px; margin: 0 4px; }

/* ─── Appendix ─── */
.appendix-grid { display: grid; gap: 8px; }
.appendix-card {
  padding: 12px 14px;
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  background: var(--off-white);
}
.appendix-card strong { font-family: 'Montserrat', sans-serif; color: var(--navy); display: block; margin-bottom: 2px; }
.appendix-card p { font-size: 11px; color: var(--gray); margin-bottom: 4px; }
.appendix-card a { color: var(--blue); font-weight: 600; font-size: 11px; }

/* ─── Region divider ─── */
.region-divider {
  margin: 0 0 14px 0;
  padding: 10px 14px;
  background: linear-gradient(135deg, var(--navy) 0%, #264d8a 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  page-break-inside: avoid;
}
.rd-icon { font-size: 18px; }
.rd-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; font-size: 12px;
  color: white;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  flex: 1;
}
.rd-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; font-weight: 600;
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.15);
  padding: 2px 8px;
  background-size: cover; background-position: center;
  border-radius: 4px; margin-bottom: 6px;
}
.faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 6px 0;
}
.faq-card {
  padding: 10px 12px;
  background: var(--off-white);
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  font-size: 11px; line-height: 1.55;
}
.faq-card strong {
  display: block;
  color: var(--navy);
  margin-bottom: 2px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.faq-card p { font-size: 11px; color: var(--gray); margin: 0; }
.faq-item {
  padding: 8px 10px;
  border-bottom: 1px solid var(--light-gray);
  font-size: 11px; line-height: 1.5;
}
.faq-item:last-child { border-bottom: none; }
.faq-item strong {
  display: block;
  color: var(--navy);
  margin-bottom: 1px;
}
.faq-item p {
  font-size: 10px; color: var(--gray);
  margin: 0;
}

/* ─── Back Cover ─── */
.backcover-wrap {
  min-height: 842px; position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  background: none;
}
.backcover-bg {
  position: absolute; inset:0;
  background-size: cover; background-position: center;
  opacity: 1;
}
.backcover-overlay {
  display: none;
}
.backcover-accent-bar {
  position: absolute; left:0; right:0; top:0;
  height: 5px;
  background: linear-gradient(90deg, var(--accent), var(--gold), var(--accent));
  z-index:2;
}
.backcover-top {
  position: relative; z-index:2;
  padding: 36px 30px 12px;
}
.backcover-badge {
  display: inline-block;
  padding: 4px 14px;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 999px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 8px; letter-spacing: 2px;
  color: var(--gold); text-transform: uppercase;
  margin-bottom: 10px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}
.backcover-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 36px;
  color: white; line-height: 1.1;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5);
}
.backcover-divider {
  width: 50px; height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--accent));
  margin: 14px 0 16px;
  border-radius: 2px;
}
.backcover-stats {
  position: relative; z-index:2;
  display: flex; gap: 0;
  margin: 0 24px;
  background: rgba(0,0,0,0.35);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
.bc-stat {
  flex: 1; text-align: center;
  padding: 16px 8px;
  display: flex; flex-direction: column;
  gap: 3px;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.bc-stat:last-child { border-right: none; }
.bc-stat-num {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900; font-size: 30px;
  color: var(--gold);
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
.bc-stat-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600; font-size: 8px;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.backcover-quote {
  position: relative; z-index:2;
  padding: 16px 30px;
  flex: 1;
  display: flex; flex-direction: column;
  justify-content: center;
}
.bc-quote-mark {
  font-family: 'Libre Baskerville', serif;
  font-size: 60px; line-height: 0.5;
  color: var(--gold);
  opacity: 0.5;
  margin-bottom: 2px;
}
.backcover-quote p {
  font-family: 'Libre Baskerville', serif;
  font-size: 12px; line-height: 1.65;
  color: rgba(255,255,255,0.9);
  font-style: italic;
  max-width: 90%;
  text-shadow: 0 1px 10px rgba(0,0,0,0.6);
}
.backcover-quote .bc-quote-author {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  color: rgba(255,255,255,0.4);
  margin-top: 6px;
  letter-spacing: 1px;
  font-style: normal;
  text-transform: uppercase;
}
.backcover-cards {
  position: relative; z-index:2;
  display: flex; gap: 10px;
  padding: 0 24px 14px;
}
.bc-card {
  flex: 1;
  padding: 14px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  text-decoration: none;
  display: flex; flex-direction: column;
  gap: 4px;
  transition: background 0.2s, border-color 0.2s;
}
.bc-card:hover { 
  background: rgba(0,0,0,0.5); 
  border-color: rgba(201,168,76,0.3);
}
.bc-card-icon { font-size: 24px; }
.bc-card-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 10px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.4);
}
.bc-card-desc {
  font-size: 9px; color: rgba(255,255,255,0.7);
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.bc-card-link {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600; font-size: 8px;
  color: var(--gold);
  letter-spacing: 0.3px;
  margin-top: 2px;
}
.backcover-footer {
  position: relative; z-index:2;
  padding: 0 30px 24px;
  text-align: center;
}
.bc-footer-line {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  margin-bottom: 10px;
}
.bc-footer-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; font-size: 9px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.bc-footer-sub {
  font-size: 8px;
  color: rgba(255,255,255,0.25);
  margin-top: 3px;
}

</style>
</head>
<body>

<button class="print-btn" onclick="window.print()">🖨 In / Xuất PDF</button>
${pages.join('\n')}
</body>
</html>`;

  // ─── WRITE FILE ───────────────────────────────────
  fs.writeFileSync(OUTPUT, html, 'utf-8');
  console.log('✅ Book generated: ' + OUTPUT);
  console.log('   Total pages: ' + pages.length);
  console.log('   Schools: ' + schools.length);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
