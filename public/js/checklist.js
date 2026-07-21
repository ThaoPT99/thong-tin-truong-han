// checklist.js — Dynamic Personalized Checklist
// UI: Profile Form → AI Analysis → Checklist View → Progress Tracking
(function() {
  'use strict';

  const STORAGE_KEY = 'checklist_data';
  let currentStep = 0;
  let profile = {};
  let checklist = null;

  // ─── Steps ───
  const STEPS = [
    { id: 'welcome', label: 'Bắt đầu', icon: '👋' },
    { id: 'personal', label: 'Cá nhân', icon: '👤' },
    { id: 'education', label: 'Học vấn', icon: '🎓' },
    { id: 'finance', label: 'Tài chính', icon: '💰' },
    { id: 'risk', label: 'Rủi ro', icon: '⚠️' },
    { id: 'analysis', label: 'Phân tích', icon: '🤖' },
    { id: 'checklist', label: 'Checklist', icon: '✅' },
  ];

  // ─── Init ───
  function init() {
    const saved = loadSavedData();
    if (saved) {
      profile = saved.profile || {};
      checklist = saved.checklist || null;
      // If has completed profile, go to checklist
      if (checklist && profile._completed) {
        currentStep = 6;
      } else if (profile._completed) {
        currentStep = 5; // Analysis step
      }
    }

    // Try loading from server if logged in (async, won't block UI)
    loadFromServer().then(function(loaded) {
      if (loaded) {
        // Re-render current step with server data merged
        renderStep();
        renderStepIndicator();
      }
    });
  }

  function loadSavedData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveData() {
    try {
      const data = { profile, checklist, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Sync to server if logged in
      syncToServer();
    } catch (e) {
      console.warn('Save failed:', e);
    }
  }

  function getStudentToken() {
    try { return localStorage.getItem('student_token'); } catch(e) { return null; }
  }

  async function syncToServer() {
    const token = getStudentToken();
    if (!token) return;

    try {
      const fetchFn = window.fetchWithAuth || fetch;

      // Save full profile + checklist as one step
      await fetchFn('/api/auth/student?action=save-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: 'profile',
          data: profile,
          checklist: checklist || {},
          completed: !!profile._completed
        }),
      });

      // Save AI drafts if any
      if (checklist && checklist._aiDrafts) {
        for (const [type, draft] of Object.entries(checklist._aiDrafts)) {
          await fetchFn('/api/auth/student?action=save-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docType: type, aiDraft: draft }),
          });
        }
      }
    } catch (e) {
      console.warn('Server sync failed:', e);
    }
  }

  async function loadFromServer() {
    const token = getStudentToken();
    if (!token) return;

    try {
      const fetchFn = window.fetchWithAuth || fetch;
      const res = await fetchFn('/api/auth/student?action=load-checklist', {
        headers: {},
      });
      if (!res.ok) return false;
      const data = await res.json();

      if (data.success && data.steps && data.steps.length > 0) {
        const profileStep = data.steps.find(s => s.step_id === 'profile');
        if (profileStep && profileStep.data) {
          // Merge: server data takes precedence over localStorage
          profile = { ...profile, ...profileStep.data };
          if (profileStep.checklist) checklist = profileStep.checklist;
          saveData(); // Sync back to localStorage
          return true;
        }
      }
    } catch (e) {
      console.warn('Server load failed:', e);
    }
    return false;
  }

  // Export profile for other modules (interview.js, etc.)
  window.clGetProfile = function() { return profile; };

  // ─── Main Render ───
  function renderApp(container) {
    if (!container) return;
    if (container.dataset.checklistReady === 'true') return;
    container.dataset.checklistReady = 'true';

    init();

    container.innerHTML = `
      <section class="checklist-view">
        <div class="checklist-hero">
          <div>
            <p class="advisor-kicker">Hồ sơ cá nhân hoá</p>
            <h2 id="checklist-title">Tự làm hồ sơ du học Hàn Quốc</h2>
            <p id="checklist-desc" class="checklist-desc">
              Hệ thống sẽ phân tích hồ sơ của bạn và tạo checklist cá nhân hoá — 
              chỉ hiển thị những giấy tờ bạn thực sự cần, dựa trên hoàn cảnh của bạn.
            </p>
          </div>
        </div>

        <!-- Progress -->
        <div class="cl-progress" id="cl-progress">
          <div class="cl-steps" id="cl-steps"></div>
          <div class="cl-progress-bar">
            <div class="cl-progress-fill" id="cl-progress-fill"></div>
          </div>
          <div class="cl-progress-label" id="cl-progress-label"></div>
        </div>

        <!-- Content -->
        <div id="cl-content" class="cl-content"></div>

        <!-- Resume / Restore -->
        <div id="cl-resume-bar" class="cl-resume-bar" style="display:none">
          <span>📂 Bạn đang tiếp tục hồ sơ đã lưu trước đó.</span>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.clStartFresh()">Bắt đầu lại</button>
        </div>
      </section>
    `;

    renderStep();
    renderStepIndicator();
    bindEvents();
  }

  function renderStepIndicator() {
    const container = document.getElementById('cl-steps');
    if (!container) return;

    container.innerHTML = STEPS.map((step, i) => {
      const active = i === currentStep ? 'active' : '';
      const done = i < currentStep ? 'done' : '';
      const clickable = (done || active) && i <= 6 ? 'clickable' : '';
      return `<div class="cl-step ${active} ${done} ${clickable}" onclick="${clickable ? `window.clGoToStep(${i})` : ''}" data-step="${i}">
        <div class="cl-step-circle">${done ? '✓' : step.icon}</div>
        <div class="cl-step-label">${escapeHtml(step.label)}</div>
      </div>`;
    }).join('');

    updateProgress();
  }

  function updateProgress() {
    const fill = document.getElementById('cl-progress-fill');
    const label = document.getElementById('cl-progress-label');
    if (fill) fill.style.width = ((currentStep + 1) / STEPS.length * 100) + '%';
    if (label) label.textContent = `${STEPS[currentStep].icon} ${STEPS[currentStep].label}`;

    document.querySelectorAll('.cl-step').forEach(el => {
      const idx = parseInt(el.dataset.step);
      el.classList.toggle('active', idx === currentStep);
      el.classList.toggle('done', idx < currentStep);
    });
  }

  window.clGoToStep = function(idx) {
    if (idx < 0 || idx > currentStep) return;
    // Can only go back to completed steps
    if (idx >= currentStep && idx < 6) return;
    currentStep = idx;
    renderStep();
    renderStepIndicator();
  };

  window.clStartFresh = function() {
    if (!confirm('Bắt đầu lại sẽ xoá toàn bộ dữ liệu hồ sơ hiện tại. Tiếp tục?')) return;
    localStorage.removeItem(STORAGE_KEY);
    profile = {};
    checklist = null;
    currentStep = 0;
    renderStep();
    renderStepIndicator();
    document.getElementById('cl-resume-bar').style.display = 'none';

    // Update title/desc
    const title = document.getElementById('checklist-title');
    const desc = document.getElementById('checklist-desc');
    if (title) title.textContent = 'Tự làm hồ sơ du học Hàn Quốc';
    if (desc) desc.textContent = 'Hệ thống sẽ phân tích hồ sơ của bạn và tạo checklist cá nhân hoá.';
  };

  // ─── Render Step ───
  function renderStep() {
    const content = document.getElementById('cl-content');
    if (!content) return;

    switch (currentStep) {
      case 0: renderWelcome(content); break;
      case 1: renderPersonalForm(content); break;
      case 2: renderEducationForm(content); break;
      case 3: renderFinanceForm(content); break;
      case 4: renderRiskForm(content); break;
      case 5: renderAnalysis(content); break;
      case 6: renderChecklistView(content); break;
    }

    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ══════════════════════════════════════════════
  // STEP 0: Welcome
  // ══════════════════════════════════════════════
  function renderWelcome(container) {
    container.innerHTML = `
      <div class="cl-welcome">
        <div class="cl-welcome-icon">📋</div>
        <h3>Chào mừng bạn đến với hệ thống tự làm hồ sơ!</h3>
        <p>Chúng tôi sẽ giúp bạn tạo một checklist cá nhân hoá — chỉ gồm những giấy tờ bạn thực sự cần, dựa trên hoàn cảnh cụ thể của bạn.</p>

        <div class="cl-benefits">
          <div class="cl-benefit">
            <span>🎯</span>
            <div><strong>Checklist theo hoàn cảnh</strong><br>Bạn gap year? Trượt visa? Tài chính tự thân? Checklist sẽ khác.</div>
          </div>
          <div class="cl-benefit">
            <span>🤖</span>
            <div><strong>AI hỗ trợ soạn thảo</strong><br>Study Plan, giải trình gap, giải trình trượt visa — AI giúp bạn viết.</div>
          </div>
          <div class="cl-benefit">
            <span>📊</span>
            <div><strong>Theo dõi tiến độ</strong><br>Biết bạn đã hoàn thành bao nhiêu %, còn thiếu gì, sắp tới hạn gì.</div>
          </div>
        </div>

        <div class="cl-visa-select">
          <label for="cl-visa-type">Loại visa bạn muốn xin:</label>
          <select id="cl-visa-type" onchange="window.clSelectVisa(this.value)">
            <option value="D-4-1">🗣️ D-4-1: Visa học tiếng Hàn</option>
            <option value="D-2">🎓 D-2: Visa đại học chính quy</option>
            <option value="D4-to-D2">🔄 D4 → D2: Chuyển đổi visa</option>
          </select>
          <p class="cl-hint">Chọn loại visa bạn định xin. Bạn có thể thay đổi sau.</p>
        </div>

        <button type="button" class="btn btn-primary btn-lg" onclick="window.clNextStep()">
          Bắt đầu khai báo →
        </button>
      </div>
    `;

    // Restore visa type if already selected
    if (profile.visaType) {
      const sel = document.getElementById('cl-visa-type');
      if (sel) sel.value = profile.visaType;
    }
  }

  window.clSelectVisa = function(value) {
    profile.visaType = value;
    saveData();
  };

  // ══════════════════════════════════════════════
  // STEP 1: Personal Info
  // ══════════════════════════════════════════════
  function renderPersonalForm(container) {
    const d = profile;
    const isD4toD2 = profile.visaType === 'D4-to-D2';
    const locationField = isD4toD2 ? `
        <div class="cl-field">
          <label>Bạn đang ở đâu?</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-location" value="vietnam" ${d.currentLocation === 'vietnam' ? 'checked' : ''} onchange="profile.currentLocation = 'vietnam'"> 🇻🇳 Việt Nam</label>
            <label><input type="radio" name="cl-location" value="korea" ${d.currentLocation === 'korea' ? 'checked' : ''} onchange="profile.currentLocation = 'korea'"> 🇰🇷 Hàn Quốc (đang học tiếng)</label>
          </div>
          <p class="cl-hint">Dành cho hồ sơ chuyển đổi D4→D2 — thủ tục khác nhau tuỳ bạn đang ở đâu.</p>
        </div>` : '';

    container.innerHTML = `
      <div class="cl-form-section">
        <h3>👤 Thông tin cá nhân</h3>
        <p class="cl-form-desc">Thông tin cơ bản để xác định hồ sơ của bạn.</p>

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Họ và tên</label>
            <input type="text" id="cl-fullname" value="${escapeHtml(d.fullName || '')}" placeholder="Nguyễn Văn A">
          </div>
          <div class="cl-field">
            <label>Số điện thoại</label>
            <input type="tel" id="cl-phone" value="${escapeHtml(d.phone || '')}" placeholder="090xxxxxxx">
          </div>
        </div>

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Email</label>
            <input type="email" id="cl-email" value="${escapeHtml(d.email || '')}" placeholder="email@example.com">
          </div>
          <div class="cl-field">
            <label>Ngày sinh</label>
            <input type="date" id="cl-dob" value="${escapeHtml(d.dateOfBirth || '')}">
          </div>
        </div>

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Giới tính</label>
            <select id="cl-gender">
              <option value="">— Chọn —</option>
              <option value="male" ${d.gender === 'male' ? 'selected' : ''}>Nam</option>
              <option value="female" ${d.gender === 'female' ? 'selected' : ''}>Nữ</option>
            </select>
          </div>
          <div class="cl-field">
            <label>Trình độ học vấn cao nhất</label>
            <select id="cl-edu-level">
              <option value="highschool" ${d.educationLevel !== 'university' ? 'selected' : ''}>THPT</option>
              <option value="university" ${d.educationLevel === 'university' ? 'selected' : ''}>Đại học / Cao đẳng</option>
            </select>
          </div>
        </div>

        ${locationField}

        <div class="cl-nav">
          <button type="button" class="btn btn-primary btn-lg" onclick="window.clSaveStep1()">
            Lưu & Tiếp theo →
          </button>
        </div>
      </div>
    `;
  }

  window.clSaveStep1 = function() {
    profile.fullName = document.getElementById('cl-fullname').value.trim();
    profile.phone = document.getElementById('cl-phone').value.trim();
    profile.email = document.getElementById('cl-email').value.trim();
    profile.dateOfBirth = document.getElementById('cl-dob').value;
    profile.gender = document.getElementById('cl-gender').value;
    profile.educationLevel = document.getElementById('cl-edu-level').value;
    // D4→D2: lưu vị trí hiện tại
    const locInput = document.querySelector('input[name="cl-location"]:checked');
    if (locInput) profile.currentLocation = locInput.value;
    saveData();
    window.clNextStep();
  };

  // ══════════════════════════════════════════════
  // STEP 2: Education
  // ══════════════════════════════════════════════
  function renderEducationForm(container) {
    const d = profile;
    const isD2 = profile.visaType === 'D-2';
    const isD4toD2 = profile.visaType === 'D4-to-D2';

    // D-2: thêm trường cho bằng ĐH và thư giới thiệu
    const d2Fields = isD2 ? `
        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Trường Đại học / Cao đẳng đã tốt nghiệp (nếu có)</label>
            <input type="text" id="cl-uni-name" value="${escapeHtml(d.universityName || '')}" placeholder="VD: Đại học Kinh tế">
          </div>
          <div class="cl-field">
            <label>Bảng điểm Đại học (GPA thang 4 hoặc 10)</label>
            <input type="text" id="cl-uni-gpa" value="${escapeHtml(d.universityGpa || '')}" placeholder="VD: 3.0/4 hoặc 7.0/10">
          </div>
        </div>
        <div class="cl-field">
          <label>Bạn đã có thư giới thiệu từ giáo viên chưa? (D-2 cần 2 thư)</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-has-rec" value="true" ${d.hasRecommendation ? 'checked' : ''} onchange="profile.hasRecommendation = true"> ✅ Có rồi</label>
            <label><input type="radio" name="cl-has-rec" value="false" ${d.hasRecommendation === false ? 'checked' : ''} onchange="profile.hasRecommendation = false"> Chưa có</label>
          </div>
        </div>` : '';

    // D4→D2: thêm trường về trường tiếng hiện tại
    const d4d2Fields = isD4toD2 ? `
        <div class="cl-field">
          <label>Bạn đang học tiếng Hàn ở trường nào?</label>
          <input type="text" id="cl-current-school" value="${escapeHtml(d.currentKoreanSchool || '')}" placeholder="VD: Osan University Language Institute">
        </div>
        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Level / kỳ học hiện tại</label>
            <input type="text" id="cl-current-level" value="${escapeHtml(d.currentKoreanLevel || '')}" placeholder="VD: Level 4, kỳ 2">
          </div>
          <div class="cl-field">
            <label>Kết quả học tập</label>
            <select id="cl-current-result">
              <option value="">— Chọn —</option>
              <option value="excellent" ${d.koreanStudyResult === 'excellent' ? 'selected' : ''}>Xuất sắc (A)</option>
              <option value="good" ${d.koreanStudyResult === 'good' ? 'selected' : ''}>Khá (B)</option>
              <option value="average" ${d.koreanStudyResult === 'average' ? 'selected' : ''}>Trung bình (C)</option>
              <option value="poor" ${d.koreanStudyResult === 'poor' ? 'selected' : ''}>Yếu (D)</option>
            </select>
          </div>
        </div>` : '';

    container.innerHTML = `
      <div class="cl-form-section">
        <h3>🎓 Thông tin học vấn</h3>
        <p class="cl-form-desc">Giúp hệ thống đánh giá hồ sơ học tập của bạn.</p>

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Trường THPT</label>
            <input type="text" id="cl-hs-name" value="${escapeHtml(d.highSchoolName || '')}" placeholder="Tên trường THPT">
          </div>
          <div class="cl-field">
            <label>GPA THPT (thang 10)</label>
            <input type="number" id="cl-gpa" min="0" max="10" step="0.1" value="${d.gpa || ''}" placeholder="6.5">
          </div>
        </div>

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Năm tốt nghiệp THPT</label>
            <input type="number" id="cl-grad-year" min="2000" max="2030" value="${d.graduationYear || ''}" placeholder="VD: 2023">
          </div>
          <div class="cl-field">
            <label>Trình độ tiếng Hàn hiện tại</label>
            <select id="cl-korean">
              <option value="none" ${d.koreanLevel === 'none' || !d.koreanLevel ? 'selected' : ''}>Chưa học</option>
              <option value="beginner" ${d.koreanLevel === 'beginner' ? 'selected' : ''}>Mới bắt đầu</option>
              <option value="sejong2b" ${d.koreanLevel === 'sejong2b' ? 'selected' : ''}>Sejong 2B</option>
              <option value="topik1" ${d.koreanLevel === 'topik1' ? 'selected' : ''}>TOPIK 1</option>
              <option value="topik2" ${d.koreanLevel === 'topik2' ? 'selected' : ''}>TOPIK 2</option>
              <option value="topik3" ${d.koreanLevel === 'topik3' ? 'selected' : ''}>TOPIK 3</option>
              <option value="topik4" ${d.koreanLevel === 'topik4' ? 'selected' : ''}>TOPIK 4+</option>
            </select>
          </div>
        </div>

        <div class="cl-field">
          <label>Bạn đã có chứng chỉ TOPIK chưa?</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-has-topik" value="true" ${d.hasTopik ? 'checked' : ''} onchange="profile.hasTopik = true; document.getElementById('cl-topik-score').style.display=''"> Có</label>
            <label><input type="radio" name="cl-has-topik" value="false" ${d.hasTopik === false ? 'checked' : ''} onchange="profile.hasTopik = false; document.getElementById('cl-topik-score').style.display='none'"> Chưa</label>
          </div>
        </div>

        <div id="cl-topik-score" style="${d.hasTopik ? '' : 'display:none'}" class="cl-grid-2">
          <div class="cl-field">
            <label>Điểm TOPIK</label>
            <select id="cl-topik-grade">
              <option value="">— Chọn —</option>
              <option value="1" ${d.topikGrade === '1' ? 'selected' : ''}>TOPIK 1</option>
              <option value="2" ${d.topikGrade === '2' ? 'selected' : ''}>TOPIK 2</option>
              <option value="3" ${d.topikGrade === '3' ? 'selected' : ''}>TOPIK 3</option>
              <option value="4" ${d.topikGrade === '4' ? 'selected' : ''}>TOPIK 4</option>
              <option value="5" ${d.topikGrade === '5' ? 'selected' : ''}>TOPIK 5</option>
              <option value="6" ${d.topikGrade === '6' ? 'selected' : ''}>TOPIK 6</option>
            </select>
          </div>
          <div class="cl-field">
            <label>Điểm IELTS (nếu có)</label>
            <input type="number" id="cl-ielts" min="0" max="9" step="0.5" value="${d.ieltsScore || ''}" placeholder="VD: 5.5">
          </div>
        </div>

        ${d2Fields}
        ${d4d2Fields}

        <div class="cl-grid-2">
          <div class="cl-field">
            <label>Trường Hàn Quốc dự định</label>
            <input type="text" id="cl-chosen-school" value="${escapeHtml(d.chosenSchool || '')}" placeholder="VD: Osan University">
          </div>
          <div class="cl-field">
            <label>Ngành học dự định</label>
            <input type="text" id="cl-chosen-major" value="${escapeHtml(d.chosenMajor || '')}" placeholder="VD: Quản trị kinh doanh">
          </div>
        </div>

        <div class="cl-info-box">
          <strong>💡 Tại sao cần thông tin này?</strong><br>
          GPA thấp, gap year dài, học lực yếu — mỗi yếu tố sẽ thêm giấy tờ bổ sung vào checklist của bạn.
        </div>

        <div class="cl-nav">
          <button type="button" class="btn btn-primary btn-lg" onclick="window.clSaveStep2()">
            Lưu & Tiếp theo →
          </button>
        </div>
      </div>
    `;
  }

  window.clSaveStep2 = function() {
    profile.highSchoolName = document.getElementById('cl-hs-name').value.trim();
    profile.gpa = parseFloat(document.getElementById('cl-gpa').value) || null;
    profile.graduationYear = parseInt(document.getElementById('cl-grad-year').value) || null;
    profile.koreanLevel = document.getElementById('cl-korean').value;
    profile.hasTopik = document.querySelector('input[name="cl-has-topik"]:checked')?.value === 'true';
    profile.topikGrade = profile.hasTopik ? document.getElementById('cl-topik-grade')?.value || '' : '';
    profile.ieltsScore = parseFloat(document.getElementById('cl-ielts')?.value) || null;
    profile.chosenSchool = document.getElementById('cl-chosen-school')?.value?.trim() || '';
    profile.chosenMajor = document.getElementById('cl-chosen-major')?.value?.trim() || '';

    // D-2 fields
    const uniName = document.getElementById('cl-uni-name');
    if (uniName) profile.universityName = uniName.value.trim();
    const uniGpa = document.getElementById('cl-uni-gpa');
    if (uniGpa) profile.universityGpa = uniGpa.value.trim();
    const recInput = document.querySelector('input[name="cl-has-rec"]:checked');
    if (recInput) profile.hasRecommendation = recInput.value === 'true';

    // D4→D2 fields
    const curSchool = document.getElementById('cl-current-school');
    if (curSchool) profile.currentKoreanSchool = curSchool.value.trim();
    const curLevel = document.getElementById('cl-current-level');
    if (curLevel) profile.currentKoreanLevel = curLevel.value.trim();
    const curResult = document.getElementById('cl-current-result');
    if (curResult) profile.koreanStudyResult = curResult.value;

    // Calculate gap years
    if (profile.graduationYear) {
      const currentYear = new Date().getFullYear();
      profile.gapYears = Math.max(0, (currentYear - profile.graduationYear));
    }

    saveData();
    window.clNextStep();
  };  // ─── Helper: gợi ý sổ tiết kiệm tối thiểu theo visa type ───
  function getVisaSavingsHint() {
    const vt = profile.visaType || 'D-4-1';
    const hints = {
      'D-4-1': 'Tối thiểu 10,000 USD (~250 triệu VND) cho D-4-1. Có thể cao hơn tuỳ trường.',
      'D-2': 'Tối thiểu 18,000-20,000 USD (~450-500 triệu VND) cho D-2. Yêu cầu cao hơn D-4-1 đáng kể!',
      'D4-to-D2': 'Thường yêu cầu 10,000-18,000 USD tuỳ trường. Nếu đã có visa D-4-1, một số trường chấp nhận mức thấp hơn.',
    };
    return hints[vt] || hints['D-4-1'];
  }

  function getVisaMinSavings() {
    const vt = profile.visaType || 'D-4-1';
    const thresholds = { 'D-4-1': 10000, 'D-2': 18000, 'D4-to-D2': 10000 };
    return thresholds[vt] || 10000;
  }

  // ══════════════════════════════════════════════
  // STEP 3: Finance
  // ══════════════════════════════════════════════
  function renderFinanceForm(container) {
    const d = profile;
    const savingsHint = getVisaSavingsHint();
    container.innerHTML = `
      <div class="cl-form-section">
        <h3>💰 Thông tin tài chính</h3>
        <p class="cl-form-desc">Giúp xác định hồ sơ tài chính bạn cần chuẩn bị.</p>

        <div class="cl-field">
          <label>Ai sẽ là người bảo lãnh tài chính?</label>
          <select id="cl-sponsor" onchange="toggleSponsorFields(this.value)">
            <option value="self" ${d.sponsorIsSelf !== false ? 'selected' : ''}>Tự thân (tự bảo lãnh)</option>
            <option value="parent" ${d.sponsorIsSelf === false ? 'selected' : ''}>Cha/Mẹ</option>
            <option value="other" ${d.sponsorIsSelf === false && d.sponsorRelation && d.sponsorRelation !== 'parent' ? 'selected' : ''}>Người thân khác</option>
          </select>
        </div>

        <div id="cl-sponsor-fields" style="${d.sponsorIsSelf === false ? '' : 'display:none'}">
          <div class="cl-grid-2">
            <div class="cl-field">
              <label>Người bảo lãnh (họ tên)</label>
              <input type="text" id="cl-sponsor-name" value="${escapeHtml(d.sponsorName || '')}" placeholder="Nguyễn Văn ...">
            </div>
            <div class="cl-field">
              <label>Nghề nghiệp người bảo lãnh</label>
              <input type="text" id="cl-sponsor-job" value="${escapeHtml(d.sponsorOccupation || '')}" placeholder="VD: Kinh doanh, Giáo viên">
            </div>
          </div>
        </div>

        <div class="cl-field">
          <label>Số tiền dự kiến trong sổ tiết kiệm (USD)</label>
          <input type="number" id="cl-savings" min="0" step="1000" value="${d.savingsAmount || ''}" placeholder="10000">
          <p class="cl-hint">${escapeHtml(savingsHint)}</p>
        </div>

        <div class="cl-info-box" style="background:#fef3c7;border-color:#f59e0b">
          <strong>📌 Lưu ý quan trọng:</strong><br>
          Hồ sơ tài chính là một trong những phần dễ bị từ chối nhất. 
          Nếu người bảo lãnh không phải tự thân, bạn cần thêm giấy tờ chứng minh quan hệ 
          và chứng minh thu nhập của người bảo lãnh.
        </div>

        <div class="cl-nav">
          <button type="button" class="btn btn-primary btn-lg" onclick="window.clSaveStep3()">
            Lưu & Tiếp theo →
          </button>
        </div>
      </div>
    `;
  }

  window.toggleSponsorFields = function(value) {
    const fields = document.getElementById('cl-sponsor-fields');
    if (fields) fields.style.display = (value === 'self') ? 'none' : '';
  };

  window.clSaveStep3 = function() {
    const sponsorVal = document.getElementById('cl-sponsor').value;
    profile.sponsorIsSelf = (sponsorVal === 'self');
    if (!profile.sponsorIsSelf) {
      profile.sponsorName = document.getElementById('cl-sponsor-name').value.trim();
      profile.sponsorOccupation = document.getElementById('cl-sponsor-job').value.trim();
      profile.sponsorRelation = sponsorVal === 'parent' ? 'parent' : 'other';
    } else {
      profile.sponsorName = '';
      profile.sponsorOccupation = '';
      profile.sponsorRelation = '';
    }
    profile.savingsAmount = parseFloat(document.getElementById('cl-savings').value) || 0;
    saveData();
    window.clNextStep();
  };

  // ══════════════════════════════════════════════
  // STEP 4: Risk Assessment
  // ══════════════════════════════════════════════
  function renderRiskForm(container) {
    const d = profile;
    container.innerHTML = `
      <div class="cl-form-section">
        <h3>⚠️ Đánh giá rủi ro</h3>
        <p class="cl-form-desc">Các yếu tố có thể ảnh hưởng đến hồ sơ visa của bạn.</p>

        <div class="cl-field">
          <label>Bạn đã từng trượt visa Hàn Quốc chưa?</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-visa-fail" value="true" ${d.hasVisaRejection ? 'checked' : ''} onchange="profile.hasVisaRejection = true"> Đã từng trượt</label>
            <label><input type="radio" name="cl-visa-fail" value="false" ${d.hasVisaRejection === false ? 'checked' : ''} onchange="profile.hasVisaRejection = false"> Chưa từng</label>
          </div>
        </div>

        <div id="cl-rejection-detail" style="${d.hasVisaRejection ? '' : 'display:none'}">
          <div class="cl-field">
            <label>Lý do trượt (nếu biết)</label>
            <textarea id="cl-rejection-reason" rows="2" placeholder="VD: Thiếu giấy tờ tài chính, Study Plan chung chung...">${escapeHtml(d.rejectionReason || '')}</textarea>
          </div>
        </div>

        <div class="cl-field">
          <label>Bạn đã từng có người thân ở lại Hàn Quốc bất hợp pháp?</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-illegal" value="true" ${d.hasIllegalRelative ? 'checked' : ''} onchange="profile.hasIllegalRelative = true"> Có</label>
            <label><input type="radio" name="cl-illegal" value="false" ${d.hasIllegalRelative === false ? 'checked' : ''} onchange="profile.hasIllegalRelative = false"> Không</label>
          </div>
        </div>

        <div class="cl-field">
          <label>Bạn đã từng đi làm chưa?</label>
          <div class="cl-radio-group">
            <label><input type="radio" name="cl-work" value="true" ${d.hasWorkExperience ? 'checked' : ''} onchange="profile.hasWorkExperience = true; toggleWorkFields(true)"> Đã đi làm</label>
            <label><input type="radio" name="cl-work" value="false" ${d.hasWorkExperience === false ? 'checked' : ''} onchange="profile.hasWorkExperience = false; toggleWorkFields(false)"> Chưa đi làm</label>
          </div>
        </div>

        <div id="cl-work-fields" style="${d.hasWorkExperience ? '' : 'display:none'}">
          <div class="cl-field">
            <label>Bạn có hợp đồng lao động / bảo hiểm xã hội không?</label>
            <div class="cl-radio-group">
              <label><input type="radio" name="cl-contract" value="true" ${d.hasLaborContract ? 'checked' : ''} onchange="profile.hasLaborContract = true"> Có đầy đủ</label>
              <label><input type="radio" name="cl-contract" value="false" ${d.hasLaborContract === false ? 'checked' : ''} onchange="profile.hasLaborContract = false"> Không / Không chính thức</label>
            </div>
          </div>
          <div class="cl-grid-2">
            <div class="cl-field">
              <label>Tên công ty</label>
              <input type="text" id="cl-work-company" value="${escapeHtml(d.workCompany || '')}" placeholder="VD: Công ty ABC">
            </div>
            <div class="cl-field">
              <label>Vị trí công việc</label>
              <input type="text" id="cl-work-position" value="${escapeHtml(d.workPosition || '')}" placeholder="VD: Nhân viên văn phòng">
            </div>
          </div>
          <div class="cl-field">
            <label>Thời gian làm việc (năm)</label>
            <input type="number" id="cl-work-duration" min="0" max="30" step="0.5" value="${d.workDuration || ''}" placeholder="VD: 1.5">
          </div>
        </div>

        <div class="cl-info-box" style="background:#fef2f2;border-color:#ef4444">
          <strong>🔴 Lưu ý:</strong><br>
          Các yếu tố rủi ro (trượt visa, gap year, người thân bất hợp pháp) 
          sẽ làm hồ sơ của bạn cần nhiều giấy tờ bổ sung hơn. 
          Đừng lo — hệ thống sẽ hướng dẫn bạn từng bước.
        </div>

        <div class="cl-nav">
          <button type="button" class="btn btn-primary btn-lg" onclick="window.clSaveStep4()">
            ⚡ Phân tích hồ sơ →
          </button>
        </div>
      </div>
    `;
  }

  window.toggleWorkFields = function(show) {
    const fields = document.getElementById('cl-work-fields');
    if (fields) fields.style.display = show ? '' : 'none';
    const rejection = document.getElementById('cl-rejection-detail');
    const hasRejection = document.querySelector('input[name="cl-visa-fail"]:checked')?.value === 'true';
    if (rejection) rejection.style.display = hasRejection ? '' : 'none';
  };

  window.clSaveStep4 = function() {
    profile.hasVisaRejection = document.querySelector('input[name="cl-visa-fail"]:checked')?.value === 'true';
    profile.rejectionReason = document.getElementById('cl-rejection-reason')?.value?.trim() || '';
    profile.hasIllegalRelative = document.querySelector('input[name="cl-illegal"]:checked')?.value === 'true';
    profile.hasWorkExperience = document.querySelector('input[name="cl-work"]:checked')?.value === 'true';
    profile.hasLaborContract = profile.hasWorkExperience
      ? document.querySelector('input[name="cl-contract"]:checked')?.value === 'true'
      : false;
    profile.workCompany = profile.hasWorkExperience ? document.getElementById('cl-work-company')?.value?.trim() || '' : '';
    profile.workPosition = profile.hasWorkExperience ? document.getElementById('cl-work-position')?.value?.trim() || '' : '';
    profile.workDuration = profile.hasWorkExperience ? parseFloat(document.getElementById('cl-work-duration')?.value) || null : null;
    profile._completed = true;

    // Generate checklist locally (fast)
    generateChecklistLocal();

    saveData();
    window.clNextStep();
  };

  // ══════════════════════════════════════════════
  // STEP 5: Analysis (AI + Local)
  // ══════════════════════════════════════════════
  function renderAnalysis(container) {
    const visaType = profile.visaType || 'D-4-1';
    const template = window.CHECKLIST_DATA?.[visaType];
    const itemCount = checklist?.totalItems || 0;
    const requiredCount = checklist?.requiredItems || 0;

    container.innerHTML = `
      <div class="cl-analysis">
        <h3>🤖 Phân tích hồ sơ của bạn</h3>
        <p class="cl-form-desc">Dựa trên thông tin bạn đã cung cấp, đây là tổng quan:</p>

        <div class="cl-analysis-summary">
          <div class="cl-analysis-card">
            <span class="cl-analysis-num">${itemCount}</span>
            <span class="cl-analysis-label">giấy tờ cần chuẩn bị</span>
          </div>
          <div class="cl-analysis-card">
            <span class="cl-analysis-num">${requiredCount}</span>
            <span class="cl-analysis-label">giấy tờ bắt buộc</span>
          </div>
          <div class="cl-analysis-card">
            <span class="cl-analysis-num">${itemCount - requiredCount}</span>
            <span class="cl-analysis-label">giấy tờ bổ sung theo hoàn cảnh</span>
          </div>
        </div>

        <div class="cl-analysis-detail">
          <h4>📋 Hồ sơ của bạn:</h4>
          <table class="cl-analysis-table">
            <tr><td>Loại visa</td><td>${visaType}</td></tr>
            <tr><td>Học vấn</td><td>${profile.educationLevel === 'university' ? 'Đại học' : 'THPT'}</td></tr>
            <tr><td>Gap year</td><td>${profile.gapYears ? profile.gapYears + ' năm' : 'Không có'}</td></tr>
            <tr><td>Đã từng trượt visa</td><td>${profile.hasVisaRejection ? '⚠️ Có' : 'Không'}</td></tr>
            <tr><td>Bảo lãnh tài chính</td><td>${profile.sponsorIsSelf ? 'Tự thân' : profile.sponsorRelation === 'parent' ? 'Cha/Mẹ' : 'Người thân khác'}</td></tr>
            <tr><td>Tiếng Hàn</td><td>${profile.koreanLevel || 'Chưa có'}</td></tr>
            ${profile.chosenSchool ? '<tr><td>Trường dự định</td><td>' + escapeHtml(profile.chosenSchool) + '</td></tr>' : ''}
            ${profile.chosenMajor ? '<tr><td>Ngành dự định</td><td>' + escapeHtml(profile.chosenMajor) + '</td></tr>' : ''}
            ${profile.hasTopik && profile.topikGrade ? '<tr><td>TOPIK</td><td>Topik ' + profile.topikGrade + '</td></tr>' : ''}
            ${profile.ieltsScore ? '<tr><td>IELTS</td><td>' + profile.ieltsScore + '</td></tr>' : ''}
            ${profile.hasWorkExperience && profile.workCompany ? '<tr><td>Kinh nghiệm làm việc</td><td>' + escapeHtml(profile.workCompany) + (profile.workPosition ? ' - ' + escapeHtml(profile.workPosition) : '') + '</td></tr>' : ''}
          </table>
        </div>

        <div class="cl-analysis-risk">
          <h4>⚠️ Rủi ro phát hiện:</h4>
          <ul>
            ${profile.gapYears > 0.5 ? '<li>📌 Bạn có gap year — cần giải trình khoảng trống thời gian</li>' : ''}
            ${profile.hasVisaRejection ? '<li>🔴 Đã từng trượt visa — cần giải trình + nộp lại hồ sơ cũ</li>' : ''}
            ${!profile.sponsorIsSelf ? '<li>📌 Người bảo lãnh không phải tự thân — cần chứng minh quan hệ + thu nhập</li>' : ''}
            ${(!profile.gpa || profile.gpa < 5) ? '<li>🟡 GPA thấp — có thể cần thư giới thiệu bổ sung</li>' : ''}
            ${(profile.koreanLevel === 'none') ? '<li>🟡 Chưa có tiếng Hàn — nên học Sejong 2B hoặc TOPIK 1 trước</li>' : ''}
            ${(profile.savingsAmount < getVisaMinSavings()) ? '<li>🔴 Sổ tiết kiệm dưới ' + getVisaMinSavings().toLocaleString() + ' USD — cần tăng lên mức tối thiểu cho ' + visaType + '</li>' : ''}
            ${!profile.hasLaborContract && profile.hasWorkExperience ? '<li>🟡 Đã đi làm nhưng không có HĐLĐ — cần giấy xác nhận khác</li>' : ''}
            ${(profile.gpa && profile.gpa >= 7) ? '<li>✅ GPA tốt — điểm mạnh trong hồ sơ</li>' : ''}
            ${(profile.koreanLevel && profile.koreanLevel !== 'none') ? '<li>✅ Đã có nền tảng tiếng Hàn — lợi thế</li>' : ''}
            ${profile.hasIllegalRelative ? '<li>🔴 Người thân cư trú bất hợp pháp — rủi ro cao, cần tư vấn riêng</li>' : ''}
            ${visaType === 'D-2' && profile.koreanLevel !== 'topik3' && profile.koreanLevel !== 'topik4' ? '<li>🔴 D-2 thường yêu cầu TOPIK 3+ — nếu chưa đạt, cần kiểm tra kỹ điều kiện đầu vào của trường</li>' : ''}
            ${visaType === 'D-2' && !profile.hasRecommendation ? '<li>🟡 D-2 cần 2 thư giới thiệu từ giáo viên — chuẩn bị sớm</li>' : ''}
            ${visaType === 'D4-to-D2' && !profile.currentKoreanSchool ? '<li>📌 Bạn chưa nhập trường tiếng đang học — cần bổ sung để xác nhận quá trình học</li>' : ''}
            ${visaType === 'D4-to-D2' && profile.currentLocation === 'korea' ? '<li>📌 Bạn đang ở Hàn — cần kiểm tra hạn visa D-4-1 hiện tại và thủ tục chuyển đổi tại Immigration</li>' : ''}
            ${!profile.hasVisaRejection && profile.gapYears <= 0.5 && profile.sponsorIsSelf && (profile.gpa || 0) >= 5 ? '<li>✅ Hồ sơ cơ bản ổn — không có rủi ro đặc biệt</li>' : ''}
          </ul>
        </div>

        <div class="cl-nav">
          <button type="button" class="btn btn-primary btn-lg" onclick="window.clNextStep()">
            📋 Xem checklist cá nhân →
          </button>
        </div>
      </div>
    `;
  }

  // ══════════════════════════════════════════════
  // STEP 6: Checklist View
  // ══════════════════════════════════════════════
  function renderChecklistView(container) {
    if (!checklist) {
      container.innerHTML = `<div class="cl-empty">Chưa có checklist. Vui lòng quay lại bước phân tích.</div>`;
      return;
    }

    const progress = window.calculateChecklistProgress(checklist);
    const moduleCount = checklist.modules.length;

    // Module tabs
    const moduleTabs = checklist.modules.map((mod, i) => `
      <button type="button" class="cl-module-tab ${i === 0 ? 'active' : ''}" 
              onclick="window.clSwitchModule(${i})" data-module-idx="${i}">
        ${mod.icon} ${mod.name}
        <span class="cl-module-count">${mod.items.filter(it => it.status === 'completed').length}/${mod.items.length}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="cl-checklist">
        <div class="cl-checklist-header">
          <h3>✅ Checklist cá nhân hoá của bạn</h3>
          <p class="cl-form-desc">Dành cho <strong>${checklist.name}</strong> — chỉ hiển thị giấy tờ phù hợp với hoàn cảnh của bạn.</p>
        </div>

        <!-- Overall Progress -->
        <div class="cl-overall-progress">
          <div class="cl-progress-circle">
            <svg viewBox="0 0 36 36" class="cl-circular-chart">
              <path class="cl-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="cl-circle-fill" stroke-dasharray="${progress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <text x="18" y="20.5" class="cl-circle-text">${progress}%</text>
            </svg>
          </div>
          <div class="cl-progress-info">
            <div><strong>${checklist.totalItems}</strong> giấy tờ cần chuẩn bị</div>
            <div>📌 <strong>${checklist.requiredItems}</strong> bắt buộc + <strong>${checklist.recommendedItems}</strong> khuyến khích</div>
            <div>🏁 <strong>${moduleCount}</strong> nhóm thủ tục</div>
          </div>
        </div>

        <!-- Module Tabs -->
        <div class="cl-module-tabs" id="cl-module-tabs">
          ${moduleTabs}
        </div>

        <!-- Module Content -->
        <div id="cl-module-content" class="cl-module-content"></div>

        <!-- AI Assist Button -->
        <div class="cl-ai-bar">
          <button type="button" class="btn btn-primary" onclick="window.clOpenAIAssist()">
            🤖 AI hỗ trợ viết Study Plan / Giải trình
          </button>
          <button type="button" class="btn btn-outline" onclick="window.clExportChecklist()">
            📤 Xuất checklist
          </button>
          <button type="button" class="btn btn-outline" onclick="window.clAutoReminders()">
            ⏰ Tạo nhắc nhở
          </button>
          <button type="button" class="btn btn-outline" onclick="window.clOpenStudyPlanReviewer()">
            📝 Đánh giá Study Plan
          </button>
          <button type="button" class="btn btn-outline" onclick="window.clOpenInterviewSimulator()">
            🎤 Luyện phỏng vấn
          </button>
        </div>
      </div>
    `;

    // Show first module
    if (checklist.modules.length > 0) {
      renderModule(0);
    }

    // Update title/desc
    const title = document.getElementById('checklist-title');
    const desc = document.getElementById('checklist-desc');
    if (title) title.textContent = '✅ Checklist cá nhân hoá';
    if (desc) desc.textContent = `Hệ thống đã phân tích hồ sơ và tạo checklist gồm ${checklist.totalItems} giấy tờ dành riêng cho bạn.`;
  }

  window.clSwitchModule = function(idx) {
    document.querySelectorAll('.cl-module-tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.cl-module-tab[data-module-idx="${idx}"]`);
    if (tab) tab.classList.add('active');
    renderModule(idx);
  };

  function renderModule(idx) {
    const container = document.getElementById('cl-module-content');
    if (!container || !checklist || !checklist.modules[idx]) return;

    const mod = checklist.modules[idx];
    container.innerHTML = `
      <div class="cl-module">
        <div class="cl-module-header">
          <h4>${mod.icon} ${mod.name}</h4>
          <p>${escapeHtml(mod.description || '')}</p>
        </div>
        <div class="cl-module-items">
          ${mod.items.map(item => renderItem(item)).join('')}
        </div>
      </div>
    `;

    // Bind item events
    container.querySelectorAll('.cl-item-status').forEach(btn => {
      btn.addEventListener('change', function() {
        const itemId = this.dataset.itemId;
        const newStatus = this.value;
        updateItemStatus(itemId, newStatus);
      });
    });

    container.querySelectorAll('.cl-item-note-input').forEach(input => {
      input.addEventListener('change', function() {
        const itemId = this.dataset.itemId;
        saveItemNote(itemId, this.value);
      });
    });
  }

  function renderItem(item) {
    const statusIcons = {
      pending: '⬜',
      in_progress: '🔄',
      completed: '✅',
      not_applicable: '➖'
    };
    const statusLabels = {
      pending: 'Chưa làm',
      in_progress: 'Đang làm',
      completed: 'Hoàn thành',
      not_applicable: 'Không áp dụng'
    };
    const badge = item.required
      ? '<span class="cl-badge cl-badge-required">Bắt buộc</span>'
      : '<span class="cl-badge cl-badge-recommended">Khuyến khích</span>';
    const aiBadge = item.hasAiAssist ? '<span class="cl-badge cl-badge-ai">🤖 AI</span>' : '';
    const warningHtml = item.warning ? `<div class="cl-item-warning">⚠️ ${escapeHtml(item.warning)}</div>` : '';
    const linkHtml = item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener" class="cl-item-link">🔗 ${escapeHtml(item.link)}</a>` : '';

    // Document status: ready_status: 'not_ready' | 'ready' | 'translated' | 'notarized'
    const docStatusLabels = { not_ready: 'Chưa có', ready: 'Đã có', translated: 'Đã dịch', notarized: '✅ Sẵn sàng' };
    const docStatus = item.docStatus || 'not_ready';
    const hasFile = item.fileUrl ? true : false;
    const isWarning = item.documentType === 'general_warning'; // ALERT items — không cần document tracking

    const docTrackingHtml = isWarning ? '' : `
        <div class="cl-item-doc-tracking">
          <div class="cl-doc-status-bar">${['not_ready', 'ready', 'translated', 'notarized'].map((s, i) => {
              const levels = ['not_ready', 'ready', 'translated', 'notarized'];
              const idx = levels.indexOf(docStatus);
              const isDone = i <= idx;
              const isCurrent = i === idx;
              const clickable = s !== 'not_ready' && !isDone && item.source !== 'school' ? 'clickable' : '';
              return `<div class="cl-doc-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${clickable}" data-doc-status="${s}">
                <div class="cl-doc-step-dot"></div>
                <span>${docStatusLabels[s]}</span>
              </div>`;
            }).join('')}
          </div>
          <div class="cl-doc-upload-row">
            <button type="button" class="cl-doc-upload-btn btn btn-sm ${hasFile ? 'btn-outline' : 'btn-primary'}" data-item-id="${item.id}">
              ${hasFile ? '📎 Đã upload' : '📤 Upload file'}
            </button>
            <input type="file" class="cl-doc-file-input" data-item-id="${item.id}" style="display:none" accept="image/*,.pdf,.doc,.docx">
            ${hasFile ? `<span class="cl-doc-filename">📄 ${escapeHtml(item.fileName || '')}</span>` : ''}
            ${hasFile && docStatus === 'ready' ? `
              <button type="button" class="cl-doc-quick-btn btn btn-sm btn-outline" onclick="window.clMarkTranslated('${item.id}')">
                🔄 Đã dịch thuật xong
              </button>
              <button type="button" class="cl-doc-quick-btn btn btn-sm btn-success" onclick="window.clMarkReady('${item.id}')">
                ✅ Sẵn sàng luôn
              </button>
            ` : ''}
            ${hasFile && docStatus === 'translated' ? `
              <button type="button" class="cl-doc-quick-btn btn btn-sm btn-success" onclick="window.clMarkReady('${item.id}')">
                ✅ Đánh dấu sẵn sàng
              </button>
            ` : ''}
          </div>
        </div>`;

    return `
      <div class="cl-item ${item.status === 'completed' ? 'cl-item-done' : ''} ${hasFile ? 'cl-item-has-file' : ''}" data-item-id="${item.id}">
        <div class="cl-item-head">
          <div class="cl-item-icon">${statusIcons[item.status] || '⬜'}</div>
          <div class="cl-item-info">
            <div class="cl-item-name">${escapeHtml(item.name)} ${badge} ${aiBadge}</div>
            <div class="cl-item-desc">${escapeHtml(item.description)}</div>
            ${warningHtml}
            ${linkHtml}
            ${item.source === 'school' ? '<div class="cl-item-source">🏫 Trường Hàn cấp — theo dõi trạng thái</div>' : ''}
          </div>
          <div class="cl-item-actions">
            <select class="cl-item-status" data-item-id="${item.id}">
              ${Object.entries(statusLabels).map(([val, label]) =>
                `<option value="${val}" ${item.status === val ? 'selected' : ''}>${label}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        ${docTrackingHtml}
        <div class="cl-item-note">
          <input type="text" class="cl-item-note-input" data-item-id="${item.id}" value="${escapeHtml(item.note || '')}" placeholder="Ghi chú thêm...">
        </div>
      </div>
    `;
  }

  function updateItemStatus(itemId, newStatus) {
    if (!checklist) return;
    for (const mod of checklist.modules) {
      const item = mod.items.find(i => i.id === itemId);
      if (item) {
        item.status = newStatus;
        break;
      }
    }
    saveData();
    // Update progress circle
    const progress = window.calculateChecklistProgress(checklist);
    const circleFill = document.querySelector('.cl-circle-fill');
    const circleText = document.querySelector('.cl-circle-text');
    if (circleFill) circleFill.setAttribute('stroke-dasharray', `${progress}, 100`);
    if (circleText) circleText.textContent = `${progress}%`;
    // Update module tab counts
    checklist.modules.forEach((mod, i) => {
      const tab = document.querySelector(`.cl-module-tab[data-module-idx="${i}"] .cl-module-count`);
      if (tab) tab.textContent = `${mod.items.filter(it => it.status === 'completed').length}/${mod.items.length}`;
    });
    // Update item styling
    const el = document.querySelector(`.cl-item[data-item-id="${itemId}"]`);
    if (el) el.classList.toggle('cl-item-done', newStatus === 'completed');
  }

  function saveItemNote(itemId, note) {
    if (!checklist) return;
    for (const mod of checklist.modules) {
      const item = mod.items.find(i => i.id === itemId);
      if (item) {
        item.note = note;
        break;
      }
    }
    saveData();
  }

  // ══════════════════════════════════════════════
  // Local Checklist Generation
  // ══════════════════════════════════════════════
  function generateChecklistLocal() {
    const visaType = profile.visaType || 'D-4-1';
    checklist = window.generatePersonalizedChecklist(visaType, profile);
    if (checklist) {
      // Gắn AI-assist suggestions dựa trên profile
      checklist._aiSuggestions = buildAISuggestions(profile);
      saveData();
    }
  }

  function buildAISuggestions(profile) {
    const suggestions = [];
    if (profile.gapYears > 0.5) {
      var gapDesc = 'Bạn đã tốt nghiệp ' + (profile.graduationYear || 'cách đây') + ' ' + profile.gapYears + ' năm. ';
      if (profile.hasWorkExperience && profile.workCompany) {
        gapDesc += 'Trong thời gian này, bạn đã làm việc tại ' + profile.workCompany;
        if (profile.workPosition) gapDesc += ' với vị trí ' + profile.workPosition;
        if (profile.workDuration) gapDesc += ' trong ' + profile.workDuration + ' năm';
        gapDesc += '. ';
      }
      gapDesc += 'Cần giải trình rõ: đã làm gì trong thời gian này, tại sao chưa đi du học sớm hơn.';
      suggestions.push({
        type: 'gap_explanation',
        title: 'Viết giải trình khoảng trống thời gian',
        description: gapDesc
      });
    }
    if (profile.hasVisaRejection) {
      suggestions.push({
        type: 'visa_rejection_explanation',
        title: 'Viết giải trình lý do trượt visa',
        description: `Phân tích nguyên nhân trượt visa lần trước và giải trình cách bạn đã khắc phục.`
      });
    }
    suggestions.push({
      type: 'study_plan',
      title: 'Soạn Study Plan',
      description: `Viết kế hoạch học tập cá nhân hoá cho visa ${profile.visaType || 'D-4-1'}.`
    });
    return suggestions;
  }

  // ══════════════════════════════════════════════
  // AI Assist Modal — NÂNG CẤP: 8 câu hỏi Study Plan
  // ══════════════════════════════════════════════
  
  // ─── Câu hỏi Study Plan — CÁ NHÂN HOÁ theo từng loại visa ───
  const STUDY_PLAN_QUESTIONS_BY_VISA = {
    // D-4-1: Visa học tiếng — ngắn gọn, tập trung động lực học tiếng & mục tiêu TOPIK
    'D-4-1': [
      { id: 'd41-q1', label: '1. Vì sao bạn chọn học tiếng Hàn tại Hàn Quốc thay vì học tại Việt Nam?', hint: 'VD: Môi trường ngôn ngữ tốt hơn, muốn trải nghiệm văn hoá, có người thân bên đó...', key: 'reasonKorea' },
      { id: 'd41-q2', label: '2. Tại sao bạn chọn trường tiếng này? Bạn biết gì về trường?', hint: 'VD: Trường có chương trình tiếng tốt, bạn bè giới thiệu, vị trí thuận lợi...', key: 'reasonSchool' },
      { id: 'd41-q3', label: '3. Bạn có mục tiêu TOPIK cụ thể không? Kế hoạch học tiếng theo từng giai đoạn?', hint: 'VD: 6 tháng đầu đạt TOPIK 2, 1 năm đạt TOPIK 3, mỗi ngày học 4-5 tiếng...', key: 'topikGoal' },
      { id: 'd41-q4', label: '4. Sau khi hoàn thành khóa học tiếng (1-2 năm), bạn dự định làm gì?', hint: 'VD: Về Việt Nam làm phiên dịch, xin việc công ty Hàn, học lên đại học...', key: 'futurePlan' },
      { id: 'd41-q5', label: '5. (Nếu có gap year) Bạn đã làm gì trong thời gian đó?', hint: 'VD: Đi làm, học thêm ngoại ngữ, tham gia hoạt động ngoại khóa...', key: 'gapActivity' },
      { id: 'd41-q6', label: '6. Bạn đã từng học tiếng Hàn chưa? Trình độ hiện tại thế nào?', hint: 'VD: Đã học Sejong 2B, tự học qua YouTube, đang ôn TOPIK 1...', key: 'languageLevel' },
    ],
    // D-2: Visa đại học chính quy — chi tiết, tập trung học thuật, ngành nghề, dài hạn
    'D-2': [
      { id: 'd2-q1', label: '1. Vì sao bạn chọn du học đại học tại Hàn Quốc thay vì học tại Việt Nam?', hint: 'VD: Chất lượng giáo dục, ngành học phù hợp, cơ hội việc làm sau tốt nghiệp...', key: 'reasonKorea' },
      { id: 'd2-q2', label: '2. Tại sao bạn chọn trường đại học này? Bạn biết gì về chương trình đào tạo?', hint: 'VD: Trường có thế mạnh về ngành này, chương trình giảng dạy bằng tiếng Anh, có cơ hội thực tập...', key: 'reasonSchool' },
      { id: 'd2-q3', label: '3. Tại sao bạn chọn ngành này? Nó liên quan thế nào đến định hướng nghề nghiệp?', hint: 'VD: Đam mê từ nhỏ, ngành có nhu cầu nhân lực cao tại Việt Nam, phù hợp năng lực...', key: 'careerGoal' },
      { id: 'd2-q4', label: '4. Bạn có kế hoạch học tập cụ thể từng học kỳ không? (mục tiêu GPA, chứng chỉ...)', hint: 'VD: Học kỳ 1 tập trung tiếng Hàn, từ kỳ 2 học chuyên ngành, mục tiêu GPA 3.5/4.5...', key: 'studyPlan' },
      { id: 'd2-q5', label: '5. Bạn dự định làm gì sau khi tốt nghiệp đại học?', hint: 'VD: Về Việt Nam làm việc, xin visa E7 ở lại Hàn, học lên thạc sĩ...', key: 'futurePlan' },
      { id: 'd2-q6', label: '6. (Nếu có gap year) Bạn đã làm gì trong thời gian đó?', hint: 'VD: Đi làm, học thêm ngoại ngữ, tham gia hoạt động ngoại khóa...', key: 'gapActivity' },
      { id: 'd2-q7', label: '7. Trình độ tiếng Hàn/Anh của bạn có đáp ứng yêu cầu đầu vào không?', hint: 'VD: Có TOPIK 3, IELTS 5.5, đang ôn thi thêm...', key: 'languageLevel' },
      { id: 'd2-q8', label: '8. Bạn có dự định học lên cao học (Thạc sĩ, Tiến sĩ) không?', hint: 'VD: Có dự định học lên thạc sĩ sau khi tốt nghiệp đại học, hoặc đi làm trước rồi tính sau...', key: 'higherStudy' },
      { id: 'd2-q9', label: '9. Bạn có kế hoạch tham gia hoạt động ngoại khóa, thực tập, hay làm thêm không?', hint: 'VD: Muốn tham gia câu lạc bộ tiếng Hàn, thực tập tại công ty Hàn vào kỳ nghỉ hè...', key: 'extracurricular' },
    ],
    // D4-to-D2: Chuyển đổi — tập trung vào trải nghiệm tại Hàn & lý do chuyển tiếp
    'D4-to-D2': [
      { id: 'd42-q1', label: '1. Bạn đang học tiếng Hàn ở trường nào? Kết quả học tập thế nào?', hint: 'VD: Học tại Osan University, đã hoàn thành level 4, sắp thi TOPIK 3...', key: 'currentStudy' },
      { id: 'd42-q2', label: '2. Vì sao bạn muốn chuyển từ visa D-4-1 lên D-2 thay vì về Việt Nam?', hint: 'VD: Muốn học lên đại học để có bằng cấp, yêu thích môi trường học tập tại Hàn...', key: 'reasonUpgrade' },
      { id: 'd42-q3', label: '3. Tại sao bạn chọn trường đại học và ngành này?', hint: 'VD: Trường có chương trình liên thông, ngành học phù hợp với định hướng...', key: 'reasonSchool' },
      { id: 'd42-q4', label: '4. Trình độ tiếng Hàn hiện tại của bạn có đủ để học đại học không? (TOPIK mấy?)', hint: 'VD: Đã có TOPIK 3, đang ôn TOPIK 4, tự tin đọc hiểu giáo trình...', key: 'languageLevel' },
      { id: 'd42-q5', label: '5. Kế hoạch học tập cụ thể của bạn khi lên đại học là gì?', hint: 'VD: Năm 1 tập trung tiếng Hàn học thuật, năm 2-3 học chuyên ngành, năm 4 làm đồ án...', key: 'studyPlan' },
      { id: 'd42-q6', label: '6. Bạn dự định làm gì sau khi tốt nghiệp đại học?', hint: 'VD: Ở lại Hàn làm việc visa E7, về Việt Nam khởi nghiệp, học lên thạc sĩ...', key: 'futurePlan' },
      { id: 'd42-q7', label: '7. Kinh nghiệm sống và học tập tại Hàn đã thay đổi bạn như thế nào?', hint: 'VD: Tự tin hơn, tiếng Hàn tiến bộ, hiểu văn hoá Hàn hơn, có bạn bè quốc tế...', key: 'koreaExperience' },
    ],
  };

  function getStudyPlanQuestions() {
    const vt = profile.visaType || 'D-4-1';
    return STUDY_PLAN_QUESTIONS_BY_VISA[vt] || STUDY_PLAN_QUESTIONS_BY_VISA['D-4-1'];
  }

  window.clOpenAIAssist = function() {
    if (!checklist || !checklist._aiSuggestions || checklist._aiSuggestions.length === 0) {
      alert('Chưa có gợi ý AI nào cho hồ sơ của bạn. Hãy hoàn thành bước khai báo trước.');
      return;
    }

    const suggestions = checklist._aiSuggestions;

    const overlay = document.createElement('div');
    overlay.className = 'cl-ai-overlay';
    overlay.innerHTML = `
      <div class="cl-ai-modal cl-ai-modal-wide">
        <div class="cl-ai-modal-header">
          <h3>🤖 AI hỗ trợ soạn thảo</h3>
          <button type="button" class="cl-ai-close" onclick="this.closest('.cl-ai-overlay').remove()">&times;</button>
        </div>
        <div class="cl-ai-modal-body">
          <!-- Step 1: Choose type -->
          <div id="cl-ai-step-choose">
            <p>Chọn loại giấy tờ bạn muốn AI hỗ trợ soạn thảo:</p>
            <div class="cl-ai-options">
              ${suggestions.map((s, i) => `
                <div class="cl-ai-option" onclick="window.clOpenAIForm(${i})">
                  <div class="cl-ai-option-title">${escapeHtml(s.title)}</div>
                  <div class="cl-ai-option-desc">${escapeHtml(s.description)}</div>
                  <div class="cl-ai-option-action">Bắt đầu →</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 2: Form (hidden initially, shown by clOpenAIForm) -->
          <div id="cl-ai-step-form" style="display:none">
            <div id="cl-ai-form-content"></div>
          </div>

          <!-- Step 3: Loading -->
          <div id="cl-ai-loading" class="cl-ai-loading" style="display:none">
            <div class="spinner"></div> <span id="cl-ai-loading-text">AI đang soạn thảo...</span>
          </div>

          <!-- Step 4: Result -->
          <div id="cl-ai-result" class="cl-ai-result" style="display:none">
            <h4>📝 Kết quả:</h4>
            <div id="cl-ai-result-text" class="cl-ai-result-text" contenteditable="true"></div>
            <div class="cl-ai-result-actions">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.clCopyAIDraft()">📋 Copy</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.clDownloadAIDraft()">📥 Tải xuống</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.clRegenerateAIDraft()">🔄 Tạo lại</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.clSaveAIDraft()">💾 Lưu</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.clCloseAIDraft()">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.remove();
    });

    window._clCurrentDraft = '';
    window._clCurrentType = '';
    window._clFormAnswers = {};
  };

  // ─── Mở form nhập liệu theo loại ───
  window.clOpenAIForm = function(idx) {
    const suggestions = checklist._aiSuggestions;
    if (!suggestions || !suggestions[idx]) return;
    const s = suggestions[idx];
    window._clCurrentType = s.type;

    document.getElementById('cl-ai-step-choose').style.display = 'none';
    document.getElementById('cl-ai-step-form').style.display = '';
    document.getElementById('cl-ai-result').style.display = 'none';
    document.getElementById('cl-ai-loading').style.display = 'none';

    const formContent = document.getElementById('cl-ai-form-content');

    if (s.type === 'study_plan') {
      // Study Plan: show dynamic questions form — khác nhau theo visa type
      const questions = getStudyPlanQuestions();
      const totalQ = questions.length;
      const saved = window._clFormAnswers[s.type] || {};
      formContent.innerHTML = `
        <div class="sp-form">
          <h4>📝 Soạn Study Plan cá nhân hoá</h4>
          <p class="cl-form-desc">Trả lời ${totalQ} câu hỏi để AI có đủ thông tin viết Study Plan thuyết phục. 
          Study Plan càng chi tiết, càng dễ đậu visa!</p>
          
          <div class="sp-progress">
            <div class="sp-progress-text">Đã trả lời: <span id="sp-answered-count">0</span>/${totalQ}</div>
            <div class="sp-progress-bar">
              <div id="sp-answered-fill" class="sp-progress-fill" style="width:0%"></div>
            </div>
          </div>

          ${questions.map((q, i) => `
            <div class="sp-question" data-qid="${q.id}">
              <label class="sp-question-label">${q.label}</label>
              <p class="sp-question-hint">💡 ${escapeHtml(q.hint)}</p>
              <textarea class="sp-question-input" id="sp-${q.id}" data-key="${q.key}" rows="3" 
                placeholder="Nhập câu trả lời của bạn..."
                oninput="window.clTrackSPAnswer()">${escapeHtml(saved[q.key] || '')}</textarea>
            </div>
          `).join('')}

          <div class="sp-actions">
            <button type="button" class="btn btn-primary btn-lg" onclick="window.clSubmitStudyPlan()">
              🤖 Tạo Study Plan từ câu trả lời
            </button>
            <button type="button" class="btn btn-outline" onclick="window.clQuickGenerate()">
              ⚡ Tạo nhanh (bỏ qua câu hỏi)
            </button>
          </div>
        </div>
      `;
      window.clTrackSPAnswer();
    } else {
      // Gap or Rejection: show simple form
      formContent.innerHTML = `
        <div class="sp-form">
          <h4>📝 ${escapeHtml(s.title)}</h4>
          <p class="cl-form-desc">${escapeHtml(s.description)}</p>
          
          <div class="sp-question">
            <label class="sp-question-label">Bạn có muốn bổ sung thêm thông tin gì không?</label>
            <textarea id="cl-ai-extra-info" rows="4" style="width:100%;padding:.65rem .75rem;border:1.5px solid #d1d5db;border-radius:8px;font:inherit;font-size:.9rem;"
              placeholder="Nhập thêm thông tin chi tiết... (tuỳ chọn)"></textarea>
          </div>

          <div class="sp-actions">
            <button type="button" class="btn btn-primary btn-lg" onclick="window.clSubmitSimple()">
              🤖 Soạn ngay
            </button>
          </div>
        </div>
      `;
    }
  };

  // ─── Theo dõi số câu hỏi đã trả lời — linh hoạt theo số lượng câu hỏi ───
  window.clTrackSPAnswer = function() {
    const questions = getStudyPlanQuestions();
    const totalQ = questions.length;
    let answered = 0;
    const answers = {};
    questions.forEach(function(q) {
      const input = document.getElementById('sp-' + q.id);
      if (input && input.value.trim()) {
        answered++;
        answers[q.key] = input.value.trim();
      }
    });
    const count = document.getElementById('sp-answered-count');
    const fill = document.getElementById('sp-answered-fill');
    if (count) count.textContent = String(answered) + '/' + String(totalQ);
    if (fill) fill.style.width = Math.round(answered / totalQ * 100) + '%';
    window._clFormAnswers[window._clCurrentType] = answers;
  };

  // ─── Gửi Study Plan (với câu trả lời) — số câu tối thiểu linh hoạt ───
  window.clSubmitStudyPlan = function() {
    window.clTrackSPAnswer();
    const answers = window._clFormAnswers[window._clCurrentType] || {};
    const questions = getStudyPlanQuestions();
    const totalQ = questions.length;
    const answeredCount = Object.keys(answers).length;
    const minRequired = Math.min(3, Math.ceil(totalQ / 2));
    
    if (answeredCount < minRequired) {
      if (!confirm('Bạn mới trả lời ' + answeredCount + '/' + totalQ + ' câu hỏi. Study Plan sẽ thiếu thông tin. Vẫn tạo?')) return;
    }
    window._clFormAnswers['_studyPlanAnswers'] = answers;
    window.clCallAIGenerate('study_plan', { studyPlanAnswers: answers });
  };

  // ─── Tạo nhanh (không cần trả lời) ───
  window.clQuickGenerate = function() {
    window.clCallAIGenerate('study_plan', {});
  };

  // ─── Gửi đơn giản (gap / rejection) ───
  window.clSubmitSimple = function() {
    const extra = document.getElementById('cl-ai-extra-info');
    const extraText = extra ? extra.value.trim() : '';
    window.clCallAIGenerate(window._clCurrentType, { extraInfo: extraText });
  };

  // ─── Gọi API AI ───
  window.clCallAIGenerate = async function(type, extraData) {
    const formEl = document.getElementById('cl-ai-step-form');
    const loading = document.getElementById('cl-ai-loading');
    const loadingText = document.getElementById('cl-ai-loading-text');
    const result = document.getElementById('cl-ai-result');
    const resultText = document.getElementById('cl-ai-result-text');

    if (formEl) formEl.style.display = 'none';
    if (loading) loading.style.display = '';
    if (loadingText) loadingText.textContent = 'AI đang soạn ' + (type === 'study_plan' ? 'Study Plan' : type === 'gap_explanation' ? 'giải trình' : 'giải trình visa') + '...';
    if (result) result.style.display = 'none';

    try {
      const res = await fetch('/api/deepseek?action=generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          profile: profile,
          visaType: profile.visaType || 'D-4-1',
          extraData: extraData || {}
        }),
      });

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error('Backend API chưa khả dụng. Tính năng AI yêu cầu chạy trên Vercel hoặc cấu hình DEEPSEEK_API_KEY.');
      }

      const data = await res.json();

      if (loading) loading.style.display = 'none';
      if (result) result.style.display = '';

      if (data.success && data.draft) {
        const formatted = (data.draft || '').replace(/\n/g, '<br>');
        if (resultText) resultText.innerHTML = formatted;
        window._clCurrentDraft = data.draft;
        window._clCurrentType = type;
        
        // Auto-save draft to checklist
        if (checklist) {
          if (!checklist._aiDrafts) checklist._aiDrafts = {};
          checklist._aiDrafts[type] = data.draft;
          saveData();
        }
        
        toast('✅ Đã tạo ' + (type === 'study_plan' ? 'Study Plan' : 'bản giải trình') + ' thành công!');
      } else {
        if (resultText) resultText.textContent = '❌ ' + (data.error || 'Lỗi kết nối AI, vui lòng thử lại sau.');
      }
    } catch (err) {
      if (loading) loading.style.display = 'none';
      if (result) result.style.display = '';
      if (resultText) resultText.textContent = '❌ ' + err.message;
    }
  };

  window.clCopyAIDraft = function() {
    if (window._clCurrentDraft) {
      navigator.clipboard.writeText(window._clCurrentDraft);
      toast('📋 Đã copy vào clipboard!');
    }
  };

  window.clDownloadAIDraft = function() {
    if (!window._clCurrentDraft) return;
    const type = window._clCurrentType || 'draft';
    const blob = new Blob([window._clCurrentDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type + '-' + new Date().toISOString().split('T')[0] + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast('📥 Đã tải file!');
  };

  window.clSaveAIDraft = function() {
    if (!window._clCurrentDraft) return;
    // Save to checklist data
    if (checklist) {
      if (!checklist._aiDrafts) checklist._aiDrafts = {};
      checklist._aiDrafts[window._clCurrentType] = window._clCurrentDraft;
      saveData();
      toast('💾 Đã lưu bản nháp!');
    }
  };

  window.clRegenerateAIDraft = function() {
    const type = window._clCurrentType || 'study_plan';
    window.clCallAIGenerate(type, window._clFormAnswers['_studyPlanAnswers'] ? { studyPlanAnswers: window._clFormAnswers['_studyPlanAnswers'] } : {});
  };

  window.clCloseAIDraft = function() {
    const overlay = document.querySelector('.cl-ai-overlay');
    if (overlay) overlay.remove();
  };

  // ══════════════════════════════════════════════
  // Study Plan Reviewer — cham diem va goi y cai thien
  // ══════════════════════════════════════════════

  var _spReviewerData = null;

  window.clOpenStudyPlanReviewer = function() {
    var overlay = document.createElement('div');
    overlay.className = 'cl-ai-overlay';
    overlay.innerHTML = `
      <div class="cl-ai-modal cl-ai-modal-wide" style="max-height:90vh">
        <div class="cl-ai-modal-header">
          <h3>📝 Đánh giá Study Plan</h3>
          <button type="button" class="cl-ai-close" onclick="this.closest('.cl-ai-overlay').remove()">&times;</button>
        </div>
        <div class="cl-ai-modal-body">
          <!-- Input step -->
          <div id="spr-step-input">
            <p class="cl-form-desc">Dán Study Plan bạn đã viết (hoặc AI đã tạo) vào đây. Hệ thống sẽ chấm điểm và gợi ý cải thiện.</p>
            <div class="spr-field">
              <label class="spr-label">📄 Study Plan của bạn</label>
              <textarea id="spr-text" class="spr-textarea" rows="10" placeholder="Paste Study Plan của bạn vào đây... (tối thiểu 50 ký tự)"></textarea>
            </div>
            <div class="spr-field">
              <label class="spr-label">🛂 Loại visa</label>
              <select id="spr-visa-type" class="spr-select">
                <option value="D-4-1">D-4-1 (Học tiếng Hàn)</option>
                <option value="D-2">D-2 (Đại học chính quy)</option>
              </select>
            </div>
            <div class="spr-info-box">
              <strong>💡 Mẹo:</strong> Nếu bạn đã khai báo hồ sơ ở bước trước, thông tin cá nhân sẽ được tự động đính kèm
              để AI đánh giá chính xác hơn. Kết quả sẽ bao gồm điểm số, nhận xét và gợi ý cải thiện.
            </div>
            <div class="spr-actions">
              <button type="button" class="btn btn-primary btn-lg" onclick="window.clSubmitReview()">
                🤖 Đánh giá ngay
              </button>
              <button type="button" class="btn btn-outline" onclick="window.clLoadSavedStudyPlan()">
                📂 Dùng Study Plan đã lưu
              </button>
            </div>
          </div>

          <!-- Loading step -->
          <div id="spr-loading" class="cl-ai-loading" style="display:none">
            <div class="spinner"></div> <span>🧠 AI đang phân tích Study Plan...</span>
          </div>

          <!-- Result step -->
          <div id="spr-result" style="display:none">
            <div class="spr-result-header">
              <div class="spr-score-ring">
                <svg viewBox="0 0 36 36" class="spr-circular">
                  <path class="spr-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="spr-circle-fill" id="spr-circle-fill" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <text x="18" y="20.5" class="spr-circle-text" id="spr-circle-text">-</text>
                </svg>
              </div>
              <div class="spr-summary">
                <h3 id="spr-overall-label">Đang phân tích...</h3>
                <p id="spr-overall-desc"></p>
              </div>
            </div>

            <!-- Criteria scores -->
            <div class="spr-criteria" id="spr-criteria"></div>

            <!-- Strengths & Weaknesses -->
            <div class="spr-grid-2">
              <div class="spr-section spr-strengths">
                <h4>✅ Điểm mạnh</h4>
                <ul id="spr-strengths"></ul>
              </div>
              <div class="spr-section spr-weaknesses">
                <h4>⚠️ Điểm yếu</h4>
                <ul id="spr-weaknesses"></ul>
              </div>
            </div>

            <!-- Suggestions -->
            <div class="spr-section spr-suggestions">
              <h4>💡 Gợi ý cải thiện</h4>
              <ol id="spr-suggestions"></ol>
            </div>

            <!-- Actions -->
            <div class="spr-result-actions">
              <button type="button" class="btn btn-outline" onclick="window.clRegenerateStudyPlan()">
                🔄 Tạo lại từ góp ý
              </button>
              <button type="button" class="btn btn-outline" onclick="window.clCopyReviewResult()">
                📋 Copy kết quả
              </button>
              <button type="button" class="btn btn-outline" onclick="window.clCloseReviewer(this)">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.querySelector('.cl-ai-close')?.click();
    });

    // Set default visa type from profile
    if (profile && profile.visaType) {
      var visaSel = document.getElementById('spr-visa-type');
      if (visaSel) visaSel.value = profile.visaType;
    }
  };

  window.clLoadSavedStudyPlan = function() {
    if (!checklist || !checklist._aiDrafts || !checklist._aiDrafts.study_plan) {
      toast('⚠️ Chưa có Study Plan nào được lưu. Hãy dùng AI để tạo Study Plan trước.');
      return;
    }
    var textarea = document.getElementById('spr-text');
    if (textarea) {
      textarea.value = checklist._aiDrafts.study_plan;
      toast('📄 Đã load Study Plan đã lưu!');
    }
  };

  window.clSubmitReview = async function() {
    var textEl = document.getElementById('spr-text');
    var studyPlan = textEl ? textEl.value.trim() : '';
    var visaTypeEl = document.getElementById('spr-visa-type');
    var visaType = visaTypeEl ? visaTypeEl.value : 'D-4-1';

    if (!studyPlan || studyPlan.length < 50) {
      toast('⚠️ Vui lòng nhập Study Plan (tối thiểu 50 ký tự).');
      return;
    }

    var inputStep = document.getElementById('spr-step-input');
    var loadingEl = document.getElementById('spr-loading');
    var resultEl = document.getElementById('spr-result');
    if (inputStep) inputStep.style.display = 'none';
    if (loadingEl) loadingEl.style.display = '';
    if (resultEl) resultEl.style.display = 'none';

    try {
      var token = getStudentToken();
      var fetchFn = window.fetchWithAuth || fetch;

      var res = await fetchFn('/api/deepseek?action=review-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyPlan: studyPlan,
          visaType: visaType,
          profile: profile || {}
        }),
      });

      var data = await res.json();

      if (loadingEl) loadingEl.style.display = 'none';

      if (data.success && data.review) {
        _spReviewerData = {
          studyPlan: studyPlan,
          review: data.review
        };
        renderReviewResult(data.review);
      } else {
        if (inputStep) inputStep.style.display = '';
        toast('❌ ' + (data.error || 'Lỗi kết nối AI, vui lòng thử lại sau.'));
      }
    } catch (err) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (inputStep) inputStep.style.display = '';
      toast('❌ Lỗi: ' + err.message);
    }
  };

  function renderReviewResult(review) {
    var resultEl = document.getElementById('spr-result');
    if (!resultEl) return;
    resultEl.style.display = '';

    var circleFill = document.getElementById('spr-circle-fill');
    var circleText = document.getElementById('spr-circle-text');
    var overallLabel = document.getElementById('spr-overall-label');
    var overallDesc = document.getElementById('spr-overall-desc');

    // Round score to 1 decimal
    var score = Math.round((review.overallScore || 0) * 10) / 10;
    var dashArray = Math.min(score * 10, 100);
    if (circleFill) circleFill.setAttribute('stroke-dasharray', dashArray + ', 100');
    if (circleText) circleText.textContent = score.toString();

    // Color based on score
    var color = '#dc2626'; // < 4: red
    if (score >= 7) color = '#059669'; // >= 7: green
    else if (score >= 5) color = '#d97706'; // >= 5: amber
    if (circleFill) circleFill.setAttribute('stroke', color);

    if (overallLabel) {
      if (score >= 8) overallLabel.textContent = '🌟 Tuyệt vời!';
      else if (score >= 6) overallLabel.textContent = '👍 Khá tốt, có thể cải thiện thêm';
      else if (score >= 4) overallLabel.textContent = '📝 Cần cải thiện nhiều';
      else overallLabel.textContent = '🔴 Cần viết lại';
    }
    if (overallDesc) {
      overallDesc.textContent = 'Study Plan của bạn đạt ' + score + '/10 điểm. Dưới đây là chi tiết từng tiêu chí và gợi ý cải thiện.';
    }

    // Criteria
    var criteriaEl = document.getElementById('spr-criteria');
    if (criteriaEl && review.criteria) {
      criteriaEl.innerHTML = review.criteria.map(function(c) {
        var cScore = Math.min(Math.max(c.score || 0, 0), 10);
        var cPercent = cScore * 10;
        var cColor = '#dc2626';
        if (cScore >= 7) cColor = '#059669';
        else if (cScore >= 5) cColor = '#d97706';
        return `
          <div class="spr-criterion">
            <div class="spr-criterion-head">
              <span class="spr-criterion-name">${escapeHtml(c.name)}</span>
              <span class="spr-criterion-score" style="color:${cColor}">${cScore}/10</span>
            </div>
            <div class="spr-criterion-bar">
              <div class="spr-criterion-fill" style="width:${cPercent}%;background:${cColor}"></div>
            </div>
            <p class="spr-criterion-comment">${escapeHtml(c.comment || '')}</p>
            ${c.suggestion ? '<div class="spr-criterion-suggestion">💡 <strong>Gợi ý:</strong> ' + escapeHtml(c.suggestion) + '</div>' : ''}
          </div>
        `;
      }).join('');
    }

    // Strengths
    var strengthsEl = document.getElementById('spr-strengths');
    if (strengthsEl && review.strengths) {
      strengthsEl.innerHTML = review.strengths.map(function(s) {
        return '<li>' + escapeHtml(s) + '</li>';
      }).join('') || '<li>Chưa có đánh giá</li>';
    }

    // Weaknesses
    var weaknessesEl = document.getElementById('spr-weaknesses');
    if (weaknessesEl && review.weaknesses) {
      weaknessesEl.innerHTML = review.weaknesses.map(function(w) {
        return '<li>' + escapeHtml(w) + '</li>';
      }).join('') || '<li>Chưa có đánh giá</li>';
    }

    // Suggestions
    var suggestionsEl = document.getElementById('spr-suggestions');
    if (suggestionsEl && review.suggestions) {
      suggestionsEl.innerHTML = review.suggestions.map(function(s) {
        return '<li>' + escapeHtml(s) + '</li>';
      }).join('') || '<li>Chưa có gợi ý</li>';
    }

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.clRegenerateStudyPlan = async function() {
    if (!_spReviewerData || !_spReviewerData.studyPlan || !_spReviewerData.review) {
      toast('⚠️ Chưa có kết quả đánh giá. Hãy đánh giá trước.');
      return;
    }

    var resultEl = document.getElementById('spr-result');
    var loadingEl = document.getElementById('spr-loading');
    if (resultEl) resultEl.style.display = 'none';
    if (loadingEl) loadingEl.style.display = '';

    try {
      var suggestions = (_spReviewerData.review.suggestions || []).join('\n- ');
      var prompt = 'Day la Study Plan can cai thien:\n\n' + _spReviewerData.studyPlan + '\n\nCac goi y cai thien:\n- ' + suggestions + '\n\nHay viet LAI Study Plan nay, khac phuc tat ca nhung diem yeu tren. Giu nguyen thong tin ca nhan, nhung viet tot hon.';

      // Use existing AI assist to regenerate
      var fetchFn = window.fetchWithAuth || fetch;
      var res = await fetchFn('/api/deepseek?action=generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'study_plan',
          profile: profile || {},
          visaType: (profile && profile.visaType) || 'D-4-1',
          extraData: { extraInfo: prompt }
        }),
      });
      var data = await res.json();

      if (loadingEl) loadingEl.style.display = 'none';

      if (data.success && data.draft) {
        // Save draft
        if (checklist) {
          if (!checklist._aiDrafts) checklist._aiDrafts = {};
          checklist._aiDrafts['study_plan'] = data.draft;
          saveData();
        }

        // Show the new draft in a sub-modal
        var overlay = document.querySelector('.cl-ai-overlay');
        var draftHtml = document.createElement('div');
        draftHtml.style.cssText = 'margin-top:1rem;padding:1rem;border:2px solid #059669;border-radius:12px;background:#f0fdf4;';
        draftHtml.innerHTML = '<h4 style="color:#059669;margin:0 0 0.5rem">✅ Study Plan da duoc cai thien!</h4>' +
          '<div style="font-size:.9rem;line-height:1.6;white-space:pre-wrap;max-height:400px;overflow-y:auto;margin-bottom:0.75rem">' + escapeHtml(data.draft) + '</div>' +
          '<div style="display:flex;gap:0.5rem">' +
          '<button type="button" class="btn btn-primary btn-sm" onclick="var t=this.parentElement.previousElementSibling.textContent;navigator.clipboard.writeText(t);toast(\'Da copy!\')">📋 Copy</button>' +
          '<button type="button" class="btn btn-outline btn-sm" onclick="this.closest(\'[style]\').remove()">Đóng</button>' +
          '</div>';

        var targetEl = document.querySelector('#spr-result .spr-result-actions');
        if (targetEl) {
          targetEl.parentElement.insertBefore(draftHtml, targetEl);
          toast('✅ Da tao Study Plan cai thien!');
        }
      } else {
        toast('❌ ' + (data.error || 'Khong the tao lai.'));
        if (resultEl) resultEl.style.display = '';
      }
    } catch (err) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (resultEl) resultEl.style.display = '';
      toast('❌ Loi: ' + err.message);
    }
  };

  window.clCopyReviewResult = function() {
    if (!_spReviewerData || !_spReviewerData.review) {
      toast('⚠️ Chua co ket qua.');
      return;
    }
    var r = _spReviewerData.review;
    var text = '=== DANH GIA STUDY PLAN ===\n' +
      'Diem tong: ' + (r.overallScore || '?') + '/10\n\n';
    if (r.criteria) {
      r.criteria.forEach(function(c) {
        text += '• ' + c.name + ': ' + (c.score || '?') + '/10\n  ' + (c.comment || '') + '\n';
      });
    }
    text += '\n=== DIEM MANH ===\n';
    if (r.strengths) r.strengths.forEach(function(s) { text += '• ' + s + '\n'; });
    text += '\n=== DIEM YEU ===\n';
    if (r.weaknesses) r.weaknesses.forEach(function(w) { text += '• ' + w + '\n'; });
    text += '\n=== GOI Y CAI THIEN ===\n';
    if (r.suggestions) r.suggestions.forEach(function(s) { text += '• ' + s + '\n'; });

    navigator.clipboard.writeText(text);
    toast('📋 Da copy ket qua danh gia!');
  };

  window.clCloseReviewer = function(btn) {
    var overlay = btn.closest('.cl-ai-overlay');
    if (overlay) overlay.remove();
  };

  // ══════════════════════════════════════════════
  // Export Checklist — PDF with branding
  // ══════════════════════════════════════════════

  let _pdfLoading = false; // guard against concurrent exports

  // ─── Helper: load external script dynamically ───
  function loadScript(url) {
    return new Promise(function(resolve, reject) {
      // Check if already loaded
      if (document.querySelector('script[src="' + url + '"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = function() { reject(new Error('Không thể tải thư viện PDF: ' + url)); };
      document.head.appendChild(script);
    });
  }

  // ─── Build HTML content for PDF ───
  function buildPDFHtml(progress) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const visaType = checklist.name || 'Du học Hàn Quốc';
    const totalItems = checklist.totalItems || 0;
    let completedItems = 0;
    checklist.modules.forEach(function(mod) {
      mod.items.forEach(function(item) {
        if (item.status === 'completed') completedItems++;
      });
    });

    const statusColors = { pending: '#94a3b8', in_progress: '#f59e0b', completed: '#22c55e', not_applicable: '#94a3b8' };
    const statusLabels = { pending: '⬜ Chưa làm', in_progress: '🔄 Đang làm', completed: '✅ Hoàn thành', not_applicable: '➖ Không áp dụng' };

    let modulesHtml = '';
    for (let mi = 0; mi < checklist.modules.length; mi++) {
      const mod = checklist.modules[mi];
      let itemsHtml = '';
      for (let ii = 0; ii < mod.items.length; ii++) {
        const item = mod.items[ii];
        const statusColor = statusColors[item.status] || '#94a3b8';
        const statusLabel = statusLabels[item.status] || '⬜ Chưa làm';
        const badgeHtml = item.required
          ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#fee2e2;color:#991b1b;margin-right:6px;">BẮT BUỘC</span>'
          : '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#fef3c7;color:#92400e;margin-right:6px;">KK</span>';
        const noteHtml = item.note
          ? '<div style="font-size:10px;color:#64748b;margin-top:3px;padding-left:20px;">📝 ' + escapeHtml(item.note) + '</div>'
          : '';
        const warningHtml = item.warning
          ? '<div style="font-size:10px;color:#92400e;background:#fef3c7;padding:4px 8px;border-radius:6px;margin-top:4px;">⚠️ ' + escapeHtml(item.warning) + '</div>'
          : '';
        itemsHtml += '<tr style="border-bottom:1px solid #e2e8f0;">' +
          '<td style="padding:7px 10px;vertical-align:top;width:24px;text-align:center;">' +
            '<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:' + statusColor + ';"></span>' +
          '</td>' +
          '<td style="padding:7px 10px;vertical-align:top;">' +
            '<div style="font-size:12px;font-weight:600;color:#1e293b;">' + badgeHtml + escapeHtml(item.name) + '</div>' +
            '<div style="font-size:10px;color:#64748b;margin-top:2px;">' + escapeHtml(item.description) + '</div>' +
            warningHtml +
            noteHtml +
          '</td>' +
          '<td style="padding:7px 10px;vertical-align:top;text-align:right;white-space:nowrap;font-size:10px;color:' + statusColor + ';font-weight:600;">' + statusLabel + '</td>' +
        '</tr>';
      }
      modulesHtml += '<div style="margin-bottom:16px;">' +
        '<div style="background:linear-gradient(135deg,#1e3a5f,#2d5a87);color:#fff;padding:10px 14px;border-radius:8px 8px 0 0;font-size:13px;font-weight:700;">' +
          (mod.icon || '📄') + ' ' + escapeHtml(mod.name) +
          ' <span style="font-weight:400;opacity:0.8;font-size:11px;">(' + mod.items.filter(function(it) { return it.status === 'completed'; }).length + '/' + mod.items.length + ')</span>' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 8px 8px;">' +
          itemsHtml +
        '</table>' +
      '</div>';
    }

    // Profile summary
    let profileHtml = '';
    if (profile.fullName || profile.phone || profile.email) {
      profileHtml = '<div style="margin-bottom:16px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">' +
        '<div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:6px;">👤 Hồ sơ</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:11px;">';
      if (profile.fullName) profileHtml += '<tr><td style="padding:2px 8px;color:#64748b;width:100px;">Họ tên</td><td style="padding:2px 8px;font-weight:600;">' + escapeHtml(profile.fullName) + '</td></tr>';
      if (profile.phone) profileHtml += '<tr><td style="padding:2px 8px;color:#64748b;">Điện thoại</td><td style="padding:2px 8px;">' + escapeHtml(profile.phone) + '</td></tr>';
      if (profile.email) profileHtml += '<tr><td style="padding:2px 8px;color:#64748b;">Email</td><td style="padding:2px 8px;">' + escapeHtml(profile.email) + '</td></tr>';
      if (profile.visaType) profileHtml += '<tr><td style="padding:2px 8px;color:#64748b;">Visa</td><td style="padding:2px 8px;font-weight:600;">' + escapeHtml(profile.visaType) + '</td></tr>';
      profileHtml += '</table></div>';
    }

    return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>' +
        '@page { margin: 0; }' +
        'body { font-family: "Be Vietnam Pro", Arial, Helvetica, sans-serif; color: #1e293b; margin: 0; padding: 0; }' +
        '.pdf-header { background: linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%); color: #fff; padding: 24px 28px 20px; }' +
        '.pdf-header h1 { margin: 0; font-size: 20px; font-weight: 800; }' +
        '.pdf-header p { margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.8); }' +
        '.pdf-body { padding: 20px 24px; }' +
        '.pdf-footer { text-align: center; padding: 12px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 20px; }' +
        '.progress-pill { display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,0.18);font-size:13px;font-weight:700;margin-top:8px;}' +
      '</style>' +
      '</head><body>' +
      '<div class="pdf-header">' +
        '<h1>📋 Checklist cá nhân hoá</h1>' +
        '<p>' + escapeHtml(visaType) + ' — ' + dateStr + '</p>' +
        '<div class="progress-pill">' +
          completedItems + '/' + totalItems + ' hoàn thành · ' + progress + '%' +
        '</div>' +
      '</div>' +
      '<div class="pdf-body">' +
        profileHtml +
        modulesHtml +
      '</div>' +
      '<div class="pdf-footer">' +
        'Tạo bởi Thông Tin Trường Hàn · thongtintruonghan.vercel.app' +
      '</div>' +
      '</body></html>';
  }

  // ─── Export to PDF ───
  window.clExportChecklist = async function() {
    if (!checklist) return;
    if (_pdfLoading) {
      toast('⏳ Đang tạo PDF, vui lòng đợi...');
      return;
    }
    _pdfLoading = true;

    const progress = window.calculateChecklistProgress(checklist);
    toast('🔄 Đang tạo PDF...');
    let container = null;

    try {
      // Load html2pdf.js library from CDN
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');

      // Build HTML content
      const htmlContent = buildPDFHtml(progress);

      // Create off-screen container
      container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;background:#fff;z-index:-1;';
      document.body.appendChild(container);

      const opt = {
        margin:       [8, 10, 8, 10],
        filename:     'checklist-' + (profile.visaType || 'visa') + '-' + new Date().toISOString().split('T')[0] + '.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await window.html2pdf().set(opt).from(container).save();
      toast('✅ Đã tải PDF — ' + opt.filename);
    } catch (err) {
      console.error('PDF export error:', err);
      toast('❌ Lỗi tạo PDF: ' + (err.message || 'Không xác định'));

      // Fallback: copy text to clipboard
      let fallbackText = '📋 CHECKLIST CÁ NHÂN HOÁ\n';
      fallbackText += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      fallbackText += 'Loại visa: ' + checklist.name + '\n';
      fallbackText += 'Tổng tiến độ: ' + progress + '%\n';
      fallbackText += 'Ngày tạo: ' + new Date().toLocaleDateString('vi-VN') + '\n\n';
      for (let mi = 0; mi < checklist.modules.length; mi++) {
        const mod = checklist.modules[mi];
        fallbackText += '\n## ' + (mod.icon || '') + ' ' + mod.name + '\n';
        fallbackText += '─'.repeat(30) + '\n';
        for (let ii = 0; ii < mod.items.length; ii++) {
          const item = mod.items[ii];
          const sMap = { pending: '⬜', in_progress: '🔄', completed: '✅', not_applicable: '➖' };
          fallbackText += (sMap[item.status] || '⬜') + ' ' + (item.required ? '[BẮT BUỘC]' : '[KK]') + ' ' + item.name + '\n';
          if (item.note) fallbackText += '   📝 ' + item.note + '\n';
        }
      }
      fallbackText += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      fallbackText += 'Tạo bởi: Thông Tin Trường Hàn\n';
      fallbackText += 'thongtintruonghan.vercel.app\n';

      try {
        await navigator.clipboard.writeText(fallbackText);
        toast('📋 Đã copy nội dung vào clipboard (thay thế PDF)');
      } catch (e) {
        const blob = new Blob([fallbackText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'checklist-' + (profile.visaType || 'visa') + '.txt';
        a.click();
        URL.revokeObjectURL(url);
        toast('📋 Đã tải file text thay thế');
      }
    } finally {
      // Clean up off-screen container
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
      _pdfLoading = false;
    }
  };

  // ══════════════════════════════════════════════
  // Auto Reminder from Checklist
  // ══════════════════════════════════════════════

  // ─── Map documentType → reminder_type ───
  // Includes both D-4-1 and D-2 aliases
  const DOC_REMINDER_MAP = {
    // Health
    'tb_test': 'health_check',
    'health_check': 'health_check',
    'health': 'health_check', // D-2 alias
    // Visa / Submission
    'kvac_booking': 'visa_appointment',
    'kvac': 'visa_appointment', // D-2 alias
    'submission': 'submission',
    'result_tracking': 'other',
    'tracking': 'other', // D-2 alias
    // Finance
    'savings_book': 'document',
    'bank_statement': 'document',
    'sponsorship_letter': 'document',
    'sponsorship': 'document', // D-2 alias
    'income_proof': 'document',
    'relationship_proof': 'document',
    'relationship': 'document', // D-2 alias
    'self_income_proof': 'document',
    'asset_proof': 'document',
    'k_study_account': 'document',
    'notarized': 'document', // D-2 alias
    // School
    'admission_letter': 'submission',
    'tuition_invoice': 'document',
    'school_business_registration': 'document',
    // Education
    'diploma': 'document',
    'transcript': 'document',
    'gap_explanation': 'document',
    'study_plan': 'document',
    'personal_statement': 'document',
    'recommendation_letter': 'document',
    'topik_certificate': 'document',
    'topik_optional': 'document', // D-4-1 optional
    'korean_certificate': 'document',
    'university_diploma': 'document',
    'uni_diploma': 'document', // D-2 alias
    'university_transcript': 'document',
    'uni_transcript': 'document', // D-2 alias
    'language_cert': 'document',
    // Identity
    'passport': 'document',
    'photo': 'document',
    'id_card': 'document',
    'birth_certificate': 'document',
    'household_registration': 'document',
    'visa_application_form': 'document',
    'visa_form': 'document', // D-2 alias
    'criminal_record_check': 'document',
    'criminal_record': 'document', // D-2 alias
    // Legalization
    'translate_all': 'document',
    'notarize_translation': 'document',
    'mofa_certification': 'document',
    'consular_legalization': 'document',
    // Other
    'insurance': 'document',
    'work_contract': 'document',
    'previous_visa_dossier': 'document',
    'visa_rejection_explanation': 'document',
    'rejection_explain': 'document', // D-2 alias
    'illegal_relative_explanation': 'document',
    'illegal_relative': 'document', // D-2 alias
    // D4→D2
    'completion_cert': 'document',
    'korean_transcript': 'document',
    'arc_copy': 'document',
    'change_form': 'submission',
    'finance_proof': 'document',
    'program_intro': 'document',
    'prep_course': 'document',
  };

  // ─── Suggested deadlines (days from now) ───
  function getSuggestedDays(docType) {
    const map = {
      'kvac_booking': 7,
      'kvac': 7,
      'health_check': 14,
      'health': 14,
      'tb_test': 14,
      'insurance': 14,
      'study_plan': 14,
      'personal_statement': 14,
      'gap_explanation': 14,
      'visa_rejection_explanation': 14,
      'rejection_explain': 14,
      'submission': 30,
      'change_form': 30,
      'admission_letter': 30,
      'diploma': 30,
      'transcript': 30,
      'savings_book': 60,
      'bank_statement': 45,
      'notarized_translation': 60,
      'translate_all': 60,
      'notarize_translation': 60,
      'mofa_certification': 45,
      'consular_legalization': 30,
    };
    return map[docType] || 30;
  }

  // ─── Auto Reminder modal ───
  window.clAutoReminders = function() {
    if (!checklist) return;
    
    // Check login
    var token = getStudentToken();
    if (!token) {
      toast('🔒 Vui lòng đăng nhập để sử dụng nhắc nhở!');
      return;
    }

    // Collect reminder-worthy items (skip ALERT warnings + already completed)
    var reminderItems = [];
    for (var mi = 0; mi < checklist.modules.length; mi++) {
      var mod = checklist.modules[mi];
      for (var ii = 0; ii < mod.items.length; ii++) {
        var item = mod.items[ii];
        // Skip: ALERT items (general_warning), already completed, not_applicable
        if (item.documentType === 'general_warning') continue;
        if (item.status === 'completed' || item.status === 'not_applicable') continue;
        
        var remType = DOC_REMINDER_MAP[item.documentType];
        if (!remType) continue; // Unknown type, skip
        
        var days = getSuggestedDays(item.documentType);
        var suggestedDate = new Date();
        suggestedDate.setDate(suggestedDate.getDate() + days);
        
        reminderItems.push({
          id: item.id,
          name: item.name,
          docType: item.documentType,
          remType: remType,
          suggestedDate: suggestedDate.toISOString().split('T')[0],
          selected: true
        });
      }
    }

    if (reminderItems.length === 0) {
      toast('✅ Không có mục nào cần tạo nhắc nhở!');
      return;
    }

    // Build modal
    var overlay = document.createElement('div');
    overlay.className = 'cl-ai-overlay';
    overlay.innerHTML = `
      <div class="cl-ai-modal cl-ai-modal-wide">
        <div class="cl-ai-modal-header">
          <h3>⏰ Tạo nhắc nhở từ checklist</h3>
          <button type="button" class="cl-ai-close" onclick="this.closest('.cl-ai-overlay').remove()">&times;</button>
        </div>
        <div class="cl-ai-modal-body">
          <p style="color:#64748b;font-size:.85rem;margin-bottom:1rem;">
            Chọn các mục bạn muốn tạo nhắc nhở. Ngày hạn đã được gợi ý dựa trên từng loại giấy tờ — bạn có thể điều chỉnh.
          </p>
          <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
            <button type="button" class="btn btn-sm btn-primary" onclick="window._rmSelectAll(true)">Chọn tất cả</button>
            <button type="button" class="btn btn-sm btn-outline" onclick="window._rmSelectAll(false)">Bỏ chọn</button>
          </div>
          <div id="rm-item-list" style="max-height:350px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${reminderItems.map(function(item, idx) {
              var remLabels = { document: '📄 Giấy tờ', submission: '📨 Nộp hồ sơ', interview: '🎤 Phỏng vấn', health_check: '🏥 Khám sức khoẻ', visa_appointment: '🛂 Hẹn visa', other: '📌 Khác' };
              var label = remLabels[item.remType] || item.remType;
              return '<div class="rm-item" data-idx="' + idx + '" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;">' +
                '<input type="checkbox" class="rm-checkbox" checked data-idx="' + idx + '" style="width:18px;height:18px;accent-color:#1e3a5f;">' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="font-size:.85rem;font-weight:600;color:#1e293b;">' + escapeHtml(item.name) + '</div>' +
                  '<div style="font-size:.75rem;color:#64748b;margin-top:2px;">' + label + '</div>' +
                '</div>' +
                '<input type="date" class="rm-date" value="' + item.suggestedDate + '" data-idx="' + idx + '" style="padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;font:inherit;font-size:.8rem;flex:0 0 auto;width:140px;">' +
              '</div>';
            }).join('')}
          </div>
          <div style="display:flex;gap:10px;margin-top:1rem;">
            <button type="button" class="btn btn-primary btn-lg" id="rm-create-btn" onclick="window._rmCreateAll()">
              ✨ Tạo ${reminderItems.length} nhắc nhở
            </button>
            <button type="button" class="btn btn-outline" onclick="this.closest('.cl-ai-overlay').remove()">Huỷ</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Store reference for the create function
    window._rmItems = reminderItems;

    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.remove();
    });
  };

  // ─── Select all / none ───
  window._rmSelectAll = function(select) {
    document.querySelectorAll('.rm-checkbox').forEach(function(cb) {
      cb.checked = select;
    });
  };

  // ─── Create reminders ───
  window._rmCreateAll = async function() {
    var btn = document.getElementById('rm-create-btn');
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = '⏳ Đang tạo...';

    var items = window._rmItems || [];
    var checkboxes = document.querySelectorAll('.rm-checkbox');
    var dates = document.querySelectorAll('.rm-date');
    var selected = [];

    checkboxes.forEach(function(cb, idx) {
      if (cb.checked) {
        var dateInput = dates[idx];
        selected.push({
          item: items[idx],
          dueDate: dateInput ? dateInput.value : items[idx].suggestedDate
        });
      }
    });

    if (selected.length === 0) {
      toast('⚠️ Chưa chọn mục nào.');
      btn.disabled = false;
      btn.textContent = '✨ Tạo nhắc nhở';
      return;
    }

    var success = 0;
    var failed = 0;
    var token = getStudentToken();

    for (var i = 0; i < selected.length; i++) {
      var s = selected[i];
      var dueDate = s.dueDate;
      if (!dueDate) {
        failed++;
        continue;
      }

      try {
        var fetchFn = window.fetchWithAuth || fetch;
        var res = await fetchFn('/api/auth/student?action=reminders-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: s.item.name,
            dueDate: dueDate,
            reminderType: s.item.remType
          })
        });
        var data = await res.json();
        if (data.success) {
          success++;
        } else {
          failed++;
        }
      } catch (e) {
        failed++;
      }
    }

    // Close modal
    var overlay = document.querySelector('.cl-ai-overlay');
    if (overlay) overlay.remove();

    toast('✅ Đã tạo ' + success + '/' + selected.length + ' nhắc nhở' + (failed > 0 ? ' (' + failed + ' lỗi)' : ''));
  };

  // ══════════════════════════════════════════════
  // Navigation Helpers
  // ══════════════════════════════════════════════
  window.clNextStep = function() {
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep();
      renderStepIndicator();
    }
  };

  window.clPrevStep = function() {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
      renderStepIndicator();
    }
  };

  // ══════════════════════════════════════════════
  // Event Binding
  // ══════════════════════════════════════════════
  function bindEvents() {
    // Visa rejection radio toggles detail field
    document.addEventListener('change', function(e) {
      if (e.target.name === 'cl-visa-fail') {
        const detail = document.getElementById('cl-rejection-detail');
        if (detail) detail.style.display = e.target.value === 'true' ? '' : 'none';
      }
      if (e.target.name === 'cl-work') {
        const fields = document.getElementById('cl-work-fields');
        if (fields) fields.style.display = e.target.value === 'true' ? '' : 'none';
      }

      // Doc status select change (kept for backward compat)
      if (e.target.classList.contains('cl-doc-status-select')) {
        const itemId = e.target.dataset.itemId;
        const newStatus = e.target.value;
        updateDocStatus(itemId, newStatus);
      }
    });

    // Click doc status step to advance status
    document.addEventListener('click', function(e) {
      const step = e.target.closest('.cl-doc-step');
      if (step) {
        const itemEl = step.closest('.cl-item');
        if (!itemEl) return;
        // Don't allow clicking status steps on school-issued items
        const itemId = itemEl.dataset.itemId;
        if (!itemId) return;
        // Find the item and check if it's school-sourced
        let isSchoolSource = false;
        if (checklist) {
          for (const mod of checklist.modules) {
            const item = mod.items.find(i => i.id === itemId);
            if (item) {
              isSchoolSource = item.source === 'school';
              break;
            }
          }
        }
        if (isSchoolSource) return;
        const targetStatus = step.dataset.docStatus;
        if (targetStatus) updateDocStatus(itemId, targetStatus);
      }
    });

    // File upload button click
    document.addEventListener('click', function(e) {
      const uploadBtn = e.target.closest('.cl-doc-upload-btn');
      if (uploadBtn) {
        e.preventDefault();
        const itemId = uploadBtn.dataset.itemId;
        const fileInput = document.querySelector(`.cl-doc-file-input[data-item-id="${itemId}"]`);
        if (fileInput) fileInput.click();
      }
    });

    // File input change → upload
    document.addEventListener('change', function(e) {
      const fileInput = e.target.closest('.cl-doc-file-input');
      if (!fileInput || !fileInput.files || !fileInput.files[0]) return;

      const itemId = fileInput.dataset.itemId;
      const file = fileInput.files[0];
      handleFileUpload(itemId, file, fileInput);
    });
  }

  // ══════════════════════════════════════════════
  // Document Status + Upload
  // ══════════════════════════════════════════════

  function updateDocStatus(itemId, newStatus) {
    if (!checklist) return;
    for (const mod of checklist.modules) {
      const item = mod.items.find(i => i.id === itemId);
      if (item) {
        item.docStatus = newStatus;
        // Auto-update main status based on doc readiness
        if (newStatus === 'notarized') item.status = 'completed';
        else if (newStatus !== 'not_ready' && item.status === 'pending') item.status = 'in_progress';
        break;
      }
    }
    saveData();
    renderModule(getCurrentModuleIdx());
    updateProgressFromDocs();
  }

  // ─── Quick-action: đánh dấu đã dịch thuật ───
  window.clMarkTranslated = function(itemId) {
    if (!checklist) return false;
    for (const mod of checklist.modules) {
      const item = mod.items.find(i => i.id === itemId);
      if (item) {
        item.docStatus = 'translated';
        if (item.status === 'pending') item.status = 'in_progress';
        break;
      }
    }
    saveData();
    renderModule(getCurrentModuleIdx());
    updateProgressFromDocs();
    toast('📄 Đã đánh dấu "Đã dịch thuật" ✓');
    return true;
  };

  // ─── Quick-action: đánh dấu sẵn sàng ngay (bỏ qua bước dịch) ───
  window.clMarkReady = function(itemId) {
    if (!checklist) return false;
    // Cập nhật trực tiếp cả docStatus + status
    for (const mod of checklist.modules) {
      const item = mod.items.find(i => i.id === itemId);
      if (item) {
        item.docStatus = 'notarized';
        item.status = 'completed';
        break;
      }
    }
    saveData();
    renderModule(getCurrentModuleIdx());
    updateProgressFromDocs();
    toast('✅ Giấy tờ đã hoàn thành (Sẵn sàng)!');
    return true;
  };

  function getCurrentModuleIdx() {
    const active = document.querySelector('.cl-module-tab.active');
    return active ? parseInt(active.dataset.moduleIdx) : 0;
  }

  async function handleFileUpload(itemId, file, fileInputEl) {
    const token = getStudentToken();
    if (!token) {
      toast('Vui lòng đăng nhập để upload file');
      if (fileInputEl) fileInputEl.value = '';
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async function(evt) {
      const base64 = evt.target.result.split(',')[1];
      const docType = itemId;

      try {
        const fetchFn = window.fetchWithAuth || fetch;
        const res = await fetchFn('/api/auth/student?action=document-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            docType: docType,
            fileName: file.name,
            fileBase64: base64,
          }),
        });
        const data = await res.json();

        if (data.success) {
          // Save file info to checklist item
          for (const mod of checklist.modules) {
            const item = mod.items.find(i => i.id === itemId);
            if (item) {
              item.fileUrl = data.fileUrl || '';
              item.fileName = file.name;
              item.docStatus = data.fileUrl ? 'ready' : 'not_ready';
              if (item.status === 'pending' && data.fileUrl) item.status = 'in_progress';
              break;
            }
          }
          saveData();
          renderModule(getCurrentModuleIdx());
          updateProgressFromDocs();
          if (data.warning) {
            toast('⚠️ ' + data.warning);
          } else {
            toast('✅ Upload thành công: ' + escapeHtml(file.name));
          }
        } else {
          toast('❌ Upload thất bại: ' + (data.error || 'Lỗi không xác định'));
        }
        if (fileInputEl) fileInputEl.value = '';
      } catch (err) {
        toast('❌ Lỗi kết nối: ' + err.message);
        if (fileInputEl) fileInputEl.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

  function updateProgressFromDocs() {
    const progress = window.calculateChecklistProgress(checklist);
    const circleFill = document.querySelector('.cl-circle-fill');
    const circleText = document.querySelector('.cl-circle-text');
    if (circleFill) circleFill.setAttribute('stroke-dasharray', progress + ', 100');
    if (circleText) circleText.textContent = progress + '%';
    // Update module tab counts
    if (checklist) {
      checklist.modules.forEach(function(mod, i) {
        const tab = document.querySelector('.cl-module-tab[data-module-idx="' + i + '"] .cl-module-count');
        if (tab) tab.textContent = mod.items.filter(function(it) { return it.status === 'completed'; }).length + '/' + mod.items.length;
      });
    }
  }

  // ══════════════════════════════════════════════
  // Escape HTML helper
  // ══════════════════════════════════════════════
  function escapeHtml(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    if (typeof str !== 'string') return str ?? '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Toast ───
  function toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:99999;background:#1e3a5f;color:#fff;padding:12px 28px;border-radius:12px;font-weight:600;font-size:.9rem;box-shadow:0 8px 32px rgba(0,0,0,0.3);transition:all .3s;opacity:0;';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; });
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2500);
  }

  // ─── Export ───
  window.renderChecklistApp = renderApp;
})();
