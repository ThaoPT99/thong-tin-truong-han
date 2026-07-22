// application.js — Phase 2: Application CRUD + Dashboard + Reminders + Document Tracking
(function() {
  'use strict';

  function getToken() {
    try { return localStorage.getItem('student_token'); } catch(e) { return null; }
  }

  async function apiFetch(action, method, body) {
    const token = getToken();
    if (!token) return { error: 'Chưa đăng nhập' };
    const opts = {
      method: method || 'GET',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch('/api/auth/student?action=' + action, opts);
      return await res.json();
    } catch (e) {
      return { error: 'Lỗi kết nối: ' + e.message };
    }
  }

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function statusLabel(status) {
    const labels = { draft: 'Nháp', submitted: 'Đã nộp', reviewing: 'Đang xét', approved: 'Đã duyệt', rejected: 'Từ chối' };
    return labels[status] || status;
  }

  function reminderTypeLabel(t) {
    const labels = { document: 'Giấy tờ', submission: 'Nộp hồ sơ', interview: 'Phỏng vấn', health_check: 'Khám sức khoẻ', visa_appointment: 'Hẹn visa', other: 'Khác' };
    return labels[t] || t;
  }

  // ─── Init ───
  window.renderApplicationApp = function(container) {
    if (!container) return;
    window.p2ShowView('dashboard');
  };

  window.p2ShowView = function(view, appId) {
    const container = document.getElementById('application-content');
    if (!container) return;
    switch(view) {
      case 'dashboard': return renderDashboard(container);
      case 'create': return renderAppForm(container, null);
      case 'edit': return renderAppForm(container, appId);
      case 'list': return renderAppList(container);
      case 'reminders': return renderReminders(container);
      default: return renderDashboard(container);
    }
  };

  window.p2OpenApp = function(appId) { window.p2ShowView('edit', appId); };

  // ─── Dashboard ───
  async function renderDashboard(container) {
    const token = getToken();
    if (!token) {
      container.innerHTML = '<div class="p2-empty" style="padding:2rem;text-align:center"><p>Vui lòng <button class="btn btn-primary btn-sm" onclick="openAuthModal()">đăng nhập</button> để xem dashboard hồ sơ.</p></div>';
      return;
    }
    container.innerHTML = '<div class="p2-loading"><div class="skeleton skeleton-heading" style="width:200px"></div></div>';

    const [appsRes, remRes] = await Promise.all([
      apiFetch('applications-list', 'GET'),
      apiFetch('reminders-list', 'GET'),
    ]);
    const apps = appsRes.applications || [];
    const reminders = remRes.reminders || [];
    const draftCount = apps.filter(a => a.status === 'draft').length;
    const submittedCount = apps.filter(a => a.status === 'submitted' || a.status === 'reviewing').length;
    const pendingReminders = reminders.filter(r => !r.is_completed).length;
    const upcoming = reminders.filter(r => !r.is_completed).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 3);

    container.innerHTML = `
      <section class="p2-section">
        <div class="p2-head">
          <p class="advisor-kicker">Tổng quan hồ sơ</p>
          <h2>Dashboard du học</h2>
          <p>Theo dõi tiến độ hồ sơ, giấy tờ và các mốc quan trọng.</p>
        </div>
        <div class="p2-stat-grid">
          <div class="p2-stat-card">
            <span class="p2-stat-icon"></span>
            <span class="p2-stat-num">${apps.length}</span>
            <span class="p2-stat-label">Hồ sơ</span>
            ${draftCount > 0 ? '<span class="p2-stat-sub">' + draftCount + ' nháp</span>' : ''}
          </div>
          <div class="p2-stat-card">
            <span class="p2-stat-icon"></span>
            <span class="p2-stat-num">${submittedCount}</span>
            <span class="p2-stat-label">Đã nộp</span>
          </div>
          <div class="p2-stat-card">
            <span class="p2-stat-icon"></span>
            <span class="p2-stat-num">${pendingReminders}</span>
            <span class="p2-stat-label">Nhắc nhở</span>
          </div>
          <div class="p2-stat-card">
            <span class="p2-stat-icon"></span>
            <span class="p2-stat-num">${apps.length > 0 ? Math.round(apps.filter(a => a.status !== 'draft').length / apps.length * 100) + '%' : '0%'}</span>
            <span class="p2-stat-label">Hoàn thành</span>
          </div>
        </div>
        ${apps.length > 0 ? `
        <div class="p2-section-block">
          <h3>Hồ sơ gần đây</h3>
          <div class="p2-app-list">${apps.slice(0, 5).map(a => '<div class="p2-app-item" onclick="window.p2OpenApp(\'' + a.id + '\')"><div><strong>' + escapeHtml(a.full_name || 'Chưa có tên') + '</strong><span class="p2-app-status status-' + a.status + '">' + statusLabel(a.status) + '</span></div><small>' + formatDate(a.created_at) + '</small></div>').join('')}</div>
          ${apps.length > 5 ? '<button class="btn btn-outline btn-sm" onclick="window.p2ShowView(\'list\')">Xem tất cả (' + apps.length + ')</button>' : ''}
        </div>` : '<div class="p2-section-block p2-empty-state"><h3>Chưa có hồ sơ nào</h3><p>Tạo hồ sơ du học đầu tiên.</p><button class="btn btn-primary" onclick="window.p2ShowView(\'create\')">+ Tạo hồ sơ mới</button></div>'}
        ${upcoming.length > 0 ? `
        <div class="p2-section-block">
          <h3>Sắp đến hạn</h3>
          <div class="p2-reminder-list">${upcoming.map(r => '<div class="p2-reminder-item ' + (new Date(r.due_date) < new Date() ? 'overdue' : '') + '"><div><strong>' + escapeHtml(r.title) + '</strong><small>' + reminderTypeLabel(r.reminder_type) + ' — Hạn: ' + formatDate(r.due_date) + '</small></div><button class="btn btn-sm btn-outline" onclick="window.p2CompleteReminder(\'' + r.id + '\')">✓</button></div>').join('')}</div>
          <button class="btn btn-outline btn-sm" onclick="window.p2ShowView('reminders')">Quản lý nhắc nhở</button>
        </div>` : '<div class="p2-section-block"><h3>Nhắc nhở</h3><p>Chưa có nhắc nhở nào.</p><button class="btn btn-outline btn-sm" onclick="window.p2ShowView(\'reminders\')">+ Thêm nhắc nhở</button></div>'}
        <div class="p2-actions" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem">
          <button class="btn btn-primary" onclick="window.p2ShowView('create')">+ Tạo hồ sơ mới</button>
          <button class="btn btn-outline" onclick="window.p2ShowView('list')">Danh sách hồ sơ</button>
          <button class="btn btn-outline" onclick="window.p2ShowView('reminders')">Nhắc nhở</button>
        </div>
      </section>`;
  }

  // ─── Application List ───
  async function renderAppList(container) {
    container.innerHTML = '<div class="p2-loading"><div class="skeleton skeleton-heading" style="width:200px"></div></div>';
    const res = await apiFetch('applications-list', 'GET');
    const apps = res.applications || [];
    container.innerHTML = `
      <section class="p2-section">
        <div class="p2-head"><p class="advisor-kicker">Hồ sơ của tôi</p><h2>${apps.length} hồ sơ du học</h2></div>
        <div class="p2-toolbar" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
          <button class="btn btn-primary" onclick="window.p2ShowView('create')">+ Tạo hồ sơ</button>
          <button class="btn btn-outline" onclick="window.p2ShowView('dashboard')">← Dashboard</button>
        </div>
        ${apps.length === 0 ? '<div class="p2-empty"><p>Chưa có hồ sơ nào.</p></div>' : '<div class="p2-app-list-full">' + apps.map(a => '<div class="p2-app-card" onclick="window.p2OpenApp(\'' + a.id + '\')"><div class="p2-app-card-top"><strong>' + escapeHtml(a.full_name || 'Chưa có tên') + '</strong><span class="p2-app-status status-' + a.status + '">' + statusLabel(a.status) + '</span></div><div class="p2-app-card-meta"><span>' + formatDate(a.created_at) + '</span>' + (a.korean_level ? '<span>' + a.korean_level + '</span>' : '') + (a.high_school_name ? '<span>' + escapeHtml(a.high_school_name) + '</span>' : '') + '</div></div>').join('') + '</div>'}
      </section>`;
  }

  // ─── Application Form ───
  async function renderAppForm(container, appId) {
    let app = null;
    if (appId) {
      const res = await apiFetch('applications-get&id=' + appId, 'GET');
      app = res.application || null;
    }
    const d = app || {};
    const isEdit = !!app;

    container.innerHTML = `
      <section class="p2-section">
        <div class="p2-head">
          <p class="advisor-kicker">${isEdit ? 'Sửa hồ sơ' : 'Tạo hồ sơ mới'}</p>
          <h2>${isEdit ? escapeHtml(d.full_name || 'Hồ sơ') : 'Điền thông tin hồ sơ du học'}</h2>
          <p>Thông tin này sẽ được dùng để điền vào đơn đăng ký trường và hồ sơ visa.</p>
        </div>
        <div class="p2-form">
          <div class="p2-form-section">
            <h3>Thông tin cá nhân</h3>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Họ tên (Tiếng Việt)</label><input type="text" id="af-fullname" value="${escapeHtml(d.full_name || '')}" placeholder="Nguyễn Văn A"></div>
              <div class="p2-field"><label>Họ tên (Tiếng Hàn)</label><input type="text" id="af-namekr" value="${escapeHtml(d.full_name_kr || '')}" placeholder="Kim..."></div>
            </div>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Ngày sinh</label><input type="date" id="af-dob" value="${d.date_of_birth ? d.date_of_birth.substring(0,10) : ''}"></div>
              <div class="p2-field"><label>Giới tính</label><select id="af-gender"><option value="">— Chọn —</option><option value="male" ${d.gender === 'male' ? 'selected' : ''}>Nam</option><option value="female" ${d.gender === 'female' ? 'selected' : ''}>Nữ</option></select></div>
            </div>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Số điện thoại</label><input type="tel" id="af-phone" value="${escapeHtml(d.phone || '')}" placeholder="090xxxxxxx"></div>
              <div class="p2-field"><label>Email</label><input type="email" id="af-email" value="${escapeHtml(d.email || '')}" placeholder="your@email.com"></div>
            </div>
            <div class="p2-field"><label>Địa chỉ</label><input type="text" id="af-address" value="${escapeHtml(d.address || '')}" placeholder="Số nhà, đường, tỉnh/thành phố"></div>
          </div>
          <div class="p2-form-section">
            <h3>Học vấn</h3>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Trường THPT</label><input type="text" id="af-hsname" value="${escapeHtml(d.high_school_name || '')}" placeholder="Tên trường"></div>
              <div class="p2-field"><label>GPA (thang 10)</label><input type="number" id="af-gpa" min="0" max="10" step="0.1" value="${d.high_school_gpa || ''}" placeholder="6.5"></div>
            </div>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Số buổi nghỉ</label><input type="number" id="af-absences" min="0" value="${d.high_school_absences || 0}"></div>
              <div class="p2-field"><label>Tiếng Hàn</label><select id="af-korean"><option value="none">Chưa học</option><option value="beginner" ${d.korean_level === 'beginner' ? 'selected' : ''}>Mới bắt đầu</option><option value="sejong2b" ${d.korean_level === 'sejong2b' ? 'selected' : ''}>Sejong 2B</option><option value="topik1" ${d.korean_level === 'topik1' ? 'selected' : ''}>TOPIK 1</option><option value="topik2" ${d.korean_level === 'topik2' ? 'selected' : ''}>TOPIK 2</option><option value="topik3" ${d.korean_level === 'topik3' ? 'selected' : ''}>TOPIK 3</option><option value="topik4" ${d.korean_level === 'topik4' ? 'selected' : ''}>TOPIK 4+</option></select></div>
            </div>
          </div>
          <div class="p2-form-section">
            <h3>Gia đình</h3>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Cha</label><input type="text" id="af-fname" value="${escapeHtml(d.father_name || '')}" placeholder="Họ tên cha"></div>
              <div class="p2-field"><label>Nghề nghiệp cha</label><input type="text" id="af-fjob" value="${escapeHtml(d.father_occupation || '')}" placeholder="Kinh doanh"></div>
            </div>
            <div class="p2-grid-2">
              <div class="p2-field"><label>Mẹ</label><input type="text" id="af-mname" value="${escapeHtml(d.mother_name || '')}" placeholder="Họ tên mẹ"></div>
              <div class="p2-field"><label>Nghề nghiệp mẹ</label><input type="text" id="af-mjob" value="${escapeHtml(d.mother_occupation || '')}" placeholder="Giáo viên"></div>
            </div>
          </div>
          <div class="p2-form-actions" style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" id="af-save-btn" onclick="window.p2SaveApp('${appId || ''}')">            ${isEdit ? 'Lưu' : 'Tạo hồ sơ'}</button>
            <button class="btn btn-outline" onclick="window.p2ShowView('list')">← Huỷ</button>
            ${isEdit ? '<button class="btn btn-danger" onclick="window.p2DeleteApp(\'' + appId + '\')">Xoá</button>' : ''}
          </div>
        </div>
      </section>`;
  }

  window.p2SaveApp = async function(appId) {
    const btn = document.getElementById('af-save-btn');
    if (!btn) return;
    btn.disabled = true; btn.textContent = 'Đang lưu...';
    const data = {
      fullName: document.getElementById('af-fullname').value.trim(),
      fullNameKr: document.getElementById('af-namekr').value.trim(),
      dateOfBirth: document.getElementById('af-dob').value || null,
      gender: document.getElementById('af-gender').value,
      phone: document.getElementById('af-phone').value.trim(),
      email: document.getElementById('af-email').value.trim(),
      address: document.getElementById('af-address').value.trim(),
      highSchoolName: document.getElementById('af-hsname').value.trim(),
      highSchoolGpa: parseFloat(document.getElementById('af-gpa').value) || null,
      highSchoolAbsences: parseInt(document.getElementById('af-absences').value) || 0,
      koreanLevel: document.getElementById('af-korean').value,
      fatherName: document.getElementById('af-fname').value.trim(),
      fatherOccupation: document.getElementById('af-fjob').value.trim(),
      motherName: document.getElementById('af-mname').value.trim(),
      motherOccupation: document.getElementById('af-mjob').value.trim(),
    };
    let res;
    if (appId) res = await apiFetch('applications-update', 'PUT', { id: appId, ...data });
    else res = await apiFetch('applications-create', 'POST', data);
    btn.disabled = false; btn.textContent = appId ? 'Lưu' : 'Tạo hồ sơ';
    if (res.success) window.p2ShowView('list');
    else alert('Lỗi: ' + (res.error || 'Không thể lưu'));
  };

  window.p2DeleteApp = async function(appId) {
    if (!confirm('Xoá hồ sơ này?')) return;
    const res = await apiFetch('applications-delete&id=' + appId, 'DELETE');
    if (res.success) window.p2ShowView('list');
    else alert('Lỗi: ' + (res.error || 'Không thể xoá'));
  };

  // ─── Reminders ───
  async function renderReminders(container) {
    const res = await apiFetch('reminders-list', 'GET');
    const reminders = res.reminders || [];
    const pending = reminders.filter(r => !r.is_completed);
    const completed = reminders.filter(r => r.is_completed);

    container.innerHTML = `
      <section class="p2-section">
        <div class="p2-head"><p class="advisor-kicker">Nhắc nhở</p><h2>${pending.length} nhắc nhở đang chờ</h2></div>
        <div class="p2-toolbar" style="margin-bottom:1rem"><button class="btn btn-outline" onclick="window.p2ShowView('dashboard')">← Dashboard</button></div>
        <div class="p2-section-block">
          <h3>+ Thêm nhắc nhở</h3>
          <div class="p2-reminder-form">
            <div class="p2-grid-2"><div class="p2-field"><input type="text" id="rm-title" placeholder="Tiêu đề"></div><div class="p2-field"><input type="date" id="rm-date"></div></div>
            <div class="p2-grid-2"><div class="p2-field"><select id="rm-type"><option value="document">Giấy tờ</option><option value="submission">Nộp hồ sơ</option><option value="interview">Phỏng vấn</option><option value="health_check">Khám sức khoẻ</option><option value="visa_appointment">Hẹn visa</option><option value="other">Khác</option></select></div><button class="btn btn-primary" onclick="window.p2AddReminder()">+ Thêm</button></div>
          </div>
        </div>
        ${pending.length > 0 ? '<div class="p2-section-block"><h3>Đang chờ (' + pending.length + ')</h3><div class="p2-reminder-list">' + pending.map(r => '<div class="p2-reminder-item ' + (new Date(r.due_date) < new Date() ? 'overdue' : '') + '"><div><strong>' + escapeHtml(r.title) + '</strong><small>' + reminderTypeLabel(r.reminder_type) + ' — Hạn: ' + formatDate(r.due_date) + '</small></div><div style="display:flex;gap:0.35rem"><button class="btn btn-sm btn-primary" onclick="window.p2CompleteReminder(\'' + r.id + '\')">✓</button><button class="btn btn-sm btn-danger" onclick="window.p2DeleteReminder(\'' + r.id + '\')">X</button></div></div>').join('') + '</div></div>' : ''}
        ${completed.length > 0 ? '<div class="p2-section-block"><h3>Đã hoàn thành (' + completed.length + ')</h3><div class="p2-reminder-list">' + completed.map(r => '<div class="p2-reminder-item completed"><div><strong>' + escapeHtml(r.title) + '</strong><small>' + reminderTypeLabel(r.reminder_type) + '</small></div><button class="btn btn-sm btn-outline" onclick="window.p2DeleteReminder(\'' + r.id + '\')">X</button></div>').join('') + '</div></div>' : ''}
      </section>`;
  }

  window.p2AddReminder = async function() {
    const title = document.getElementById('rm-title').value.trim();
    const dueDate = document.getElementById('rm-date').value;
    const type = document.getElementById('rm-type').value;
    if (!title || !dueDate) return alert('Vui lòng nhập tiêu đề và ngày hạn.');
    const res = await apiFetch('reminders-create', 'POST', { title, dueDate, reminderType: type });
    if (res.success) { document.getElementById('rm-title').value = ''; document.getElementById('rm-date').value = ''; window.p2ShowView('reminders'); }
    else alert('Lỗi: ' + (res.error || 'Không thể tạo'));
  };

  window.p2CompleteReminder = async function(id) {
    const res = await apiFetch('reminders-complete', 'POST', { id, completed: true });
    if (res.success) window.p2ShowView('reminders');
  };

  window.p2DeleteReminder = async function(id) {
    if (!confirm('Xoá nhắc nhở này?')) return;
    const res = await apiFetch('reminders-delete&id=' + id, 'DELETE');
    if (res.success) window.p2ShowView('reminders');
  };
})();
