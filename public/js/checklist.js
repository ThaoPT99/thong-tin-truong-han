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
    saveData();
    window.clNextStep();
  };

  // ══════════════════════════════════════════════
  // STEP 2: Education
  // ══════════════════════════════════════════════
  function renderEducationForm(container) {
    const d = profile;
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
            <label><input type="radio" name="cl-has-topik" value="true" ${d.hasTopik ? 'checked' : ''} onchange="profile.hasTopik = true"> Có</label>
            <label><input type="radio" name="cl-has-topik" value="false" ${d.hasTopik === false ? 'checked' : ''} onchange="profile.hasTopik = false"> Chưa</label>
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

    // Calculate gap years
    if (profile.graduationYear) {
      const currentYear = new Date().getFullYear();
      profile.gapYears = Math.max(0, (currentYear - profile.graduationYear));
    }

    saveData();
    window.clNextStep();
  };

  // ══════════════════════════════════════════════
  // STEP 3: Finance
  // ══════════════════════════════════════════════
  function renderFinanceForm(container) {
    const d = profile;
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
          <p class="cl-hint">Tối thiểu 10,000 USD (~250 triệu VND) cho D-4-1. Có thể cao hơn tuỳ trường.</p>
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
            ${(profile.savingsAmount < 10000) ? '<li>🔴 Sổ tiết kiệm dưới 10,000 USD — cần tăng lên mức tối thiểu</li>' : ''}
            ${!profile.hasLaborContract && profile.hasWorkExperience ? '<li>🟡 Đã đi làm nhưng không có HĐLĐ — cần giấy xác nhận khác</li>' : ''}
            ${(profile.gpa && profile.gpa >= 7) ? '<li>✅ GPA tốt — điểm mạnh trong hồ sơ</li>' : ''}
            ${(profile.koreanLevel && profile.koreanLevel !== 'none') ? '<li>✅ Đã có nền tảng tiếng Hàn — lợi thế</li>' : ''}
            ${profile.hasIllegalRelative ? '<li>🔴 Người thân cư trú bất hợp pháp — rủi ro cao, cần tư vấn riêng</li>' : ''}
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
        <!-- Document tracking row -->
        <div class="cl-item-doc-tracking">
          <div class="cl-doc-status-bar">                ${['not_ready', 'ready', 'translated', 'notarized'].map((s, i) => {
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
          </div>
        </div>
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
      suggestions.push({
        type: 'gap_explanation',
        title: 'Viết giải trình khoảng trống thời gian',
        description: `Bạn đã tốt nghiệp ${profile.graduationYear || 'cách đây'} ${profile.gapYears} năm. Cần giải trình rõ: đã làm gì trong thời gian này, tại sao chưa đi du học sớm hơn.`
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
  // AI Assist Modal
  // ══════════════════════════════════════════════
  window.clOpenAIAssist = function() {
    if (!checklist || !checklist._aiSuggestions || checklist._aiSuggestions.length === 0) {
      alert('Chưa có gợi ý AI nào cho hồ sơ của bạn. Hãy hoàn thành bước khai báo trước.');
      return;
    }

    const suggestions = checklist._aiSuggestions;

    // Simple modal-style overlay
    const overlay = document.createElement('div');
    overlay.className = 'cl-ai-overlay';
    overlay.innerHTML = `
      <div class="cl-ai-modal">
        <div class="cl-ai-modal-header">
          <h3>🤖 AI hỗ trợ soạn thảo</h3>
          <button type="button" class="cl-ai-close" onclick="this.closest('.cl-ai-overlay').remove()">&times;</button>
        </div>
        <div class="cl-ai-modal-body">
          <p>Chọn loại giấy tờ bạn muốn AI hỗ trợ soạn thảo:</p>
          <div class="cl-ai-options">
            ${suggestions.map((s, i) => `
              <div class="cl-ai-option" onclick="window.clRequestAIDraft(${i}, this)">
                <div class="cl-ai-option-title">${escapeHtml(s.title)}</div>
                <div class="cl-ai-option-desc">${escapeHtml(s.description)}</div>
                <div class="cl-ai-option-action">Soạn ngay →</div>
              </div>
            `).join('')}
          </div>
          <div id="cl-ai-result" class="cl-ai-result" style="display:none">
            <h4>Kết quả:</h4>
            <div id="cl-ai-result-text" class="cl-ai-result-text"></div>
            <div class="cl-ai-result-actions">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.clCopyAIDraft()">📋 Copy</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.clCloseAIDraft()">Đóng</button>
            </div>
          </div>
          <div id="cl-ai-loading" class="cl-ai-loading" style="display:none">
            <div class="spinner"></div> AI đang soạn thảo...
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.remove();
    });

    window._clCurrentDraft = '';
  };

  window.clRequestAIDraft = async function(idx, el) {
    const suggestions = checklist._aiSuggestions;
    if (!suggestions || !suggestions[idx]) return;

    const s = suggestions[idx];
    const loading = document.getElementById('cl-ai-loading');
    const result = document.getElementById('cl-ai-result');
    const resultText = document.getElementById('cl-ai-result-text');
    const options = document.querySelector('.cl-ai-options');
    if (options) options.style.display = 'none';

    if (loading) loading.style.display = '';
    if (result) result.style.display = 'none';

    try {
      const res = await fetch('/api/deepseek?action=generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: s.type,
          profile: profile,
          visaType: profile.visaType || 'D-4-1'
        }),
      });

      // Kiểm tra response có phải JSON không (nếu không → backend chưa hoạt động)
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
      toast('Đã copy bản nháp vào clipboard!');
    }
  };

  window.clCloseAIDraft = function() {
    const overlay = document.querySelector('.cl-ai-overlay');
    if (overlay) overlay.remove();
  };

  // ══════════════════════════════════════════════
  // Export Checklist
  // ══════════════════════════════════════════════
  window.clExportChecklist = function() {
    if (!checklist) return;

    const progress = window.calculateChecklistProgress(checklist);
    let text = `📋 CHECKLIST CÁ NHÂN HOÁ\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Loại visa: ${checklist.name}\n`;
    text += `Tổng tiến độ: ${progress}%\n`;
    text += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    for (const mod of checklist.modules) {
      text += `\n## ${mod.icon} ${mod.name}\n`;
      text += `${'─'.repeat(30)}\n`;
      for (const item of mod.items) {
        const statusMap = { pending: '⬜', in_progress: '🔄', completed: '✅', not_applicable: '➖' };
        const status = statusMap[item.status] || '⬜';
        text += `${status} ${item.required ? '[BẮT BUỘC]' : '[KK]'} ${item.name}\n`;
        if (item.note) text += `   📝 ${item.note}\n`;
      }
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Tạo bởi: Thông Tin Trường Hàn\n`;
    text += `thongtintruonghan.vercel.app\n`;

    navigator.clipboard.writeText(text).then(() => {
      toast('✅ Đã copy checklist vào clipboard!');
    }).catch(() => {
      // Fallback: create a downloadable text file
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist-${profile.visaType || 'visa'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast('✅ Đã tải file checklist!');
    });
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
              item.fileUrl = data.fileUrl;
              item.fileName = file.name;
              item.docStatus = 'ready';
              if (item.status === 'pending') item.status = 'in_progress';
              break;
            }
          }
          saveData();
          renderModule(getCurrentModuleIdx());
          updateProgressFromDocs();
          toast('✅ Upload thành công: ' + escapeHtml(file.name));
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
