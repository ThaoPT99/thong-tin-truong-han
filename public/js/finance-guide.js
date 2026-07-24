/**
 * finance-guide.js — Hướng dẫn dòng tiền & tài chính (Nâng cấp)
 * 
 * Cung cấp:
 * 1. Kiểm tra tương quan thu nhập vs sổ tiết kiệm
 * 2. Hướng dẫn kỹ thuật built-up sổ tiết kiệm
 * 3. Hướng dẫn chuẩn bị sao kê ngân hàng
 * 4. Giải trình nguồn tiền
 * 5. ĐIỂM TÀI CHÍNH tổng thể (0-100)
 * 6. TEMPLATE GIẢI TRÌNH theo từng nguồn thu
 * 7. DANH SÁCH GIẤY TỜ yêu cầu theo nguồn thu nhập
 * 8. Cảnh báo thông minh tích hợp
 */

(function() {
  'use strict';

  // ─── Helper: safe escapeHtml (fallback nếu api-loader chưa load) ───
  function safeEscape(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    var d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
  }

  // ─── Inject styles ───
  function injectStyles() {
    var css = `
      .fg-widget {
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .fg-widget h4 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        font-weight: 700;
        color: var(--text, #1e293b);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .fg-widget p, .fg-widget li {
        font-size: 0.88rem;
        line-height: 1.6;
        color: var(--text-muted, #475569);
      }
      .fg-widget p { margin: 0 0 0.5rem; }
      .fg-widget ul, .fg-widget ol {
        margin: 0.25rem 0 0.75rem;
        padding-left: 1.25rem;
      }
      .fg-widget li { margin-bottom: 0.35rem; }

      .fg-card {
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 0.75rem;
      }
      .fg-card-header {
        padding: 0.75rem 1rem;
        background: rgba(0,0,0,0.02);
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background 0.2s;
        color: var(--text, #1e293b);
      }
      .fg-card-header:hover {
        background: rgba(0,0,0,0.04);
      }
      .fg-card-header .fg-chevron {
        transition: transform 0.2s;
        font-size: 0.75rem;
        color: var(--text-muted, #94a3b8);
      }
      .fg-card-header .fg-chevron.open {
        transform: rotate(180deg);
      }
      .fg-card-body {
        padding: 0 1rem 0.75rem;
        display: none;
      }
      .fg-card-body.open {
        display: block;
        animation: fgFadeIn 0.25s ease;
      }

      /* Income-savings ratio indicator */
      .fg-ratio {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        margin: 0.75rem 0;
        border: 1.5px solid;
      }
      .fg-ratio.fg-ratio-good {
        background: rgba(16, 185, 129, 0.06);
        border-color: #10b981;
      }
      .fg-ratio.fg-ratio-warn {
        background: rgba(245, 158, 11, 0.06);
        border-color: #f59e0b;
      }
      .fg-ratio.fg-ratio-bad {
        background: rgba(239, 68, 68, 0.06);
        border-color: #ef4444;
      }
      .fg-ratio-icon { font-size: 1.5rem; flex-shrink: 0; }
      .fg-ratio-text { flex: 1; }
      .fg-ratio-text strong {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
        color: var(--text, #1e293b);
      }
      .fg-ratio-text span {
        font-size: 0.82rem;
        color: var(--text-muted, #64748b);
      }
      .fg-ratio-text .fg-ratio-detail {
        margin-top: 0.4rem;
        padding: 0.4rem 0.6rem;
        background: rgba(0,0,0,0.03);
        border-radius: 6px;
        font-size: 0.8rem;
      }

      /* ─── Financial Score ─── */
      .fg-score-wrap {
        text-align: center;
        padding: 1.25rem;
        border-radius: 16px;
        margin-bottom: 1rem;
        border: 2px solid;
      }
      .fg-score-number {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1;
      }
      .fg-score-label {
        font-size: 0.9rem;
        font-weight: 600;
        margin-top: 0.25rem;
      }
      .fg-score-desc {
        font-size: 0.82rem;
        margin-top: 0.4rem;
        line-height: 1.4;
        opacity: 0.8;
      }
      .fg-score-bars {
        display: flex;
        gap: 0.4rem;
        margin: 0.75rem 0 0.25rem;
        justify-content: center;
      }
      .fg-score-bar {
        width: 32px;
        height: 4px;
        border-radius: 2px;
        background: var(--border, #e2e8f0);
        transition: background 0.3s;
      }
      .fg-score-bar.filled-green { background: #10b981; }
      .fg-score-bar.filled-yellow { background: #f59e0b; }
      .fg-score-bar.filled-red { background: #ef4444; }

      /* ─── Doc requirements grid ─── */
      .fg-docs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
        margin: 0.75rem 0;
      }
      .fg-doc-item {
        padding: 0.6rem 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border, #e2e8f0);
        background: rgba(0,0,0,0.015);
        font-size: 0.82rem;
      }
      .fg-doc-item strong {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 0.2rem;
        color: var(--text, #1e293b);
      }
      .fg-doc-item span {
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
      }
      .fg-doc-required {
        border-left: 3px solid #ef4444;
      }
      .fg-doc-recommended {
        border-left: 3px solid #f59e0b;
      }
      .fg-doc-optional {
        border-left: 3px solid #3b82f6;
      }

      /* ─── Template preview ─── */
      .fg-template {
        background: #f8fafc;
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        padding: 1rem 1.25rem;
        margin: 0.75rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
        color: var(--text, #1e293b);
        max-height: 300px;
        overflow-y: auto;
      }
      .fg-template-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .fg-template-actions button {
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        border: 1px solid var(--border, #e2e8f0);
        background: #fff;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
        color: var(--text, #1e293b);
      }
      .fg-template-actions button:hover {
        border-color: var(--accent, #2563eb);
        color: var(--accent, #2563eb);
      }
      .fg-template-actions .fg-btn-copy {
        background: #2563eb;
        color: #fff;
        border-color: #2563eb;
      }
      .fg-template-actions .fg-btn-copy:hover {
        background: #1d4ed8;
      }
      .fg-copied-toast {
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
      .fg-copied-toast.show {
        opacity: 1;
      }

      @keyframes fgFadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Tag badges */
      .fg-tag {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 1px 2px;
      }
      .fg-tag-green { background: #d1fae5; color: #065f46; }
      .fg-tag-yellow { background: #fef3c7; color: #92400e; }
      .fg-tag-red { background: #fee2e2; color: #991b1b; }
      .fg-tag-blue { background: #dbeafe; color: #1e40af; }

      /* Built-up timeline */
      .fg-timeline {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin: 0.75rem 0;
        overflow-x: auto;
        padding-bottom: 0.5rem;
      }
      .fg-timeline-step {
        flex: 1;
        min-width: 100px;
        text-align: center;
        padding: 0.6rem 0.5rem;
        border-radius: 8px;
        background: rgba(0,0,0,0.02);
        border: 1px solid var(--border, #e2e8f0);
        font-size: 0.78rem;
        position: relative;
      }
      .fg-timeline-step::after {
        content: '→';
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted, #94a3b8);
        font-size: 1rem;
      }
      .fg-timeline-step:last-child::after { display: none; }
      .fg-timeline-step .fg-tl-week {
        font-weight: 700;
        color: var(--text, #1e293b);
        display: block;
        margin-bottom: 0.2rem;
      }
      .fg-timeline-step .fg-tl-desc {
        color: var(--text-muted, #64748b);
        font-size: 0.72rem;
        line-height: 1.3;
      }
      .fg-timeline-step.fg-tl-active {
        border-color: #2563eb;
        background: rgba(37, 99, 235, 0.06);
      }
      .fg-timeline-step.fg-tl-active .fg-tl-week { color: #2563eb; }

      @media (max-width: 768px) {
        .fg-widget { padding: 1rem; }
        .fg-timeline { gap: 0.3rem; }
        .fg-timeline-step { min-width: 80px; padding: 0.4rem 0.3rem; }
        .fg-ratio { flex-direction: column; text-align: center; }
        .fg-score-number { font-size: 2rem; }
      }

      /* ─── Income source selector ─── */
      .fg-sel {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1.5px solid var(--border, #e2e8f0);
        border-radius: 8px;
        background: #fff;
        font: inherit;
        font-size: 0.88rem;
        color: var(--text, #1e293b);
        margin-bottom: 0.75rem;
      }
      .fg-sel:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
      }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ─── Toggle card ───
  function toggleCard(id) {
    var body = document.getElementById(id);
    var chevron = document.querySelector('[data-fg-card="' + id + '"] .fg-chevron');
    if (!body) return;
    var isOpen = body.classList.toggle('open');
    if (chevron) chevron.classList.toggle('open', isOpen);
  }

  // ─── Show toast ───
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'fg-copied-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() {
      t.classList.add('show');
    });
    setTimeout(function() {
      t.classList.remove('show');
      setTimeout(function() { t.remove(); }, 300);
    }, 2000);
  }

  // ═══════════════════════════════════════════
  // 1. FINANCIAL HEALTH SCORE
  // ═══════════════════════════════════════════

  /**
   * Tính điểm tài chính tổng thể (0-100)
   * Dựa trên: savings amount, monthly income, savings duration, income source
   */
  function calculateFinancialScore(profile) {
    profile = profile || {};
    var score = 0;
    var maxScore = 100;
    var details = [];

    var visaType = profile.visaType || 'D-4-1';
    // D-2 mức tối thiểu dao động $10,000-$20,000 tuỳ trường; dùng $15,000 làm mức trung bình cho scoring
    var minSavings = (visaType === 'D-2' || visaType === 'D-2-6') ? 15000 : 10000;
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;
    var savingsDuration = profile.savingsDurationMonths;
    var incomeSource = profile.incomeSource || '';
    var hasStatement = profile.hasSavingsStatement;

    // 1. Savings amount (tối đa 35 điểm)
    if (savings <= 0) {
      // 0 điểm
    } else if (savings >= minSavings * 2) {
      score += 35;
      details.push({ icon: '✅', text: 'Sổ TK gấp đôi mức tối thiểu', pts: 35 });
    } else if (savings >= minSavings * 1.3) {
      score += 30;
      details.push({ icon: '✅', text: 'Sổ TK vượt mức tối thiểu', pts: 30 });
    } else if (savings >= minSavings) {
      score += 22;
      details.push({ icon: '⚠️', text: 'Sổ TK đạt mức tối thiểu', pts: 22 });
    } else if (savings > 0) {
      score += 10;
      details.push({ icon: '⚠️', text: 'Sổ TK chưa đủ mức tối thiểu', pts: 10 });
    }

    // 2. Income-savings ratio (tối đa 25 điểm)
    if (savings > 0 && monthlyIncome > 0) {
      var ratio = savings / monthlyIncome;
      if (ratio <= 12) {
        score += 25;
        details.push({ icon: '✅', text: 'Tương quan thu nhập hợp lý', pts: 25 });
      } else if (ratio <= 18) {
        score += 18;
        details.push({ icon: '⚠️', text: 'Tương quan thu nhập hơi cao', pts: 18 });
      } else if (ratio <= 24) {
        score += 10;
        details.push({ icon: '⚠️', text: 'Tương quan thu nhập cần giải trình', pts: 10 });
      } else {
        score += 3;
        details.push({ icon: '🚨', text: 'Tương quan thu nhập bất hợp lý', pts: 3 });
      }
    } else if (monthlyIncome > 0) {
      score += 5;
      details.push({ icon: 'ℹ️', text: 'Chưa có sổ TK để so sánh thu nhập', pts: 5 });
    }

    // 3. Savings duration (tối đa 20 điểm)
    if (savingsDuration !== null && savingsDuration !== undefined && savingsDuration !== '') {
      var dur = parseInt(savingsDuration);
      if (dur >= 12) {
        score += 20;
        details.push({ icon: '✅', text: 'Sổ TK mở ≥12 tháng', pts: 20 });
      } else if (dur >= 6) {
        score += 15;
        details.push({ icon: '✅', text: 'Sổ TK mở ≥6 tháng', pts: 15 });
      } else if (dur >= 3) {
        score += 10;
        details.push({ icon: '⚠️', text: 'Sổ TK mở ≥3 tháng (chấp nhận được)', pts: 10 });
      } else if (dur >= 1) {
        score += 4;
        details.push({ icon: '🚨', text: 'Sổ TK mới mở <3 tháng — rủi ro', pts: 4 });
      } else {
        score += 1;
        details.push({ icon: '🚨', text: 'Chưa mở sổ TK', pts: 1 });
      }
    }

    // 4. Income source (tối đa 10 điểm)
    if (incomeSource && incomeSource !== '') {
      var reliableSources = ['salary', 'business', 'rental', 'multiple'];
      if (reliableSources.indexOf(incomeSource) !== -1) {
        score += 10;
        details.push({ icon: '✅', text: 'Nguồn thu dễ chứng minh', pts: 10 });
      } else {
        score += 6;
        details.push({ icon: '⚠️', text: 'Nguồn thu cần chứng minh thêm', pts: 6 });
      }
    }

    // 5. Bank statement readiness (tối đa 10 điểm)
    if (hasStatement === 'ready') {
      score += 10;
      details.push({ icon: '✅', text: 'Đã có sao kê ngân hàng', pts: 10 });
    } else if (hasStatement === 'need') {
      score += 5;
      details.push({ icon: '⚠️', text: 'Có thể lấy sao kê ngân hàng', pts: 5 });
    } else if (hasStatement === 'no_account') {
      score += 1;
      details.push({ icon: '🚨', text: 'Không có tài khoản ngân hàng', pts: 1 });
    }

    return {
      score: Math.min(maxScore, Math.max(0, score)),
      maxScore: maxScore,
      details: details,
      level: score >= 80 ? 'good' : score >= 60 ? 'medium' : score >= 40 ? 'warning' : 'critical',
      label: score >= 80 ? '✅ Tài chính VỮNG' 
           : score >= 60 ? '⚠️ Tài chính TẠM ỔN' 
           : score >= 40 ? '🚨 Tài chính YẾU' 
           : '❌ Tài chính RỦI RO CAO',
      description: score >= 80 ? 'Hồ sơ tài chính của bạn rất tốt. Tiếp tục duy trì.'
                 : score >= 60 ? 'Hồ sơ tài chính tạm ổn, cần bổ sung một số giấy tờ.'
                 : score >= 40 ? 'Hồ sơ tài chính yếu. Cần cải thiện ngay trước khi nộp visa.'
                 : 'Hồ sơ tài chính rất yếu. Nguy cơ trượt visa cao do vấn đề tài chính.',
    };
  }

  function renderScoreBars(score, maxScore) {
    var bars = 10;
    var filled = Math.round((score / maxScore) * bars);
    var html = '<div class="fg-score-bars">';
    for (var i = 0; i < bars; i++) {
      var cls = '';
      if (i < filled) {
        if (score >= 80) cls = 'filled-green';
        else if (score >= 60) cls = 'filled-yellow';
        else cls = 'filled-red';
      }
      html += '<div class="fg-score-bar ' + cls + '"></div>';
    }
    html += '</div>';
    return html;
  }

  function renderFinancialScore(profile) {
    profile = profile || {};
    var result = calculateFinancialScore(profile);
    var colorMap = {
      good: '#10b981',
      medium: '#f59e0b',
      warning: '#ef4444',
      critical: '#dc2626',
    };
    var bgMap = {
      good: 'rgba(16,185,129,0.06)',
      medium: 'rgba(245,158,11,0.06)',
      warning: 'rgba(239,68,68,0.06)',
      critical: 'rgba(220,38,38,0.08)',
    };
    var color = colorMap[result.level] || '#6b7280';
    var bg = bgMap[result.level] || 'rgba(0,0,0,0.02)';

    var detailsHtml = result.details.map(function(d) {
      return '<div style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0;font-size:0.82rem;">' +
        '<span>' + d.icon + '</span>' +
        '<span style="flex:1;color:var(--text,#1e293b);">' + d.text + '</span>' +
        '<span style="font-weight:700;color:' + color + ';">+' + d.pts + '</span>' +
      '</div>';
    }).join('');

    return '<div class="fg-score-wrap" style="border-color:' + color + ';background:' + bg + ';">' +
      '<div class="fg-score-number" style="color:' + color + ';">' + result.score + '</div>' +
      renderScoreBars(result.score, result.maxScore) +
      '<div class="fg-score-label" style="color:' + color + ';">' + result.label + '</div>' +
      '<div class="fg-score-desc">' + result.description + '</div>' +
      '<div style="margin-top:0.75rem;text-align:left;padding:0.5rem;border-radius:8px;background:rgba(255,255,255,0.7);">' +
        detailsHtml +
      '</div>' +
    '</div>';
  }

  // ═══════════════════════════════════════════
  // 2. DOCUMENT REQUIREMENTS BY INCOME SOURCE
  // ═══════════════════════════════════════════

  var INCOME_SOURCE_DOCS = {
    'salary': {
      label: 'Lương (nhân viên)',
      required: [
        { text: 'Hợp đồng lao động (bản sao + dịch công chứng)', note: 'Thể hiện rõ mức lương, chức vụ, thời hạn' },
        { text: 'Sao kê lương 3-6 tháng gần nhất', note: 'Từ tài khoản ngân hàng nhận lương' },
        { text: 'Giấy xác nhận công việc (có dấu mộc)', note: 'Ghi rõ thu nhập hàng tháng, ngày ký gần nhất' },
        { text: 'Giấy đăng ký BHXH hoặc bảng lương (nếu có)', note: 'Tăng độ tin cậy' },
      ],
      recommended: [
        { text: 'Sao kê tài khoản ngân hàng 6 tháng', note: 'Thể hiện dòng tiền lương ổn định' },
        { text: 'Giấy phép lao động / Quyết định bổ nhiệm', note: 'Nếu là công chức nhà nước' },
      ],
    },
    'business': {
      label: 'Kinh doanh / Doanh nghiệp',
      required: [
        { text: 'Giấy phép đăng ký kinh doanh (bản sao)', note: 'Cần công chứng' },
        { text: 'Báo cáo thuế 6-12 tháng gần nhất', note: 'Có dấu thuế hoặc chữ ký số' },
        { text: 'Sao kê tài khoản ngân hàng kinh doanh', note: 'Thể hiện dòng tiền kinh doanh' },
      ],
      recommended: [
        { text: 'Hợp đồng cung cấp dịch vụ/hàng hoá', note: 'Chứng minh hoạt động kinh doanh thực tế' },
        { text: 'Giấy xác nhận doanh thu (có xác nhận của cơ quan thuế)', note: 'Nếu có' },
        { text: 'Bảng lương nhân viên (nếu có)', note: 'Thể hiện quy mô doanh nghiệp' },
      ],
    },
    'freelance': {
      label: 'Tự do / Freelance',
      required: [
        { text: 'Hợp đồng dịch vụ / Hợp đồng cộng tác', note: 'Càng nhiều hợp đồng càng tốt' },
        { text: 'Sao kê tài khoản ngân hàng nhận thanh toán', note: 'Thể hiện dòng tiền đều đặn' },
        { text: 'Giấy xác nhận thu nhập (có công chứng)', note: 'Tự khai và xác nhận tại phường/xã' },
      ],
      recommended: [
        { text: 'Bảng kê công việc đã thực hiện', note: 'List dự án đã làm, thời gian, giá trị' },
        { text: 'Chứng từ thanh toán (hoá đơn, phiếu thu)', note: 'Nếu có xuất hoá đơn' },
        { text: 'Giấy nộp thuế thu nhập cá nhân', note: 'Nếu đóng thuế TNCN' },
      ],
    },
    'rental': {
      label: 'Cho thuê tài sản',
      required: [
        { text: 'Hợp đồng cho thuê nhà/đất (có công chứng)', note: 'Thể hiện giá trị cho thuê hàng tháng' },
        { text: 'Sao kê tài khoản nhận tiền cho thuê', note: 'Dòng tiền đều đặn hàng tháng' },
        { text: 'Giấy chứng nhận quyền sở hữu tài sản (sổ đỏ/sổ hồng)', note: 'Chứng minh tài sản cho thuê là có thật' },
      ],
      recommended: [
        { text: 'Tờ khai thuế cho thuê tài sản', note: 'Nếu có đóng thuế' },
        { text: 'Giấy xác nhận của phường/xã về hoạt động cho thuê', note: 'Tăng độ tin cậy' },
      ],
    },
    'agriculture': {
      label: 'Nông nghiệp',
      required: [
        { text: 'Giấy chứng nhận quyền sử dụng đất nông nghiệp', note: 'Sổ đỏ/sổ xanh' },
        { text: 'Giấy xác nhận của UBND xã/phường về thu nhập nông nghiệp', note: 'Có dấu mộc' },
        { text: 'Sao kê ngân hàng (nếu có giao dịch nông sản)', note: 'Thể hiện dòng tiền từ nông nghiệp' },
      ],
      recommended: [
        { text: 'Hợp đồng thu mua nông sản (nếu có)', note: 'Với các thương lái/doanh nghiệp' },
        { text: 'Giấy tờ chứng minh diện tích canh tác', note: 'Xác nhận của địa phương' },
      ],
    },
    'invest': {
      label: 'Đầu tư / Cổ tức',
      required: [
        { text: 'Giấy xác nhận đầu tư / chứng chỉ cổ phiếu', note: 'Từ công ty chứng khoán' },
        { text: 'Sao kê tài khoản chứng khoán 6 tháng', note: 'Thể hiện lịch sử giao dịch và lợi nhuận' },
        { text: 'Giấy xác nhận thu nhập từ đầu tư (có dấu)', note: 'Từ công ty/cơ quan quản lý' },
      ],
      recommended: [
        { text: 'Báo cáo tài chính cá nhân', note: 'Tổng quan danh mục đầu tư' },
        { text: 'Giấy nộp thuế thu nhập từ đầu tư', note: 'Nếu có' },
      ],
    },
    'multiple': {
      label: 'Nhiều nguồn',
      required: [
        { text: 'Tổng hợp các nguồn thu nhập (bảng kê)', note: 'Liệt kê từng nguồn, số tiền, tần suất' },
        { text: 'Giấy tờ chứng minh từng nguồn', note: 'Mỗi nguồn cần giấy tờ tương ứng' },
      ],
      recommended: [
        { text: 'Sao kê tất cả tài khoản ngân hàng', note: 'Thể hiện dòng tiền từ nhiều nguồn' },
        { text: 'Tờ khai thuế tổng hợp', note: 'Nếu có' },
      ],
    },
  };

  function renderDocRequirements(incomeSource) {
    var info = INCOME_SOURCE_DOCS[incomeSource];
    if (!info) return '<p style="font-size:0.85rem;color:var(--text-muted);">Chọn nguồn thu nhập để xem danh sách giấy tờ cần chuẩn bị.</p>';

    var requiredHtml = info.required.map(function(item) {
      return '<div class="fg-doc-item fg-doc-required">' +
        '<strong>' + safeEscape(item.text) + '</strong>' +
        '<span>' + safeEscape(item.note) + '</span>' +
      '</div>';
    }).join('');

    var recHtml = info.recommended.map(function(item) {
      return '<div class="fg-doc-item fg-doc-recommended">' +
        '<strong>' + safeEscape(item.text) + '</strong>' +
        '<span>' + safeEscape(item.note) + '</span>' +
      '</div>';
    }).join('');

    return '<div style="margin-top:0.5rem;">'+'<p style="font-weight:600;font-size:0.88rem;margin-bottom:0.5rem;color:var(--text,#1e293b);">📋 Giấy tờ cần chuẩn bị — <span style="font-weight:400;color:var(--text-muted);">' + safeEscape(info.label) + '</span></p>' +
      '<div class="fg-docs-grid">' +
        requiredHtml +
      '</div>' +
      (recHtml ? '<div style="margin-top:0.5rem;"><p style="font-weight:600;font-size:0.82rem;color:var(--text-muted,#64748b);margin-bottom:0.4rem;">Nên có thêm:</p><div class="fg-docs-grid">' + recHtml + '</div></div>' : '') +
      '<p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;border-top:1px solid var(--border);padding-top:0.5rem;">' +
        '🔴 <strong>Bắt buộc</strong> | 🟡 <strong>Nên có</strong> | 🔵 <strong>Khuyến khích</strong><br>' +
        'Tất cả giấy tờ cần dịch công chứng sang tiếng Hàn hoặc tiếng Anh.' +
      '</p>' +
    '</div>';
  }

  // ═══════════════════════════════════════════
  // 3. FUNDING EXPLANATION TEMPLATE
  // ═══════════════════════════════════════════

  function generateFundingTemplate(profile) {
    profile = profile || {};
    var fullName = profile.fullName || '[HỌ VÀ TÊN]';
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;
    var incomeSource = profile.incomeSource || '';
    var sponsorName = profile.sponsorName || '[TÊN NGƯỜI BẢO LÃNH]';
    var sponsorRelation = profile.sponsorRelation || '';
    var isSelf = profile.sponsorIsSelf !== false;
    var occupation = profile.sponsorOccupation || '[NGHỀ NGHIỆP]';
    var visaType = profile.visaType || 'D-4-1';

    var incomeSourceLabels = {
      'salary': 'lương từ công việc',
      'business': 'kinh doanh / doanh nghiệp',
      'freelance': 'công việc tự do',
      'rental': 'thu nhập từ cho thuê tài sản',
      'agriculture': 'thu nhập từ nông nghiệp',
      'invest': 'thu nhập từ đầu tư',
      'multiple': 'nhiều nguồn thu nhập khác nhau',
    };
    var sourceText = incomeSourceLabels[incomeSource] || 'thu nhập ổn định';

    var sponsorSection = isSelf
      ? 'Tôi, ' + fullName + ', hiện đang làm việc với mức thu nhập ' + monthlyIncome.toLocaleString() + ' USD/tháng từ ' + sourceText + '.'
      : 'Người bảo lãnh tài chính của tôi là ' + sponsorName + ' (' + (sponsorRelation === 'parent' ? 'cha/mẹ' : 'người thân') + '), hiện đang làm ' + occupation + ' với mức thu nhập ' + monthlyIncome.toLocaleString() + ' USD/tháng từ ' + sourceText + '.';

    var sourceDetailText = '';
    if (incomeSource === 'salary') {
      sourceDetailText = 'Thu nhập từ lương được xác nhận qua hợp đồng lao động, sao kê lương hàng tháng và giấy xác nhận công việc từ công ty.';
    } else if (incomeSource === 'business') {
      sourceDetailText = 'Thu nhập từ hoạt động kinh doanh được chứng minh qua giấy phép đăng ký kinh doanh, báo cáo thuế và sao kê tài khoản ngân hàng kinh doanh.';
    } else if (incomeSource === 'freelance') {
      sourceDetailText = 'Thu nhập từ công việc tự do được chứng minh qua các hợp đồng dịch vụ, sao kê tài khoản nhận thanh toán và xác nhận thu nhập.';
    } else if (incomeSource === 'rental') {
      sourceDetailText = 'Thu nhập từ cho thuê tài sản được chứng minh qua hợp đồng cho thuê, giấy chứng nhận quyền sở hữu tài sản và sao kê tài khoản nhận tiền thuê.';
    } else if (incomeSource === 'agriculture') {
      sourceDetailText = 'Thu nhập từ nông nghiệp được chứng minh qua giấy chứng nhận quyền sử dụng đất và xác nhận của chính quyền địa phương.';
    } else if (incomeSource === 'invest') {
      sourceDetailText = 'Thu nhập từ đầu tư được chứng minh qua xác nhận danh mục đầu tư, sao kê tài khoản chứng khoán và giấy tờ thu nhập từ đầu tư.';
    } else if (incomeSource === 'multiple') {
      sourceDetailText = 'Thu nhập đến từ nhiều nguồn khác nhau và được chứng minh qua các giấy tờ tương ứng cho từng nguồn.';
    } else {
      sourceDetailText = 'Thu nhập được chứng minh qua các giấy tờ thu nhập kèm theo hồ sơ.';
    }

    var savingsDesc = savings > 0
      ? 'Số tiền ' + savings.toLocaleString() + ' USD trong sổ tiết kiệm là kết quả của quá trình tích luỹ từ thu nhập ổn định qua nhiều năm. Nguồn gốc số tiền này hoàn toàn hợp pháp và minh bạch.'
      : 'Sổ tiết kiệm sẽ được mở trước thời điểm nộp hồ sơ ít nhất 3 tháng với số tiền phù hợp yêu cầu visa ' + visaType + '.';

    var template = 'GIẢI TRÌNH NGUỒN GỐC TÀI CHÍNH\n' +
      '─────────────────────────────────────\n' +
      'Kính gửi: Đại sứ quán/Lãnh sự quán Hàn Quốc tại Việt Nam\n\n' +
      'Tôi tên là: ' + fullName + '\n' +
      'Xin trình bày về nguồn gốc tài chính phục vụ cho kế hoạch du học tại Hàn Quốc (visa ' + visaType + ') như sau:\n\n' +
      '1. THÔNG TIN NGƯỜI BẢO LÃNH TÀI CHÍNH\n' +
      sponsorSection + '\n\n' +
      '2. CHI TIẾT NGUỒN THU NHẬP\n' +
      sourceDetailText + '\n\n' +
      '3. SỔ TIẾT KIỆM\n' +
      savingsDesc + '\n\n' +
      '4. CAM KẾT\n' +
      'Tôi cam đoan toàn bộ thông tin trên là đúng sự thật. Tất cả giấy tờ chứng minh tài chính kèm theo đều hợp lệ và có giá trị pháp lý.\n\n' +
      'Ngày ..... tháng ..... năm .....\n' +
      'Người khai\n' +
      '(Ký và ghi rõ họ tên)\n' +
      fullName;

    return template;
  }

  function renderFundingTemplate(profile) {
    profile = profile || {};
    var template = generateFundingTemplate(profile);

    return '<div style="margin-top:0.75rem;">' +
      '<p style="font-weight:600;font-size:0.88rem;color:var(--text,#1e293b);">📝 Mẫu giải trình nguồn gốc tài chính</p>' +
      '<p style="font-size:0.82rem;color:var(--text-muted,#64748b);margin-bottom:0.5rem;">' +
        'Dựa trên thông tin bạn đã nhập, đây là mẫu giải trình nguồn gốc tài chính. Bạn có thể copy và chỉnh sửa cho phù hợp với hoàn cảnh thực tế.' +
      '</p>' +
      '<div class="fg-template" id="fg-template-text">' + safeEscape(template) + '</div>' +
      '<div class="fg-template-actions">' +
        '<button type="button" class="fg-btn-copy" onclick="window._fgCopyTemplate()">📋 Copy giải trình</button>' +
        '<button type="button" onclick="document.getElementById(\'fg-template-text\').classList.toggle(\'fg-template-collapsed\')">👁️ Thu nhỏ</button>' +
      '</div>' +
    '</div>';
  }

  window._fgCopyTemplate = function() {
    var el = document.getElementById('fg-template-text');
    if (!el) return;
    var text = el.textContent || el.innerText;
    navigator.clipboard.writeText(text).then(function() {
      showToast('✅ Đã copy mẫu giải trình tài chính!');
    }).catch(function() {
      // Fallback: select + copy
      try {
        var range = document.createRange();
        range.selectNode(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        showToast('✅ Đã copy (phương pháp dự phòng)');
      } catch(e) {
        showToast('⚠️ Không thể copy tự động, hãy bôi đen và copy thủ công');
      }
    });
  };

  // ═══════════════════════════════════════════
  // 4. COMPREHENSIVE FINANCIAL CHECK
  // ═══════════════════════════════════════════

  /**
   * Phân tích toàn diện và trả về array các cảnh báo
   * Dùng cho risk-warning.js và checklist
   */
  function analyzeFinancialWarnings(profile) {
    profile = profile || {};
    var warnings = [];
    var visaType = profile.visaType || 'D-4-1';
    var minSavings = (visaType === 'D-2' || visaType === 'D-2-6') ? 18000 : 10000;
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;
    var savingsDuration = profile.savingsDurationMonths;

    // 1. Không có sổ TK
    if (savings <= 0) {
      warnings.push({
        icon: '💰',
        level: 'critical',
        text: 'Chưa có sổ tiết kiệm. Cần tối thiểu ' + minSavings.toLocaleString() + ' USD cho visa ' + visaType + '. Nên mở sổ ngay, ít nhất 3-6 tháng trước khi nộp hồ sơ.',
        action: 'Mở sổ TK ngay',
        actionTarget: 'checklist',
      });
    }
    // 2. Sổ TK thiếu
    else if (savings < minSavings) {
      warnings.push({
        icon: '💰',
        level: 'high',
        text: 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD chưa đủ mức tối thiểu ' + minSavings.toLocaleString() + ' USD cho ' + visaType + '. Cần bổ sung thêm ' + (minSavings - savings).toLocaleString() + ' USD.',
        action: 'Bổ sung TK',
        actionTarget: 'checklist',
      });
    }
    // 3. Sổ mới mở quá gần
    if (savingsDuration !== null && savingsDuration !== undefined && savingsDuration !== '' && savingsDuration < 3 && savings > 0) {
      warnings.push({
        icon: '⏰',
        level: 'high',
        text: 'Sổ tiết kiệm mới mở chưa được 3 tháng. ĐSQ sẽ soi kỹ sổ mới. Nếu còn thời gian, hãy đợi ít nhất 3 tháng trước khi nộp.',
        action: 'Xem hướng dẫn built-up',
        actionTarget: 'checklist',
      });
    }
    // 4. Tương quan thu nhập bất hợp lý
    if (savings > 0 && monthlyIncome > 0) {
      var ratio = savings / monthlyIncome;
      if (ratio > 24) {
        warnings.push({
          icon: '🚨',
          level: 'critical',
          text: 'Sổ TK (' + savings.toLocaleString() + ' USD) gấp ' + Math.round(ratio) + ' tháng thu nhập (' + monthlyIncome.toLocaleString() + ' USD/tháng). Tỉ lệ này rất khó giải trình — cần có bằng chứng tích luỹ nhiều năm hoặc bán tài sản/thừa kế.',
          action: 'Xem hướng dẫn giải trình',
          actionTarget: 'checklist',
        });
      } else if (ratio > 18) {
        warnings.push({
          icon: '⚠️',
          level: 'medium',
          text: 'Sổ TK gấp ' + Math.round(ratio) + ' tháng thu nhập. Mức này hơi cao — nên chuẩn bị giải trình nguồn gốc rõ ràng.',
          action: 'Xem template giải trình',
          actionTarget: 'checklist',
        });
      }
    }
    // 5. Chưa có nguồn thu nhập
    if (savings > 0 && !profile.incomeSource) {
      warnings.push({
        icon: '📋',
        level: 'medium',
        text: 'Chưa khai báo nguồn thu nhập. Cần xác định nguồn gốc số tiền trong sổ TK để chuẩn bị giải trình.',
        action: 'Khai báo nguồn thu',
        actionTarget: 'checklist',
      });
    }
    // 6. Chưa có sao kê ngân hàng
    if (!profile.hasSavingsStatement || profile.hasSavingsStatement === '') {
      warnings.push({
        icon: '🏦',
        level: 'medium',
        text: 'Chưa chuẩn bị sao kê ngân hàng. Cần sao kê tài khoản 3-6 tháng để chứng minh dòng tiền ổn định.',
        action: 'Xem hướng dẫn',
        actionTarget: 'checklist',
      });
    }
    // 7. Không có tài khoản ngân hàng
    if (profile.hasSavingsStatement === 'no_account') {
      warnings.push({
        icon: '🔴',
        level: 'high',
        text: 'Bạn không có tài khoản ngân hàng. Cần mở tài khoản ngay và duy trì giao dịch ít nhất 3 tháng trước khi nộp hồ sơ.',
        action: 'Hướng dẫn mở TK',
        actionTarget: 'checklist',
      });
    }

    return warnings;
  }

  /**
   * Export dạng đơn giản cho risk-warning.js
   * Trả về { score, level, warnings }
   */
  function getFinancialRiskSummary(profile) {
    var scoreResult = calculateFinancialScore(profile);
    var warnings = analyzeFinancialWarnings(profile);
    return {
      score: scoreResult.score,
      level: scoreResult.level,
      label: scoreResult.label,
      warnings: warnings,
      hasCriticalRisk: warnings.some(function(w) { return w.level === 'critical'; }),
      hasHighRisk: warnings.some(function(w) { return w.level === 'high' || w.level === 'critical'; }),
    };
  }

  // ═══════════════════════════════════════════
  // 5. RENDER: Income source selector + docs + template
  // ═══════════════════════════════════════════

  function renderSourceDocsAndTemplate(profile) {
    profile = profile || {};
    var currentSource = profile.incomeSource || '';

    var selOptions = Object.keys(INCOME_SOURCE_DOCS).map(function(key) {
      var selected = key === currentSource ? 'selected' : '';
      return '<option value="' + key + '" ' + selected + '>' + safeEscape(INCOME_SOURCE_DOCS[key].label) + '</option>';
    }).join('');

    return '<div id="fg-source-section">' +
      '<label style="font-weight:600;font-size:0.85rem;display:block;margin-bottom:0.3rem;color:var(--text,#1e293b);">Chọn nguồn thu nhập của bạn:</label>' +
      '<select class="fg-sel" id="fg-source-select" onchange="window._fgUpdateSourceDocs()">' +
        '<option value="">— Chọn nguồn thu nhập —</option>' +
        selOptions +
      '</select>' +
      '<div id="fg-source-docs">' +
        renderDocRequirements(currentSource) +
      '</div>' +
      '<div id="fg-funding-template">' +
        (currentSource ? renderFundingTemplate(profile) : '<p style="font-size:0.85rem;color:var(--text-muted);">Chọn nguồn thu nhập để xem mẫu giải trình.</p>') +
      '</div>' +
    '</div>';
  }

  window._fgUpdateSourceDocs = function() {
    var sel = document.getElementById('fg-source-select');
    if (!sel) return;
    var val = sel.value;
    var docsEl = document.getElementById('fg-source-docs');
    var tplEl = document.getElementById('fg-funding-template');
    if (docsEl) docsEl.innerHTML = renderDocRequirements(val);

    // Get profile from checklist global
    var profile = {};
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        var data = JSON.parse(raw);
        profile = data.profile || {};
      }
    } catch(e) {}
    profile.incomeSource = val;

    if (tplEl) {
      tplEl.innerHTML = val ? renderFundingTemplate(profile) : '<p style="font-size:0.85rem;color:var(--text-muted);">Chọn nguồn thu nhập để xem mẫu giải trình.</p>';
    }

    // Also update the score display
    var scoreEl = document.getElementById('fg-score-display');
    if (scoreEl) {
      profile.savingsAmount = parseFloat(document.getElementById('cl-savings')?.value) || 0;
      profile.monthlyIncome = parseFloat(document.getElementById('cl-monthly-income')?.value) || 0;
      var sd = document.getElementById('cl-savings-duration');
      profile.savingsDurationMonths = sd ? sd.value : null;
      var bs = document.getElementById('cl-bank-statement');
      profile.hasSavingsStatement = bs ? bs.value : '';
      scoreEl.innerHTML = renderFinancialScore(profile);
    }
  };

  // ═══════════════════════════════════════════
  // 6. MAIN: renderFinanceGuide (nâng cấp)
  // ═══════════════════════════════════════════

  function renderFinanceGuide(profile) {
    profile = profile || {};

    var savingsRatioHtml = renderSavingsRatio(profile);
    var scoreHtml = renderFinancialScore(profile);
    var sourceDocsHtml = renderSourceDocsAndTemplate(profile);

    return '<div class="fg-widget">' +
      '<h4>💰 Hướng dẫn dòng tiền & tài chính</h4>' +
      '<p>Đây là phần <strong>quan trọng nhất</strong> trong bộ hồ sơ du học Hàn Quốc. Hệ thống sẽ tự động đánh giá hồ sơ tài chính của bạn dựa trên thông tin đã nhập và đưa ra các khuyến nghị cụ thể.</p>' +

      // Financial Score
      scoreHtml +

      // Income-savings ratio
      (savingsRatioHtml || '<p style="color:var(--text-muted);font-size:0.82rem;font-style:italic;">💡 Nhập thu nhập hàng tháng và số tiền sổ TK ở form bên trên để xem đánh giá tương quan.</p>') +

      // Source selector + Docs + Template
      '<div style="margin:1rem 0 0;padding-top:1rem;border-top:1px solid var(--border);">' +
        sourceDocsHtml +
      '</div>' +

      // Guide cards
      '<div style="margin-top:1rem;">' +
        renderCard('fg-card-builtup', '📈 Kỹ thuật Built-up sổ tiết kiệm', false) +
        renderCard('fg-card-bank', '🏦 Chuẩn bị sao kê ngân hàng', false) +
        renderCard('fg-card-source', '📋 Giải trình nguồn gốc tiền', false) +
        renderCard('fg-card-tips', '💡 Lưu ý quan trọng', false) +
      '</div>' +
    '</div>';
  }

  // ─── Render income-savings ratio check ───
  function renderSavingsRatio(profile) {
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;

    if (savings <= 0 || monthlyIncome <= 0) return null;

    var monthsEquivalent = savings / monthlyIncome;

    var icon, cls, title, detail;
    if (monthsEquivalent <= 12) {
      cls = 'fg-ratio-good';
      icon = '✅';
      title = 'Tương quan thu nhập — sổ tiết kiệm HỢP LÝ';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập (' + monthlyIncome.toLocaleString() + ' USD/tháng). Đây là tỉ lệ chấp nhận được.';
    } else if (monthsEquivalent <= 18) {
      cls = 'fg-ratio-warn';
      icon = '⚠️';
      title = 'Tương quan thu nhập — HƠI CAO';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập. Mức này hơi cao — nên chuẩn bị giải trình tích luỹ nhiều năm hoặc bán tài sản.';
    } else if (monthsEquivalent <= 24) {
      cls = 'fg-ratio-warn';
      icon = '⚠️';
      title = 'Tương quan thu nhập — CẦN GIẢI TRÌNH';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập (' + monthlyIncome.toLocaleString() + ' USD/tháng). Mức này hơi cao so với thu nhập — cần giải trình nguồn gốc (tích luỹ nhiều năm, bán tài sản, hỗ trợ gia đình...).';
    } else {
      cls = 'fg-ratio-bad';
      icon = '🚨';
      title = 'Tương quan thu nhập — BẤT HỢP LÝ';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập. Rất khó để giải trình nếu không có nguồn gốc rõ ràng! Có thể bị ĐSQ nghi ngờ tiền đi mượn. Cần: (1) bán tài sản có giấy tờ, (2) thừa kế, (3) hỗ trợ từ người thân.';
    }

    return '<div class="fg-ratio ' + cls + '">' +
      '<div class="fg-ratio-icon">' + icon + '</div>' +
      '<div class="fg-ratio-text">' +
        '<strong>' + title + '</strong>' +
        '<span>' + detail + '</span>' +
      '</div>' +
    '</div>';
  }

  // ─── Card renderer ───
  function renderCard(id, title, isOpen) {
    var bodyHtml = '';
    switch (id) {
      case 'fg-card-builtup':
        bodyHtml = `
          <p>Kỹ thuật <strong>Built-up</strong> (xây dựng dần) là cách làm đẹp sổ tiết kiệm bằng cách gửi tiền <strong>đều đặn hàng tháng</strong>, thay vì nạp 1 cục lớn ngay trước khi nộp hồ sơ.</p>
          <div class="fg-timeline">
            <div class="fg-timeline-step fg-tl-active">
              <span class="fg-tl-week">Tuần 1-4</span>
              <span class="fg-tl-desc">Mở sổ tại quầy,<br>gửi lần đầu 30-40%</span>
            </div>
            <div class="fg-timeline-step">
              <span class="fg-tl-week">Tuần 5-8</span>
              <span class="fg-tl-desc">Gửi thêm 20-30%,<br>thể hiện tích luỹ</span>
            </div>
            <div class="fg-timeline-step">
              <span class="fg-tl-week">Tuần 9-12</span>
              <span class="fg-tl-desc">Hoàn thiện số dư,<br>duy trì ổn định</span>
            </div>
            <div class="fg-timeline-step">
              <span class="fg-tl-week">Tuần 13+</span>
              <span class="fg-tl-desc">Lấy sao kê +<br>Xác nhận số dư</span>
            </div>
          </div>
          <p><strong>Áp dụng khi nào?</strong></p>
          <ul>
            <li>Bạn có sẵn tiền mặt nhưng chưa có sổ tiết kiệm</li>
            <li>Bạn muốn tránh bị ĐSQ nghi ngờ "tiền đi mượn"</li>
            <li>Bạn còn > 3 tháng trước khi nộp hồ sơ</li>
          </ul>
          <p><strong>Lưu ý quan trọng:</strong></p>
          <ul>
            <li><span class="fg-tag fg-tag-red">Tuyệt đối không</span> nạp 1 lần 500 triệu rồi lấy sao kê ngay — đây là "cờ đỏ" số 1!</li>
            <li><span class="fg-tag fg-tag-green">Nên</span> gửi tiền từ nhiều nguồn: lương, kinh doanh, tiết kiệm từ trước</li>
            <li><span class="fg-tag fg-tag-blue">Sổ tại quầy</span> — không dùng sổ online, không app ngân hàng</li>
          </ul>
        `;
        break;

      case 'fg-card-bank':
        bodyHtml = `
          <p><strong>Sao kê ngân hàng 3-6 tháng</strong> là giấy tờ bắt buộc trong bộ hồ sơ. ĐSQ dùng nó để đánh giá:</p>
          <ul>
            <li>Lịch sử giao dịch có ổn định không?</li>
            <li>Có dấu hiệu nạp tiền "sốc" trước khi nộp hồ sơ không?</li>
            <li>Thu nhập hàng tháng có khớp với nghề nghiệp đã khai không?</li>
          </ul>
          <p><strong>Các bước chuẩn bị:</strong></p>
          <ol>
            <li><strong>Chọn tài khoản</strong> — dùng tài khoản chính, có lịch sử giao dịch lâu dài (không dùng tài khoản mới mở)</li>
            <li><strong>Duy trì số dư ổn định</strong> — tránh rút hết tiền rồi nạp lại gấp đôi</li>
            <li><strong>Tránh giao dịch bất thường</strong> — tiền vào rồi ra ngay trong vài ngày</li>
            <li><strong>Giải trình các khoản lớn</strong> — nếu có giao dịch > 50 triệu VND, chuẩn bị giải trình nguồn gốc</li>
            <li><strong>Lấy sao kê trong 30 ngày</strong> — trước khi nộp hồ sơ (giấy có giá trị 30 ngày)</li>
          </ol>
          <p><strong>Mẹo:</strong> Nếu thu nhập chính bằng tiền mặt (kinh doanh nhỏ), hãy chủ động gửi tiền vào tài khoản định kỳ <strong>2-3 lần/tháng</strong> để tạo dòng tiền đều đặn, ít nhất 3 tháng trước khi nộp hồ sơ.</p>
        `;
        break;

      case 'fg-card-source':
        bodyHtml = `
          <p>ĐSQ Hàn Quốc yêu cầu <strong>giải trình nguồn gốc</strong> số tiền trong sổ tiết kiệm. Dưới đây là các nguồn hợp lý:</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.5rem;margin:0.75rem 0;">
            <div style="padding:0.6rem;border-radius:8px;background:rgba(16,185,129,0.06);border:1px solid #d1fae5;">
              <strong>📋 Lương</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần HĐLĐ + sao kê lương + BHXH</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(59,130,246,0.06);border:1px solid #dbeafe;">
              <strong>🏪 Kinh doanh</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần GPKD, báo cáo thuế, sao kê tài khoản kinh doanh</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(245,158,11,0.06);border:1px solid #fef3c7;">
              <strong>🏠 Bán tài sản</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần hợp đồng mua bán, giấy chuyển nhượng</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(168,85,247,0.06);border:1px solid #f3e8ff;">
              <strong>🏘️ Cho thuê</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần hợp đồng cho thuê, xác nhận thu nhập</span>
            </div>
          </div>
          <p><strong>Nguyên tắc vàng:</strong> Khai đúng nguồn, có giấy tờ chứng minh từng nguồn. Không bịa nguồn không có thật — ĐSQ có thể xác minh qua cơ quan thuế, ngân hàng.</p>
          <p><strong>Nếu sổ tiết kiệm do người thân tặng/cho:</strong> Cần hợp đồng tặng cho + giấy tờ chứng minh năng lực tài chính của người cho + chứng minh quan hệ.</p>
        `;
        break;

      case 'fg-card-tips':
        bodyHtml = `
          <ul>
            <li><span class="fg-tag fg-tag-red">Không</span> dùng sổ tiết kiệm online — ĐSQ chỉ chấp nhận sổ mở tại quầy giao dịch</li>
            <li><span class="fg-tag fg-tag-red">Không</span> nạp tiền "sốc" 1 lần rồi đi nộp hồ sơ ngay — sẽ bị từ chối</li>
            <li><span class="fg-tag fg-tag-green">Nên</span> mở sổ tiết kiệm <strong>trước 3-6 tháng</strong> — càng sớm càng tốt</li>
            <li><span class="fg-tag fg-tag-green">Nên</span> giữ sổ tiết kiệm kỳ hạn 6-12 tháng (tối thiểu 6 tháng, lý tưởng 12 tháng)</li>
            <li><span class="fg-tag fg-tag-blue">Sổ tiết kiệm + xác nhận số dư</span> phải cấp trong vòng 30 ngày trước khi nộp</li>
            <li><span class="fg-tag fg-tag-blue">Tất cả giấy tờ tài chính</span> cần dịch công chứng sang tiếng Hàn hoặc Anh</li>
            <li><strong>D-2:</strong> Cần sổ tiết kiệm <strong>18,000-20,000 USD</strong> (~450-500 triệu VND)</li>
            <li><strong>D-4-1:</strong> Cần sổ tiết kiệm <strong>10,000 USD</strong> (~250 triệu VND)</li>
          </ul>
        `;
        break;
    }

    return '<div class="fg-card">' +
      '<div class="fg-card-header" onclick="window._fgToggleCard(\'' + id + '\')" data-fg-card="' + id + '">' +
        '<span>' + title + '</span>' +
        '<span class="fg-chevron ' + (isOpen ? 'open' : '') + '\">▼</span>' +
      '</div>' +
      '<div class="fg-card-body ' + (isOpen ? 'open' : '') + '" id="' + id + '">' +
        bodyHtml +
      '</div>' +
    '</div>';
  }

  // ─── Render checklist addon: tài chính lưu ý ───
  function renderChecklistFinanceNotes(profile) {
    profile = profile || {};
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;
    var riskSummary = getFinancialRiskSummary(profile);

    var notes = [];

    // High/critical risks from the analysis
    riskSummary.warnings.forEach(function(w) {
      if (w.level === 'critical' || w.level === 'high') {
        notes.push({
          type: w.level === 'critical' ? 'red' : 'yellow',
          text: w.text,
        });
      }
    });

    // Add score-based note
    if (riskSummary.score < 40) {
      notes.push({ type: 'red', text: 'Điểm tài chính thấp (' + riskSummary.score + '/100). Cần cải thiện ngay để tránh rủi ro visa.' });
    }

    // Income-savings ratio
    if (savings > 0 && monthlyIncome > 0) {
      var ratio = savings / monthlyIncome;
      if (ratio > 24) {
        notes.push({ type: 'red', text: 'Sổ tiết kiệm gấp ' + Math.round(ratio) + ' tháng thu nhập — cần giải trình nguồn gốc rõ ràng (bán tài sản, thừa kế...).' });
      } else if (ratio > 12) {
        notes.push({ type: 'yellow', text: 'Sổ tiết kiệm gấp ' + Math.round(ratio) + ' tháng thu nhập — nên chuẩn bị giải trình nguồn gốc.' });
      }
    }

    if (profile.hasSavingsStatement !== false) {
      notes.push({ type: 'blue', text: 'Chuẩn bị sao kê ngân hàng 3-6 tháng — thể hiện lịch sử giao dịch ổn định.' });
    }

    if (notes.length === 0) return '';

    return '<div class="fg-widget" style="margin:0.5rem 0;">' +
      '<h4>💰 Tài chính</h4>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;padding:0.4rem 0.6rem;border-radius:8px;font-size:0.82rem;' +
        (riskSummary.score >= 60 ? 'background:rgba(16,185,129,0.06);border:1px solid #d1fae5;"' : 'background:rgba(239,68,68,0.06);border:1px solid #fecaca;"') +
      '>' +
        '<span style="font-weight:700;font-size:1rem;">' + riskSummary.score + '</span>' +
        '<span style="color:var(--text-muted);">/100</span>' +
        '<span style="font-weight:600;font-size:0.78rem;color:' + (riskSummary.score >= 60 ? '#065f46' : '#991b1b') + ';">' + riskSummary.label + '</span>' +
      '</div>' +
      notes.map(function(n) {
        var bg = n.type === 'red' ? '#fef2f2' : n.type === 'yellow' ? '#fffbeb' : '#eff6ff';
        var border = n.type === 'red' ? '#fecaca' : n.type === 'yellow' ? '#fde68a' : '#bfdbfe';
        var icon = n.type === 'red' ? '🚨' : n.type === 'yellow' ? '⚠️' : '💡';
        return '<div style="padding:0.6rem 0.75rem;margin-bottom:0.4rem;border-radius:8px;background:' + bg + ';border:1px solid ' + border + ';font-size:0.85rem;line-height:1.4;">' +
          '<span style="margin-right:0.4rem;">' + icon + '</span>' + n.text +
        '</div>';
      }).join('') +
    '</div>';
  }

  // ─── Expose public API ───
  window.renderFinanceGuide = renderFinanceGuide;
  window.renderSavingsRatio = renderSavingsRatio;
  window.renderChecklistFinanceNotes = renderChecklistFinanceNotes;
  window.renderFinancialScore = renderFinancialScore;
  window.renderDocRequirements = renderDocRequirements;
  window.renderFundingTemplate = renderFundingTemplate;
  window.generateFundingTemplate = generateFundingTemplate;
  window.calculateFinancialScore = calculateFinancialScore;
  window.analyzeFinancialWarnings = analyzeFinancialWarnings;
  window.getFinancialRiskSummary = getFinancialRiskSummary;
  window._fgToggleCard = toggleCard;

  // ═══════════════════════════════════════════
  // 7. Tích hợp với Risk Warning
  // ═══════════════════════════════════════════
  // Cung cấp hook để risk-warning.js gọi
  window.__fgGetRiskWarnings = function() {
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        var data = JSON.parse(raw);
        return analyzeFinancialWarnings(data.profile || {});
      }
    } catch(e) {}
    return [];
  };

  // ─── Init ───
  injectStyles();

})();
