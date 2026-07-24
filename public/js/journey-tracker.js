// journey-tracker.js — Theo dõi hành trình học sinh
// Tự động phát hiện giai đoạn dựa trên profile + cho phép cập nhật thủ công
(function() {
  'use strict';

  // ─── Định nghĩa các giai đoạn ───
  const STAGES = [
    { id: 'exploring',         label: 'Tìm hiểu',         icon: '🔍', pct: 0,  desc: 'Đang tìm hiểu thông tin du học Hàn Quốc' },
    { id: 'building_profile',  label: 'Khai báo hồ sơ',   icon: '📝', pct: 20, desc: 'Đang khai báo thông tin cá nhân và hồ sơ' },
    { id: 'preparing_docs',    label: 'Chuẩn bị giấy tờ', icon: '📄', pct: 50, desc: 'Đang chuẩn bị các giấy tờ theo checklist' },
    { id: 'ready_to_submit',   label: 'Sẵn sàng nộp',     icon: '✅', pct: 70, desc: 'Hồ sơ đã sẵn sàng, chuẩn bị nộp visa' },
    { id: 'submitted',         label: 'Đã nộp visa',       icon: '📨', pct: 85, desc: 'Đã nộp hồ sơ visa, đang chờ kết quả' },
    { id: 'approved',          label: 'Đậu visa! 🎉',     icon: '🎉', pct: 100, desc: 'Chúc mừng! Visa đã được cấp.' },
    { id: 'rejected',          label: 'Trượt visa',       icon: '❌', pct: 0,  desc: 'Rất tiếc, hồ sơ bị từ chối. Cần tư vấn lại.' },
  ];

  const STORAGE_KEY = 'journey_stage';

  // ─── Lấy giai đoạn hiện tại ───
  function getCurrentStage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch(e) { return null; }
  }

  // ─── Lưu giai đoạn ───
  function setCurrentStage(stageId) {
    try {
      localStorage.setItem(STORAGE_KEY, stageId);
    } catch(e) {}
  }

  // ─── Tự động phát hiện giai đoạn từ profile ───
  function detectStageFromProfile(profile) {
    if (!profile || Object.keys(profile).length === 0) return 'exploring';

    // Nếu đã có journeyStage được set thủ công, ưu tiên dùng
    var saved = getCurrentStage();
    if (saved && STAGES.some(function(s) { return s.id === saved; })) {
      // Không tự động hạ cấp nếu đã được set thủ công lên cao hơn
      var savedIdx = STAGES.findIndex(function(s) { return s.id === saved; });
      if (savedIdx >= 3) return saved; // từ ready_to_submit trở lên là do người dùng tự set
    }

    // Tự động suy luận
    if (profile._completed) {
      return 'preparing_docs'; // Đã hoàn thành khai báo → đang chuẩn bị giấy tờ
    }

    // Kiểm tra xem đã có dữ liệu profile chưa
    var hasPersonalData = profile.fullName || profile.dateOfBirth || profile.gender;
    var hasEducationData = profile.gpa || profile.koreanLevel;
    var hasFinanceData = profile.savingsAmount > 0;
    var hasRiskData = profile.hasVisaRejection !== undefined || profile.consularRegion;

    if (hasPersonalData && hasEducationData && hasFinanceData && hasRiskData) {
      return 'building_profile'; // Đang khai báo, gần xong
    }

    if (hasPersonalData) {
      return 'building_profile'; // Đã bắt đầu khai báo
    }

    return 'exploring'; // Mới vào web
  }

  // ─── Lấy thông tin semester deadline ───
  function getDeadlineInfo() {
    var sem = window.SEMESTER_INFO;
    if (!sem) return null;

    // Deadline là 2 tháng trước kỳ nhập học
    // VD: kỳ tháng 3 → deadline tháng 1; kỳ tháng 1 → deadline tháng 11 năm trước
    var dlMonth = parseInt(sem.ky) - 2;
    var dlYear = parseInt(sem.nam);
    if (dlMonth <= 0) { dlMonth += 12; dlYear--; }

    var now = new Date();
    var deadline = new Date(dlYear, dlMonth - 1, 15); // Giữa tháng
    var diffDays = Math.ceil((deadline - now) / (24 * 60 * 60 * 1000));

    return {
      semesterLabel: 'Tháng ' + sem.ky + '/' + sem.nam,
      deadlineDate: deadline,
      diffDays: diffDays,
      isUrgent: diffDays <= 30,
      isCritical: diffDays <= 14,
      isPast: diffDays <= 0,
    };
  }

  // ─── Render Widget ───
  function renderWidget(container) {
    if (!container) return;

    var profile = null;
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) profile = JSON.parse(raw).profile || {};
    } catch(e) {}

    var stageId = detectStageFromProfile(profile);
    setCurrentStage(stageId);
    var stage = STAGES.find(function(s) { return s.id === stageId; }) || STAGES[0];
    var stageIdx = STAGES.indexOf(stage);

    var deadline = getDeadlineInfo();

    // Build HTML
    var html = '<div class="jt-widget">' +
      '<div class="jt-header">' +
      '<span class="jt-header-icon">🗺️</span>' +
      '<span class="jt-header-title">Hành trình của bạn</span>' +
      '</div>' +
      '<div class="jt-body">' +
      // Giai đoạn badge
      '<div class="jt-stage-row">' +
      '<span class="jt-stage-icon">' + stage.icon + '</span>' +
      '<div class="jt-stage-info">' +
      '<div class="jt-stage-label">' + stage.label + '</div>' +
      '<div class="jt-stage-desc">' + stage.desc + '</div>' +
      '</div>' +
      '</div>' +
      // Progress bar
      '<div class="jt-progress-bar">' +
      '<div class="jt-progress-fill" style="width:' + stage.pct + '%"></div>' +
      '</div>' +
      // Deadline warning
      (deadline ? renderDeadlineHTML(deadline) : '') +
      // Stage selector (nếu đã qua giai đoạn preparing_docs)
      '<div class="jt-actions">' +
      '<button type="button" class="jt-update-btn" onclick="window.jtOpenUpdater()">' +
      (stageIdx <= 3 ? '📌 Cập nhật tiến độ' : '🔄 Thay đổi giai đoạn') +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    container.innerHTML = html;
  }

  function renderDeadlineHTML(deadline) {
    if (deadline.isPast) {
      return '<div class="jt-deadline jt-deadline-critical">' +
        '⛔ Hạn nộp hồ sơ kỳ ' + deadline.semesterLabel + ' đã qua! Cân nhắc kỳ sau.' +
        '</div>';
    }

    var cls = deadline.isCritical ? 'jt-deadline-critical' : deadline.isUrgent ? 'jt-deadline-urgent' : 'jt-deadline-normal';
    var icon = deadline.isCritical ? '🚨' : deadline.isUrgent ? '⚠️' : '📅';
    var text = deadline.isCritical
      ? 'Còn ' + deadline.diffDays + ' ngày đến hạn nộp kỳ ' + deadline.semesterLabel + '! Cần gấp!'
      : deadline.isUrgent
        ? 'Còn ' + deadline.diffDays + ' ngày đến hạn nộp kỳ ' + deadline.semesterLabel + '. Nên nộp sớm.'
        : 'Hạn nộp kỳ ' + deadline.semesterLabel + ': còn ' + deadline.diffDays + ' ngày.';

    return '<div class="jt-deadline ' + cls + '">' +
      '<span>' + icon + '</span>' +
      '<span>' + text + '</span>' +
      '</div>';
  }

  // ─── Open stage updater modal ───
  window.jtOpenUpdater = function() {
    var existing = document.querySelector('.jt-modal');
    if (existing) existing.remove();

    var currentStageId = getCurrentStage() || 'exploring';
    var currentIdx = STAGES.findIndex(function(s) { return s.id === currentStageId; });

    var modal = document.createElement('div');
    modal.className = 'jt-modal';
    modal.innerHTML = '<div class="jt-backdrop" onclick="window.jtCloseUpdater()"></div>' +
      '<div class="jt-modal-card">' +
      '<button type="button" class="jt-modal-close" onclick="window.jtCloseUpdater()">&times;</button>' +
      '<h3 class="jt-modal-title">📍 Cập nhật giai đoạn</h3>' +
      '<p class="jt-modal-desc">Bạn đang ở bước nào trong hành trình du học? Chọn để cập nhật.</p>' +
      '<div class="jt-stage-list">' +
      STAGES.map(function(s, i) {
        var isCurrent = i === currentIdx;
        // Disable quay lại giai đoạn trừ khi đang ở exploring/building
        var isLocked = !isCurrent && i < currentIdx && currentIdx >= 3;
        return '<button type="button" class="jt-stage-option ' +
          (isCurrent ? 'is-current' : '') +
          (isLocked ? 'is-locked' : '') + '" ' +
          (isLocked ? 'disabled' : '') +
          ' data-stage="' + s.id + '" onclick="window.jtSelectStage(\'' + s.id + '\', this)">' +
          '<span class="jt-opt-icon">' + s.icon + '</span>' +
          '<div class="jt-opt-info">' +
          '<span class="jt-opt-label">' + s.label + '</span>' +
          '<span class="jt-opt-desc">' + s.desc + '</span>' +
          '</div>' +
          (isCurrent ? '<span class="jt-opt-badge">Hiện tại</span>' : '') +
          (isLocked ? '<span class="jt-opt-lock">🔒</span>' : '') +
          '</button>';
      }).join('') +
      '</div>' +
      '<button type="button" class="btn btn-primary jt-modal-confirm" onclick="window.jtConfirmStage()">Xác nhận</button>' +
      '</div>';

    document.body.appendChild(modal);
    setTimeout(function() { modal.classList.add('is-open'); }, 10);
  };

  window.jtCloseUpdater = function() {
    var modal = document.querySelector('.jt-modal');
    if (modal) {
      modal.classList.remove('is-open');
      setTimeout(function() { modal.remove(); }, 250);
    }
  };

  window.jtSelectStage = function(stageId, btn) {
    // Remove previous selection
    document.querySelectorAll('.jt-stage-option').forEach(function(el) {
      el.classList.remove('is-selected');
      var badge = el.querySelector('.jt-opt-badge');
      if (badge && !el.classList.contains('is-current')) badge.remove();
    });
    btn.classList.add('is-selected');
    // Store selected stage
    window._jtSelectedStage = stageId;
    // Show badge on selected
    if (!btn.querySelector('.jt-opt-badge')) {
      var newBadge = document.createElement('span');
      newBadge.className = 'jt-opt-badge jt-opt-badge-selected';
      newBadge.textContent = 'Chọn';
      btn.appendChild(newBadge);
    }
  };

  window.jtConfirmStage = function() {
    var selected = window._jtSelectedStage;
    if (!selected) { alert('Vui lòng chọn một giai đoạn.'); return; }

    setCurrentStage(selected);
    window._jtSelectedStage = null;
    window.jtCloseUpdater();

    // Re-render widget
    var widget = document.querySelector('.jt-widget');
    if (widget) {
      var parent = widget.parentElement;
      if (parent) renderWidget(parent);
    }

    // Sync to server if logged in
    var token = null;
    try { token = localStorage.getItem('student_token'); } catch(e) {}
    if (token) {
      var fetchFn = window.fetchWithAuth || fetch;
      fetchFn('/api/auth/student?action=update-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyStage: selected }),
      }).catch(function() {});
    }
  };

  // ─── Auto-update stage based on profile changes ───
  function autoSyncStage() {
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        var profile = JSON.parse(raw).profile || {};
        var detected = detectStageFromProfile(profile);
        var current = getCurrentStage();

        // Nếu phát hiện thấy profile đã hoàn thành, tự động nâng cấp
        if (profile._completed && (!current || current === 'exploring')) {
          setCurrentStage('preparing_docs');
          return;
        }

        // Nếu có dữ liệu cá nhân mà vẫn đang exploring → nâng lên building_profile
        if (detected === 'building_profile' && (!current || current === 'exploring')) {
          setCurrentStage('building_profile');
        }
      }
    } catch(e) {}
  }

  // ─── Re-render widget helper ───
  function reRenderWidget() {
    var container = document.querySelector('.jt-container');
    if (container) renderWidget(container);
  }

  // ─── Init ───
  function init() {
    autoSyncStage();

    // Render widget vào sidebar
    var sidebar = document.querySelector('.app-sidebar');
    if (sidebar) {
      var widgetContainer = document.createElement('div');
      widgetContainer.className = 'jt-container';
      sidebar.appendChild(widgetContainer);
      renderWidget(widgetContainer);
    }

    // Hook vào tất cả các bước lưu checklist (Step 1-4)
    ['clSaveStep1', 'clSaveStep2', 'clSaveStep3', 'clSaveStep4'].forEach(function(fnName) {
      var orig = window[fnName];
      if (typeof orig === 'function') {
        window[fnName] = function() {
          orig.apply(this, arguments);
          autoSyncStage();
          reRenderWidget();
        };
      }
    });

    // Hook vào khởi tạo lại
    var origFresh = window.clStartFresh;
    if (typeof origFresh === 'function') {
      window.clStartFresh = function() {
        origFresh.apply(this, arguments);
        setCurrentStage('exploring');
        reRenderWidget();
      };
    }

    // Polling để bắt các thay đổi từ các module khác (advisor, ai-chat...)
    setInterval(function() {
      var raw = localStorage.getItem('checklist_data');
      if (raw !== window.__jtCheckData) {
        window.__jtCheckData = raw;
        autoSyncStage();
        reRenderWidget();
      }
    }, 3000);
  }

  // ─── Styles ───
  var STYLES = `
    .jt-container {
      padding: 0.75rem;
      border-top: 1px solid var(--border);
    }
    .jt-widget {
      background: #fff;
      border-radius: 10px;
      border: 1px solid var(--border);
      overflow: hidden;
      font-size: 0.82rem;
      transition: all 0.3s ease;
    }
    .jt-widget:hover {
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .jt-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 0.7rem;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: #fff;
      font-weight: 600;
      font-size: 0.78rem;
    }
    .jt-header-icon { font-size: 0.9rem; }
    .jt-body { padding: 0.65rem; }
    .jt-stage-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .jt-stage-icon { font-size: 1.4rem; }
    .jt-stage-info { flex: 1; min-width: 0; }
    .jt-stage-label {
      font-weight: 700;
      font-size: 0.88rem;
      color: var(--text);
    }
    .jt-stage-desc {
      font-size: 0.72rem;
      color: var(--text-muted);
      line-height: 1.3;
      margin-top: 0.1rem;
    }
    .jt-progress-bar {
      height: 4px;
      background: var(--gray-200);
      border-radius: 4px;
      margin: 0.5rem 0;
      overflow: hidden;
    }
    .jt-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #7c3aed);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .jt-deadline {
      display: flex;
      align-items: flex-start;
      gap: 0.35rem;
      padding: 0.45rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      line-height: 1.35;
      margin-top: 0.4rem;
    }
    .jt-deadline-normal { background: #f0f7ff; border: 1px solid #bfdbfe; color: #1e40af; }
    .jt-deadline-urgent { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
    .jt-deadline-critical { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
    .jt-actions { margin-top: 0.45rem; }
    .jt-update-btn {
      width: 100%;
      padding: 0.4rem;
      border: 1px dashed var(--gray-300);
      border-radius: 6px;
      background: transparent;
      color: var(--text-muted);
      font: inherit;
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .jt-update-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-soft);
    }
    /* Modal */
    .jt-modal {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .jt-modal.is-open { opacity: 1; }
    .jt-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
    }
    .jt-modal-card {
      position: relative;
      background: #fff;
      border-radius: 16px;
      max-width: 440px;
      width: 90vw;
      max-height: 85vh;
      overflow-y: auto;
      padding: 1.5rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      transform: translateY(20px) scale(0.96);
      transition: transform 0.25s ease;
    }
    .jt-modal.is-open .jt-modal-card {
      transform: translateY(0) scale(1);
    }
    .jt-modal-close {
      position: absolute;
      top: 0.6rem;
      right: 0.8rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--gray-400);
      cursor: pointer;
    }
    .jt-modal-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    .jt-modal-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    .jt-stage-list {
      display: grid;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .jt-stage-option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      width: 100%;
      padding: 0.65rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: #fff;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .jt-stage-option:hover:not(:disabled) {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    .jt-stage-option.is-current {
      border-color: #2563eb;
      background: #eff6ff;
    }
    .jt-stage-option.is-selected {
      border-color: #059669;
      background: #f0fdf4;
    }
    .jt-stage-option:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .jt-opt-icon { font-size: 1.3rem; }
    .jt-opt-info { flex: 1; }
    .jt-opt-label {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .jt-opt-desc {
      display: block;
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .jt-opt-badge {
      font-size: 0.68rem;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: #2563eb;
      color: #fff;
      font-weight: 600;
    }
    .jt-opt-badge-selected {
      background: #059669;
    }
    .jt-opt-lock { font-size: 0.85rem; }
    .jt-modal-confirm {
      width: 100%;
    }
  `;

  // ─── Inject styles ───
  function injectStyles() {
    if (document.getElementById('jt-styles')) return;
    var style = document.createElement('style');
    style.id = 'jt-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  // ─── Khởi động sau khi DOM sẵn sàng ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectStyles();
      init();
    });
  } else {
    injectStyles();
    init();
  }

})();
