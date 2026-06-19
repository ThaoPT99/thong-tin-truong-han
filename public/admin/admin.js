/* ============================================
   Admin JS — Shared helpers for Admin UI
   ============================================ */

const API_BASE = window.location.origin + '/api';

// ─── Auth ───

function getToken() { return localStorage.getItem('admin_token'); }
function setToken(token) { localStorage.setItem('admin_token', token); }
function clearToken() { localStorage.removeItem('admin_token'); }

function getUser() {
  try { return JSON.parse(localStorage.getItem('admin_user')); }
  catch { return null; }
}

function setUser(user) { localStorage.setItem('admin_user', JSON.stringify(user)); }
function clearUser() { localStorage.removeItem('admin_user'); }

function checkAuth() {
  const token = getToken();
  if (!token) {
    // Don't redirect from login page
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    return false;
  }
  return true;
}

// Verify token asynchronously (redirect if invalid, no flash)
document.addEventListener('DOMContentLoaded', async () => {
  const token = getToken();
  if (!token) return;
  try {
    const r = await fetch(API_BASE + '/auth/verify', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!r.ok) {
      clearToken();
      clearUser();
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
  } catch {}
});

function logout() {
  clearToken();
  clearUser();
  window.location.href = '/admin/login';
}

// ─── Role-based UI ───

function getUserRole() {
  const user = getUser();
  return user?.role || 'sale';
}

function setupSidebarByRole() {
  const role = getUserRole();
  // Các tab chỉ director mới được thấy (dựa trên class role-director)
  const directorTabs = document.querySelectorAll('.sidebar-nav a.role-director');
  const studentsTab = document.querySelector('.sidebar-nav a[href="students.html"]');
  
  if (role === 'sale') {
    // Ẩn các tab director
    directorTabs.forEach(el => el.style.display = 'none');
    
    // Redirect nếu đang ở trang không cho phép
    const currentPage = window.location.pathname.split('/').pop();
    const allowedPages = ['students.html', 'login.html'];
    if (!allowedPages.includes(currentPage)) {
      window.location.href = '/admin/students.html';
    }
  } else if (role === 'director') {
    // Director thấy tất cả
    directorTabs.forEach(el => el.style.display = '');
    if (studentsTab) studentsTab.style.display = '';
  }
}

// Gọi setup role khi DOM ready
document.addEventListener('DOMContentLoaded', setupSidebarByRole);

// ─── API Helper ───

async function api(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'API error: ' + res.status);
  }
  return data;
}

// ─── Toast notifications ───

function toast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; el.style.transition = '.3s ease'; }, 3000);
  setTimeout(() => el.remove(), 3500);
}

// ─── Format helpers ───

function escapeHtml(str) {
  // DOM-based approach (giống api-loader.js)
  var d = document.createElement('div');
  d.textContent = String(str ?? '');
  return d.innerHTML;
}

function roleLabel(role) {
  const map = { director: 'Giám đốc', sale: 'Sale', admin: 'Admin' };
  return map[role] || role;
}

function regionLabel(r) {
  if (!r) return r || '';
  if (typeof window.REGION_LABELS !== 'undefined' && window.REGION_LABELS[r]) {
    var label = window.REGION_LABELS[r];
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  // Fallback map (giống global REGION_LABELS)
  var map = {
    seoul: 'Seoul', busan: 'Busan', gyeonggi: 'Gyeonggi', incheon: 'Incheon',
    gwangju: 'Gwangju', daegu: 'Daegu', daejeon: 'Daejeon', ulsan: 'Ulsan',
    chungcheongbuk: 'Chungcheongbuk', chungcheongnam: 'Chungcheongnam',
    jeollabuk: 'Jeollabuk', jeollanam: 'Jeollanam',
    gyeongsangbuk: 'Gyeongsangbuk', gyeongsangnam: 'Gyeongsangnam',
    gangwon: 'Gangwon', jeju: 'Jeju'
  };
  return map[r] || r;
}

// ─── DOM ready ───

document.addEventListener('DOMContentLoaded', () => {
  // Add toast container
  const tc = document.createElement('div');
  tc.id = 'toast-container';
  tc.className = 'toast-container';
  document.body.appendChild(tc);

  // Render sidebar user info
  renderSidebarUser();
});

// Render sidebar user info
function renderSidebarUser() {
  const user = getUser();
  const container = document.getElementById('sidebar-user');
  const topbarDisplay = document.getElementById('user-display');
  if (!user) return;
  
  const roleLabels = { director: 'Giám đốc', sale: 'Sale', admin: 'Admin' };
  const roleBadgeClass = { director: 'role-director', sale: 'role-sale', admin: 'role-admin' };
  
  const html = `
    <div style="padding:8px 0; border-top:1px solid var(--gray-200);">
      <div style="font-weight:600; color:var(--gray-800); font-size:.85rem;">${escapeHtml(user.displayName || user.email)}</div>
      <span class="user-role ${roleBadgeClass[user.role] || ''}" style="font-size:.7rem; padding:2px 6px; border-radius:99px; display:inline-block; margin-top:4px;">${roleLabels[user.role] || user.role}</span>
    </div>
  `;
  
  if (container) container.innerHTML = html;
  if (topbarDisplay) topbarDisplay.textContent = user.displayName || user.email;
}