// application.js — Application Form multi-step cho du học Hàn Quốc
// Tích hợp với hệ thống SCHOOLS_DATA hiện có

(function() {
  'use strict';

  // ─── Steps ───
  const STEPS = [
    { id: 'personal', label: 'Cá nhân', icon: '👤' },
    { id: 'education', label: 'Học vấn', icon: '🎓' },
    { id: 'korean', label: 'Tiếng Hàn', icon: '🇰🇷' },
    { id: 'family', label: 'Gia đình', icon: '👨‍👩‍👧‍👦' },
    { id: 'school', label: 'Trường', icon: '🏫' },
    { id: 'documents', label: 'Hồ sơ', icon: '📄' },
    { id: 'review', label: 'Xác nhận', icon: '✅' },
  ];

  let currentStep = 0;
  let formData = {};
  let documentFiles = {};
  let isSubmitting = false;
  let selectedSchoolFormUrl = ''; // URL mẫu đơn của trường đã chọn

  // ─── Initialize form data with defaults ───
  function getDefaultData() {
    return {
      // Personal
      fullName: '',
      fullNameKr: '',
      fullNameEn: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Vietnam',
      passportNo: '',
      passportExpiry: '',
      phone: '',
      email: '',
      address: '',

      // Education
      highSchoolName: '',
      highSchoolAddress: '',
      highSchoolStart: '',
      highSchoolEnd: '',
      highSchoolMajor: '',
      highSchoolGpa: '',
      highSchoolAbsences: '0',
      highSchoolStatus: 'graduated',
      universityName: '',
      universityMajor: '',
      universityStart: '',
      universityEnd: '',
      universityGpa: '',
      universityDegree: '',

      // Korean
      koreanLevel: 'none',
      topikLevel: '',
      koreanEducation: '',

      // Family
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',

      // School
      schoolId: '',
      semesterId: '',
    };
  }

  // ─── Render ───
  function renderApp(container) {
    if (!container) return;
    if (container.dataset.applicationReady === 'true') return;
    container.dataset.applicationReady = 'true';

    formData = getDefaultData();

    container.innerHTML = `
      <section class="application-view">
        <div class="application-hero">
          <div>
            <p class="advisor-kicker">Visa D2-6</p>
            <h2>Đơn đăng ký nhập học</h2>
            <p>Hoàn thành form này để gửi hồ sơ đăng ký nhập học vào trường Hàn Quốc. Thông tin sẽ được admin xem xét và phản hồi.</p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="application-progress" id="app-progress">
          <div class="progress-steps" id="progress-steps"></div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" id="progress-fill"></div>
          </div>
          <div class="progress-label" id="progress-label">Bước 1 / 7: Thông tin cá nhân</div>
        </div>

        <!-- Form -->
        <form id="application-form" class="application-form" novalidate>
          <div id="app-step-content" class="app-step-content"></div>
          
          <!-- Navigation buttons -->
          <div class="app-nav-buttons">
            <button type="button" class="btn btn-outline" id="app-prev-btn" onclick="window.appPrevStep()">
              ← Quay lại
            </button>
            <span id="app-step-error" class="app-step-error"></span>
            <button type="button" class="btn btn-primary btn-lg" id="app-next-btn" onclick="window.appNextStep()">
              Tiếp theo →
            </button>
            <button type="submit" class="btn btn-primary btn-lg" id="app-submit-btn" style="display:none">
              📨 Gửi đơn đăng ký
            </button>
          </div>
        </form>

        <!-- Success screen (hidden) -->
        <div id="app-success" class="app-success" style="display:none">
          <div class="app-success-icon">✅</div>
          <h2>Đơn đăng ký đã được gửi!</h2>
          <p>Cảm ơn bạn đã gửi đơn đăng ký. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.</p>
          <div class="app-success-id" id="app-success-id"></div>
          <button type="button" class="btn btn-primary btn-lg" onclick="window.appResetForm()">
            📝 Gửi đơn mới
          </button>
        </div>
      </section>
    `;

    // Expose functions globally
    window.appNextStep = nextStep;
    window.appPrevStep = prevStep;
    window.appResetForm = resetForm;
    window.appSelectSchool = selectSchool;

    renderStepIndicator();
    renderStep(0);
    bindFormEvents(container);
  }

  function renderStepIndicator() {
    const container = document.getElementById('progress-steps');
    if (!container) return;

    const isDone = (idx) => idx < currentStep;
    container.innerHTML = STEPS.map((step, i) => {
      const isActive = i === currentStep;
      const done = isDone(i);
      const clickable = done || isActive;
      return `
        <div class="progress-step ${isActive ? 'active' : ''} ${done ? 'done' : ''} ${clickable ? 'clickable' : ''}" 
             onclick="${clickable ? 'window.appGoToStep('+i+')' : ''}" data-step="${i}">
          <div class="step-circle">${done ? '✓' : step.icon}</div>
          <div class="step-label">${step.label}</div>
        </div>
      `;
    }).join('');

    updateProgress();
  }

  function updateProgress() {
    const fill = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    if (fill) fill.style.width = ((currentStep + 1) / STEPS.length * 100) + '%';
    if (label) label.textContent = `Bước ${currentStep + 1} / ${STEPS.length}: ${STEPS[currentStep].label}`;
    
    // Update step indicators
    document.querySelectorAll('.progress-step').forEach(el => {
      const idx = parseInt(el.dataset.step);
      el.classList.toggle('active', idx === currentStep);
      el.classList.toggle('done', idx < currentStep);
    });
  }

  function renderStep(stepIndex) {
    const content = document.getElementById('app-step-content');
    if (!content) return;

    const prevBtn = document.getElementById('app-prev-btn');
    const nextBtn = document.getElementById('app-next-btn');
    const submitBtn = document.getElementById('app-submit-btn');
    const errorEl = document.getElementById('app-step-error');

    if (prevBtn) prevBtn.style.display = stepIndex === 0 ? 'none' : '';
    if (nextBtn) nextBtn.style.display = stepIndex === STEPS.length - 1 ? 'none' : '';
    if (submitBtn) submitBtn.style.display = stepIndex === STEPS.length - 1 ? '' : 'none';
    if (errorEl) errorEl.textContent = '';

    switch (stepIndex) {
      case 0: content.innerHTML = renderPersonalStep(); break;
      case 1: content.innerHTML = renderEducationStep(); break;
      case 2: content.innerHTML = renderKoreanStep(); break;
      case 3: content.innerHTML = renderFamilyStep(); break;
      case 4: content.innerHTML = renderSchoolStep(); break;
      case 5: 
        content.innerHTML = renderDocumentsStep(); 
        bindFileInputs();
        break;
      case 6: content.innerHTML = renderReviewStep(); break;
    }

    // Restore form data
    restoreFormData();
    updateProgress();
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.appGoToStep = function goToStep(idx) {
    if (idx < 0 || idx >= STEPS.length) return;
    // Chỉ cho phép đi đến step đã hoàn thành hoặc step hiện tại
    if (idx > currentStep) {
      // Nếu chưa hoàn thành step hiện tại, không cho nhảy forward
      return;
    }
    currentStep = idx;
    renderStep(idx);
  };

  function nextStep() {
    if (!validateStep(currentStep)) return;
    saveFormData();
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep(currentStep);
    }
  }

  function prevStep() {
    saveFormData();
    if (currentStep > 0) {
      currentStep--;
      renderStep(currentStep);
    }
  }

  function saveFormData() {
    const form = document.getElementById('application-form');
    if (!form) return;
    const data = new FormData(form);
    for (const [key, val] of data.entries()) {
      formData[key] = val;
    }
  }

  function restoreFormData() {
    const form = document.getElementById('application-form');
    if (!form) return;
    const elements = form.elements;
    for (const key of Object.keys(formData)) {
      const el = elements[key];
      if (el) {
        if (el.type === 'checkbox') el.checked = Boolean(formData[key]);
        else el.value = String(formData[key] || '');
      }
    }
  }

  function validateStep(stepIndex) {
    const errorEl = document.getElementById('app-step-error');
    if (!errorEl) return true;

    const getVal = (name) => {
      const el = document.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : '';
    };

    switch (stepIndex) {
      case 0: {
        if (!getVal('fullName')) {
          errorEl.textContent = 'Vui lòng nhập Họ tên';
          return false;
        }
        break;
      }
      case 4: {
        if (!getVal('schoolId')) {
          errorEl.textContent = 'Vui lòng chọn trường';
          return false;
        }
        break;
      }
    }
    return true;
  }

  // ══════════════════════════════════════════
  // STEP RENDERERS
  // ══════════════════════════════════════════

  function renderPersonalStep() {
    return `
      <div class="app-section">
        <h3>👤 Thông tin cá nhân</h3>
        <p class="app-section-desc">Nhập thông tin cơ bản của học sinh.</p>
        
        <div class="app-grid-2">
          <div class="app-field">
            <label>Họ tên (tiếng Việt) <span class="required">*</span></label>
            <input type="text" name="fullName" placeholder="Nguyễn Văn A" required>
          </div>
          <div class="app-field">
            <label>Họ tên (tiếng Hàn)</label>
            <input type="text" name="fullNameKr" placeholder="Nguyen Van A (hoặc tên Hàn)">
          </div>
        </div>

        <div class="app-grid-2">
          <div class="app-field">
            <label>Họ tên (tiếng Anh - như passport)</label>
            <input type="text" name="fullNameEn" placeholder="NGUYEN VAN A">
          </div>
          <div class="app-field">
            <label>Ngày sinh</label>
            <input type="date" name="dateOfBirth">
          </div>
        </div>

        <div class="app-grid-3">
          <div class="app-field">
            <label>Giới tính</label>
            <select name="gender">
              <option value="">— Chọn —</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div class="app-field">
            <label>Quốc tịch</label>
            <select name="nationality">
              <option value="Vietnam" selected>Việt Nam</option>
              <option value="Other">Khác</option>
            </select>
          </div>
          <div class="app-field">
            <label>Số hộ chiếu</label>
            <input type="text" name="passportNo" placeholder="C1234567">
          </div>
        </div>

        <div class="app-grid-2">
          <div class="app-field">
            <label>Ngày hết hạn passport</label>
            <input type="date" name="passportExpiry">
          </div>
          <div class="app-field">
            <label>Số điện thoại</label>
            <input type="tel" name="phone" placeholder="090xxxxxxx">
          </div>
        </div>

        <div class="app-grid-2">
          <div class="app-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="email@example.com">
          </div>
          <div class="app-field">
            <label>Địa chỉ</label>
            <input type="text" name="address" placeholder="Số nhà, đường, phường, quận, tỉnh/thành">
          </div>
        </div>
      </div>
    `;
  }

  function renderEducationStep() {
    return `
      <div class="app-section">
        <h3>🎓 Học vấn</h3>
        <p class="app-section-desc">Thông tin trường THPT và Đại học (nếu có).</p>
        
        <div class="app-subsection">
          <h4>THPT</h4>
          <div class="app-grid-2">
            <div class="app-field">
              <label>Tên trường THPT</label>
              <input type="text" name="highSchoolName" placeholder="Trường THPT ...">
            </div>
            <div class="app-field">
              <label>Địa chỉ trường</label>
              <input type="text" name="highSchoolAddress" placeholder="Tỉnh/Thành phố">
            </div>
          </div>
          <div class="app-grid-2">
            <div class="app-field">
              <label>Thời gian bắt đầu</label>
              <input type="date" name="highSchoolStart">
            </div>
            <div class="app-field">
              <label>Thời gian kết thúc</label>
              <input type="date" name="highSchoolEnd">
            </div>
          </div>
          <div class="app-grid-3">
            <div class="app-field">
              <label>Ngành/chọn (nếu có)</label>
              <input type="text" name="highSchoolMajor" placeholder="Tự nhiên / Xã hội">
            </div>
            <div class="app-field">
              <label>GPA (thang 10)</label>
              <input type="number" name="highSchoolGpa" min="0" max="10" step="0.1" placeholder="6.5">
            </div>
            <div class="app-field">
              <label>Số buổi nghỉ</label>
              <input type="number" name="highSchoolAbsences" min="0" max="200" placeholder="10">
            </div>
          </div>
          <div class="app-field">
            <label>Tình trạng tốt nghiệp</label>
            <select name="highSchoolStatus">
              <option value="graduated">Đã tốt nghiệp</option>
              <option value="expecting">Đang học / Chờ tốt nghiệp</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        <div class="app-subsection">
          <h4>Đại học / Cao đẳng (nếu có)</h4>
          <p class="app-note">Bỏ qua nếu chưa học Đại học</p>
          <div class="app-grid-2">
            <div class="app-field">
              <label>Tên trường ĐH/CĐ</label>
              <input type="text" name="universityName" placeholder="Tên trường">
            </div>
            <div class="app-field">
              <label>Chuyên ngành</label>
              <input type="text" name="universityMajor" placeholder="Ngành học">
            </div>
          </div>
          <div class="app-grid-2">
            <div class="app-field">
              <label>Thời gian bắt đầu</label>
              <input type="date" name="universityStart">
            </div>
            <div class="app-field">
              <label>Thời gian kết thúc</label>
              <input type="date" name="universityEnd">
            </div>
          </div>
          <div class="app-grid-2">
            <div class="app-field">
              <label>GPA Đại học</label>
              <input type="number" name="universityGpa" min="0" max="10" step="0.1" placeholder="6.5">
            </div>
            <div class="app-field">
              <label>Bằng cấp</label>
              <input type="text" name="universityDegree" placeholder="Cử nhân / Kỹ sư / ...">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderKoreanStep() {
    return `
      <div class="app-section">
        <h3>🇰🇷 Năng lực tiếng Hàn</h3>
        <p class="app-section-desc">Trình độ tiếng Hàn hiện tại của học sinh.</p>

        <div class="app-grid-2">
          <div class="app-field">
            <label>Trình độ tiếng Hàn</label>
            <select name="koreanLevel">
              <option value="none">Chưa có chứng chỉ</option>
              <option value="sejong2b">Sejong 2B</option>
              <option value="topik2">TOPIK 2</option>
              <option value="topik3">TOPIK 3</option>
              <option value="topik4">TOPIK 4</option>
              <option value="topik5">TOPIK 5</option>
              <option value="topik6">TOPIK 6</option>
            </select>
          </div>
          <div class="app-field">
            <label>Điểm TOPIK (nếu có)</label>
            <input type="number" name="topikLevel" min="1" max="6" placeholder="VD: 3">
          </div>
        </div>

        <div class="app-field">
          <label>Quá trình học tiếng Hàn</label>
          <textarea name="koreanEducation" rows="3" placeholder="Đã học ở đâu? Bao lâu? Trung tâm nào?"></textarea>
        </div>

        <div class="app-info-box">
          <strong>💡 Gợi ý:</strong> 
          Hầu hết các trường yêu cầu tối thiểu TOPIK 2-3. Nếu chưa có, bạn có thể đăng ký học tiếng Hàn tại trường.
        </div>
      </div>
    `;
  }

  function renderFamilyStep() {
    return `
      <div class="app-section">
        <h3>👨‍👩‍👧‍👦 Thông tin gia đình</h3>
        <p class="app-section-desc">Thông tin phụ huynh phục vụ hồ sơ tài chính và nhân thân.</p>

        <div class="app-subsection">
          <h4>Thông tin cha</h4>
          <div class="app-grid-3">
            <div class="app-field">
              <label>Họ tên cha</label>
              <input type="text" name="fatherName" placeholder="Nguyễn Văn ...">
            </div>
            <div class="app-field">
              <label>Nghề nghiệp</label>
              <input type="text" name="fatherOccupation" placeholder="VD: Kinh doanh">
            </div>
            <div class="app-field">
              <label>Số điện thoại</label>
              <input type="tel" name="fatherPhone" placeholder="090xxxxxxx">
            </div>
          </div>
        </div>

        <div class="app-subsection">
          <h4>Thông tin mẹ</h4>
          <div class="app-grid-3">
            <div class="app-field">
              <label>Họ tên mẹ</label>
              <input type="text" name="motherName" placeholder="Nguyễn Thị ...">
            </div>
            <div class="app-field">
              <label>Nghề nghiệp</label>
              <input type="text" name="motherOccupation" placeholder="VD: Giáo viên">
            </div>
            <div class="app-field">
              <label>Số điện thoại</label>
              <input type="tel" name="motherPhone" placeholder="090xxxxxxx">
            </div>
          </div>
        </div>

        <div class="app-info-box">
          <strong>📌 Lưu ý:</strong> Thông tin gia đình cần chính xác vì sẽ được đối chiếu với sổ hộ khẩu và giấy tờ tài chính khi nộp visa.
        </div>
      </div>
    `;
  }

  function renderSchoolStep() {
    const schools = Object.values(window.SCHOOLS_DATA || {});
    const semesters = window.SEMESTERS_LIST || [];

    const schoolOptions = schools.map(s => 
      `              <option value="${esc(s.id)}">${esc(s.name)} ${s.nameKr ? '(' + esc(s.nameKr) + ')' : ''} — ${esc(s.system || '')}</option>`
    ).join('');

    const semesterOptions = semesters.map(s =>
      `<option value="${esc(s.id)}">${esc(s.title || 'Kỳ tháng ' + s.ky + '/' + s.nam)}</option>`
    ).join('');

    return `
      <div class="app-section">
        <h3>🏫 Chọn trường & kỳ tuyển sinh</h3>
        <p class="app-section-desc">Chọn trường Hàn Quốc và kỳ nhập học mong muốn.</p>

        <div class="app-grid-2">
          <div class="app-field">
            <label>Trường Hàn Quốc <span class="required">*</span></label>
            <select name="schoolId" id="app-school-select" onchange="window.appSelectSchool(this.value)">
              <option value="">— Chọn trường —</option>
              ${schoolOptions}
            </select>
            <div id="app-school-preview" class="app-school-preview"></div>
          </div>
          <div class="app-field">
            <label>Kỳ tuyển sinh</label>
            <select name="semesterId">
              <option value="">— Chọn kỳ —</option>
              ${semesterOptions}
            </select>
          </div>
        </div>

        <div class="app-info-box">
          <strong>🏆 Danh sách trường:</strong> 
          <span id="app-school-count">${schools.length}</span> trường đang tuyển sinh. 
          Xem chi tiết từng trường trong tab <strong>Trường</strong>.
        </div>
      </div>
    `;
  }

  function selectSchool(schoolId) {
    const preview = document.getElementById('app-school-preview');
    if (!preview) return;

    const school = (window.SCHOOLS_DATA || {})[schoolId];
    if (!school) {
      preview.innerHTML = '';
      selectedSchoolFormUrl = '';
      return;
    }

    // Lưu URL mẫu đơn của trường
    selectedSchoolFormUrl = school.applicationFormUrl || '';

    const rules = typeof getAdvisorRules === 'function' ? getAdvisorRules(schoolId, school) : {};
    const regionName = rules?.region ? (window.REGION_LABELS?.[rules.region] || rules.region) : '';

    preview.innerHTML = `
      <div class="app-school-card">
        <strong>${esc(school.name)}</strong>
        ${school.nameKr ? `<span class="kr">${esc(school.nameKr)}</span>` : ''}
        <div class="app-school-meta">
          ${school.system ? `<span>📚 ${esc(school.system)}</span>` : ''}
          ${regionName ? `<span>📍 ${esc(regionName)}</span>` : ''}
        </div>
      </div>
    `;
  }

  function renderDocumentsStep() {
    const formLink = selectedSchoolFormUrl 
      ? `<div class="app-form-download">
          <a href="${esc(selectedSchoolFormUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            📥 Tải mẫu đơn của trường
          </a>
          <span class="doc-hint">Tải file PDF mẫu, điền đầy đủ thông tin, sau đó upload lại bên dưới.</span>
         </div>`
      : `<div class="app-form-download">
          <span class="doc-hint">⚠️ Chưa có mẫu đơn cho trường này. Vui lòng liên hệ admin để được hỗ trợ hoặc sử dụng mẫu đơn của trường trên website trường.</span>
         </div>`;

    return `
      <div class="app-section">
        <h3>📄 Hồ sơ cần nộp</h3>
        <p class="app-section-desc">Chuẩn bị sẵn các file (PDF, JPG, PNG) để upload. Mỗi file tối đa 10MB.</p>

        ${formLink}

        <div class="app-doc-grid">
          <div class="app-doc-item">
            <label>📝 Đơn đăng ký (theo mẫu trường) <span class="required">*</span></label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docApplicationForm">
            <span class="doc-hint">Upload file PDF đã điền xong</span>
          </div>
          <div class="app-doc-item">
            <label>📖 Kế hoạch học tập (Study Plan)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docStudyPlan">
            <span class="doc-hint">Viết bằng tiếng Hàn hoặc Anh</span>
          </div>
          <div class="app-doc-item">
            <label>📋 Giới thiệu bản thân</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docSelfIntroduction">
            <span class="doc-hint">Tự giới thiệu, thành tích</span>
          </div>
          <div class="app-doc-item">
            <label>🎓 Bằng THPT</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docHighSchoolDiploma">
            <span class="doc-hint">Bản sao công chứng</span>
          </div>
          <div class="app-doc-item">
            <label>📊 Học bạ THPT</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docHighSchoolTranscript">
            <span class="doc-hint">Bảng điểm 3 năm</span>
          </div>
          <div class="app-doc-item">
            <label>🛂 Hộ chiếu (bản sao)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docPassportCopy">
            <span class="doc-hint">Trang có ảnh + chữ ký</span>
          </div>
          <div class="app-doc-item">
            <label>👶 Giấy khai sinh</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docBirthCertificate">
            <span class="doc-hint">Bản sao</span>
          </div>
          <div class="app-doc-item">
            <label>📑 Sổ hộ khẩu</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docFamilyRegister">
            <span class="doc-hint">Công chứng + dịch thuật</span>
          </div>
          <div class="app-doc-item">
            <label>🏦 Sổ tiết kiệm / Xác nhận số dư</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docBankStatement">
            <span class="doc-hint">Tối thiểu $10,000</span>
          </div>
          <div class="app-doc-item">
            <label>🏥 Giấy khám sức khỏe</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docHealthCertificate">
            <span class="doc-hint">Theo mẫu của ĐSQ</span>
          </div>
          <div class="app-doc-item">
            <label>📸 Ảnh thẻ 3.5x4.5</label>
            <input type="file" accept=".jpg,.jpeg,.png" name="docPhoto">
            <span class="doc-hint">Nền trắng, mới chụp</span>
          </div>
          <div class="app-doc-item">
            <label>🏅 Chứng chỉ TOPIK (nếu có)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" name="docTopikCertificate">
            <span class="doc-hint">Scan chứng chỉ</span>
          </div>
        </div>

        <div class="app-doc-other">
          <label>📎 Giấy tờ khác</label>
          <textarea name="docOther" rows="2" placeholder="Liệt kê các giấy tờ bổ sung khác..."></textarea>
        </div>

        <div class="app-info-box">
          <strong>💡 Mẹo:</strong> Nên chuẩn bị sẵn các file PDF đã scan rõ, dung lượng vừa phải. Các giấy tờ tiếng Việt cần dịch công chứng sang tiếng Hàn hoặc tiếng Anh.
        </div>
      </div>
    `;
  }

  function renderReviewStep() {
    saveFormData();
    const d = formData;
    const school = (window.SCHOOLS_DATA || {})[d.schoolId];
    const sem = (window.SEMESTERS_LIST || []).find(s => s.id === d.semesterId);

    return `
      <div class="app-section">
        <h3>✅ Xác nhận thông tin</h3>
        <p class="app-section-desc">Vui lòng kiểm tra lại toàn bộ thông tin trước khi gửi.</p>

        <div class="app-review-grid">
          <div class="app-review-section">
            <h4>👤 Thông tin cá nhân</h4>
            <table class="app-review-table">
              <tr><td>Họ tên</td><td>${esc(d.fullName || '—')}</td></tr>
              <tr><td>Tên Hàn</td><td>${esc(d.fullNameKr || '—')}</td></tr>
              <tr><td>Tên Anh</td><td>${esc(d.fullNameEn || '—')}</td></tr>
              <tr><td>Ngày sinh</td><td>${esc(d.dateOfBirth || '—')}</td></tr>
              <tr><td>Giới tính</td><td>${d.gender === 'male' ? 'Nam' : d.gender === 'female' ? 'Nữ' : '—'}</td></tr>
              <tr><td>Passport</td><td>${esc(d.passportNo || '—')}</td></tr>
              <tr><td>SĐT</td><td>${esc(d.phone || '—')}</td></tr>
              <tr><td>Email</td><td>${esc(d.email || '—')}</td></tr>
            </table>
          </div>

          <div class="app-review-section">
            <h4>🎓 Học vấn</h4>
            <table class="app-review-table">
              <tr><td>Trường THPT</td><td>${esc(d.highSchoolName || '—')}</td></tr>
              <tr><td>GPA</td><td>${d.highSchoolGpa || '—'}</td></tr>
              <tr><td>ĐH (nếu có)</td><td>${esc(d.universityName || '—')}</td></tr>
            </table>
          </div>

          <div class="app-review-section">
            <h4>🇰🇷 Tiếng Hàn</h4>
            <table class="app-review-table">
              <tr><td>Trình độ</td><td>${esc(d.koreanLevel || '—')}</td></tr>
              <tr><td>TOPIK</td><td>${d.topikLevel || '—'}</td></tr>
            </table>
          </div>

          <div class="app-review-section">
            <h4>🏫 Trường đã chọn</h4>
            <table class="app-review-table">
              <tr><td>Trường</td><td>${school ? esc(school.name) : '—'}</td></tr>
              <tr><td>Kỳ</td><td>${sem ? esc(sem.title || 'Kỳ ' + sem.ky + '/' + sem.nam) : '—'}</td></tr>
            </table>
          </div>

          <div class="app-review-section">
            <h4>📄 Hồ sơ đã chuẩn bị</h4>
            <ul class="app-doc-list">
              ${renderDocStatus('docApplicationForm', 'Đơn đăng ký')}
              ${renderDocStatus('docStudyPlan', 'Kế hoạch học tập')}
              ${renderDocStatus('docSelfIntroduction', 'Giới thiệu bản thân')}
              ${renderDocStatus('docHighSchoolDiploma', 'Bằng THPT')}
              ${renderDocStatus('docHighSchoolTranscript', 'Học bạ THPT')}
              ${renderDocStatus('docPassportCopy', 'Hộ chiếu')}
              ${renderDocStatus('docBirthCertificate', 'Giấy khai sinh')}
              ${renderDocStatus('docFamilyRegister', 'Sổ hộ khẩu')}
              ${renderDocStatus('docBankStatement', 'Tài chính')}
              ${renderDocStatus('docHealthCertificate', 'Sức khỏe')}
              ${renderDocStatus('docPhoto', 'Ảnh thẻ')}
              ${renderDocStatus('docTopikCertificate', 'TOPIK')}
            </ul>
          </div>
        </div>

        <div class="app-agree-box">
          <label class="app-agree-label">
            <input type="checkbox" id="app-agree" required>
            <span>Tôi xác nhận thông tin trên là đúng sự thật và chịu trách nhiệm về tính chính xác của dữ liệu đã cung cấp.</span>
          </label>
        </div>
      </div>
    `;
  }

  function renderDocStatus(fieldName, label) {
    const file = documentFiles[fieldName];
    const hasDoc = file instanceof File;
    return `<li class="${hasDoc ? 'doc-ready' : 'doc-missing'}">
      ${hasDoc ? '✅' : '⬜'} ${esc(label)}${hasDoc ? ' <span class="doc-file-name">(' + esc(file.name) + ')</span>' : ''}
    </li>`;
  }

  // ══════════════════════════════════════════
  // FORM SUBMISSION
  // ══════════════════════════════════════════

  function bindFormEvents(container) {
    const form = document.getElementById('application-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;
      if (!document.getElementById('app-agree')?.checked) {
        document.getElementById('app-step-error').textContent = 'Vui lòng xác nhận thông tin trước khi gửi';
        return;
      }
      await submitForm();
    });
  }

  // ─── Save file objects when user selects files (step 5) ───
  // Lưu File reference vào documentFiles để dùng khi submit ở bước 6 (file inputs không còn trong DOM)
  function bindFileInputs() {
    const fileInputs = document.querySelectorAll('#app-step-content input[type="file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
          documentFiles[this.name] = this.files[0];
        } else {
          delete documentFiles[this.name];
        }
      });
    });
  }

  // ─── Read file as base64 data URI ───
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Không thể đọc file'));
      reader.readAsDataURL(file);
    });
  }

  async function submitForm() {
    if (isSubmitting) return;
    isSubmitting = true;

    const submitBtn = document.getElementById('app-submit-btn');
    const errorEl = document.getElementById('app-step-error');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Đang đọc file...';
    }
    if (errorEl) errorEl.textContent = '';

    saveFormData();

    // Build payload
    const payload = { ...formData };

    // Dùng documentFiles đã lưu từ bước 5 (Hồ sơ) — file inputs không còn trong DOM ở bước 6
    const fileEntries = Object.entries(documentFiles).filter(([, file]) => file instanceof File);
    
    for (let i = 0; i < fileEntries.length; i++) {
      const [fieldName, file] = fileEntries[i];
      if (submitBtn) {
        submitBtn.textContent = `⏳ Đang đọc file ${i+1}/${fileEntries.length}...`;
      }
      try {
        const base64 = await readFileAsBase64(file);
        payload[fieldName] = base64;
      } catch (err) {
        if (errorEl) errorEl.textContent = '❌ Lỗi đọc file ' + file.name + ': ' + err.message;
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '📨 Gửi đơn đăng ký';
        }
        return;
      }
    }

    payload.source = 'web';

    if (submitBtn) submitBtn.textContent = '⏳ Đang gửi đơn...';

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi gửi đơn');
      }

      // Show success
      const form = document.getElementById('application-form');
      const progress = document.getElementById('app-progress');
      const success = document.getElementById('app-success');
      const successId = document.getElementById('app-success-id');

      if (form) form.style.display = 'none';
      if (progress) progress.style.display = 'none';
      if (success) success.style.display = 'block';
      if (successId && data.data?.id) {
        successId.innerHTML = `
          <p>Mã đơn: <strong>${data.data.id}</strong></p>
          <p>Cảm ơn bạn! File hồ sơ đã được tải lên. Admin sẽ xem xét và phản hồi sớm nhất.</p>
        `;
      }
    } catch (err) {
      if (errorEl) errorEl.textContent = '❌ ' + err.message;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '📨 Gửi đơn đăng ký';
      }
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    const form = document.getElementById('application-form');
    const progress = document.getElementById('app-progress');
    const success = document.getElementById('app-success');

    if (form) form.style.display = '';
    if (progress) progress.style.display = '';
    if (success) success.style.display = 'none';

    currentStep = 0;
    formData = getDefaultData();
    documentFiles = {};
    isSubmitting = false;
    renderStep(0);
  }

  // ─── Escape HTML helper (dùng global từ api-loader.js) ───
  function esc(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    if (typeof str !== 'string') return str ?? '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Export ───
  window.renderApplicationApp = renderApp;
})();
