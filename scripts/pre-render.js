/**
 * Pre-render — Sinh file tĩnh SEO cho từng trường
 * Chạy: node scripts/pre-render.js
 *
 * Sinh ra:
 *   - truong/<slug>/index.html  (trang tĩnh cho từng trường)
 *   - sitemap.xml (cập nhật đầy đủ URL)
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Config ───
const SITE_URL = 'https://thongtintruonghan.vercel.app';
const OUTPUT_DIR = path.join(__dirname, '..');

// REGION_LABELS (giống api-loader.js)
const REGION_LABELS = {
  any: 'không ưu tiên khu vực',
  seoul: 'Seoul',
  'near-seoul': 'gần Seoul',
  busan: 'Busan',
  gwangju: 'Gwangju',
  province: 'tỉnh/thành khác',
  incheon: 'Incheon',
  gyeonggi: 'Gyeonggi',
  chungcheongbuk: 'Chungcheongbuk',
  chungcheongnam: 'Chungcheongnam',
  jeollanam: 'Jeollanam',
  jeollabuk: 'Jeollabuk',
  gyeongsangnam: 'Gyeongsangnam',
  gyeongsangbuk: 'Gyeongsangbuk',
  gangwon: 'Gangwon',
  daegu: 'Daegu',
  daejeon: 'Daejeon',
  ulsan: 'Ulsan',
  sejong: 'Sejong',
  jeju: 'Jeju',
};

// ─── Supabase client ───
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Cần set SUPABASE_URL và SUPABASE_KEY / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Helpers ───
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/\0/g, '')       // Loại bỏ null bytes trước
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function regionLabel(region) {
  if (!region) return '';
  const label = REGION_LABELS[region];
  if (label) return label.charAt(0).toUpperCase() + label.slice(1);
  return region;
}

function extractFirstImage(intro) {
  if (!intro) return '';
  const match = intro.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i);
  return match ? match[1] : '';
}

function stripHtml(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function truncate(str, max) {
  if (!str) return '';
  const cleaned = stripHtml(str);
  return cleaned.length > max ? cleaned.slice(0, max) + '...' : cleaned;
}

function buildJsonLd(school) {
  const url = `${SITE_URL}/truong/${school.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    alternateName: [school.name_kr, school.name_en].filter(Boolean),
    description: truncate(school.intro || `${school.name} - Thông tin tuyển sinh Visa D2-6 tại Hàn Quốc.`, 200),
    url: url,
    address: school.location ? {
      '@type': 'PostalAddress',
      addressLocality: regionLabel(school.region),
      addressCountry: 'KR',
      streetAddress: school.location,
    } : undefined,
    ...(school.image_main && school.image_main !== 'images/placeholder.svg'
      ? { image: `${SITE_URL}/${school.image_main}` }
      : {}),
  };
}

function buildSchoolHtml(school, semesterInfo, prerenderedData) {
  const ky = semesterInfo?.ky || '3';
  const nam = semesterInfo?.nam || '2027';
  const semTitle = semesterInfo?.title || `Kỳ tháng ${ky}/${nam}`;

  const title = `${school.name} - Thông tin trường Hàn Visa D2-6 (${semTitle})`;
  const desc = truncate(
    school.intro ||
    `${school.name} (${school.name_kr || ''}): Hệ ${school.system || ''}, khu vực ${regionLabel(school.region)}, học phí, điều kiện tuyển sinh và hồ sơ Visa D2-6.`,
    160
  );
  const canonicalUrl = `/truong/${school.slug}/`;
  const fullUrl = `${SITE_URL}${canonicalUrl}`;

  // Render static content
  const introHtml = school.intro ? `<p>${escapeHtml(school.intro).replace(/\n/g, '<br>')}</p>` : '';
  const conditionsHtml = (school.conditions || []).map(c => `<li>${escapeHtml(c.text || c)}</li>`).join('');
  const majorsHtml = (school.majors || []).map(m => `<li>${escapeHtml(m.text || m)}</li>`).join('');
  const advantagesHtml = (school.advantages || []).map(a => `<li>${escapeHtml(a.text || a)}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <link rel="canonical" href="${fullUrl}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:image" content="${SITE_URL}/images/logo-d26-horizontal.svg">

  <meta name="twitter:card" content="summary_large_image">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(buildJsonLd(school), null, 2)}
  </script>

  <!-- Fonts & Styles -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="app-shell">
    <aside class="app-sidebar">
      <header class="header">
        <div class="header-inner">
          <img src="/images/logo-d26-sidebar.svg" alt="D26 Schools" class="brand-logo">
        </div>
      </header>
      <nav class="school-tabs" aria-label="Menu chính">
        <div class="tabs-inner">
          <button class="tab-btn" data-school="schools">Trường</button>
          <button class="tab-btn advisor-tab-btn" data-school="advisor">Tư vấn</button>
          <button class="tab-btn" data-school="compare">So sánh</button>
          <button class="tab-btn" data-school="map">Bản đồ</button>
          <button class="tab-btn" data-school="extra">Tài liệu</button>
          <button class="tab-btn" data-school="ebook">Cẩm nang D2-6</button>
        </div>
      </nav>
      <div class="sidebar-zalo">
        <h2>Cộng đồng Zalo</h2>
        <p>Nhận checklist, catalog và tư vấn hồ sơ D2-6.</p>
        <button type="button" onclick="openZaloPopup()">Mở Zalo</button>
      </div>
    </aside>

    <div class="app-main">
      <section class="app-topbar">
        <div>
          <h2>${escapeHtml(school.name)}</h2>
          <p>${escapeHtml(school.name_kr || '')}${school.name_en ? ' · ' + escapeHtml(school.name_en) : ''}</p>
        </div>
        <div class="topbar-stats">
          <span>${escapeHtml(regionLabel(school.region))}</span>
          <span>${escapeHtml(school.system || 'D2-6')}</span>
        </div>
      </section>

      <main class="main">
        <!-- Static SEO content (visible to Google) -->
        <div id="seo-content" style="max-width: 980px; margin: 0 auto; padding: 1.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <h1 style="font-size: 1.75rem; color: #1e3a5f; margin-bottom: 0.5rem;">${escapeHtml(school.name)}</h1>
          ${school.name_kr ? `<p style="font-size: 1rem; color: #64748b; margin-bottom: 1rem;">${escapeHtml(school.name_kr)}</p>` : ''}

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            ${school.system ? `<div style="padding: 0.8rem; background: #f8fafc; border-radius: 8px;"><strong style="display: block; font-size: 0.8rem; color: #64748b; text-transform: uppercase;">Hệ học</strong><span style="font-size: 1rem;">${escapeHtml(school.system)}</span></div>` : ''}
            <div style="padding: 0.8rem; background: #f8fafc; border-radius: 8px;"><strong style="display: block; font-size: 0.8rem; color: #64748b; text-transform: uppercase;">Khu vực</strong><span style="font-size: 1rem;">${escapeHtml(regionLabel(school.region))}</span></div>
            ${school.quota ? `<div style="padding: 0.8rem; background: #f8fafc; border-radius: 8px;"><strong style="display: block; font-size: 0.8rem; color: #64748b; text-transform: uppercase;">Chỉ tiêu</strong><span style="font-size: 1rem;">${school.quota}</span></div>` : ''}
          </div>

          ${introHtml ? `<section style="margin: 1.5rem 0;"><h2 style="font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.75rem;">Giới thiệu</h2><div style="line-height: 1.7; color: #334155;">${introHtml}</div></section>` : ''}

          ${conditionsHtml ? `<section style="margin: 1.5rem 0;"><h2 style="font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.75rem;">Điều kiện tuyển sinh</h2><ul style="line-height: 1.8; color: #334155;">${conditionsHtml}</ul></section>` : ''}

          ${majorsHtml ? `<section style="margin: 1.5rem 0;"><h2 style="font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.75rem;">Chuyên ngành</h2><ul style="line-height: 1.8; color: #334155;">${majorsHtml}</ul></section>` : ''}

          ${advantagesHtml ? `<section style="margin: 1.5rem 0;"><h2 style="font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.75rem;">Ưu điểm</h2><ul style="line-height: 1.8; color: #334155;">${advantagesHtml}</ul></section>` : ''}

          ${school.tuition ? `<section style="margin: 1.5rem 0;"><h2 style="font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.75rem;">Học phí</h2><div style="line-height: 1.7; color: #334155;">${escapeHtml(school.tuition).replace(/\n/g, '<br>')}</div></section>` : ''}

          <p style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.9rem;">
            <a href="/" style="color: #2563eb;">← Quay lại danh sách trường</a>
          </p>
        </div>

        <!-- JS content sẽ render vào đây -->
        <div id="advisor-content"></div>
        <div id="schools-content" class="hidden"></div>
        <div id="compare-content" class="hidden"></div>
        <div id="school-content" class="hidden"></div>
        <div id="map-content" class="hidden"></div>
        <div id="extra-content" class="hidden"></div>
        <div id="ebook-content" class="hidden"></div>
      </main>

      <footer class="footer">
        <p>Thông tin được tổng hợp và cập nhật theo từng kỳ tuyển sinh. <a href="https://docs.google.com/spreadsheets/d/1H5tFffhJeLETHrNeRLV2l_gpg-KDQITD/edit?usp=sharing" target="_blank" rel="noopener">Xem nguồn dữ liệu</a></p>
      </footer>
    </div>
  </div>

  <div id="zalo-popup" class="zalo-popup" role="dialog" aria-modal="true" aria-labelledby="zalo-popup-title">
    <div class="zalo-popup-backdrop"></div>
    <div class="zalo-popup-card">
      <button type="button" class="zalo-popup-close" aria-label="Đóng">&times;</button>
      <h2 id="zalo-popup-title" class="zalo-popup-title">Cộng Đồng Visa D2-6</h2>
      <p class="zalo-popup-subtitle">Quét mã QR hoặc tham gia nhóm để nhận thêm thông tin tuyển sinh</p>
      <div class="zalo-popup-qr-wrap">
        <img src="/zalo-qr-d2-6.png" alt="Mã QR tham gia nhóm Zalo" class="zalo-popup-qr">
      </div>
      <p class="zalo-popup-hint">Quét mã QR bằng ứng dụng Zalo trên điện thoại</p>
      <div class="zalo-popup-actions">
        <a href="https://zalo.me/g/1oq8ngti4pcbfmxdbe9g" target="_blank" rel="noopener noreferrer" class="zalo-popup-join">Tham gia nhóm Zalo</a>
        <button type="button" class="zalo-popup-later">Để sau (12 giờ)</button>
      </div>
    </div>
  </div>

  <button type="button" class="theme-toggle" id="theme-toggle" title="Chuyển đổi giao diện" aria-label="Chuyển đổi sáng/tối">
    <span id="theme-icon">🌙</span>
  </button>

  <button type="button" class="zalo-fab" onclick="openZaloPopup()" title="Tham gia nhóm Zalo D2-6" aria-label="Mở popup tham gia nhóm Zalo">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.81 3.05 6.27L4 22l5.86-2.34C10.53 19.89 11.25 20 12 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
    Zalo
  </button>

  <link rel="prefetch" href="/api/schools">
  <link rel="prefetch" href="/api/extras">

  <!-- Pre-rendered data: inline, api-loader.js sẽ xử lý và skip fetch -->
  <script>
  window.__PRERENDERED_DATA__ = ${JSON.stringify(prerenderedData)};
  // Listener đặt TRƯỚC api-loader.js. Poll showSchool vì render.js chưa load.
  document.addEventListener('app-data-ready', function() {
    var sid = '${school.slug}';
    var check = setInterval(function() {
      if (typeof showSchool === 'function') {
        clearInterval(check);
        showSchool(sid);
      }
    }, 10);
  }, { once: true });
  </script>

  <script src="/api-loader.js"></script>
  <script src="/advisor.js"></script>
  <script src="/render.js"></script>
  <script src="/zalo-popup.js"></script>

  <script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(reg) {
        console.log('SW registered:', reg.scope);
      }).catch(function(err) {
        console.warn('SW registration failed:', err);
      });
    });
  }
  </script>
</body>
</html>`;
}

// ─── Generate sitemap ───
function buildSitemap(schools, semesterInfo) {
  const urls = [];

  // Trang chủ
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Trang từng trường
  for (const school of schools) {
    urls.push(`  <url>
    <loc>${SITE_URL}/truong/${school.slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ─── Main ───
async function main() {
  console.log('🔄 Pre-render: fetching schools data...');

  // Fetch schools with child tables
  const { data: schools, error } = await supabase
    .from('schools')
    .select(`
      *,
      school_conditions(*),
      school_majors(*),
      school_advantages(*),
      school_conversions(*),
      school_documents(*),
      school_partners(*)
    `)
    .order('slug');

  if (error) {
    console.error('❌ Supabase error:', error.message);
    process.exit(1);
  }

  if (!schools || schools.length === 0) {
    console.error('❌ Không có dữ liệu trường từ database');
    process.exit(1);
  }

  // Fetch semester info
  const { data: semInfo } = await supabase
    .from('semester_info')
    .select('*')
    .limit(1)
    .maybeSingle();

  console.log(`📊 Found ${schools.length} schools, semester: ${semInfo?.ky || '?'}/${semInfo?.nam || '?'}`);

  // Transform schools (giống api/schools/index.js)
  const transformed = schools.map((school) => ({
    ...school,
    school_conditions: undefined,
    school_majors: undefined,
    school_advantages: undefined,
    school_conversions: undefined,
    school_documents: undefined,
    school_partners: undefined,
    conditions: school.school_conditions || [],
    majors: school.school_majors || [],
    advantages: school.school_advantages || [],
    conversion: school.school_conversions || [],
    documents: school.school_documents || [],
    partners: school.school_partners || [],
  }));

  // ─── Fetch thêm advisor profiles + extras cho inline data ───
  const { data: advisorProfilesRaw } = await supabase
    .from('school_advisor_profiles')
    .select('*');

  const { data: visaChecklistRaw } = await supabase
    .from('extra_visa_checklist')
    .select('*')
    .order('sort_order');

  // Build schools lookup by slug
  const schoolsBySlug = {};
  for (const s of schools) {
    schoolsBySlug[s.id] = s.slug;
  }

  // Build advisor profiles map: { slug: { gender, minGpa, ... } }
  const advisorProfilesMap = {};
  for (const ap of advisorProfilesRaw || []) {
    const slug = schoolsBySlug[ap.school_id];
    if (!slug) continue;
    const firstProfile = schools.find(s => s.id === ap.school_id)?.school_advisor_profiles?.[0];
    advisorProfilesMap[slug] = {
      gender: ap.gender || 'all',
      min_gpa: ap.min_gpa || 5.0,
      max_absences: ap.max_absences || 30,
      region: ap.region || '',
      cost_level: ap.cost_level || 3,
      visa_chance: ap.visa_chance || 3,
      job_opportunity: ap.job_opportunity || 3,
      e7_opportunity: ap.e7_opportunity || 3,
      study_load: ap.study_load || 3,
      interview_difficulty: ap.interview_difficulty || 2,
      tags: ap.tags || [],
    };
  }

  // Build extras data (checklist groups)
  const extrasChecklist = (visaChecklistRaw || []).map((r) => ({
    groupName: r.group_name || 'Khác',
    content: r.content || '',
    level: r.level || 'Bắt buộc',
    note: r.note || '',
  }));

  // Build the complete prerendered data payload
  const prerenderedDataPayload = {
    schoolsData: transformed.map((s) => {
      const slug = s.slug;
      const schoolForPayload = schools.find(sch => sch.id === s.id);
      return {
        id: slug,
        slug: slug,
        name: s.name,
        name_kr: s.name_kr,
        name_en: s.name_en,
        system: s.system,
        quota: s.quota,
        region: s.region,
        location: s.location,
        intro: s.intro,
        tuition: s.tuition,
        insurance: s.insurance,
        ktx: s.ktx,
        schedule: s.schedule,
        documents_note: s.documents_note,
        mou: s.mou,
        website: s.website,
        catalog_url: s.catalog_url,
        invoice_url: s.invoice_url,
        video_url: s.video_url,
        video_youtube_id: s.video_youtube_id,
        video_title: s.video_title,
        image_main: s.image_main,
        image_catalog: s.image_catalog,
        image_location: s.image_location,
        image_invoice: s.image_invoice,
        conditions: s.conditions.map(c => ({ text: c.text || c })),
        majors: s.majors.map(m => ({ text: m.text || m })),
        advantages: s.advantages.map(a => ({ text: a.text || a })),
        conversion: s.conversion.map(c => ({ text: c.text || c })),
        documents: s.documents.map(d => ({ text: d.text || d })),
        partners: s.partners || [],
        advisorProfile: advisorProfilesMap[slug] || null,
      };
    }),
    advisorProfilesData: advisorProfilesMap,
    semesterInfo: { ky: semInfo?.ky || '3', nam: semInfo?.nam || '2027', title: semInfo?.title || '' },
    extrasChecklist: extrasChecklist,
  };

  // ─── Generate school pages ───
  const truongDir = path.join(OUTPUT_DIR, 'truong');
  if (!fs.existsSync(truongDir)) {
    fs.mkdirSync(truongDir, { recursive: true });
  }

  let count = 0;
  for (const school of transformed) {
    if (!school.slug) continue;

    const schoolDir = path.join(truongDir, school.slug);
    if (!fs.existsSync(schoolDir)) {
      fs.mkdirSync(schoolDir, { recursive: true });
    }

    const html = buildSchoolHtml(school, semInfo, prerenderedDataPayload);
    fs.writeFileSync(path.join(schoolDir, 'index.html'), html, 'utf-8');
    count++;

    if (count % 5 === 0) {
      console.log(`  ✅ ${count}/${schools.length} schools`);
    }
  }

  console.log(`  ✅ Generated ${count}/${schools.length} school pages`);

  // ─── Generate sitemap ───
  const sitemap = buildSitemap(transformed, semInfo);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✅ sitemap.xml updated');

  console.log(`\n🎉 Pre-render complete! ${count} pages generated`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
