/**
 * finance-guide.js — Hướng dẫn dòng tiền & tài chính
 * 
 * Cung cấp:
 * 1. Kiểm tra tương quan thu nhập vs sổ tiết kiệm
 * 2. Hướng dẫn kỹ thuật built-up sổ tiết kiệm
 * 3. Hướng dẫn chuẩn bị sao kê ngân hàng
 * 4. Giải trình nguồn tiền
 * 5. Widget hiển thị trên Step 3 (finance) và dashboard checklist
 */

(function() {
  'use strict';

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

  // ─── Render income-savings ratio check ───
  // Returns HTML for the ratio indicator, or null if not enough data
  function renderSavingsRatio(profile) {
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;

    if (savings <= 0 || monthlyIncome <= 0) return null;

    // Tính số tháng thu nhập tương đương với sổ tiết kiệm
    var monthsEquivalent = savings / monthlyIncome;

    var icon, cls, title, detail;

    // Tiêu chuẩn: thu nhập 1 năm >= sổ tiết kiệm (hoặc sổ tiết kiệm <= 12 tháng thu nhập)
    if (monthsEquivalent <= 12) {
      cls = 'fg-ratio-good';
      icon = '✅';
      title = 'Tương quan thu nhập — sổ tiết kiệm HỢP LÝ';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập (' + monthlyIncome.toLocaleString() + ' USD/tháng). Đây là tỉ lệ chấp nhận được.';
    } else if (monthsEquivalent <= 24) {
      cls = 'fg-ratio-warn';
      icon = '⚠️';
      title = 'Tương quan thu nhập — CẦN GIẢI TRÌNH';
      detail = 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD tương đương ' + Math.round(monthsEquivalent) + ' tháng thu nhập. Mức này hơi cao so với thu nhập — cần giải trình nguồn gốc (tích luỹ nhiều năm, bán tài sản, hỗ trợ gia đình...).';
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

  // ─── Render full finance guide ───
  function renderFinanceGuide(profile) {
    profile = profile || {};

    var savingsRatioHtml = renderSavingsRatio(profile);

    return '<div class="fg-widget">' +
      '<h4> Hướng dẫn dòng tiền & tài chính</h4>' +
      '<p>Đây là phần <strong>quan trọng nhất</strong> trong bộ hồ sơ du học Hàn Quốc. Dưới đây là các hướng dẫn chi tiết giúp bạn chuẩn bị tài chính đúng cách, tránh bị từ chối visa vì lý do tài chính.</p>' +

      (savingsRatioHtml || '<p style="color:var(--text-muted);font-size:0.82rem;font-style:italic;"> Nhập thu nhập hàng tháng ở form bên trên để xem đánh giá tương quan thu nhập vs sổ tiết kiệm.</p>') +

      '<div style="margin-top:1rem;">' +
        // Card 1: Built-up kỹ thuật
        renderCard('fg-card-builtup', ' Kỹ thuật Built-up sổ tiết kiệm', false) +
        // Card 2: Sao kê ngân hàng
        renderCard('fg-card-bank', ' Chuẩn bị sao kê ngân hàng', false) +
        // Card 3: Nguồn tiền
        renderCard('fg-card-source', ' Giải trình nguồn gốc tiền', false) +
        // Card 4: Lưu ý quan trọng
        renderCard('fg-card-tips', ' Lưu ý quan trọng', false) +
      '</div>' +
    '</div>';
  }

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
            <li>Bạn muốn tránh bị ĐSQ nghi ngờ \"tiền đi mượn\"</li>
            <li>Bạn còn > 3 tháng trước khi nộp hồ sơ</li>
          </ul>
          <p><strong>Lưu ý quan trọng:</strong></p>
          <ul>
            <li><span class="fg-tag fg-tag-red">Tuyệt đối không</span> nạp 1 lần 500 triệu rồi lấy sao kê ngay — đây là \"cờ đỏ\" số 1!</li>
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
            <li>Có dấu hiệu nạp tiền \"sốc\" trước khi nộp hồ sơ không?</li>
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
              <strong>Lương</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần HĐLĐ + sao kê lương + BHXH</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(59,130,246,0.06);border:1px solid #dbeafe;">
              <strong>Kinh doanh</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần GPKD, báo cáo thuế, sao kê tài khoản kinh doanh</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(245,158,11,0.06);border:1px solid #fef3c7;">
              <strong>Bán tài sản</strong><br>
              <span style="font-size:0.8rem;color:var(--text-muted);">Cần hợp đồng mua bán, giấy chuyển nhượng</span>
            </div>
            <div style="padding:0.6rem;border-radius:8px;background:rgba(168,85,247,0.06);border:1px solid #f3e8ff;">
              <strong>Cho thuê</strong><br>
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
            <li><span class="fg-tag fg-tag-red">Không</span> nạp tiền \"sốc\" 1 lần rồi đi nộp hồ sơ ngay — sẽ bị từ chối</li>
            <li><span class="fg-tag fg-tag-green">Nên</span> mở sổ tiết kiệm <strong>trước 3-6 tháng</strong> — càng sớm càng tốt</li>
            <li><span class="fg-tag fg-tag-green">Nên</span> giữ sổ tiết kiệm kỳ hạn 12 tháng (hoặc tối thiểu 6 tháng)</li>
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
        '<span class="fg-chevron ' + (isOpen ? 'open' : '') + '">▼</span>' +
      '</div>' +
      '<div class="fg-card-body ' + (isOpen ? 'open' : '') + '" id="' + id + '">' +
        bodyHtml +
      '</div>' +
    '</div>';
  }

  // ─── Render checklist addon: tài chính lưu ý (hiển thị ở checklist view) ───
  function renderChecklistFinanceNotes(profile) {
    profile = profile || {};
    var savings = profile.savingsAmount || 0;
    var monthlyIncome = profile.monthlyIncome || 0;

    var notes = [];

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
      '<h4> Tài chính</h4>' +
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

  // ─── Expose ───
  window.renderFinanceGuide = renderFinanceGuide;
  window.renderSavingsRatio = renderSavingsRatio;
  window.renderChecklistFinanceNotes = renderChecklistFinanceNotes;
  window._fgToggleCard = toggleCard;

  // ─── Init ───
  injectStyles();

})();
