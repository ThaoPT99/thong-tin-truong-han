// personalization.js — 6 cải tiến cá nhân hoá hồ sơ du học
// #1: Study Plan Builder 8 bước tương tác
// #2: Timeline cá nhân hoá tự động
// #3: So sánh với case tương tự từ advisor_cases
// #4: Checklist thông minh (step/tip/priority)
// #5: AI chấm điểm Study Plan
// #6: Gợi ý trường ngay trong Analysis step

(function() {
  'use strict';

  // ════════════════════════════════════════════
  // #6: GỢI Ý TRƯỜNG TRONG ANALYSIS STEP
  // ════════════════════════════════════════════

  /**
   * Render school recommendations into the analysis step
   * Called after profile analysis is shown
   */
  async function renderSchoolRecommendations(container) {
    var profile = getChecklistProfile();
    if (!profile || !profile.gpa) return;

    // Build advisor-style profile from checklist data
    var advisorProfile = {
      visaType: profile.visaType === 'D-4-1' ? 'D4-1' : 'D2-6',
      gender: profile.gender || 'female',
      age: getAgeFromProfile(profile) || 21,
      gpa: profile.gpa || 6.5,
      absences: profile.highSchoolAbsences || 10,
      korean: profile.koreanLevel || 'none',
      visaFail: profile.hasVisaRejection ? 'yes' : 'no',
      region: profile.region || 'any',
      budget: profile.savingsAmount && profile.savingsAmount < 10000 ? 'low' : 'medium',
      priorities: ['visa', 'job'],
    };

    // Try local scoring first (uses SCHOOLS_DATA from api-loader)
    if (typeof window.analyzeSchools === 'function' && window.SCHOOLS_DATA) {
      try {
        var results = window.analyzeSchools(advisorProfile);
        var top3 = results.slice(0, 3);
        if (top3.length > 0) {
          renderSchoolCards(container, top3, profile.visaType);
          return;
        }
      } catch(e) { /* fallback to API */ }
    }

    // Fallback: call advisor API
    try {
      var res = await fetch('/api/deepseek?action=advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advisorProfile),
      });
      var data = await res.json();
      if (data.success && data.advice) {
        var advHtml = '<div class="pa-school-recs">' +
          '<div class="pa-school-recs-header">🏫 Trường phù hợp với hồ sơ của bạn</div>' +
          '<div class="pa-school-recs-body">' + formatAIAdvice(data.advice) + '</div></div>';
        container.insertAdjacentHTML('afterend', advHtml);
      }
    } catch(e) { /* silent fail */ }
  }

  function renderSchoolCards(container, results, visaType) {
    var html = '<div class="pa-school-recs">' +
      '<div class="pa-school-recs-header">🏫 Top trường phù hợp với hồ sơ</div>' +
      '<div class="pa-school-recs-grid">';

    results.forEach(function(item) {
      var school = item.school || {};
      var pct = item.score;
      var level = item.level || 'Cân nhắc';
      var color = pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626';
      var safeId = encodeURIComponent(String(item.id || ''));
      var reasons = (item.reasons || []).slice(0, 2);
      var risks = (item.risks || []).slice(0, 1);
      html += '<div class="pa-school-rec-card" data-school-id="' + safeId + '" onclick="var id=this.dataset.schoolId;window.showSchool&&window.showSchool(id)">' +
        '<div class="pa-school-rec-top">' +
        '<div class="pa-school-rec-name">' + escapeHtml(school.name || '') + '</div>' +
        '<div class="pa-school-rec-pct" style="color:' + color + '">' + Math.round(pct) + '%</div>' +
        '</div>' +
        '<div class="pa-school-rec-meter"><span style="width:' + pct + '%;background:' + color + '"></span></div>' +
        '<div class="pa-school-rec-tags">' +
        '<span>' + escapeHtml(level) + '</span>' +
        (item.rules && item.rules.region ? '<span>' + escapeHtml(window.REGION_LABELS ? window.REGION_LABELS[item.rules.region] : item.rules.region) + '</span>' : '') +
        '</div>' +
        '<div class="pa-school-rec-reasons">' +
        reasons.map(function(r) { return '<div>✅ ' + escapeHtml(r) + '</div>'; }).join('') +
        (risks.length > 0 ? risks.map(function(r) { return '<div style="color:#dc2626">⚠️ ' + escapeHtml(r) + '</div>'; }).join('') : '') +
        '</div></div>';
    });
    html += '</div></div>';

    var parent = container.closest ? container.closest('.cl-analysis') : container.parentElement;
    if (parent) parent.insertAdjacentHTML('beforeend', html);
    else container.insertAdjacentHTML('afterend', html);
  }


  // ════════════════════════════════════════════
  // #2: TIMELINE CÁ NHÂN HOÁ TỰ ĐỘNG
  // ════════════════════════════════════════════

  /**
   * Generate personalized timeline based on visa type and target semester
   */
  function generateTimeline(profile) {
    if (!profile) return [];

    var visaType = profile.visaType || 'D-4-1';
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Target: default to next March or September
    var targetYear = now.getFullYear();
    var targetMonth = now.getMonth() < 6 ? 3 : 9; // March or September
    if (now.getMonth() >= targetMonth - 2 && now.getMonth() <= targetMonth + 1) {
      targetMonth = targetMonth === 3 ? 9 : 3;
      if (targetMonth === 3) targetYear++;
    }

    var targetDate = new Date(targetYear, targetMonth - 1, 1);

    var months = [
      { label: 'Bắt đầu', offset: 0, icon: '🚀', tasks: ['Đăng ký tài khoản', 'Khai báo hồ sơ', 'Chọn trường dự định'] },
      { label: 'Học tiếng Hàn', offset: 1, icon: '📖', tasks: ['Học Sejong 2B+', 'Thi TOPIK thử', 'Luyện giao tiếp'] },
      { label: 'Mở sổ TK + Tài chính', offset: 1.5, icon: '💰', tasks: ['Mở sổ tiết kiệm', 'Chuẩn bị CMTC', 'Sao kê ngân hàng'] },
      { label: 'Nộp hồ sơ trường', offset: 3, icon: '📋', tasks: ['Hoàn thiện hồ sơ', 'Nộp trường', 'Chờ thư mời'] },
      { label: 'Nhận Admission', offset: 5, icon: '📩', tasks: ['Nhận thư mời', 'Đóng học phí', 'Nhận invoice'] },
      { label: 'Dịch thuật + Công chứng', offset: 5.5, icon: '📄', tasks: ['Dịch thuật toàn bộ', 'Công chứng', 'Hợp pháp hoá'] },
      { label: 'Nộp visa', offset: 7, icon: '🛂', tasks: ['Đặt lịch KVAC', 'Nộp hồ sơ', 'Phỏng vấn'] },
      { label: 'Nhập học!', offset: 8.5, icon: '🎉', tasks: ['Nhận visa', 'Mua vé bay', 'Đặt KTX'] },
    ];

    // Adjust for D-2 (longer timeline)
    if (visaType === 'D-2') {
      months[1].tasks = ['Học TOPIK 3+', 'Thi TOPIK chính thức', 'Xin thư giới thiệu'];
    }

    // Adjust for D4→D2
    if (visaType === 'D4-to-D2') {
      months = [
        { label: 'Xác nhận hoàn tất D4', offset: 0, icon: '✅', tasks: ['Xin giấy hoàn tất', 'Xin bảng điểm', 'Xin chuyên cần'] },
        { label: 'Nộp ĐH Hàn', offset: 1, icon: '🏫', tasks: ['Nộp hồ sơ ĐH', 'Thi TOPIK', 'Chờ kết quả'] },
        { label: 'Giấy tờ tại Hàn', offset: 2.5, icon: '📋', tasks: ['ARC photo', 'Giấy khám sức khoẻ', 'C1-9 residence'] },
        { label: 'Nộp Immigration', offset: 4, icon: '🛂', tasks: ['Đặt lịch Hi Korea', 'Nộp hồ sơ', 'Đóng phí'] },
        { label: 'Chuyển đổi visa', offset: 5.5, icon: '🔄', tasks: ['Theo dõi online', 'Nhận ARC mới', 'Nhập học ĐH'] },
      ];
    }

    // Calculate actual dates
    var timeline = months.map(function(m) {
      var d = new Date(today);
      d.setDate(d.getDate() + Math.round(m.offset * 30));
      return {
        label: m.label,
        icon: m.icon,
        date: d,
        dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tasks: m.tasks,
        isPast: d < today,
        isUpcoming: d >= today && d <= new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      };
    });

    return timeline;
  }

  /**
   * Render timeline HTML
   */
  function renderTimeline(container, timeline) {
    if (!timeline || timeline.length === 0) return;

    var html = '<div class="cl-timeline-section">' +
      '<div class="cl-timeline-header">' +
      '<span class="cl-timeline-icon">📅</span>' +
      '<div><h4>Lộ trình tự động của bạn</h4>' +
      '<p>Dựa trên hồ sơ và kỳ nhập học mục tiêu. Các mốc có thể điều chỉnh tuỳ trường.</p></div>' +
      '</div>' +
      '<div class="cl-timeline">';

    timeline.forEach(function(m, idx) {
      var cls = 'cl-timeline-item';
      if (m.isPast) cls += ' is-past';
      if (m.isUpcoming) cls += ' is-upcoming';
      html += '<div class="' + cls + '">' +
        '<div class="cl-timeline-dot">' + m.icon + '</div>' +
        '<div class="cl-timeline-content">' +
        '<div class="cl-timeline-title">' + escapeHtml(m.label) + '</div>' +
        '<div class="cl-timeline-date">' + m.dateStr + '</div>' +
        '<ul class="cl-timeline-tasks">' +
        m.tasks.map(function(t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') +
        '</ul></div></div>';
    });

    html += '</div>' +
      '<div class="cl-timeline-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" onclick="window.clAutoCreateReminders()">⏰ Tạo nhắc nhở tự động</button>' +
      '</div></div>';

    container.insertAdjacentHTML('afterbegin', html);

    // Auto-create reminders function
    window.clAutoCreateReminders = function() {
      var token = null;
      try { token = localStorage.getItem('student_token'); } catch(e) {}
      if (!token) { alert('Vui lòng đăng nhập để tạo nhắc nhở tự động!'); return; }

      var count = 0;
      timeline.forEach(function(m) {
        if (m.isPast) return;
        // Save to application.js reminder system
        var fetchFn = window.fetchWithAuth || fetch;
        fetchFn('/api/auth/student?action=reminders-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: m.label + ': ' + m.tasks[0],
            dueDate: m.date.toISOString().split('T')[0],
            reminderType: 'document',
          }),
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d.success) count++;
        }).catch(function() {});
      });
      setTimeout(function() {
        alert('✅ Đã tạo ' + count + ' nhắc nhở tự động! Xem trong tab Gửi đơn.');
      }, 500);
    };
  }


  // ════════════════════════════════════════════
  // #3: SO SÁNH VỚI CASE TƯƠNG TỰ
  // ════════════════════════════════════════════

  /**
   * Fetch and render similar cases from advisor_cases DB
   */
  async function renderSimilarCases(container, profile) {
    if (!profile) return;

    // Build a simplified profile for similarity matching
    var searchProfile = {
      visaType: profile.visaType || 'D-4-1',
      gender: profile.gender || null,
      korean: profile.koreanLevel || null,
      visaFail: profile.hasVisaRejection ? 'yes' : 'no',
      gpa: profile.gpa || null,
    };

    try {
      var res = await fetch('/api/deepseek?action=similar-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: searchProfile }),
      });

      if (!res.ok) return;
      var data = await res.json();
      if (!data.success || !data.cases || data.cases.length === 0) return;

      var cases = data.cases;
      var passCount = cases.filter(function(c) { return c.result === 'approved' || c.result === 'granted'; }).length;
      var failCount = cases.filter(function(c) { return c.result === 'rejected' || c.result === 'denied'; }).length;
      var passRate = Math.round(passCount / cases.length * 100);

      var html = '<div class="cl-similar-cases">' +
        '<div class="cl-similar-header">📊 Hồ sơ tương tự đã xử lý</div>' +
        '<div class="cl-similar-stats">' +
        '<div class="cl-similar-stat"><strong>' + cases.length + '</strong> hồ sơ tương tự</div>' +
        '<div class="cl-similar-stat" style="color:' + (passRate >= 60 ? '#059669' : '#dc2626') + '"><strong>' + passRate + '%</strong> tỉ lệ đậu</div>' +
        '<div class="cl-similar-stat">' + passCount + ' đậu / ' + failCount + ' trượt</div>' +
        '</div>' +
        '<div class="cl-similar-list">';
      cases.slice(0, 3).forEach(function(c) {
        var p = c.student_profile || {};
        var resultColor = c.result === 'approved' || c.result === 'granted' ? '#059669' : c.result === 'rejected' || c.result === 'denied' ? '#dc2626' : '#d97706';
        var resultLabel = c.result === 'approved' ? '✅ Đậu visa' : c.result === 'granted' ? '✅ Đậu' : c.result === 'rejected' ? '❌ Trượt' : c.result === 'denied' ? '❌ Từ chối' : '⏳ Chờ';
        var schools = (c.top_schools || []).slice(0, 2).map(function(s) { return s.name || ''; }).filter(Boolean).join(', ');
        html += '<div class="cl-similar-case">' +
          '<div class="cl-similar-case-header">' +
          '<span>' + (p.gender === 'female' ? '👩' : '👨') + ' ' + (p.age || '?') + 't, GPA ' + (p.gpa || '?') + '</span>' +
          '<span style="color:' + resultColor + ';font-weight:700">' + resultLabel + '</span>' +
          '</div>' +
          (schools ? '<div class="cl-similar-case-schools">🏫 ' + escapeHtml(schools) + '</div>' : '') +
          (c.notes ? '<div class="cl-similar-case-notes">💡 ' + escapeHtml(c.notes) + '</div>' : '') +
          '</div>';
      });
      html += '</div></div>';

      container.insertAdjacentHTML('beforeend', html);
    } catch(e) { /* silent fail */ }
  }


  // ════════════════════════════════════════════
  // #4: CHECKLIST THÔNG MINH (STEP/TIP/PRIORITY)
  // ════════════════════════════════════════════

  /**
   * Enhance checklist items with smart features:
   * - Step number (thứ tự ưu tiên)
   * - Cost/time estimates
   * - "Hướng dẫn" popup
   * - Priority badges
   */
  var SMART_CHECKLIST_ENHANCEMENTS = {
    'A1-1': { step: 1, cost: '0đ', time: '15 phút', tip: 'Tải mẫu KSD0-2014 từ website KVAC. Điền bằng tiếng Hàn hoặc Anh. Chữ ký phải giống hộ chiếu.' },
    'A1-2': { step: 2, cost: '200,000đ', time: '2 tuần', tip: 'Làm hộ chiếu tại Phòng Quản lý xuất nhập cảnh. Cần CCCD + ảnh 4x6.' },
    'A1-3': { step: 3, cost: '30,000đ', time: '15 phút', tip: 'Chụp tại tiệm ảnh thẻ. Yêu cầu: nền trắng, áo sáng màu, không đeo kính.' },
    'A1-4': { step: 4, cost: '2,000đ', time: '5 phút', tip: 'Photo CCCD 2 mặt trên cùng 1 tờ giấy A4.' },
    'A1-5': { step: 5, cost: '10,000đ', time: '30 phút', tip: 'Photo sổ hộ khẩu. Hoặc xin CT07 tại Công an phường (miễn phí).' },
    'A1-6': { step: 6, cost: '20,000đ', time: '30 phút', tip: 'Xin bản sao tại UBND phường nơi đăng ký khai sinh.' },
    'A1-7': { step: 7, cost: '500,000đ', time: '1 ngày', tip: 'Khám tại BV Phổi TW (HN) hoặc BV Chợ Rẫy (HCM). Kết quả có sau 3-5 ngày.' },
    'A2-1': { step: 8, cost: '200,000đ', time: '1 ngày', tip: 'Mang bằng gốc đến Phòng Công chứng. Dịch sang tiếng Hàn (ưu tiên) hoặc Anh.' },
    'A2-2': { step: 9, cost: '200,000đ', time: '1 ngày', tip: 'Xin bảng điểm từ trường THPT. Dịch công chứng.' },
    'A4-1': { step: 10, cost: '8,000-10,000 USD', time: '1 ngày', tip: 'Mở tại quầy ngân hàng (không online). Kỳ hạn 12 tháng. Để sổ càng lâu càng tốt.' },
    'A4-3': { step: 11, cost: '0đ', time: '30 phút', tip: 'Viết cam kết bảo lãnh. Công chứng chữ ký tại Phòng Công chứng.' },
    'A4-4': { step: 12, cost: '20,000đ', time: '30 phút', tip: 'Dùng giấy khai sinh + sổ hộ khẩu để chứng minh quan hệ.' },
    'A5-1': { step: 13, cost: '0đ', time: '2-4 giờ', tip: 'Dùng AI trên site để soạn nháp! Study Plan chung chung = trượt visa.' },
    'A6-1': { step: 14, cost: '0đ', time: '15 phút', tip: 'Đặt sớm 2-4 tuần. Lịch KVAC thường đầy nhanh.' },
  };

  /**
   * Get smart enhancement for a checklist item
   */
  function getSmartEnhancement(itemId) {
    return SMART_CHECKLIST_ENHANCEMENTS[itemId] || null;
  }

  /**
   * Enhance checklist items with step numbers, tips, and costs
   * Call this after renderModule() to add smart features
   */
  function enhanceChecklistItems() {
    // Guard: skip if already enhanced
    if (document.querySelector('.cl-smart-step')) return;
    var items = document.querySelectorAll('.cl-module .cl-item');
    items.forEach(function(el) {
      var itemId = el.dataset.itemId;
      if (!itemId) return;
      var enhancement = getSmartEnhancement(itemId);
      if (!enhancement) return;

      // Add step badge
      var nameEl = el.querySelector('.cl-item-name');
      if (nameEl && enhancement.step) {
        nameEl.insertAdjacentHTML('afterbegin', '<span class="cl-smart-step">#' + enhancement.step + '</span> ');
      }

      // Add cost and time info
      var metaEl = el.querySelector('.cl-item-meta');
      if (!metaEl) {
        var descEl = el.querySelector('.cl-item-desc');
        if (descEl) {
          descEl.insertAdjacentHTML('beforeend', ' <span class="cl-smart-meta">💰 ' + escapeHtml(enhancement.cost) + ' · ⏱ ' + escapeHtml(enhancement.time) + '</span>');
        }
      }

      // Add tip icon with popup
      var actionsEl = el.querySelector('.cl-item-actions') || el;
      if (enhancement.tip) {
        var tipBtn = document.createElement('button');
        tipBtn.type = 'button';
        tipBtn.className = 'cl-smart-tip-btn btn btn-sm btn-outline';
        tipBtn.textContent = '💡';
        tipBtn.title = 'Xem hướng dẫn';
        tipBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          showTipPopup(enhancement.tip, enhancement.cost, enhancement.time);
        });
        actionsEl.appendChild(tipBtn);
      }
    });
  }

  /**
   * Show tip popup
   */
  function showTipPopup(tip, cost, time) {
    var existing = document.querySelector('.cl-tip-popup');
    if (existing) existing.remove();

    var popup = document.createElement('div');
    popup.className = 'cl-tip-popup';
    popup.innerHTML = '<div class="cl-tip-backdrop" onclick="this.parentElement.remove()"></div>' +
      '<div class="cl-tip-card">' +
      '<button type="button" class="cl-tip-close" onclick="this.closest(\'.cl-tip-popup\').remove()">&times;</button>' +
      '<div class="cl-tip-icon">💡</div>' +
      '<h4>Hướng dẫn nhanh</h4>' +
      '<div class="cl-tip-content">' + escapeHtml(tip) + '</div>' +
      (cost ? '<div class="cl-tip-cost">💰 Chi phí dự kiến: <strong>' + escapeHtml(cost) + '</strong></div>' : '') +
      (time ? '<div class="cl-tip-time">⏱ Thời gian: <strong>' + escapeHtml(time) + '</strong></div>' : '') +
      '</div>';
    document.body.appendChild(popup);
    setTimeout(function() { popup.classList.add('is-open'); }, 10);
  }


  // ════════════════════════════════════════════
  // #1: STUDY PLAN BUILDER TƯƠNG TÁC 8 BƯỚC
  // ════════════════════════════════════════════

  var STUDY_PLAN_QUESTIONS = [
    { id: 'q1', question: '1/8 · Vì sao bạn chọn du học Hàn Quốc thay vì các nước khác?', hint: 'Gợi ý: Văn hoá K-pop ảnh hưởng, chất lượng giáo dục, gần Việt Nam, học phí hợp lý...', field: 'whyKorea' },
    { id: 'q2', question: '2/8 · Vì sao bạn chọn trường này / thành phố này?', hint: 'Gợi ý: Chương trình đào tạo phù hợp, vị trí thuận lợi, cơ hội việc làm...', field: 'whySchool' },
    { id: 'q3', question: '3/8 · Bạn học ngành gì? Ngành đó liên quan gì đến định hướng nghề nghiệp?', hint: 'Gợi ý: Ngành bạn đam mê, có liên quan đến công việc hiện tại hoặc dự định tương lai.', field: 'majorGoal' },
    { id: 'q4', question: '4/8 · Kế hoạch học tập cụ thể theo từng giai đoạn (6 tháng, 1 năm, 2 năm)?', hint: 'Gợi ý: Giai đoạn 1 học tiếng, Giai đoạn 2 học chuyên ngành, mục tiêu TOPIK từng kỳ.', field: 'studyPlan' },
    { id: 'q5', question: '5/8 · Kế hoạch sau khi tốt nghiệp (về Việt Nam / ở lại làm việc)?', hint: 'Gợi ý: Nên thể hiện cam kết về nước. VD: về làm cho công ty Hàn tại VN, mở cửa hàng...', field: 'afterGraduation' },
    { id: 'q6', question: '6/8 · Nếu có gap year, bạn đã làm gì trong thời gian đó?', hint: 'Gợi ý: Đi làm, học thêm kỹ năng, chờ đủ điều kiện... Nếu không có gap, ghi "Không có gap year".', field: 'gapExplanation' },
    { id: 'q7', question: '7/8 · Gia đình/người bảo lãnh có nghề nghiệp và thu nhập thế nào?', hint: 'Gợi ý: Cha/mẹ làm gì? Thu nhập bao nhiêu? Có ổn định không?', field: 'familyFinance' },
    { id: 'q8', question: '8/8 · Trình độ tiếng Hàn/Anh hiện tại của bạn? Có chứng chỉ gì?', hint: 'Gợi ý: TOPIK mấy? IELTS? Đã học bao lâu? Kế hoạch cải thiện?', field: 'languageLevel' },
  ];

  var STUDY_PLAN_STORAGE_KEY = 'study_plan_draft';

  function loadStudyPlanDraft() {
    try {
      var raw = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function saveStudyPlanDraft(draft) {
    try { localStorage.setItem(STUDY_PLAN_STORAGE_KEY, JSON.stringify(draft)); } catch(e) {}
  }

  /**
   * Open Study Plan Builder modal
   */
  window.clOpenStudyPlanBuilder = function() {
    // Check if already open
    if (document.querySelector('.sp-builder')) return;

    // Show auth reminder but allow use anyway
    var token = null;
    try { token = localStorage.getItem('student_token'); } catch(e) {}
    if (!token) {
      if (!confirm('Bạn chưa đăng nhập. Study Plan sẽ chỉ lưu trên máy này, không đồng bộ lên server. Tiếp tục?')) return;
    }

    var draft = loadStudyPlanDraft() || { answers: {}, currentStep: 0, completed: false };
    var profile = getChecklistProfile();

    // Auto-fill known info from profile
    if (profile && !draft.answers.q8) {
      if (profile.koreanLevel) {
        var koreanMap = { none: 'Chưa học', beginner: 'Mới bắt đầu', sejong2b: 'Sejong 2B', topik1: 'TOPIK 1', topik2: 'TOPIK 2', topik3: 'TOPIK 3', topik4: 'TOPIK 4+' };
        draft.answers.q8 = draft.answers.q8 || 'Trình độ tiếng Hàn: ' + (koreanMap[profile.koreanLevel] || profile.koreanLevel);
      }
      if (profile.chosenSchool) {
        draft.answers.q2 = draft.answers.q2 || 'Tôi chọn trường ' + profile.chosenSchool;
      }
      if (profile.chosenMajor) {
        draft.answers.q3 = draft.answers.q3 || 'Tôi muốn học ngành ' + profile.chosenMajor;
      }
      if (profile.sponsorName && profile.sponsorOccupation) {
        draft.answers.q7 = draft.answers.q7 || 'Người bảo lãnh: ' + profile.sponsorName + ' - ' + profile.sponsorOccupation;
      }
      if (profile.workCompany) {
        draft.answers.q6 = draft.answers.q6 || 'Tôi đã đi làm tại ' + profile.workCompany + ' (' + (profile.workDuration || '') + ' năm)';
      }
    }

    var modal = document.createElement('div');
    modal.className = 'sp-builder';
    modal.innerHTML = '<div class="sp-backdrop" onclick="window.clCloseStudyPlanBuilder()"></div>' +
      '<div class="sp-card">' +
      '<div class="sp-header">' +
      '<div class="sp-header-left">' +
      '<span class="sp-icon">✍</span>' +
      '<div><h3>Soạn Study Plan</h3><p>Trả lời 8 câu hỏi → AI tự động tổng hợp thành Study Plan hoàn chỉnh.</p></div>' +
      '</div>' +
      '<button type="button" class="sp-close" onclick="window.clCloseStudyPlanBuilder()">&times;</button>' +
      '</div>' +
      '<div class="sp-progress" id="sp-progress"><div class="sp-progress-bar" id="sp-progress-bar"></div></div>' +
      '<div class="sp-content" id="sp-content"></div>' +
      '<div class="sp-nav" id="sp-nav"></div>' +
      '</div>';

    document.body.appendChild(modal);
    setTimeout(function() { modal.classList.add('is-open'); }, 10);

    renderStudyPlanStep(draft);
  };

  window.clCloseStudyPlanBuilder = function() {
    var modal = document.querySelector('.sp-builder');
    if (modal) {
      modal.classList.remove('is-open');
      setTimeout(function() { modal.remove(); }, 300);
    }
  };

  function renderStudyPlanStep(draft) {
    var currentStep = draft.currentStep || 0;
    var isComplete = draft.completed;

    // Update progress
    var progressBar = document.getElementById('sp-progress-bar');
    if (progressBar) {
      var pct = isComplete ? 100 : (currentStep / STUDY_PLAN_QUESTIONS.length * 100);
      progressBar.style.width = pct + '%';
    }

    var content = document.getElementById('sp-content');
    var nav = document.getElementById('sp-nav');
    if (!content || !nav) return;

    if (isComplete) {
      // Show the generated study plan
      content.innerHTML = '<div class="sp-result">' +
        '<div class="sp-result-header">✅ Hoàn thành! Đây là bản nháp Study Plan của bạn:</div>' +
        '<div class="sp-result-content" id="sp-result-content">' +
        '<div class="sp-loading">Đang tổng hợp câu trả lời...</div>' +
        '</div></div>';
      nav.innerHTML = '<button type="button" class="btn btn-outline" onclick="window.clCloseStudyPlanBuilder()">Đóng</button>' +
        '<button type="button" class="btn btn-outline" onclick="window.clEditStudyPlan()">✏️ Sửa câu trả lời</button>' +
        '<button type="button" class="btn btn-primary" onclick="window.clSaveStudyPlan()">💾 Lưu lại</button>';

      // Generate study plan from answers
      generateStudyPlanFromAnswers(draft.answers);
      return;
    }

    if (currentStep >= STUDY_PLAN_QUESTIONS.length) {
      draft.completed = true;
      saveStudyPlanDraft(draft);
      renderStudyPlanStep(draft);
      return;
    }

    var q = STUDY_PLAN_QUESTIONS[currentStep];
    var answer = draft.answers[q.field] || '';

    content.innerHTML = '<div class="sp-question">' +
      '<div class="sp-question-text">' + q.question + '</div>' +
      (q.hint ? '<div class="sp-question-hint">💡 ' + q.hint + '</div>' : '') +
      '<textarea class="sp-answer" id="sp-answer" rows="5" placeholder="Nhập câu trả lời của bạn...">' + escapeHtml(answer) + '</textarea>' +
      '<div class="sp-word-count" id="sp-word-count">0 từ</div>' +
      '</div>';

    nav.innerHTML = (currentStep > 0 ? '<button type="button" class="btn btn-outline" onclick="window.clPrevStudyPlanStep()">← Quay lại</button>' : '') +
      '<button type="button" class="btn btn-primary" onclick="window.clNextStudyPlanStep()">' +
      (currentStep < STUDY_PLAN_QUESTIONS.length - 1 ? 'Lưu & Tiếp theo →' : 'Hoàn thành →') +
      '</button>';

    // Word count
    var textarea = document.getElementById('sp-answer');
    var wordCount = document.getElementById('sp-word-count');
    if (textarea && wordCount) {
      textarea.addEventListener('input', function() {
        var words = this.value.trim() ? this.value.trim().split(/\s+/).length : 0;
        wordCount.textContent = words + ' từ';
        draft.answers[q.field] = this.value;
        saveStudyPlanDraft(draft);
      });
      var initWords = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
      wordCount.textContent = initWords + ' từ';
    }
  }

  window.clNextStudyPlanStep = function() {
    var draft = loadStudyPlanDraft() || { answers: {}, currentStep: 0, completed: false };
    var q = STUDY_PLAN_QUESTIONS[draft.currentStep];
    if (q) {
      var textarea = document.getElementById('sp-answer');
      if (textarea) {
        draft.answers[q.field] = textarea.value;
      }
    }
    draft.currentStep = (draft.currentStep || 0) + 1;
    saveStudyPlanDraft(draft);
    renderStudyPlanStep(draft);
  };

  window.clPrevStudyPlanStep = function() {
    var draft = loadStudyPlanDraft() || { answers: {}, currentStep: 0, completed: false };
    var q = STUDY_PLAN_QUESTIONS[draft.currentStep - 1];
    if (q) {
      var textarea = document.getElementById('sp-answer');
      if (textarea) {
        draft.answers[q.field] = textarea.value;
      }
    }
    draft.currentStep = Math.max(0, (draft.currentStep || 0) - 1);
    saveStudyPlanDraft(draft);
    renderStudyPlanStep(draft);
  };

  window.clEditStudyPlan = function() {
    var draft = loadStudyPlanDraft();
    if (draft) {
      draft.completed = false;
      draft.currentStep = 0;
      saveStudyPlanDraft(draft);
      renderStudyPlanStep(draft);
    }
  };

  window.clSaveStudyPlan = function() {
    var draft = loadStudyPlanDraft();
    if (!draft || !draft.generatedPlan) return;

    // Save to checklist data
    var checklistData = null;
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        checklistData = JSON.parse(raw);
        checklistData.checklist = checklistData.checklist || {};
        checklistData.checklist._aiDrafts = checklistData.checklist._aiDrafts || {};
        checklistData.checklist._aiDrafts.study_plan = draft.generatedPlan;
        localStorage.setItem('checklist_data', JSON.stringify(checklistData));
      }
    } catch(e) {}

    // Save to server if logged in
    var token = null;
    try { token = localStorage.getItem('student_token'); } catch(e) {}
    if (token) {
      var fetchFn = window.fetchWithAuth || fetch;
      fetchFn('/api/auth/student?action=save-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: 'study_plan', aiDraft: draft.generatedPlan }),
      }).catch(function() {});
    }

    window.clCloseStudyPlanBuilder();
    alert('✅ Đã lưu Study Plan! Bạn có thể xem lại trong checklist.');
  };

  async function generateStudyPlanFromAnswers(answers) {
    var container = document.getElementById('sp-result-content');
    if (!container) return;

    // Try to generate via API
    try {
      var res = await fetch('/api/deepseek?action=generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answers,
          profile: getChecklistProfile(),
        }),
      });
      var data = await res.json();

      if (data.success && data.studyPlan) {
        container.innerHTML = '<div class="sp-generated">' + formatStudyPlan(data.studyPlan) + '</div>';
        // Save to draft
        var draft = loadStudyPlanDraft();
        if (draft) {
          draft.generatedPlan = data.studyPlan;
          saveStudyPlanDraft(draft);
        }
        return;
      }
    } catch(e) { /* fallback */ }

    // Fallback: generate locally
    var plan = buildLocalStudyPlan(answers);
    container.innerHTML = '<div class="sp-generated">' + formatStudyPlan(plan) + '</div>';
    var draft = loadStudyPlanDraft();
    if (draft) {
      draft.generatedPlan = plan;
      saveStudyPlanDraft(draft);
    }
  }

  function buildLocalStudyPlan(answers) {
    var lines = [];
    lines.push('KẾ HOẠCH HỌC TẬP (STUDY PLAN)');
    lines.push('');
    if (answers.whyKorea) lines.push('1. Lý do chọn Hàn Quốc:\n' + answers.whyKorea);
    if (answers.whySchool) lines.push('\n2. Lý do chọn trường:\n' + answers.whySchool);
    if (answers.majorGoal) lines.push('\n3. Ngành học & Định hướng:\n' + answers.majorGoal);
    if (answers.studyPlan) lines.push('\n4. Kế hoạch học tập:\n' + answers.studyPlan);
    if (answers.afterGraduation) lines.push('\n5. Dự định sau tốt nghiệp:\n' + answers.afterGraduation);
    if (answers.gapExplanation) lines.push('\n6. Giải trình thời gian:\n' + answers.gapExplanation);
    if (answers.familyFinance) lines.push('\n7. Tài chính gia đình:\n' + answers.familyFinance);
    if (answers.languageLevel) lines.push('\n8. Trình độ ngoại ngữ:\n' + answers.languageLevel);
    lines.push('\n\n--- Study Plan được tạo bởi AI tại thongtintruonghan.vercel.app ---');
    return lines.join('\n\n');
  }

  function formatStudyPlan(text) {
    if (!text) return '';
    return escapeHtml(text).replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  /**
   * Format AI advice text from the advisor API
   */
  function formatAIAdvice(text) {
    if (!text) return '';
    var safe = escapeHtml(text);
    safe = safe.replace(/\n/g, '<br>');
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/<br>- /g, '<br>• ');
    return safe;
  }


  // ════════════════════════════════════════════
  // #5: AI CHẤM ĐIỂM STUDY PLAN
  // ════════════════════════════════════════════

  window.clOpenStudyPlanReviewer = function() {
    if (document.querySelector('.sp-reviewer')) return;

    var modal = document.createElement('div');
    modal.className = 'sp-reviewer';
    modal.innerHTML = '<div class="sp-backdrop" onclick="this.closest(\'.sp-reviewer\').remove()"></div>' +
      '<div class="sp-card sp-reviewer-card">' +
      '<div class="sp-header">' +
      '<div class="sp-header-left">' +
      '<span class="sp-icon">📝</span>' +
      '<div><h3>Đánh giá Study Plan</h3><p>AI sẽ chấm điểm và gợi ý cải thiện Study Plan của bạn.</p></div>' +
      '</div>' +
      '<button type="button" class="sp-close" onclick="this.closest(\'.sp-reviewer\').remove()">&times;</button>' +
      '</div>' +
      '<div class="sp-reviewer-body">' +
      '<p style="color:#64748b;font-size:0.9rem;margin-bottom:0.5rem">Dán Study Plan của bạn vào ô bên dưới để AI đánh giá.</p>' +
      '<textarea id="sp-review-content" rows="10" placeholder="Dán Study Plan của bạn vào đây..." style="width:100%;min-height:200px;padding:0.75rem;border:1px solid #dbe3ee;border-radius:8px;font:inherit;font-size:0.9rem;line-height:1.6;resize:vertical"></textarea>' +
      '<div style="display:flex;gap:0.5rem;margin-top:0.75rem">' +
      '<button type="button" class="btn btn-primary" id="sp-review-btn" onclick="window.clRunStudyPlanReview()">🤖 Chấm điểm</button>' +
      '<button type="button" class="btn btn-outline" onclick="this.closest(\'.sp-reviewer\').remove()">Đóng</button>' +
      '</div>' +
      '<div id="sp-review-result" style="margin-top:1rem;display:none"></div>' +
      '</div></div>';

    document.body.appendChild(modal);
    setTimeout(function() { modal.classList.add('is-open'); }, 10);
  };

  window.clRunStudyPlanReview = async function() {
    var textarea = document.getElementById('sp-review-content');
    var btn = document.getElementById('sp-review-btn');
    var result = document.getElementById('sp-review-result');
    if (!textarea || !btn || !result) return;

    var text = textarea.value.trim();
    if (text.length < 50) {
      alert('Vui lòng nhập Study Plan (tối thiểu 50 ký tự).');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Đang chấm điểm...';
    result.style.display = 'block';
    result.innerHTML = '<div class="sp-loading">🤖 AI đang phân tích...</div>';

    // Try API first
    try {
      var res = await fetch('/api/deepseek?action=review-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyPlan: text,
          profile: getChecklistProfile(),
        }),
      });
      var data = await res.json();
      if (data.success && data.review) {
        result.innerHTML = '<div class="sp-review-result">' + formatReview(data.review) + '</div>';
        btn.disabled = false;
        btn.textContent = 'Chấm điểm lại';
        return;
      }
    } catch(e) { /* fallback */ }

    // Fallback: local scoring
    var review = localStudyPlanReview(text);
    result.innerHTML = '<div class="sp-review-result">' + formatReview(review) + '</div>';
    btn.disabled = false;
    btn.textContent = 'Chấm điểm lại';
  };

  function localStudyPlanReview(text) {
    var score = 50;
    var suggestions = [];

    // Check length
    var wordCount = text.split(/\s+/).length;
    if (wordCount < 100) { score -= 15; suggestions.push('Study Plan quá ngắn (' + wordCount + ' từ). Nên viết ít nhất 300-500 từ.'); }
    else if (wordCount < 200) { score -= 5; suggestions.push('Có thể viết dài hơn để thuyết phục (300-500 từ là lý tưởng).'); }
    else { score += 10; suggestions.push('✅ Độ dài phù hợp.'); }

    // Check specificity
    if (text.toLowerCase().includes('hàn quốc') || text.toLowerCase().includes('korea')) score += 5;
    else suggestions.push('Nên đề cập rõ lý do chọn Hàn Quốc thay vì nước khác.');

    if (text.toLowerCase().includes('về nước') || text.toLowerCase().includes('vietnam') || text.toLowerCase().includes('việt nam')) score += 5;
    else suggestions.push('Nên thể hiện cam kết về nước sau khi học xong.');

    // Check for common school names
    var schoolNames = ['osan', 'induk', 'yeonsung', 'sangmyung', 'dongnam', 'gwangju', 'nambu', 'busan', 'jeonju'];
    var hasSchool = schoolNames.some(function(s) { return text.toLowerCase().includes(s); });
    if (hasSchool) score += 10;
    else suggestions.push('Nên đề cập tên trường cụ thể thay vì viết chung chung.');

    // Check for generic phrases
    var genericPhrases = ['không chỉ', 'không những', 'nói chung', 'như mọi người đều biết', 'từ lâu tôi đã'];
    var isGeneric = genericPhrases.some(function(p) { return text.toLowerCase().includes(p); });
    if (isGeneric) { score -= 10; suggestions.push('Tránh dùng các cụm từ chung chung như "như mọi người đều biết". Hãy nói cụ thể về bản thân.'); }

    // Check for specific majors
    if (text.toLowerCase().includes('kinh doanh') || text.toLowerCase().includes('quản trị') || text.toLowerCase().includes('công nghệ') || text.toLowerCase().includes('ngôn ngữ')) score += 5;
    else suggestions.push('Nên đề cập ngành học cụ thể và lý do chọn ngành đó.');

    score = Math.max(10, Math.min(100, score));

    var level, color;
    if (score >= 80) { level = '✅ Tốt'; color = '#059669'; }
    else if (score >= 60) { level = '⚠️ Khá'; color = '#d97706'; }
    else if (score >= 40) { level = '⚠️ Yếu'; color = '#dc2626'; }
    else { level = '❌ Kém'; color = '#991b1b'; }

    return { score: score, level: level, color: color, suggestions: suggestions, wordCount: wordCount };
  }

  function formatReview(review) {
    var html = '<div class="sp-review-score" style="text-align:center;margin-bottom:1rem;padding:1rem;background:#f8fafc;border-radius:12px">' +
      '<div style="font-size:2.5rem;font-weight:800;color:' + review.color + '">' + review.score + '/100</div>' +
      '<div style="font-weight:600;color:' + review.color + ';margin-top:0.25rem">' + review.level + '</div>' +
      '<div style="color:#64748b;font-size:0.85rem;margin-top:0.25rem">' + (review.wordCount || '?') + ' từ</div>' +
      '</div>';

    if (review.suggestions && review.suggestions.length > 0) {
      html += '<div style="font-weight:600;margin-bottom:0.5rem">📋 Gợi ý cải thiện:</div><ul style="color:#475569;font-size:0.9rem;line-height:1.7;padding-left:1.2rem">';
      review.suggestions.forEach(function(s) {
        var isGood = s.startsWith('✅');
        html += '<li style="color:' + (isGood ? '#059669' : '#dc2626') + '">' + s + '</li>';
      });
      html += '</ul>';
    }

    return html;
  }


  // ════════════════════════════════════════════
  // INTERGRATION: HOOK VÀO EXISTING SYSTEM
  // ════════════════════════════════════════════

  /**
   * Get checklist profile from localStorage
   */
  function getChecklistProfile() {
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        var data = JSON.parse(raw);
        return data.profile || {};
      }
    } catch(e) {}
    return null;
  }

  function getAgeFromProfile(profile) {
    if (profile.dateOfBirth) {
      var birth = new Date(profile.dateOfBirth);
      return Math.floor((new Date() - birth) / 31557600000);
    }
    return profile.age || null;
  }

  function escapeHtml(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    var d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }


  // ════════════════════════════════════════════
  // INIT: Tự động hook vào analysis và checklist
  // ════════════════════════════════════════════

  /**
   * Hook into analysis step: add school recommendations + similar cases
   * Called after renderAnalysis() in checklist.js
   */
  window.clInitPersonalization = function() {
    // Wait for analysis to render
    var analysisContainer = document.querySelector('.cl-analysis');
    if (analysisContainer) {
      // Add school recommendations (#6)
      renderSchoolRecommendations(analysisContainer);

      // Add similar cases (#3)
      var profile = getChecklistProfile();
      if (profile && profile._completed) {
        renderSimilarCases(analysisContainer, profile);
      }
    }

    // Hook into checklist view: add timeline (#2) + enhance items (#4)
    var checklistSection = document.querySelector('.cl-checklist');
    if (checklistSection) {
      // Add timeline
      var profile = getChecklistProfile();
      if (profile) {
        var timeline = generateTimeline(profile);
        var overviewProgress = checklistSection.querySelector('.cl-overall-progress');
        if (overviewProgress) {
          renderTimeline(overviewProgress.parentElement, timeline);
        }
      }

      // Enhance checklist items
      setTimeout(enhanceChecklistItems, 200);
    }
  };

  // Listen for step changes — hook into analysis and checklist steps
  var _origGoToStep = window.clGoToStep;
  if (_origGoToStep) {
    window.clGoToStep = function(idx) {
      _origGoToStep(idx);
      // Re-hook personalization after step change
      setTimeout(function() {
        if (idx === 5 || idx === 6) window.clInitPersonalization();
      }, 300);
    };
  }

  // Auto-run when page loads if already at analysis or checklist step
  if (document.readyState !== 'loading') {
    setTimeout(window.clInitPersonalization, 1500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(window.clInitPersonalization, 1500);
    });
  }

  // Hook into tab switching — detect content changes via MutationObserver
  var _mutationTarget = document.querySelector('.cl-content') || document.querySelector('main') || document.body;
  if (_mutationTarget) {
    var _observer = new MutationObserver(function() {
      var analysisVisible = document.querySelector('.cl-analysis');
      var checklistVisible = document.querySelector('.cl-checklist');
      
      if (analysisVisible && !analysisVisible.querySelector('.pa-school-recs')) {
        renderSchoolRecommendations(analysisVisible);
      }

      if (checklistVisible && !checklistVisible.querySelector('.cl-timeline-section')) {
        var profile = getChecklistProfile();
        if (profile) {
          var overviewProgress = checklistVisible.querySelector('.cl-overall-progress');
          if (overviewProgress) {
            var timeline = generateTimeline(profile);
            renderTimeline(overviewProgress.parentElement, timeline);
          }
          renderSimilarCases(checklistVisible, profile);
        }
        setTimeout(enhanceChecklistItems, 200);
      }
    });
    _observer.observe(_mutationTarget, { childList: true, subtree: true });
  }

  // ════════════════════════════════════════════
  // EXPOSED TOOLS FOR STUDENT AGENT (Phase 1)
  // ════════════════════════════════════════════

  // Expose functions for the AI chat agent to call
  window.personalization = {
    getSimilarCases: renderSimilarCases,
    getTimeline: generateTimeline,
    getStudyPlanBuilder: window.clOpenStudyPlanBuilder,
    getStudyPlanReviewer: window.clOpenStudyPlanReviewer,
    getSmartEnhancement: getSmartEnhancement,
  };

  console.log('personalization.js loaded: 6 improvements enabled');

})();
