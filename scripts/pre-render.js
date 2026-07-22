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
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

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

function buildSchoolHtml(school, semesterInfo) {
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
  <link rel="stylesheet" href="/checklist.css">
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
          <button class="tab-btn" data-school="schools">D2-6</button>
          <button class="tab-btn" data-school="d4-1">D4-1</button>
          <button class="tab-btn" data-school="advisor">Tư vấn</button>
          <button class="tab-btn" data-school="compare">So sánh</button>
          <button class="tab-btn" data-school="checklist">📋 Hồ sơ của tôi</button>

          <div class="sidebar-divider"></div>

          <div class="sidebar-submenu-wrap">
            <button class="tab-btn sidebar-toggle-btn" type="button">
              <span>Tiện ích</span>
              <svg class="sidebar-chevron" viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
            </button>
            <div class="sidebar-submenu hidden">
              <button class="tab-btn" data-school="map">Bản đồ</button>
              <button class="tab-btn" data-school="extra">Tài liệu</button>
              <button class="tab-btn" data-school="ebook">Cẩm nang D2-6</button>
              <button class="tab-btn" data-school="cost">Chi phí</button>
              <button class="tab-btn" data-school="application">📨 Gửi đơn</button>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <div class="app-main">
      <section class="app-topbar">
        <button type="button" class="sidebar-hamburger" id="sidebarToggle" aria-label="Mở menu">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div>
          <h2>${escapeHtml(school.name)}</h2>
          <p>${escapeHtml(school.name_kr || '')}${school.name_en ? ' · ' + escapeHtml(school.name_en) : ''}</p>
        </div>
        <div class="topbar-stats">
          <span>${escapeHtml(regionLabel(school.region))}</span>
          <span>${escapeHtml(school.system || 'D2-6')}</span>
        </div>
        <div class="topbar-actions">
          <button type="button" class="topbar-auth-btn" id="authBtn" onclick="openAuthModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span id="authBtnText">Đăng nhập</span>
          </button>
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
        <div id="cost-content" class="hidden"></div>
        <div id="application-content" class="hidden"></div>
        <div id="checklist-content" class="hidden"></div>
        <div id="ebook-content" class="hidden"></div>
      </main>

      <footer class="footer">
        <p>Thông tin được tổng hợp và cập nhật theo từng kỳ tuyển sinh. <a href="https://docs.google.com/spreadsheets/d/1H5tFffhJeLETHrNeRLV2l_gpg-KDQITD/edit?usp=sharing" target="_blank" rel="noopener">Xem nguồn dữ liệu</a></p>
      </footer>
    </div>
  </div>

  <div id="auth-modal" class="auth-modal" role="dialog" aria-modal="true">
    <div class="auth-backdrop" onclick="closeAuthModal()"></div>
    <div class="auth-card">
      <button type="button" class="auth-close" onclick="closeAuthModal()" aria-label="Đóng">&times;</button>

      <div class="auth-tabs">
        <button type="button" class="auth-tab active" data-auth-tab="login" onclick="switchAuthTab('login')">Đăng nhập</button>
        <button type="button" class="auth-tab" data-auth-tab="register" onclick="switchAuthTab('register')">Tạo tài khoản</button>
      </div>

      <form class="auth-form" id="loginForm">
        <h2 class="auth-title">Chào mừng trở lại</h2>
        <p class="auth-subtitle">Đăng nhập để lưu tiến độ hồ sơ của bạn.</p>
        <div id="loginError" class="auth-error"></div>
        <div class="auth-field">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" placeholder="your@email.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="loginPassword">Mật khẩu</label>
          <input type="password" id="loginPassword" placeholder="••••••••" required autocomplete="current-password">
        </div>
        <button type="submit" class="auth-submit" id="loginSubmitBtn"><span>Đăng nhập</span></button>
      </form>

      <form class="auth-form hidden" id="registerForm">
        <h2 class="auth-title">Tạo tài khoản mới</h2>
        <p class="auth-subtitle">Miễn phí — lưu hồ sơ và theo dõi tiến độ.</p>
        <div id="registerError" class="auth-error"></div>
        <div class="auth-field">
          <label for="regName">Họ tên</label>
          <input type="text" id="regName" placeholder="Nguyễn Văn A">
        </div>
        <div class="auth-field">
          <label for="regEmail">Email</label>
          <input type="email" id="regEmail" placeholder="your@email.com" required>
        </div>
        <div class="auth-field">
          <label for="regPassword">Mật khẩu</label>
          <input type="password" id="regPassword" placeholder="Ít nhất 6 ký tự" required minlength="6">
        </div>
        <div class="auth-field">
          <label for="regPhone">Số điện thoại (tùy chọn)</label>
          <input type="tel" id="regPhone" placeholder="0978 xxx xxx">
        </div>
        <button type="submit" class="auth-submit" id="registerSubmitBtn"><span>Tạo tài khoản</span></button>
      </form>
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
        <a href="https://zalo.me/g/4x7gts4riwvmxthrcaaq" target="_blank" rel="noopener noreferrer" class="zalo-popup-join">Tham gia nhóm Zalo</a>
        <button type="button" class="zalo-popup-later">Để sau (12 giờ)</button>
      </div>
    </div>
  </div>

    <span id="theme-icon">🌙</span>
  </button>

  <button type="button" class="zalo-fab" onclick="openZaloPopup()" title="Tham gia nhóm Zalo D2-6" aria-label="Mở popup tham gia nhóm Zalo">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.81 3.05 6.27L4 22l5.86-2.34C10.53 19.89 11.25 20 12 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
    Zalo
  </button>

  <link rel="prefetch" href="/api/schools">
  <link rel="prefetch" href="/api/schools?include=extras">

  <!-- Script: đợi dữ liệu API load xong rồi hiển thị trường -->
  <script>
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

  <script>
  // ═══ Sidebar toggle for mobile ═══
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('sidebarToggle');
    var backdrop = document.getElementById('sidebarBackdrop');
    var shell = document.querySelector('.app-shell');
    if (toggle && backdrop) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        shell.classList.toggle('sidebar-open');
        toggle.setAttribute('aria-label', shell.classList.contains('sidebar-open') ? 'Đóng menu' : 'Mở menu');
      });
      backdrop.addEventListener('click', function() {
        shell.classList.remove('sidebar-open');
        toggle.setAttribute('aria-label', 'Mở menu');
      });
    }

    // ═══ Auth: restore session + verify/refresh token ═══
    var token = localStorage.getItem('student_token');
    if (token) {
      var user = JSON.parse(localStorage.getItem('student_user') || '{}');
      if (user.full_name) {
        document.getElementById('authBtnText').textContent = user.full_name;
        document.getElementById('authBtn').classList.add('is-logged-in');
      }
      refreshAccessTokenIfNeeded();
    }
  });

  // ═══ Token refresh helpers ═══
  async function refreshAccessTokenIfNeeded() {
    var token = localStorage.getItem('student_token');
    if (!token) return;
    try {
      var refreshToken = localStorage.getItem('student_refresh_token');
      if (!refreshToken) return;
      var res = await fetch('/api/auth/student?action=refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        var data = await res.json();
        localStorage.setItem('student_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('student_refresh_token', data.refresh_token);
        }
      } else if (res.status === 401) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_refresh_token');
        localStorage.removeItem('student_user');
        var btn = document.getElementById('authBtn');
        if (btn) btn.classList.remove('is-logged-in');
        var txt = document.getElementById('authBtnText');
        if (txt) txt.textContent = 'Đăng nhập';
      }
    } catch(e) {}
  }

  var _refreshPromise = null;
  async function fetchWithAuth(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    var token = localStorage.getItem('student_token');
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    var res = await fetch(url, options);
    if (res.status === 401 && token) {
      // Token expired — try to refresh (with in-flight promise guard)
      if (!_refreshPromise) {
        _refreshPromise = (async function() {
          var refreshToken = localStorage.getItem('student_refresh_token');
          if (!refreshToken) return null;
          var refreshRes = await fetch('/api/auth/student?action=refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            var refreshData = await refreshRes.json();
            localStorage.setItem('student_token', refreshData.access_token);
            if (refreshData.refresh_token) {
              localStorage.setItem('student_refresh_token', refreshData.refresh_token);
            }
            return refreshData.access_token;
          } else {
            localStorage.removeItem('student_token');
            localStorage.removeItem('student_refresh_token');
            localStorage.removeItem('student_user');
            var btn = document.getElementById('authBtn');
            if (btn) btn.classList.remove('is-logged-in');
            var txt = document.getElementById('authBtnText');
            if (txt) txt.textContent = 'Đăng nhập';
            return null;
          }
        })();
      }
      var newToken = await _refreshPromise;
      _refreshPromise = null;
      if (newToken) {
        options.headers['Authorization'] = 'Bearer ' + newToken;
        return await fetch(url, options);
      }
    }
    return res;
  }
  window.fetchWithAuth = fetchWithAuth;

  // ═══ Auth Modal ═══
  function openAuthModal() {
    var token = localStorage.getItem('student_token');
    if (token) {
      if (confirm('Đăng xuất khỏi tài khoản hiện tại?')) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_refresh_token');
        localStorage.removeItem('student_user');
        location.reload();
      }
      return;
    }
    document.getElementById('auth-modal').classList.add('is-open');
    document.body.classList.add('zalo-popup-open');
  }

  function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('is-open');
    document.body.classList.remove('zalo-popup-open');
  }

  function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.authTab === tab); });
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    document.querySelectorAll('.auth-error').forEach(function(e) { e.classList.remove('show'); e.textContent = ''; });
  }

  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    var errorEl = document.getElementById('loginError');
    var btn = document.getElementById('loginSubmitBtn');
    errorEl.classList.remove('show');
    btn.disabled = true; btn.querySelector('span').textContent = 'Đang đăng nhập...';
    try {
      var res = await fetch('/api/auth/student?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      var data = await res.json();        if (res.ok) {
          localStorage.setItem('student_token', data.access_token);
          if (data.refresh_token) localStorage.setItem('student_refresh_token', data.refresh_token);
          localStorage.setItem('student_user', JSON.stringify(data.user));
          document.getElementById('authBtnText').textContent = data.user.full_name || data.user.email;
          document.getElementById('authBtn').classList.add('is-logged-in');
          closeAuthModal();
        } else {
          errorEl.textContent = data.error || 'Đăng nhập thất bại'; errorEl.classList.add('show'); }
    } catch(err) { errorEl.textContent = 'Lỗi kết nối'; errorEl.classList.add('show'); }
    btn.disabled = false; btn.querySelector('span').textContent = 'Đăng nhập';
  });

  document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    var phone = document.getElementById('regPhone').value.trim();
    var errorEl = document.getElementById('registerError');
    var btn = document.getElementById('registerSubmitBtn');
    if (password.length < 6) { errorEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự'; errorEl.classList.add('show'); return; }
    errorEl.classList.remove('show');
    btn.disabled = true; btn.querySelector('span').textContent = 'Đang tạo...';
    try {
      var res = await fetch('/api/auth/student?action=register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, fullName: name, phone }) });
      var data = await res.json();        if (res.ok) {
          localStorage.setItem('student_token', data.access_token);
          if (data.refresh_token) localStorage.setItem('student_refresh_token', data.refresh_token);
          localStorage.setItem('student_user', JSON.stringify(data.user));
          document.getElementById('authBtnText').textContent = data.user.full_name || data.user.email;
          document.getElementById('authBtn').classList.add('is-logged-in');
          closeAuthModal();
        } else {
          errorEl.textContent = data.error || 'Đăng ký thất bại'; errorEl.classList.add('show'); }
    } catch(err) { errorEl.textContent = 'Lỗi kết nối'; errorEl.classList.add('show'); }
    btn.disabled = false; btn.querySelector('span').textContent = 'Tạo tài khoản';
  });
  </script>
  <script src="/js/api-loader.js"></script>
  <script src="/js/advisor.js"></script>
  <script src="/js/render.js"></script>
  <script src="/js/zalo-popup.js"></script>
  <script src="/js/checklist-data.js"></script>
  <script src="/js/checklist.js"></script>

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

  // Fetch semester info + semesters
  const { data: semInfo } = await supabase
    .from('semester_info')
    .select('*')
    .limit(1)
    .maybeSingle();

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*')
    .order('sort_order')
    .order('nam', { ascending: false })
    .order('ky', { ascending: false });

  const activeSemester = (semesters || []).find(s => s.is_active) || (semesters || [])[0] || null;
  const activeSemInfo = activeSemester || semInfo;

  console.log(`📊 Found ${schools.length} schools, active semester: ${activeSemInfo?.ky || '?'}/${activeSemInfo?.nam || '?'}`);

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

    const html = buildSchoolHtml(school, activeSemInfo);
    fs.writeFileSync(path.join(schoolDir, 'index.html'), html, 'utf-8');
    count++;

    if (count % 5 === 0) {
      console.log(`  ✅ ${count}/${schools.length} schools`);
    }
  }

  console.log(`  ✅ Generated ${count}/${schools.length} school pages`);

  // ─── Generate sitemap ───
  const sitemap = buildSitemap(transformed, activeSemInfo);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✅ sitemap.xml updated');

  console.log(`\n🎉 Pre-render complete! ${count} pages generated`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
