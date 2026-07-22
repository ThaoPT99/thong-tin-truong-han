// student-agent.js — Personal AI Agent cho học sinh đã đăng nhập
// Widget chat có thể thao tác dữ liệu của chính học sinh đó
(function() {
  'use strict';

  // ─── State ───
  let isOpen = false;
  let isSending = false;
  let messages = [];
  let studentProfile = null;
  const storageKey = 'studentAgentMessages';
  const profileKey = 'checklist_data'; // Share with checklist.js

  // Load persisted messages
  try {
    var saved = localStorage.getItem(storageKey);
    if (saved) {
      messages = JSON.parse(saved);
      if (messages.length > 20) messages = messages.slice(-20);
    }
  } catch (e) { /* ignore */ }

  // Load student profile from checklist data
  function loadStudentProfile() {
    try {
      var raw = localStorage.getItem(profileKey);
      if (raw) {
        var data = JSON.parse(raw);
        studentProfile = data.profile || {};
      }
    } catch (e) { /* ignore */ }
  }
  loadStudentProfile();

  // ─── Build HTML ───
  function buildWidget() {
    var container = document.createElement('div');
    container.id = 'student-agent-widget';
    container.innerHTML =
      '<button type="button" id="sa-fab" class="sa-fab" aria-label="Mở trợ lý AI" title="Trợ lý cá nhân">' +
        '<svg class="sa-fab-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 2l.5 9.5L22 12l-9.5.5L12 22l-.5-9.5L2 12l9.5-.5z"/>' +
          '<path d="M18 4l.5 3.5L22 8l-3.5.5L18 12l-.5-3.5L14 8l3.5-.5z"/>' +
        '</svg>' +
        '<svg class="sa-fab-close" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
        '<span class="sa-fab-label">Trợ lý</span>' +
      '</button>' +
      '<div id="sa-panel" class="sa-panel">' +
        '<div class="sa-header">' +
          '<div class="sa-header-left">' +
            '<div class="sa-avatar">🤖</div>' +
            '<div>' +
              '<div class="sa-header-title">Trợ lý cá nhân</div>' +
              '<div class="sa-header-status">Online</div>' +
            '</div>' +
          '</div>' +
          '<button type="button" id="sa-close" class="sa-header-close" aria-label="Đóng">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div id="sa-messages" class="sa-messages">' +
          '<div class="sa-welcome">' +
            '<div class="sa-bubble sa-bubble-ai">' +
              '<div class="sa-bubble-content">👋 Chào bạn! Tôi là trợ lý AI cá nhân của bạn.<br><br>' +
              'Tôi có thể:<br>' +
              '• 📋 Xem/Sửa hồ sơ của bạn<br>' +
              '• ✅ Cập nhật checklist giấy tờ<br>' +
              '• 🏫 Tra cứu thông tin trường<br>' +
              '• 📝 Soạn Study Plan / Giải trình<br>' +
              '• ⏰ Xem nhắc nhở<br><br>' +
              '<i>VD: "Cập nhật GPA của tôi lên 7.5"</i></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sa-input-area">' +
          '<div class="sa-input-wrap">' +
            '<input type="text" id="sa-input" class="sa-input" placeholder="Nhập yêu cầu..." autocomplete="off">' +
            '<button type="button" id="sa-send" class="sa-send-btn" aria-label="Gửi">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="sa-suggestions">' +
            '<button type="button" data-quick="Xem hồ sơ của tôi">Hồ sơ</button>' +
            '<button type="button" data-quick="Checklist của tôi đang ở đâu?">Checklist</button>' +
            '<button type="button" data-quick="Tôi cần những giấy tờ gì?">Giấy tờ</button>' +
            '<button type="button" data-quick="Cập nhật GPA của tôi lên 7.0">Sửa GPA</button>' +
            '<button type="button" data-quick="Tìm trường ở Seoul">Seoul</button>' +
            '<button type="button" data-quick="So sánh Osan và Induk">So sánh</button>' +
            '<button type="button" data-quick="Gửi đơn vào Osan">Gửi đơn</button>' +
            '<button type="button" data-quick="Xem đơn của tôi">Đơn của tôi</button>' +
            '<button type="button" data-quick="Tạo nhắc nhở nộp hồ sơ hạn 2026-09-15">Nhắc nhở</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(container);
    return container;
  }

  // ─── Render Messages ───
  function renderMessages() {
    var container = document.getElementById('sa-messages');
    if (!container) return;

    var welcome = container.querySelector('.sa-welcome');
    if (messages.length > 0 && welcome) {
      welcome.remove();
    }

    var existingBubbles = container.querySelectorAll('.sa-bubble');
    existingBubbles.forEach(function(b) { b.remove(); });

    var loadingEl = container.querySelector('.sa-loading');

    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      var div = document.createElement('div');
      div.className = 'sa-bubble sa-bubble-' + (msg.role === 'user' ? 'user' : 'ai');
      div.innerHTML = '<div class="sa-bubble-content">' + msg.content + '</div>';
      container.insertBefore(div, loadingEl || null);
    }

    container.scrollTop = container.scrollHeight;
  }

  // ─── Loading ───
  function showLoading() {
    var container = document.getElementById('sa-messages');
    if (!container) return;
    var existing = container.querySelector('.sa-loading');
    if (existing) return;

    var div = document.createElement('div');
    div.className = 'sa-bubble sa-bubble-ai sa-loading';
    div.innerHTML = '<div class="sa-bubble-content"><span class="sa-dots"><span></span><span></span><span></span></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideLoading() {
    var el = document.querySelector('.sa-loading');
    if (el) el.remove();
  }

  // ─── Render tool results ───
  function renderToolResultMessage(toolResults) {
    if (!toolResults || !toolResults.data) return '';
    var tool = toolResults.tool;
    var data = toolResults.data;

    switch (tool) {
      case 'search_schools': return renderSchoolCards(data, 'Kết quả tìm kiếm trường');
      case 'get_school_detail': return renderSchoolDetail(data);
      case 'compare_schools': return renderCompareTable(data);
      case 'list_by_criteria': return renderSchoolCards(data, 'Trường phù hợp với tiêu chí của bạn');
      case 'apply_school': return renderApplyResult(data);
      case 'get_applications': return renderApplicationsList(data);
      case 'set_reminder': return renderReminderResult(data);
      case 'interview_simulator': return renderInterviewResult(data);
      case 'upload_document': return renderDocumentStatus(data);
      case 'generate_study_plan': return renderStudyPlanDraft(data);
      case 'get_advisor_history': return renderAdvisorHistory(data);
      case 'check_deadlines': return renderDeadlines(data);
      default: return '';
    }
  }

  // ─── Render school cards (for search_schools / list_by_criteria) ───
  function renderSchoolCards(schools, title) {
    if (!schools || schools.length === 0) return '❌ Không tìm thấy trường nào phù hợp.';
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:8px;font-size:14px">🏫 ' + escapeHTML(title || 'Danh sách trường') + '</div>';
    for (var i = 0; i < schools.length; i++) {
      var s = schools[i];
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;margin-bottom:6px;border:1px solid #e5e7eb">';
      html += '<div style="font-weight:600;color:#111">' + escapeHTML(s.name || '') + (s.nameKr ? ' <span style="color:#6b7280;font-weight:400">(' + escapeHTML(s.nameKr) + ')</span>' : '') + '</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:6px;color:#4b5563;font-size:12px">';
      if (s.location) html += '<div>📍 ' + escapeHTML(s.location) + '</div>';
      if (s.region) html += '<div>🗺️ ' + escapeHTML(s.region) + '</div>';
      if (s.system) html += '<div>📚 ' + escapeHTML(s.system) + '</div>';
      if (s.tuition) html += '<div>💰 ' + escapeHTML(s.tuition) + '</div>';
      if (s.ktx) html += '<div>🏠 ' + escapeHTML(s.ktx) + '</div>';
      if (s.quota) html += '<div>🎯 Chỉ tiêu: ' + escapeHTML(s.quota) + '</div>';
      html += '</div>';
      if (s.intro) html += '<div style="color:#6b7280;font-size:11px;margin-top:4px;font-style:italic">' + escapeHTML(s.intro) + '</div>';
      if (s.slug) html += '<div style="margin-top:4px"><a href="/?school=' + encodeURIComponent(s.slug) + '" target="_blank" style="color:#1a56db;font-size:11px;text-decoration:none">🔗 Xem chi tiết →</a></div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ─── Render school detail (for get_school_detail) ───
  function renderSchoolDetail(school) {
    if (!school) return '❌ Không tìm thấy trường này.';
    var ap = school.advisorProfile || {};
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:8px;font-size:14px">🏫 ' + escapeHTML(school.name) + (school.nameKr ? ' (' + escapeHTML(school.nameKr) + ')' : '') + '</div>';
    // Basic info grid
    html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:6px">';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;color:#4b5563;font-size:12px">';
    if (school.location) html += '<div>📍 ' + escapeHTML(school.location) + '</div>';
    if (school.region) html += '<div>🗺️ ' + escapeHTML(school.region) + '</div>';
    if (school.system) html += '<div>📚 ' + escapeHTML(school.system) + '</div>';
    if (school.tuition) html += '<div>💰 ' + escapeHTML(school.tuition) + '</div>';
    if (school.ktx) html += '<div>🏠 ' + escapeHTML(school.ktx) + '</div>';
    if (school.quota) html += '<div>🎯 Chỉ tiêu: ' + escapeHTML(school.quota) + '</div>';
    html += '</div></div>';
    // Conditions
    if (school.conditions && school.conditions.length > 0) {
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:6px">';
      html += '<div style="font-weight:600;color:#111;font-size:12px;margin-bottom:4px">📋 Điều kiện</div>';
      html += '<ul style="margin:0;padding-left:16px;color:#4b5563;font-size:12px">';
      for (var ci = 0; ci < school.conditions.length; ci++) {
        html += '<li>' + escapeHTML(school.conditions[ci]) + '</li>';
      }
      html += '</ul></div>';
    }
    // Majors
    if (school.majors && school.majors.length > 0) {
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:6px">';
      html += '<div style="font-weight:600;color:#111;font-size:12px;margin-bottom:4px">📖 Chuyên ngành</div>';
      html += '<div style="color:#4b5563;font-size:12px">' + escapeHTML(school.majors.join(', ')) + '</div></div>';
    }
    // Advantages
    if (school.advantages && school.advantages.length > 0) {
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:6px">';
      html += '<div style="font-weight:600;color:#111;font-size:12px;margin-bottom:4px">⭐ Ưu điểm</div>';
      html += '<ul style="margin:0;padding-left:16px;color:#059669;font-size:12px">';
      for (var ai = 0; ai < school.advantages.length; ai++) {
        html += '<li>' + escapeHTML(school.advantages[ai]) + '</li>';
      }
      html += '</ul></div>';
    }
    // Advisor info
    if (ap.visaChance || ap.jobOpportunity || ap.costLevel) {
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:6px">';
      html += '<div style="font-weight:600;color:#111;font-size:12px;margin-bottom:4px">📊 Đánh giá</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;color:#4b5563;font-size:12px">';
      if (ap.visaChance) html += '<div>🛂 Visa: ' + ap.visaChance + '/5</div>';
      if (ap.jobOpportunity) html += '<div>💼 Việc làm: ' + ap.jobOpportunity + '/5</div>';
      if (ap.costLevel) html += '<div>💰 Chi phí: ' + ap.costLevel + '/5</div>';
      if (ap.e7Opportunity) html += '<div>🔑 E7: ' + ap.e7Opportunity + '/5</div>';
      html += '</div></div>';
    }
    if (school.slug) html += '<div style="text-align:center;margin-top:6px"><a href="/?school=' + encodeURIComponent(school.slug) + '" target="_blank" style="color:#1a56db;font-size:12px;text-decoration:none;font-weight:500">🔗 Xem trên web →</a></div>';
    html += '</div>';
    return html;
  }

  // ─── Render compare table (for compare_schools) ───
  function renderCompareTable(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Không thể so sánh');
    var s1 = data.school1, s2 = data.school2;
    if (!s1 || !s2) return '❌ Không tìm thấy đủ thông tin để so sánh.';
    var rows = [
      { label: '📍 Vị trí', v1: s1.location, v2: s2.location },
      { label: '🗺️ Khu vực', v1: s1.region, v2: s2.region },
      { label: '📚 Hệ', v1: s1.system, v2: s2.system },
      { label: '💰 Học phí', v1: s1.tuition, v2: s2.tuition },
      { label: '🏠 KTX', v1: s1.ktx, v2: s2.ktx },
      { label: '🎯 Chỉ tiêu', v1: s1.quota, v2: s2.quota },
    ];
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:12px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:8px;font-size:13px">⚖️ So sánh: ' + escapeHTML(s1.name) + ' vs ' + escapeHTML(s2.name) + '</div>';
    // Header
    html += '<div style="display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:4px;background:#dbeafe;border-radius:6px;padding:6px 8px;font-weight:600;color:#1e40af;margin-bottom:4px">';
    html += '<div></div><div style="text-align:center">' + escapeHTML(s1.name) + '</div><div style="text-align:center">' + escapeHTML(s2.name) + '</div>';
    html += '</div>';
    // Rows
    for (var ri = 0; ri < rows.length; ri++) {
      var r = rows[ri];
      var same = r.v1 && r.v2 && r.v1 === r.v2;
      html += '<div style="display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:4px;padding:4px 8px;border-bottom:1px solid #e5e7eb">';
      html += '<div style="color:#6b7280;font-weight:500">' + r.label + '</div>';
      html += '<div style="text-align:center;' + (same ? '' : 'color:#1a56db;font-weight:500') + '">' + escapeHTML(r.v1 || '—') + '</div>';
      html += '<div style="text-align:center;' + (same ? '' : 'color:#059669;font-weight:500') + '">' + escapeHTML(r.v2 || '—') + '</div>';
      html += '</div>';
    }
    // Conditions (show unique differences)
    if (s1.conditions && s2.conditions) {
      html += '<div style="margin-top:6px;padding:6px 8px;background:#fff;border-radius:6px;border:1px solid #e5e7eb">';
      html += '<div style="font-weight:600;color:#111;font-size:11px;margin-bottom:3px">📋 Điều kiện:</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:4px;font-size:11px;color:#4b5563">';
      html += '<div></div><div>' + escapeHTML(s1.conditions.slice(0, 3).join('; ')) + '</div>';
      html += '<div>' + escapeHTML(s2.conditions.slice(0, 3).join('; ')) + '</div>';
      html += '</div></div>';
    }
    html += '<div style="text-align:center;margin-top:6px"><a href="/?compare=' + encodeURIComponent(s1.slug) + ',' + encodeURIComponent(s2.slug) + '" target="_blank" style="color:#1a56db;font-size:11px;text-decoration:none;font-weight:500">🔗 Xem so sánh trên web →</a></div>';
    html += '</div>';
    return html;
  }

  // ─── Render apply result (for apply_school) ───
  function renderApplyResult(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Không thể tạo đơn');
    if (!data.application && data.message) return escapeHTML(data.message);
    if (!data.application && !data.message) return '✅ Đã xử lý yêu cầu của bạn!';
    var app = data.application;
    var statusColors = { 'draft': '#6b7280', 'submitted': '#2563eb', 'reviewing': '#d97706', 'approved': '#059669', 'rejected': '#dc2626' };
    var color = statusColors[app.statusRaw] || statusColors[app.status] || '#6b7280';
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:6px;font-size:14px">📨 Đơn đăng ký</div>';
    html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb">';
    html += '<div style="font-weight:600;color:#111;margin-bottom:4px">' + escapeHTML(app.schoolName || 'Đã gửi đơn') + '</div>';
    html += '<div style="color:#4b5563;font-size:12px">👤 Học sinh: ' + escapeHTML(app.studentName || '') + '</div>';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-top:6px">';
    html += '<span style="background:' + color + ';color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500">' + escapeHTML(app.status || 'Đã tạo') + '</span>';
    html += '<span style="color:#9ca3af;font-size:11px">📅 ' + (app.createdAt ? new Date(app.createdAt).toLocaleDateString('vi-VN') : '') + '</span>';
    html += '</div>';
    if (data.message) html += '<div style="color:#059669;font-size:12px;margin-top:6px;font-weight:500">' + escapeHTML(data.message) + '</div>';
    html += '</div>';
    html += '<div style="text-align:center;margin-top:6px"><span style="color:#6b7280;font-size:11px">📌 Xem chi tiết trong tab "📨 Gửi đơn"</span></div>';
    html += '</div>';
    return html;
  }

  // ─── Render applications list (for get_applications) ───
  function renderApplicationsList(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Không thể lấy danh sách');
    if (data.message) return escapeHTML(data.message);
    if (!data.applications || data.applications.length === 0) return '📭 Bạn chưa có đơn đăng ký nào.';
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:8px;font-size:14px">📨 Danh sách đơn (' + data.applications.length + ')</div>';
    var statusColors = { 'draft': '#6b7280', 'submitted': '#2563eb', 'reviewing': '#d97706', 'approved': '#059669', 'rejected': '#dc2626' };
    var findColor = function(s) {
      for (var k in statusColors) { if (s && s.toLowerCase().includes(k)) return statusColors[k]; }
      return '#6b7280';
    };
    for (var i = 0; i < data.applications.length; i++) {
      var a = data.applications[i];
      var c = findColor(a.statusRaw || a.status);
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;margin-bottom:6px;border:1px solid #e5e7eb">';
      html += '<div style="font-weight:600;color:#111;font-size:13px">' + escapeHTML(a.schoolName || 'Chưa rõ') + '</div>';
      html += '<div style="color:#4b5563;font-size:12px;margin-top:2px">👤 ' + escapeHTML(a.studentName || '') + '</div>';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">';
      html += '<span style="background:' + c + ';color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500">' + escapeHTML(a.status || '—') + '</span>';
      if (a.createdAt) html += '<span style="color:#9ca3af;font-size:11px">📅 ' + new Date(a.createdAt).toLocaleDateString('vi-VN') + '</span>';
      html += '</div></div>';
    }
    html += '<div style="text-align:center;margin-top:4px"><span style="color:#6b7280;font-size:11px">📌 Chi tiết: tab "📨 Gửi đơn" trên web</span></div>';
    html += '</div>';
    return html;
  }

  // ─── Render interview result (for interview_simulator) ───
  function renderInterviewResult(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Khong the bat dau phong van');
    if (data.type === 'interview_question') {
      return '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">' +
        '<div style="font-weight:700;color:#1a56db;margin-bottom:6px;font-size:14px">🎤 Phong van visa - Cau ' + (data.questionNumber || 1) + '/' + (data.totalQuestions || 6) + '</div>' +
        '<div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #e5e7eb">' +
        '<div style="font-size:14px;color:#111;margin-bottom:6px">' + escapeHTML(data.question || '') + '</div>' +
        (data.message ? '<div style="color:#059669;font-size:12px;font-style:italic">' + escapeHTML(data.message) + '</div>' : '') +
        '</div></div>';
    }
    if (data.type === 'interview_answer') {
      return '<div style="background:#fef9ef;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">' +
        '<div style="font-weight:600;color:#d97706;margin-bottom:4px;font-size:13px">📊 Danh gia cua KVAC</div>' +
        '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #fde68a;color:#4b5563">' +
        escapeHTML(data.feedback || '') +
        '</div>' +
        (data.message ? '<div style="color:#059669;font-size:12px;margin-top:6px">' + escapeHTML(data.message) + '</div>' : '') +
        '</div>';
    }
    if (data.type === 'interview_complete') {
      return '<div style="background:#f0fdf4;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">' +
        '<div style="font-weight:700;color:#059669;margin-bottom:6px;font-size:14px">✅ Hoan thanh phong van!</div>' +
        '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #bbf7d0;color:#4b5563">' +
        escapeHTML(data.feedback || 'Cam on ban da tham gia!') +
        '</div>' +
        (data.message ? '<div style="color:#059669;font-size:12px;margin-top:6px">' + escapeHTML(data.message) + '</div>' : '') +
        '</div>';
    }
    if (data.message) return escapeHTML(data.message);
    return '';
  }

  // ─── Render document status (for upload_document) ───
  function renderDocumentStatus(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Khong the kiem tra');
    if (data.type !== 'document_status') {
      if (data.message) return escapeHTML(data.message);
      return '';
    }
    var docs = data.documents || [];
    if (docs.length === 0) return 'Khong co giay to nao.';
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:6px;font-size:14px">📄 Trang thai giay to</div>';
    html += '<div style="font-weight:500;color:#059669;margin-bottom:8px;font-size:12px">' + escapeHTML(data.summary || '') + '</div>';
    for (var i = 0; i < docs.length; i++) {
      var d = docs[i];
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#fff;border-radius:6px;margin-bottom:4px;border:1px solid #e5e7eb">';
      html += '<span style="width:8px;height:8px;border-radius:50%;background:' + (d.color || '#6b7280') + ';flex-shrink:0"></span>';
      html += '<span style="flex:1;color:#111;font-size:12px">' + escapeHTML(d.label || d.type) + '</span>';
      html += '<span style="font-size:11px;color:' + (d.color || '#6b7280') + ';font-weight:500">' + escapeHTML(d.status || 'Chua co') + '</span>';
      html += '</div>';
    }
    if (data.message) html += '<div style="color:#6b7280;font-size:11px;margin-top:6px;font-style:italic">' + escapeHTML(data.message) + '</div>';
    html += '</div>';
    return html;
  }

  // ─── Render reminder result (for set_reminder) ───
  function renderReminderResult(data) {
    if (!data || data.error) return '❌ ' + escapeHTML(data.error || 'Không thể tạo nhắc nhở');
    if (!data.reminder && data.message) return escapeHTML(data.message);
    if (!data.reminder && !data.message) return '✅ Đã xử lý!';
    var r = data.reminder;
    var typeLabels = {
      document: '📄 Giấy tờ', submission: '📨 Nộp hồ sơ',
      interview: '🎤 Phỏng vấn', health_check: '🏥 Sức khỏe',
      visa_appointment: '🛂 Hẹn visa', other: '📌 Khác',
    };
    var label = typeLabels[r.type] || '📌 Nhắc nhở';
    var html = '<div style="background:#fef9ef;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#d97706;margin-bottom:6px;font-size:14px">⏰ Nhắc nhở mới</div>';
    html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;border:1px solid #fde68a">';
    html += '<div style="font-weight:600;color:#111;margin-bottom:2px">' + label + ': ' + escapeHTML(r.title || '') + '</div>';
    html += '<div style="color:#d97706;font-weight:500;margin-top:4px">📅 Hạn: ' + escapeHTML(r.dueDate || '') + '</div>';
    if (data.message) html += '<div style="color:#059669;font-size:12px;margin-top:4px">' + escapeHTML(data.message) + '</div>';
    html += '</div>';
    html += '<div style="text-align:center;margin-top:6px"><span style="color:#6b7280;font-size:11px">📌 Xem trong tab "📨 Gửi đơn"</span></div>';
    html += '</div>';
    return html;
  }

  // ─── Render study plan draft (for generate_study_plan) ───
  function renderStudyPlanDraft(data) {
    if (!data || data.error) return 'Xin loi, ' + escapeHTML(data.error || 'khong the tao Study Plan');
    if (data.message && !data.draft) return escapeHTML(data.message);
    var html = '<div style="background:#f0fdf4;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.6">';
    html += '<div style="font-weight:700;color:#059669;margin-bottom:6px;font-size:14px">Ban nhap Study Plan</div>';
    html += '<div style="background:#fff;border-radius:8px;padding:12px;border:1px solid #bbf7d0;white-space:pre-wrap;color:#334155;font-size:12px">';
    html += escapeHTML(data.draft || '') + '</div>';
    if (data.message) html += '<div style="color:#6b7280;font-size:11px;margin-top:6px;font-style:italic">' + escapeHTML(data.message) + '</div>';
    html += '</div>';
    return html;
  }

  // ─── Render advisor history (for get_advisor_history) ───
  function renderAdvisorHistory(data) {
    if (!data || data.error) return 'Xin loi, ' + escapeHTML(data.error || 'khong the lay lich su');
    if (data.message) return escapeHTML(data.message);
    if (!data.cases || data.cases.length === 0) return 'Ban chua co lich su tu van.';
    var html = '<div style="background:#f0f7ff;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#1a56db;margin-bottom:8px;font-size:14px">Lich su tu van</div>';
    for (var i = 0; i < data.cases.length; i++) {
      var c = data.cases[i];
      var resultColors = { 'approved': '#059669', 'rejected': '#dc2626', 'pending': '#d97706', 'reviewing': '#2563eb' };
      var color = resultColors[c.result] || '#6b7280';
      html += '<div style="background:#fff;border-radius:8px;padding:10px 12px;margin-bottom:6px;border:1px solid #e5e7eb">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<span style="font-weight:600;color:#111;font-size:12px">' + escapeHTML(c.visaType || 'Phan tich ho so') + '</span>';
      html += '<span style="background:' + color + ';color:#fff;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:500">' + escapeHTML(c.result || 'pending') + '</span>';
      html += '</div>';
      if (c.schools) html += '<div style="color:#4b5563;font-size:11px;margin-top:2px">Truong: ' + escapeHTML(c.schools) + '</div>';
      if (c.advicePreview) html += '<div style="color:#6b7280;font-size:11px;margin-top:2px">' + escapeHTML(c.advicePreview) + '...</div>';
      if (c.createdAt) html += '<div style="color:#9ca3af;font-size:10px;margin-top:2px">' + new Date(c.createdAt).toLocaleDateString('vi-VN') + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ─── Render deadlines (for check_deadlines) ───
  function renderDeadlines(data) {
    if (!data || data.error) return 'Xin loi, ' + escapeHTML(data.error || 'khong the lay danh sach');
    if (data.message) return escapeHTML(data.message);
    if (!data.reminders || data.reminders.length === 0) return 'Ban chua co nhac nho nao.';
    var html = '<div style="background:#fef9ef;border-radius:12px;padding:12px;margin:8px 0;font-size:13px;line-height:1.5">';
    html += '<div style="font-weight:700;color:#d97706;margin-bottom:4px;font-size:14px">Han nop giay to</div>';
    if (data.warnings) {
      var warnColor = data.reminders.some(function(r) { return r.daysLeft < 0 && !r.completed; }) ? '#dc2626' : '#d97706';
      html += '<div style="color:' + warnColor + ';font-weight:500;font-size:12px;margin-bottom:8px">' + escapeHTML(data.warnings) + '</div>';
    }
    for (var i = 0; i < data.reminders.length; i++) {
      var r = data.reminders[i];
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#fff;border-radius:6px;margin-bottom:4px;border:1px solid #fde68a;' + (r.completed ? 'opacity:0.5' : '') + '">';
      html += '<span style="width:8px;height:8px;border-radius:50%;background:' + (r.completed ? '#9ca3af' : r.statusColor || '#d97706') + ';flex-shrink:0"></span>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-size:12px;color:#111;font-weight:500">' + escapeHTML(r.title || '') + '</div>';
      html += '<div style="font-size:11px;color:' + (r.completed ? '#9ca3af' : r.statusColor || '#d97706') + '">' + escapeHTML(r.type || 'Khac') + ' - ' + escapeHTML(r.dueDate || '') + ' - ' + escapeHTML(r.statusText || '') + '</div>';
      html += '</div>';
      if (r.completed) html += '<span style="font-size:11px;color:#059669">Da xong</span>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ─── Escape HTML ───
  function escapeHTML(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    var d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

  // ─── Send Message ───
  async function sendMessage(text) {
    if (isSending || !text || text.trim().length < 2) return;
    isSending = true;

    var input = document.getElementById('sa-input');
    var sendBtn = document.getElementById('sa-send');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Add user message
    messages.push({ role: 'user', content: escapeHTML(text.trim()) });
    renderMessages();
    showLoading();

    try {
      // Build student context
      var profileData = {};
      try { var raw = localStorage.getItem(profileKey); if (raw) { var d = JSON.parse(raw); profileData = d.profile || {}; } } catch(e) {}

      var res = await fetch('/api/deepseek?action=student-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          studentProfile: profileData,
          conversation: messages.slice(-10), // Last 10 messages for context
        }),
      });
      var data = await res.json();
      hideLoading();

      if (data.success) {
        // Handle tool results first (render beautiful cards)
        if (data.toolResults) {
          var toolHtml = renderToolResultMessage(data.toolResults);
          if (toolHtml) {
            messages.push({ role: 'assistant', content: toolHtml });
          }
        }

        // Handle text reply
        if (data.reply && data.reply.trim() && !data.toolResults) {
          var formatted = escapeHTML(data.reply).replace(/\n/g, '<br>');
          messages.push({ role: 'assistant', content: formatted });
        } else if (data.reply && data.reply.trim() && data.toolResults) {
          // Append AI analysis text after tool results
          var formatted2 = escapeHTML(data.reply).replace(/\n/g, '<br>');
          if (formatted2 !== 'Đang tra cứu...') {
            messages.push({ role: 'assistant', content: formatted2 });
          }
        }

        // Handle profile updates from the response
        if (data.updatedProfile) {
          try {
            var raw2 = localStorage.getItem(profileKey);
            if (raw2) {
              var existing = JSON.parse(raw2);
              existing.profile = { ...(existing.profile || {}), ...data.updatedProfile };
              localStorage.setItem(profileKey, JSON.stringify(existing));
              studentProfile = existing.profile;
            }
          } catch(e) { /* ignore */ }
        }

        // Handle checklist updates from the response
        if (data.updatedChecklist) {
          try {
            var raw3 = localStorage.getItem(profileKey);
            if (raw3) {
              var existing2 = JSON.parse(raw3);
              existing2.checklist = data.updatedChecklist;
              localStorage.setItem(profileKey, JSON.stringify(existing2));
            }
          } catch(e) { /* ignore */ }
        }

        // Trigger custom event for other modules (checklist.js etc.) to refresh
        if (data.updatedProfile || data.updatedChecklist) {
          window.dispatchEvent(new CustomEvent('student-data-changed', {
            detail: { profile: data.updatedProfile, checklist: data.updatedChecklist }
          }));
        }
      } else {
        messages.push({
          role: 'assistant',
          content: '❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!',
        });
      }
    } catch (err) {
      hideLoading();
      messages.push({
        role: 'assistant',
        content: '❌ Mất kết nối. Vui lòng kiểm tra internet và thử lại.',
      });
    }

    renderMessages();
    saveMessages();

    if (input) { input.value = ''; input.disabled = false; input.focus(); }
    if (sendBtn) sendBtn.disabled = false;
    isSending = false;
  }

  // ─── Persist ───
  function saveMessages() {
    try {
      var toSave = messages.slice(-20);
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch (e) { /* ignore */ }
  }

  // ─── Toggle ───
  function openPanel() {
    isOpen = true;
    var panel = document.getElementById('sa-panel');
    var fab = document.getElementById('sa-fab');
    var fabIcon = fab ? fab.querySelector('.sa-fab-icon') : null;
    var fabClose = fab ? fab.querySelector('.sa-fab-close') : null;
    if (panel) panel.classList.add('is-open');
    if (fab) fab.classList.add('is-open');
    if (fabIcon) fabIcon.style.display = 'none';
    if (fabClose) fabClose.style.display = 'block';

    var input = document.getElementById('sa-input');
    if (input) setTimeout(function() { input.focus(); }, 350);
  }

  function closePanel() {
    isOpen = false;
    var panel = document.getElementById('sa-panel');
    var fab = document.getElementById('sa-fab');
    var fabIcon = fab ? fab.querySelector('.sa-fab-icon') : null;
    var fabClose = fab ? fab.querySelector('.sa-fab-close') : null;
    if (panel) panel.classList.remove('is-open');
    if (fab) fab.classList.remove('is-open');
    if (fabIcon) fabIcon.style.display = 'block';
    if (fabClose) fabClose.style.display = 'none';
  }

  // ─── Show/Hide widget based on auth status ───
  function updateVisibility() {
    var widget = document.getElementById('student-agent-widget');
    if (!widget) return;
    var token = localStorage.getItem('student_token');
    if (token) {
      widget.style.display = '';
    } else {
      widget.style.display = 'none';
    }
  }

  // ─── Init ───
  function init() {
    var widget = buildWidget();
    renderMessages();
    updateVisibility();

    // Listen for auth changes
    var authBtn = document.getElementById('authBtn');
    if (authBtn) {
      var observer = new MutationObserver(function() {
        updateVisibility();
        loadStudentProfile();
      });
      observer.observe(authBtn, { attributes: true, attributeFilter: ['class'] });
    }

    // Listen for storage changes (other tabs)
    window.addEventListener('storage', function(e) {
      if (e.key === 'student_token') {
        updateVisibility();
        loadStudentProfile();
      }
    });

    // Listen for custom data changes
    window.addEventListener('student-data-changed', function() {
      loadStudentProfile();
    });

    var fab = document.getElementById('sa-fab');
    var closeBtn = document.getElementById('sa-close');
    var input = document.getElementById('sa-input');
    var sendBtn = document.getElementById('sa-send');

    if (fab) {
      fab.addEventListener('click', function() {
        isOpen ? closePanel() : openPanel();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    function doSend() {
      if (!input) return;
      var val = input.value.trim();
      if (val) sendMessage(val);
    }

    if (sendBtn) sendBtn.addEventListener('click', doSend);
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSend();
        }
      });
    }

    // Quick suggestions
    widget.querySelectorAll('[data-quick]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        sendMessage(btn.dataset.quick);
      });
    });

    // Auto-open if has previous messages
    if (messages.length > 0) {
      setTimeout(openPanel, 1000);
    }

    // Also open if coming from checklist view (user just logged in)
    if (window.location.hash === '#checklist' && !messages.length) {
      setTimeout(openPanel, 2000);
    }
  }

  // ─── Start when DOM ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
