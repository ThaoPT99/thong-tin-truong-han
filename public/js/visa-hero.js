/**
 * visa-hero.js — Giao diện riêng cho D2-6 vs D4-1
 * 
 * Cung cấp:
 * 1. Hero banner riêng cho từng loại visa
 * 2. Bảng so sánh nhanh D2-6 vs D4-1
 * 3. Quiz "Bạn hợp với visa nào?" → gợi ý tự động
 * 4. Flowchart hướng dẫn theo loại visa
 */

(function() {
  'use strict';

  // ─── Inject styles ───
  function injectStyles() {
    var css = `
      .visa-hero {
        background: linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%);
        border-radius: 16px;
        padding: 2rem 2.5rem;
        margin-bottom: 2rem;
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        box-shadow: 0 8px 32px rgba(30, 58, 95, 0.25);
        position: relative;
        overflow: hidden;
      }
      .visa-hero::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -30%;
        width: 300px;
        height: 300px;
        background: rgba(255,255,255,0.04);
        border-radius: 50%;
        pointer-events: none;
      }
      .visa-hero::after {
        content: '';
        position: absolute;
        bottom: -40%;
        left: 10%;
        width: 200px;
        height: 200px;
        background: rgba(255,255,255,0.03);
        border-radius: 50%;
        pointer-events: none;
      }
      .visa-hero--d41 {
        background: linear-gradient(135deg, #0d4a3a 0%, #1a7a5c 100%);
        box-shadow: 0 8px 32px rgba(13, 74, 58, 0.3);
      }
      .visa-hero-text { flex: 1; min-width: 240px; position: relative; z-index: 1; }
      .visa-hero-badge {
        display: inline-block;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(4px);
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
      }
      .visa-hero-text h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: #fff;
        line-height: 1.3;
      }
      .visa-hero-text p {
        font-size: 0.95rem;
        opacity: 0.9;
        margin: 0 0 1rem;
        line-height: 1.6;
        max-width: 520px;
      }
      .visa-hero-stats {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
        position: relative;
        z-index: 1;
      }
      .visa-hero-stat {
        text-align: center;
        min-width: 80px;
      }
      .visa-hero-stat strong {
        display: block;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
      }
      .visa-hero-stat span {
        font-size: 0.75rem;
        opacity: 0.75;
      }
      .visa-hero-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top: 0.75rem;
      }
      .visa-hero-actions .vh-btn {
        padding: 8px 20px;
        border-radius: 8px;
        border: none;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .visa-hero-actions .vh-btn-primary {
        background: #fff;
        color: #1e3a5f;
      }
      .visa-hero--d41 .visa-hero-actions .vh-btn-primary {
        color: #0d4a3a;
      }
      .visa-hero-actions .vh-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      .visa-hero-actions .vh-btn-outline {
        background: transparent;
        color: #fff;
        border: 1.5px solid rgba(255,255,255,0.4);
      }
      .visa-hero-actions .vh-btn-outline:hover {
        border-color: #fff;
        background: rgba(255,255,255,0.1);
      }

      /* ─── Visa Comparison Widget ─── */
      .visa-compare-wrap {
        margin-bottom: 2rem;
      }
      .visa-compare-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .visa-compare-head h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text, #1e293b);
      }
      .visa-compare-toggle {
        padding: 6px 16px;
        border-radius: 8px;
        border: 1.5px solid var(--border, #e2e8f0);
        background: var(--card-bg, #fff);
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text-muted, #64748b);
      }
      .visa-compare-toggle:hover {
        border-color: var(--accent, #2563eb);
        color: var(--accent, #2563eb);
      }
      .visa-compare-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        font-size: 0.9rem;
      }
      .visa-compare-table th,
      .visa-compare-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid var(--border, #e2e8f0);
      }
      .visa-compare-table thead {
        background: var(--card-bg, #fff);
      }
      .visa-compare-table thead th {
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: var(--text-muted, #64748b);
        border-bottom: 2px solid var(--border, #e2e8f0);
      }
      .visa-compare-table thead th:first-child { width: 28%; }
      .visa-compare-table tbody tr:hover {
        background: rgba(0,0,0,0.02);
      }
      .visa-compare-table td:first-child {
        font-weight: 600;
        color: var(--text-muted, #64748b);
      }
      .visa-compare-table .vh-d26 {
        border-left: 3px solid #1e3a5f;
      }
      .visa-compare-table .vh-d41 {
        border-left: 3px solid #1a7a5c;
      }
      .visa-compare-table .vh-best {
        background: rgba(16, 185, 129, 0.06);
      }
      .visa-compare-table .vh-best::after {
        content: ' ✓';
        color: #10b981;
        font-weight: 700;
      }

      /* ─── Visa Quiz ─── */
      .visa-quiz-wrap {
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 16px;
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .visa-quiz-head {
        margin-bottom: 1.25rem;
      }
      .visa-quiz-head h3 {
        margin: 0 0 0.25rem;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text, #1e293b);
      }
      .visa-quiz-head p {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-muted, #64748b);
      }
      .visa-quiz-question {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border, #e2e8f0);
      }
      .visa-quiz-question:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .visa-quiz-q {
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: var(--text, #1e293b);
      }
      .visa-quiz-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .visa-quiz-opt {
        padding: 6px 16px;
        border-radius: 20px;
        border: 1.5px solid var(--border, #e2e8f0);
        background: var(--card-bg, #fff);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text, #1e293b);
      }
      .visa-quiz-opt:hover {
        border-color: var(--accent, #2563eb);
        background: rgba(37, 99, 235, 0.04);
      }
      .visa-quiz-opt.selected-d26 {
        border-color: #1e3a5f;
        background: rgba(30, 58, 95, 0.08);
        color: #1e3a5f;
        font-weight: 600;
      }
      .visa-quiz-opt.selected-d41 {
        border-color: #1a7a5c;
        background: rgba(26, 122, 92, 0.08);
        color: #1a7a5c;
        font-weight: 600;
      }
      .visa-quiz-result {
        margin-top: 1rem;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        display: none;
      }
      .visa-quiz-result.show {
        display: block;
        animation: fadeSlideUp 0.3s ease;
      }
      .visa-quiz-result.result-d26 {
        background: linear-gradient(135deg, rgba(30,58,95,0.06), rgba(42,82,152,0.06));
        border: 1.5px solid #1e3a5f;
      }
      .visa-quiz-result.result-d41 {
        background: linear-gradient(135deg, rgba(13,74,58,0.06), rgba(26,122,92,0.06));
        border: 1.5px solid #1a7a5c;
      }
      .visa-quiz-result.result-equal {
        background: linear-gradient(135deg, rgba(30,58,95,0.04), rgba(13,74,58,0.04));
        border: 1.5px solid var(--border, #e2e8f0);
      }
      .visa-quiz-result strong {
        display: block;
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }
      .visa-quiz-result p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-muted, #64748b);
      }
      .visa-quiz-result .vh-btn {
        margin-top: 0.75rem;
        padding: 8px 20px;
        border-radius: 8px;
        border: none;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        color: #fff;
      }
      .visa-quiz-result .vh-btn-d26 {
        background: #1e3a5f;
      }
      .visa-quiz-result .vh-btn-d41 {
        background: #1a7a5c;
      }
      .visa-quiz-result .vh-btn-d26:hover,
      .visa-quiz-result .vh-btn-d41:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ─── Visa Flowchart ─── */
      .visa-flowchart {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .visa-flow-step {
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 12px;
        padding: 1rem 1.25rem;
        text-align: center;
        position: relative;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .visa-flow-step:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .visa-flow-step .step-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: 0.8rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.5rem;
      }
      .visa-flow-step .step-num.d26-step {
        background: #1e3a5f;
      }
      .visa-flow-step .step-num.d41-step {
        background: #1a7a5c;
      }
      .visa-flow-step h4 {
        font-size: 0.85rem;
        margin: 0 0 0.25rem;
        color: var(--text, #1e293b);
      }
      .visa-flow-step p {
        font-size: 0.78rem;
        margin: 0;
        color: var(--text-muted, #64748b);
        line-height: 1.4;
      }

      /* ─── Responsive ─── */
      @media (max-width: 768px) {
        .visa-hero { padding: 1.5rem; }
        .visa-hero-text h2 { font-size: 1.2rem; }
        .visa-hero-stats { gap: 0.75rem; }
        .visa-hero-stat { min-width: 60px; }
        .visa-hero-stat strong { font-size: 1.1rem; }
        .visa-compare-table { font-size: 0.8rem; }
        .visa-compare-table th, .visa-compare-table td { padding: 8px 10px; }
        .visa-quiz-wrap { padding: 1rem 1.25rem; }
        .visa-flowchart { grid-template-columns: repeat(2, 1fr); }
      }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ─── Render visa hero banner ───
  function renderVisaHero(visaType) {
    var isD41 = visaType === 'D4-1';
    var badgeText = isD41 ? 'Visa D4-1' : 'Visa D2-6';
    var schoolCount = 0;
    try {
      var schools = Object.values(window.SCHOOLS_DATA || {});
      schoolCount = schools.filter(function(s) {
        return (s.visaType || 'D2-6') === visaType;
      }).length;
    } catch(e) { /* ignore */ }

    return '<div class="visa-hero' + (isD41 ? ' visa-hero--d41' : '') + '">' +
      '<div class="visa-hero-text">' +
        '<div class="visa-hero-badge">' + badgeText + '</div>' +
        '<h2>' + (isD41
          ? 'Du học tiếng Hàn — Visa D4-1'
          : 'Trao đổi sinh viên — Visa D2-6') + '</h2>' +
        '<p>' + (isD41
          ? 'Dành cho học sinh muốn học tiếng Hàn tại các trường đối tác, sau đó chuyển tiếp lên chuyên ngành. Quy trình đơn giản hơn, phù hợp với hồ sơ chưa có TOPIK hoặc muốn rèn luyện tiếng trước.'
          : 'Dành cho sinh viên Việt Nam theo chương trình liên kết giữa trường ĐH Việt Nam và Hàn Quốc. Học chuyên ngành ngay, có lộ trình chuyển đổi E7 sau tốt nghiệp.') + '</p>' +
        '<div class="visa-hero-actions">' +
          '<button type="button" class="vh-btn vh-btn-primary" data-action="checklist" onclick="window.showSchool(\'checklist\')">📋 Kiểm tra hồ sơ</button>' +
          '<button type="button" class="vh-btn vh-btn-outline" data-action="advisor" onclick="window.showSchool(\'advisor\')">🎯 Phân tích hồ sơ</button>' +
          '<button type="button" class="vh-btn vh-btn-outline" data-action="knowledge" onclick="window.showSchool(\'knowledge\')">📖 Kiến thức</button>' +
        '</div>' +
      '</div>' +
      '<div class="visa-hero-stats">' +
        '<div class="visa-hero-stat"><strong>' + schoolCount + '</strong><span>Trường</span></div>' +
        '<div class="visa-hero-stat"><strong>' + (isD41 ? '12-24' : '6-12') + '</strong><span>Tháng học</span></div>' +
        '<div class="visa-hero-stat"><strong>' + (isD41 ? 'TOPIK 1-2' : 'TOPIK 3-4') + '</strong><span>Yêu cầu Hàn</span></div>' +
      '</div>' +
    '</div>';
  }

  // ─── Render visa comparison table ───
  function renderVisaComparison() {
    var rows = [
      { label: 'Mục đích',
        d26: 'Trao đổi sinh viên, học chuyên ngành tại trường đối tác',
        d41: 'Học tiếng Hàn tại trường, sau đó chuyển tiếp' },
      { label: 'Đối tượng',
        d26: 'Sinh viên ĐH/CĐ tại VN có chương trình liên kết',
        d41: 'Học sinh THPT/ĐH muốn học tiếng Hàn bài bản' },
      { label: 'Thời gian',
        d26: '6-12 tháng (1-2 kỳ)',
        d41: '12-24 tháng (2-4 kỳ)' },
      { label: 'Yêu cầu tiếng Hàn',
        d26: 'TOPIK 3-4 (khuyến khích) hoặc Sejong cơ bản',
        d41: 'Không yêu cầu đầu vào, có TOPIK là lợi thế' },
      { label: 'Học phí (KRW)',
        d26: '3,000,000–6,000,000/kỳ',
        d41: '600,000–1,500,000/kỳ' },
      { label: 'Hồ sơ tài chính',
        d26: 'Sổ TK 10,000+ USD + giải trình nguồn',
        d41: 'Sổ TK 8,000–10,000 USD' },
      { label: 'Chứng minh MOU',
        d26: 'Cần MOU giữa 2 trường',
        d41: 'Không cần MOU phức tạp' },
      { label: 'Phỏng vấn visa',
        d26: 'Thường có, cần chuẩn bị câu chuyện học tập',
        d41: 'Ít gặp, hồ sơ gọn hơn' },
      { label: 'Cơ hội E7',
        d26: 'Có lộ trình rõ ràng sau tốt nghiệp',
        d41: 'Cần học thêm chuyên ngành sau tiếng' },
    ];

    var html = '<div class="visa-compare-wrap">' +
      '<div class="visa-compare-head">' +
        '<h3>📊 So sánh nhanh D2-6 vs D4-1</h3>' +
        '<button type="button" class="visa-compare-toggle" onclick="document.getElementById(\'visa-compare-table\').classList.toggle(\'hidden\');this.textContent=this.textContent===\'Ẩn bảng\'?\'Hiện bảng\':\'Ẩn bảng\'">Ẩn bảng</button>' +
      '</div>' +
      '<table id="visa-compare-table" class="visa-compare-table">' +
        '<thead><tr><th>Tiêu chí</th><th class="vh-d26">D2-6</th><th class="vh-d41">D4-1</th></tr></thead>' +
        '<tbody>';

    rows.forEach(function(row) {
      html += '<tr>' +
        '<td>' + row.label + '</td>' +
        '<td class="vh-d26">' + row.d26 + '</td>' +
        '<td class="vh-d41">' + row.d41 + '</td>' +
      '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
  }

  // ─── Render visa quiz ───
  var quizState = { answers: {} };

  var quizQuestions = [
    {
      id: 'q1',
      question: 'Bạn đang học ở đâu?',
      options: [
        { value: 'd26', label: 'Đại học/Cao đẳng tại Việt Nam' },
        { value: 'd41', label: 'THPT hoặc vừa tốt nghiệp THPT' },
        { value: 'either', label: 'Đã đi làm / Không thuộc 2 nhóm trên' },
      ]
    },
    {
      id: 'q2',
      question: 'Mục tiêu chính của bạn khi đi Hàn là gì?',
      options: [
        { value: 'd26', label: 'Học chuyên ngành, lấy bằng ĐH Hàn Quốc' },
        { value: 'd41', label: 'Học tiếng Hàn trước, rồi tính tiếp' },
        { value: 'either', label: 'Kết hợp cả học chuyên ngành và việc làm' },
      ]
    },
    {
      id: 'q3',
      question: 'Trình độ tiếng Hàn hiện tại?',
      options: [
        { value: 'd26', label: 'TOPIK 3+ hoặc tự tin giao tiếp' },
        { value: 'd41', label: 'Chưa biết / Mới bắt đầu / TOPIK 1-2' },
        { value: 'either', label: 'TOPIK 3 nhưng muốn học thêm' },
      ]
    },
    {
      id: 'q4',
      question: 'Trường bạn có liên kết với trường Hàn Quốc không?',
      options: [
        { value: 'd26', label: 'Có, trường tôi có chương trình trao đổi' },
        { value: 'd41', label: 'Không / Không rõ' },
        { value: 'either', label: 'Tôi sẽ chọn trường có liên kết' },
      ]
    },
  ];

  function handleQuizAnswer(qId, value) {
    quizState.answers[qId] = value;
    // Highlight selected
    var container = document.getElementById('visa-quiz-questions');
    if (!container) return;
    var opts = container.querySelectorAll('[data-q="' + qId + '"]');
    opts.forEach(function(opt) {
      opt.classList.remove('selected-d26', 'selected-d41');
      if (opt.dataset.val === value) {
        opt.classList.add(value === 'd26' ? 'selected-d26' : value === 'd41' ? 'selected-d41' : '');
      }
    });
    updateQuizResult();
  }

  function updateQuizResult() {
    var resultEl = document.getElementById('visa-quiz-result');
    if (!resultEl) return;
    var answers = quizState.answers;
    var answered = Object.keys(answers).length;
    if (answered < 4) {
      resultEl.classList.remove('show');
      return;
    }
    // Count scores
    var d26Score = 0, d41Score = 0;
    Object.values(answers).forEach(function(val) {
      if (val === 'd26') d26Score++;
      else if (val === 'd41') d41Score++;
      else { d26Score += 0.5; d41Score += 0.5; }
    });

    var result = d26Score > d41Score ? 'd26' : (d41Score > d26Score ? 'd41' : 'equal');
    resultEl.className = 'visa-quiz-result show result-' + result;

    if (result === 'd26') {
      resultEl.innerHTML = '<strong>🎯 D2-6 — Trao đổi sinh viên</strong>' +
        '<p>Hồ sơ của bạn có vẻ phù hợp với Visa D2-6. Bạn có nền tảng học tập tại trường liên kết, mục tiêu chuyên ngành rõ ràng. Hãy bắt đầu với bước kiểm tra hồ sơ và chọn trường phù hợp.</p>' +
        '<button type="button" class="vh-btn vh-btn-d26" onclick="window.showSchool(\'schools\')">Xem trường D2-6 →</button>';
    } else if (result === 'd41') {
      resultEl.innerHTML = '<strong>🗣️ D4-1 — Học tiếng Hàn</strong>' +
        '<p>Hồ sơ của bạn có vẻ phù hợp với Visa D4-1. Bạn muốn học tiếng Hàn trước, xây dựng nền tảng rồi mới tính tiếp. Đây là lựa chọn tốt để bắt đầu hành trình du học.</p>' +
        '<button type="button" class="vh-btn vh-btn-d41" onclick="window.showSchool(\'d4-1\')">Xem trường D4-1 →</button>';
    } else {
      resultEl.innerHTML = '<strong>🤔 Bạn phù hợp với cả hai!</strong>' +
        '<p>Tuỳ vào ưu tiên cá nhân và trường bạn muốn theo học. Hãy tham khảo bảng so sánh bên trên và dùng công cụ phân tích hồ sơ để có gợi ý chính xác hơn.</p>' +
        '<button type="button" class="vh-btn vh-btn-d26" onclick="window.showSchool(\'advisor\')">Phân tích hồ sơ →</button>';
    }
  }

  function renderVisaQuiz() {
    quizState.answers = {};
    var questionsHtml = quizQuestions.map(function(q) {
      var optsHtml = q.options.map(function(opt) {
        return '<button type="button" class="visa-quiz-opt" data-q="' + q.id + '" data-val="' + opt.value + '" onclick="window._vhQuizAnswer(\'' + q.id + '\',\'' + opt.value + '\')">' + opt.label + '</button>';
      }).join('');
      return '<div class="visa-quiz-question">' +
        '<div class="visa-quiz-q">' + q.question + '</div>' +
        '<div class="visa-quiz-options">' + optsHtml + '</div>' +
      '</div>';
    }).join('');

    return '<div class="visa-quiz-wrap">' +
      '<div class="visa-quiz-head">' +
        '<h3>🤔 Bạn hợp với visa nào?</h3>' +
        '<p>Trả lời 4 câu hỏi nhanh để nhận gợi ý loại visa phù hợp với hồ sơ của bạn.</p>' +
      '</div>' +
      '<div id="visa-quiz-questions">' + questionsHtml + '</div>' +
      '<div id="visa-quiz-result" class="visa-quiz-result"></div>' +
    '</div>';
  }

  // ─── Render D2-6 flowchart ───
  function renderD26Flowchart() {
    var steps = [
      { num: 1, title: 'Kiểm tra MOU', desc: 'Xác nhận trường bạn có MOU với trường Hàn không' },
      { num: 2, title: 'Chọn trường Hàn', desc: 'Lọc theo khu vực, học phí, điều kiện đầu vào' },
      { num: 3, title: 'Chuẩn bị hồ sơ', desc: 'Học tập, tài chính, nhân thân + giấy tờ trường' },
      { num: 4, title: 'Nộp trường', desc: 'Chờ thư mời, bổ sung nếu cần' },
      { num: 5, title: 'Nộp visa', desc: 'KVAC/LSQ HCM với bộ hồ sơ đầy đủ' },
    ];
    return '<div class="visa-flowchart">' + steps.map(function(s) {
      return '<div class="visa-flow-step">' +
        '<div class="step-num d26-step">' + s.num + '</div>' +
        '<h4>' + s.title + '</h4>' +
        '<p>' + s.desc + '</p>' +
      '</div>';
    }).join('') + '</div>';
  }

  // ─── Render D4-1 flowchart ───
  function renderD41Flowchart() {
    var steps = [
      { num: 1, title: 'Chọn trường tiếng', desc: 'Lọc trường dạy tiếng Hàn, xem học phí + KTX' },
      { num: 2, title: 'Chuẩn bị hồ sơ', desc: 'Học bạ, tài chính, CCCD, hộ chiếu' },
      { num: 3, title: 'Đăng ký nhập học', desc: 'Nộp đơn + lệ phí, nhận thư mời' },
      { num: 4, title: 'Nộp visa D4-1', desc: 'KVAC Hà Nội hoặc LSQ TP.HCM' },
      { num: 5, title: 'Sang Hàn', desc: 'Nhập học, xin chuyển tiếp sau khi đủ TOPIK' },
    ];
    return '<div class="visa-flowchart">' + steps.map(function(s) {
      return '<div class="visa-flow-step">' +
        '<div class="step-num d41-step">' + s.num + '</div>' +
        '<h4>' + s.title + '</h4>' +
        '<p>' + s.desc + '</p>' +
      '</div>';
    }).join('') + '</div>';
  }

  // ─── Entry point: render full visa section ───
  function renderVisaSection(visaType) {
    var isD41 = visaType === 'D4-1';
    return renderVisaHero(visaType) +
      renderVisaComparison() +
      renderVisaQuiz() +
      (isD41 ? renderD41Flowchart() : renderD26Flowchart());
  }

  // ─── Expose to window ───
  window.renderVisaSection = renderVisaSection;
  window._vhQuizAnswer = handleQuizAnswer;

  // ─── Init ───
  injectStyles();

})();
