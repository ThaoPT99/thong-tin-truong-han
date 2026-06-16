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
    window.location.href = '/admin/login.html';
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
      window.location.href = '/admin/login.html';
    }
  } catch {}
});

function logout() {
  clearToken();
  clearUser();
  window.location.href = '/admin/login.html';
}

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
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function regionLabel(r) {
  const map = {
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
});
