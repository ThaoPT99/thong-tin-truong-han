// ── Admin JS — shared utilities ──

const API = window.location.origin;  // Same origin in production

function getToken() {
    return localStorage.getItem('adminToken');
}

function getUser() {
    try { return JSON.parse(localStorage.getItem('adminUser')); }
    catch { return null; }
}

function apiHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast' + (type === 'error' ? ' error' : '');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showModal(html) {
    const backdrop = document.createElement('div');
    backdrop.className = 'admin-modal-backdrop';
    backdrop.innerHTML = html;
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.remove();
    });
    document.body.appendChild(backdrop);
    backdrop.querySelector('.admin-modal-close')?.addEventListener('click', () => backdrop.remove());
    return backdrop;
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
}

// Auth check
(function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
})();

// Logout
document.getElementById('nav-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
});

// ── Helper: Export ──
async function _callExport(url, btnEl, successMsg) {
    if (btnEl) {
        const orig = btnEl.innerHTML || btnEl.textContent;
        btnEl.disabled = true;
        btnEl.innerHTML = '⏳ Đang xử lý...';
        try {
            const res = await fetch(API + url, { method: 'POST', headers: apiHeaders() });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message || successMsg || 'Thành công!');
            } else {
                showToast(data.error || 'Thất bại', 'error');
            }
        } catch {
            showToast('Lỗi kết nối server', 'error');
        }
        btnEl.disabled = false;
        btnEl.innerHTML = orig;
    }
}

// Export data.js (chỉ ghi file)
document.getElementById('nav-export')?.addEventListener('click', (e) => {
    e.preventDefault();
    _callExport('/api/export/data-js', e.currentTarget);
});
document.getElementById('btn-export')?.addEventListener('click', () => {
    _callExport('/api/export/data-js', document.getElementById('btn-export'));
});

// Export & Push (ghi file + git push lên GitHub)
document.getElementById('nav-export-push')?.addEventListener('click', (e) => {
    e.preventDefault();
    _callExport('/api/export/push', e.currentTarget, '✅ Đã push lên GitHub! Vercel sẽ cập nhật sau 1-2 phút.');
});
document.getElementById('btn-export-push')?.addEventListener('click', () => {
    _callExport('/api/export/push', document.getElementById('btn-export-push'), '✅ Đã push lên GitHub!');
});

// Import
document.getElementById('nav-import')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('import-file-input')?.click();
});

document.getElementById('import-file-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    showToast('Đang import...', 'success');
    try {
        const res = await fetch(API + '/api/import/excel', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken() },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || 'Import thành công!');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(data.error || 'Import thất bại', 'error');
        }
    } catch {
        showToast('Lỗi kết nối server', 'error');
    }
    e.target.value = '';
});
