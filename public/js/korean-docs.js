/**
 * korean-docs.js — Trợ lý Hồ sơ Tiếng Hàn 🇰🇷
 * 
 * Sinh 4 tài liệu song ngữ cho hồ sơ visa:
 * 1. 자기소개서 (Self-Introduction)
 * 2. 학업계획서 (Study Plan)
 * 3. 재정 진술서 (Financial Statement)
 * 4. 통합 서류 (Combined Application)
 * 
 * Pattern theo study-plan-upgrade.js và finance-guide.js
 */

(function() {
  'use strict';

  // ─── Inject styles ───
  function injectStyles() {
    var css = `
      .kd-widget {
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .kd-widget h4 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        font-weight: 700;
        color: var(--text, #1e293b);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .kd-widget p {
        font-size: 0.88rem;
        line-height: 1.6;
        color: var(--text-muted, #475569);
        margin: 0 0 0.5rem;
      }

      /* ─── Step progress bar ─── */
      .kd-steps {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 1.5rem;
        padding: 0.5rem 0;
      }
      .kd-step {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: var(--border, #e2e8f0);
        transition: background 0.3s;
      }
      .kd-step.active { background: #6366f1; }
      .kd-step.done { background: #10b981; }
      .kd-step-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.72rem;
        color: var(--text-muted, #94a3b8);
        margin-top: 0.3rem;
      }
      .kd-step-label span.active { color: #6366f1; font-weight: 700; }
      .kd-step-label span.done { color: #10b981; font-weight: 600; }

      /* ─── Form ─── */
      .kd-form { display: block; }
      .kd-form-step { display: none; }
      .kd-form-step.active { display: block; animation: kdFadeIn 0.3s ease; }
      .kd-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin: 1rem 0;
      }
      .kd-field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .kd-field.full { grid-column: 1 / -1; }
      .kd-field label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text, #1e293b);
      }
      .kd-field input, .kd-field select, .kd-field textarea {
        padding: 0.5rem 0.7rem;
        border: 1.5px solid var(--border, #e2e8f0);
        border-radius: 8px;
        background: #fff;
        font: inherit;
        font-size: 0.88rem;
        color: var(--text, #1e293b);
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .kd-field input:focus, .kd-field select:focus, .kd-field textarea:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
      }
      .kd-field textarea {
        min-height: 80px;
        resize: vertical;
      }
      .kd-field .kd-hint {
        font-size: 0.72rem;
        color: var(--text-muted, #94a3b8);
      }

      /* ─── Buttons ─── */
      .kd-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.25rem;
        flex-wrap: wrap;
      }
      .kd-btn {
        padding: 0.55rem 1.2rem;
        border: none;
        border-radius: 8px;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .kd-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .kd-btn-primary {
        background: #6366f1;
        color: #fff;
      }
      .kd-btn-primary:hover:not(:disabled) { background: #4f46e5; }
      .kd-btn-secondary {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
      .kd-btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
      .kd-btn-success {
        background: #10b981;
        color: #fff;
      }
      .kd-btn-success:hover:not(:disabled) { background: #059669; }
      .kd-btn-outline {
        background: #fff;
        color: #6366f1;
        border: 1.5px solid #6366f1;
      }
      .kd-btn-outline:hover:not(:disabled) { background: #eef2ff; }

      /* ─── Result tabs ─── */
      .kd-result { 
        display: none;
        margin-top: 1.5rem;
        animation: kdFadeIn 0.4s ease;
      }
      .kd-result.show { display: block; }
      .kd-tabs {
        display: flex;
        gap: 0.25rem;
        border-bottom: 2px solid var(--border, #e2e8f0);
        margin-bottom: 1rem;
        overflow-x: auto;
      }
      .kd-tab {
        padding: 0.6rem 1rem;
        border: none;
        background: none;
        font: inherit;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text-muted, #64748b);
        cursor: pointer;
        white-space: nowrap;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.15s;
      }
      .kd-tab:hover { color: var(--text, #1e293b); }
      .kd-tab.active {
        color: #6366f1;
        border-bottom-color: #6366f1;
      }
      .kd-tab-content { display: none; }
      .kd-tab-content.active { display: block; }
      .kd-doc {
        background: #f8fafc;
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        padding: 1.25rem;
        font-size: 0.88rem;
        line-height: 1.7;
        white-space: pre-wrap;
        word-break: break-word;
        max-height: 500px;
        overflow-y: auto;
        color: var(--text, #1e293b);
        font-family: 'Noto Sans KR', 'Be Vietnam Pro', sans-serif;
      }
      .kd-doc-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
      .kd-copied {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #065f46;
        color: #fff;
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      .kd-copied.show { opacity: 1; }

      /* ─── Loading ─── */
      .kd-loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-muted, #64748b);
      }
      .kd-loading .kd-spinner {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 3px solid #e2e8f0;
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: kdSpin 0.8s linear infinite;
        margin-bottom: 0.75rem;
      }
      @keyframes kdSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes kdFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ─── Badge ─── */
      .kd-badge {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 0.72rem;
        font-weight: 700;
        margin-left: 0.5rem;
      }
      .kd-badge-purple { background: #eef2ff; color: #4f46e5; }
      .kd-badge-green { background: #d1fae5; color: #065f46; }

      /* ─── Preview card ─── */
      .kd-preview-card {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.75rem 0;
        background: linear-gradient(135deg, #faf5ff 0%, #f0fdf4 100%);
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .kd-preview-card .kd-pc-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .kd-preview-card .kd-pc-text { flex: 1; }
      .kd-preview-card .kd-pc-text strong {
        display: block;
        font-size: 0.95rem;
        color: var(--text, #1e293b);
        margin-bottom: 0.15rem;
      }
      .kd-preview-card .kd-pc-text span {
        font-size: 0.82rem;
        color: var(--text-muted, #64748b);
      }

      @media (max-width: 768px) {
        .kd-form-grid { grid-template-columns: 1fr; }
        .kd-widget { padding: 1rem; }
        .kd-tabs { gap: 0; }
        .kd-tab { padding: 0.5rem 0.6rem; font-size: 0.75rem; }
        .kd-actions { flex-direction: column; }
        .kd-btn { justify-content: center; }
      }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ─── Toast helper ───
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'kd-copied';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('show'); });
    setTimeout(function() {
      t.classList.remove('show');
      setTimeout(function() { t.remove(); }, 300);
    }, 2000);
  }

  // ─── Safe escape ───
  function safeEscape(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    var d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
  }

  // ═══════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════

  var currentStep = 1;
  var totalSteps = 4;
  var generatedDocs = null;

  var STEP_LABELS = ['Thông tin cá nhân', 'Mục đích học tập', 'Học vấn & Nền tảng', 'Tài chính'];

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  function renderForm() {
    return `
      <section class="kd-view">
        <div class="directory-head">
          <div>
            <p class="advisor-kicker" style="color:#6366f1;">🇰🇷 Trợ lý Hồ sơ Tiếng Hàn</p>
            <h2>Sinh tài liệu song ngữ Việt-Hàn</h2>
            <p>Nhập thông tin 1 lần — AI tự động tạo 4 tài liệu bằng tiếng Hàn: tự giới thiệu, kế hoạch học tập, giải trình tài chính và tổng hợp hồ sơ.</p>
          </div>
        </div>

        <div class="kd-widget">
          <!-- Steps -->
          <div class="kd-steps" id="kd-steps">
            ${Array(totalSteps).fill(0).map(function(_, i) {
              return '<div class="kd-step' + (i === 0 ? ' active' : '') + '" id="kd-step-' + (i + 1) + '"></div>';
            }).join('')}
          </div>
          <div class="kd-step-label" id="kd-step-label">
            ${STEP_LABELS.map(function(l, i) {
              return '<span' + (i === 0 ? ' class="active"' : '') + ' id="kd-slabel-' + (i + 1) + '">' + safeEscape(l) + '</span>';
            }).join('')}
          </div>

          <form id="kd-form" class="kd-form" onsubmit="return false;">
            <!-- STEP 1: Personal Info -->
            <div class="kd-form-step active" data-step="1">
              <div class="kd-preview-card">
                <div class="kd-pc-icon">👤</div>
                <div class="kd-pc-text">
                  <strong>Thông tin cá nhân</strong>
                  <span>Các thông tin cơ bản để đưa vào phần giới thiệu bản thân tiếng Hàn.</span>
                </div>
              </div>
              <div class="kd-form-grid">
                <div class="kd-field">
                  <label>Họ và tên <span style="color:#ef4444;">*</span></label>
                  <input type="text" id="kd-name" placeholder="Nguyễn Văn A" required>
                </div>
                <div class="kd-field">
                  <label>Tên tiếng Hàn (nếu có)</label>
                  <input type="text" id="kd-kname" placeholder="Nguyen Van A (viết bằng tiếng Hàn nếu biết)">
                </div>
                <div class="kd-field">
                  <label>Ngày sinh</label>
                  <input type="date" id="kd-dob">
                </div>
                <div class="kd-field">
                  <label>Số điện thoại</label>
                  <input type="tel" id="kd-phone" placeholder="0978 xxx xxx">
                </div>
                <div class="kd-field">
                  <label>Email</label>
                  <input type="email" id="kd-email" placeholder="your@email.com">
                </div>
                <div class="kd-field">
                  <label>Địa chỉ (tỉnh/thành phố)</label>
                  <input type="text" id="kd-address" placeholder="TP. Hồ Chí Minh">
                </div>
              </div>
            </div>

            <!-- STEP 2: Study Purpose -->
            <div class="kd-form-step" data-step="2">
              <div class="kd-preview-card">
                <div class="kd-pc-icon">📚</div>
                <div class="kd-pc-text">
                  <strong>Mục đích học tập</strong>
                  <span>Thông tin về trường, ngành và lý do du học — nội dung chính của Study Plan.</span>
                </div>
              </div>
              <div class="kd-form-grid">
                <div class="kd-field">
                  <label>Loại visa</label>
                  <select id="kd-visa-type">
                    <option value="D-4-1">D-4-1 (Học tiếng Hàn)</option>
                    <option value="D-2-6">D-2-6 (Trao đổi sinh viên)</option>
                    <option value="D-2">D-2 (Đại học chính quy)</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Tên trường Hàn Quốc</label>
                  <input type="text" id="kd-school" placeholder="Tên trường dự định nhập học">
                </div>
                <div class="kd-field full">
                  <label>Lý do chọn Hàn Quốc <span style="color:#ef4444;">*</span></label>
                  <textarea id="kd-why-korea" placeholder="Tại sao bạn muốn du học Hàn Quốc? (văn hoá, giáo dục, cơ hội...)" rows="3"></textarea>
                  <span class="kd-hint">Viết 2-3 câu. AI sẽ phát triển thành 1 đoạn hoàn chỉnh bằng tiếng Hàn.</span>
                </div>
                <div class="kd-field full">
                  <label>Mục tiêu học tập <span style="color:#ef4444;">*</span></label>
                  <textarea id="kd-goal" placeholder="Bạn muốn học gì? Mục tiêu TOPIK? Dự định sau khi học xong?" rows="3"></textarea>
                  <span class="kd-hint">Mô tả kế hoạch học tập và mục tiêu tương lai.</span>
                </div>
              </div>
            </div>

            <!-- STEP 3: Background -->
            <div class="kd-form-step" data-step="3">
              <div class="kd-preview-card">
                <div class="kd-pc-icon">🎓</div>
                <div class="kd-pc-text">
                  <strong>Học vấn & Nền tảng</strong>
                  <span>Trình độ học vấn, tiếng Hàn và lịch sử visa — để AI giải trình phù hợp.</span>
                </div>
              </div>
              <div class="kd-form-grid">
                <div class="kd-field">
                  <label>Trình độ học vấn</label>
                  <select id="kd-education">
                    <option value="highschool">Tốt nghiệp THPT</option>
                    <option value="college">Cao đẳng / Đang học ĐH</option>
                    <option value="university">Tốt nghiệp Đại học</option>
                    <option value="postgrad">Sau Đại học</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Năm tốt nghiệp</label>
                  <input type="number" id="kd-grad-year" placeholder="2024" min="2000" max="2030">
                </div>
                <div class="kd-field full">
                  <label>Trường đã học / Đang học</label>
                  <input type="text" id="kd-prev-school" placeholder="Tên trường THPT/ĐH tại Việt Nam">
                </div>
                <div class="kd-field">
                  <label>Trình độ tiếng Hàn</label>
                  <select id="kd-korean-level">
                    <option value="none">Chưa có</option>
                    <option value="sejong2b">Sejong 2B</option>
                    <option value="topik1">TOPIK 1</option>
                    <option value="topik2">TOPIK 2</option>
                    <option value="topik3">TOPIK 3</option>
                    <option value="topik4+">TOPIK 4 trở lên</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Đã từng trượt visa?</label>
                  <select id="kd-visa-fail">
                    <option value="no">Chưa từng</option>
                    <option value="yes">Đã từng trượt</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Gap year (thời gian trống)</label>
                  <input type="text" id="kd-gap" placeholder="VD: 1 năm, hoặc để trống nếu không có">
                </div>
              </div>
            </div>

            <!-- STEP 4: Financial -->
            <div class="kd-form-step" data-step="4">
              <div class="kd-preview-card">
                <div class="kd-pc-icon">💰</div>
                <div class="kd-pc-text">
                  <strong>Tài chính</strong>
                  <span>Thông tin tài chính để AI viết giải trình nguồn gốc tài chính bằng tiếng Hàn.</span>
                </div>
              </div>
              <div class="kd-form-grid">
                <div class="kd-field">
                  <label>Người bảo lãnh tài chính</label>
                  <select id="kd-sponsor">
                    <option value="self">Tự bảo lãnh</option>
                    <option value="parent">Cha/Mẹ</option>
                    <option value="relative">Người thân khác</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Thu nhập hàng tháng (USD)</label>
                  <input type="number" id="kd-monthly-income" placeholder="1000" min="0" step="100">
                </div>
                <div class="kd-field full">
                  <label>Nguồn thu nhập</label>
                  <select id="kd-income-source">
                    <option value="salary">Lương (nhân viên)</option>
                    <option value="business">Kinh doanh / Doanh nghiệp</option>
                    <option value="freelance">Tự do / Freelance</option>
                    <option value="rental">Cho thuê tài sản</option>
                    <option value="agriculture">Nông nghiệp</option>
                    <option value="invest">Đầu tư</option>
                    <option value="multiple">Nhiều nguồn</option>
                  </select>
                </div>
                <div class="kd-field">
                  <label>Số tiền sổ TK (USD)</label>
                  <input type="number" id="kd-savings" placeholder="10000" min="0" step="1000">
                  <span class="kd-hint">Số tiền trong sổ tiết kiệm để chứng minh tài chính.</span>
                </div>
                <div class="kd-field">
                  <label>Nghề nghiệp người bảo lãnh</label>
                  <input type="text" id="kd-occupation" placeholder="VD: Kỹ sư, Giáo viên, Kinh doanh...">
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="kd-actions">
              <button type="button" class="kd-btn kd-btn-secondary" id="kd-prev" onclick="window._kdPrevStep()" style="display:none;">
                ← Quay lại
              </button>
              <button type="button" class="kd-btn kd-btn-primary" id="kd-next" onclick="window._kdNextStep()">
                Tiếp theo →
              </button>
              <button type="button" class="kd-btn kd-btn-success" id="kd-generate" onclick="window._kdGenerate()" style="display:none;">
                🇰🇷 Tạo tài liệu Hàn
              </button>
            </div>
          </form>
        </div>

        <!-- Loading -->
        <div class="kd-widget kd-loading" id="kd-loading" style="display:none;">
          <div class="kd-spinner"></div>
          <p style="font-weight:600;">🇰🇷 AI đang viết tài liệu tiếng Hàn...</p>
          <p style="font-size:0.82rem;">Quá trình này mất 15-30 giây. AI sẽ tạo 4 tài liệu song ngữ Việt-Hàn.</p>
        </div>

        <!-- Result -->
        <div class="kd-widget kd-result" id="kd-result">
          <div class="directory-head">
            <div>
              <p class="advisor-kicker" style="color:#10b981;">✅ Tài liệu đã sẵn sàng</p>
              <h3>🇰🇷 4 tài liệu tiếng Hàn</h3>
              <p>Dưới đây là các tài liệu được AI tạo dựa trên thông tin bạn cung cấp. Bạn có thể copy từng tài liệu hoặc tải toàn bộ.</p>
            </div>
          </div>

          <div class="kd-tabs" id="kd-tabs">
            <button class="kd-tab active" data-kd-tab="self-intro" onclick="window._kdSwitchTab('self-intro')">📝 Tự giới thiệu</button>
            <button class="kd-tab" data-kd-tab="study-plan" onclick="window._kdSwitchTab('study-plan')">📚 Kế hoạch học tập</button>
            <button class="kd-tab" data-kd-tab="finance" onclick="window._kdSwitchTab('finance')">💰 Giải trình TC</button>
            <button class="kd-tab" data-kd-tab="combined" onclick="window._kdSwitchTab('combined')">📄 Tổng hợp</button>
          </div>

          <div id="kd-self-intro" class="kd-tab-content active"></div>
          <div id="kd-study-plan" class="kd-tab-content"></div>
          <div id="kd-finance" class="kd-tab-content"></div>
          <div id="kd-combined" class="kd-tab-content"></div>
        </div>
      </section>
    `;
  }

  // ═══════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════

  function goToStep(step) {
    currentStep = Math.max(1, Math.min(totalSteps, step));
    
    // Update form steps
    document.querySelectorAll('.kd-form-step').forEach(function(el) {
      el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
    });

    // Update progress bars
    for (var i = 1; i <= totalSteps; i++) {
      var bar = document.getElementById('kd-step-' + i);
      var label = document.getElementById('kd-slabel-' + i);
      if (!bar || !label) continue;
      bar.className = 'kd-step';
      label.className = '';
      if (i < currentStep) { bar.classList.add('done'); label.classList.add('done'); }
      else if (i === currentStep) { bar.classList.add('active'); label.classList.add('active'); }
    }

    // Show/hide buttons
    var prevBtn = document.getElementById('kd-prev');
    var nextBtn = document.getElementById('kd-next');
    var genBtn = document.getElementById('kd-generate');
    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : '';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : '';
    if (genBtn) genBtn.style.display = currentStep === totalSteps ? '' : 'none';
  }

  function collectFormData() {
    return {
      fullName: document.getElementById('kd-name')?.value || '',
      koreanName: document.getElementById('kd-kname')?.value || '',
      dob: document.getElementById('kd-dob')?.value || '',
      phone: document.getElementById('kd-phone')?.value || '',
      email: document.getElementById('kd-email')?.value || '',
      address: document.getElementById('kd-address')?.value || '',
      visaType: document.getElementById('kd-visa-type')?.value || 'D-4-1',
      school: document.getElementById('kd-school')?.value || '',
      whyKorea: document.getElementById('kd-why-korea')?.value || '',
      goal: document.getElementById('kd-goal')?.value || '',
      education: document.getElementById('kd-education')?.value || 'highschool',
      gradYear: document.getElementById('kd-grad-year')?.value || '',
      prevSchool: document.getElementById('kd-prev-school')?.value || '',
      koreanLevel: document.getElementById('kd-korean-level')?.value || 'none',
      visaFail: document.getElementById('kd-visa-fail')?.value || 'no',
      gapYear: document.getElementById('kd-gap')?.value || '',
      sponsor: document.getElementById('kd-sponsor')?.value || 'self',
      monthlyIncome: parseFloat(document.getElementById('kd-monthly-income')?.value) || 0,
      incomeSource: document.getElementById('kd-income-source')?.value || 'salary',
      savings: parseFloat(document.getElementById('kd-savings')?.value) || 0,
      occupation: document.getElementById('kd-occupation')?.value || '',
    };
  }

  // ═══════════════════════════════════════════
  // GENERATE
  // ═══════════════════════════════════════════

  async function generate() {
    var data = collectFormData();
    
    // Validate
    if (!data.fullName || data.fullName.length < 2) {
      goToStep(1);
      document.getElementById('kd-name')?.focus();
      showToast('⚠️ Vui lòng nhập họ tên');
      return;
    }
    if (!data.whyKorea || data.whyKorea.length < 10) {
      goToStep(2);
      document.getElementById('kd-why-korea')?.focus();
      showToast('⚠️ Vui lòng nhập lý do chọn Hàn Quốc (tối thiểu 10 ký tự)');
      return;
    }
    if (!data.goal || data.goal.length < 10) {
      goToStep(2);
      document.getElementById('kd-goal')?.focus();
      showToast('⚠️ Vui lòng nhập mục tiêu học tập');
      return;
    }

    // Show loading
    document.getElementById('kd-loading').style.display = '';
    document.getElementById('kd-result').classList.remove('show');
    document.getElementById('kd-generate').disabled = true;

    try {
      var res = await fetch('/api/deepseek?action=generate-korean-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      var result = await res.json();

      if (result.success && result.documents) {
        generatedDocs = result.documents;
        renderResult(generatedDocs);
        document.getElementById('kd-loading').style.display = 'none';
        document.getElementById('kd-result').classList.add('show');
        showToast('✅ Đã tạo 4 tài liệu tiếng Hàn!');
        // Scroll to result
        document.getElementById('kd-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        showToast('❌ ' + (result.error || 'Lỗi tạo tài liệu, thử lại sau'));
        document.getElementById('kd-loading').style.display = 'none';
      }
    } catch (err) {
      showToast('❌ Lỗi kết nối: ' + err.message);
      document.getElementById('kd-loading').style.display = 'none';
    }
    
    document.getElementById('kd-generate').disabled = false;
  }

  // ═══════════════════════════════════════════
  // RENDER RESULT
  // ═══════════════════════════════════════════

  function renderResult(docs) {
    var docTypes = [
      { id: 'self-intro', title: '📝 Tự giới thiệu (자기소개서)', key: 'selfIntro' },
      { id: 'study-plan', title: '📚 Kế hoạch học tập (학업계획서)', key: 'studyPlan' },
      { id: 'finance', title: '💰 Giải trình tài chính (재정 진술서)', key: 'finance' },
      { id: 'combined', title: '📄 Tổng hợp hồ sơ (통합 서류)', key: 'combined' },
    ];

    docTypes.forEach(function(doc) {
      var el = document.getElementById('kd-' + doc.id);
      if (!el) return;
      var content = docs[doc.key] || docs[doc.id] || 'Đang cập nhật...';
      el.innerHTML = `
        <div style="margin-bottom:0.5rem;">
          <h4 style="display:flex;align-items:center;gap:0.5rem;margin:0 0 0.25rem;font-size:0.95rem;">
            ${doc.title}
            <span class="kd-badge kd-badge-purple">🇰🇷 한국어</span>
          </h4>
          <p style="font-size:0.78rem;color:var(--text-muted);margin:0 0 0.75rem;">
            Copy nội dung này vào hồ sơ visa của bạn.
          </p>
        </div>
        <div class="kd-doc" id="kd-doc-${doc.id}">${safeEscape(content)}</div>
        <div class="kd-doc-actions">
          <button type="button" class="kd-btn kd-btn-outline" onclick="window._kdCopy('${doc.id}')">📋 Copy</button>
          <button type="button" class="kd-btn kd-btn-secondary" onclick="window._kdDownload('${doc.id}')">⬇️ Tải .txt</button>
        </div>
      `;
    });
  }

  // ═══════════════════════════════════════════
  // COPY & DOWNLOAD
  // ═══════════════════════════════════════════

  function copyDoc(docId) {
    var el = document.getElementById('kd-doc-' + docId);
    if (!el) return;
    var text = el.textContent || '';
    navigator.clipboard.writeText(text).then(function() {
      showToast('📋 Đã copy nội dung!');
    }).catch(function() {
      showToast('Không thể copy tự động');
    });
  }

  function downloadDoc(docId) {
    var el = document.getElementById('kd-doc-' + docId);
    if (!el) return;
    var text = el.textContent || '';
    var titles = { 'self-intro': 'Tu_gioi_thieu', 'study-plan': 'Ke_hoach_hoc_tap', 'finance': 'Giai_trinh_tai_chinh', 'combined': 'Tong_hop_ho_so' };
    var filename = (titles[docId] || 'tai_lieu') + '_' + new Date().toISOString().split('T')[0] + '.txt';
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('⬇️ Đã tải xuống: ' + filename);
  }

  function switchTab(tabId) {
    document.querySelectorAll('.kd-tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.kdTab === tabId);
    });
    document.querySelectorAll('.kd-tab-content').forEach(function(c) {
      c.classList.toggle('active', c.id === 'kd-' + tabId);
    });
  }

  // ═══════════════════════════════════════════
  // EXPOSE GLOBALS
  // ═══════════════════════════════════════════

  window._kdNextStep = function() {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
  };
  window._kdPrevStep = function() {
    if (currentStep > 1) goToStep(currentStep - 1);
  };
  window._kdGenerate = generate;
  window._kdCopy = copyDoc;
  window._kdDownload = downloadDoc;
  window._kdSwitchTab = switchTab;
  window.renderKoreanDocs = function(container) {
    if (!container.dataset.kdReady) {
      container.innerHTML = renderForm();
      container.dataset.kdReady = 'true';
      goToStep(1);
    }
  };

  injectStyles();
})();
