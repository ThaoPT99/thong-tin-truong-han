// risk-warning.js — Cảnh báo sớm rủi ro hồ sơ
// Hiển thị banner trên main page khi profile có rủi ro cao
(function() {
  'use strict';

  // ─── Kiểm tra profile và tạo cảnh báo ───
  function assessRisks() {
    var profile = null;
    try {
      var raw = localStorage.getItem('checklist_data');
      if (raw) {
        var data = JSON.parse(raw);
        profile = data.profile || {};
      }
    } catch(e) {}

    // Cần ít nhất có thông tin cơ bản để cảnh báo
    if (!profile || Object.keys(profile).length < 3) return null;
    // Chỉ cảnh báo khi có ít nhất 1 dữ liệu định lượng (GPA, tiếng Hàn, tài chính)
    var hasData = profile.gpa || profile.koreanLevel || profile.savingsAmount > 0 || profile.hasVisaRejection !== undefined;
    if (!hasData) return null;

    var warnings = [];
    var level = 'low'; // 'low' | 'medium' | 'high' | 'critical'
    var score = 100;

    // 1. GPA thấp
    var gpa = profile.gpa;
    if (gpa !== null && gpa !== undefined && gpa > 0) {
      if (gpa < 5.0) {
        warnings.push({ icon: '📉', text: 'GPA ' + gpa + '/10 — dưới mức khuyến nghị (5.0+). Nên chọn trường yêu cầu đầu vào thấp.', action: 'Xem trường nhóm B', actionSchool: 'schools' });
        score -= 15;
      } else if (gpa < 6.5) {
        warnings.push({ icon: '📊', text: 'GPA ' + gpa + '/10 — ở mức trung bình. Nên tăng cường các giấy tờ khác.', action: 'Xem checklist', actionSchool: 'checklist' });
        score -= 5;
      }
    }

    // 2. Không có tiếng Hàn
    var koreanLevel = profile.koreanLevel || 'none';
    var hasTopik = profile.hasTopik;
    if (koreanLevel === 'none' && !hasTopik) {
      warnings.push({ icon: '📖', text: 'Chưa có tiếng Hàn — rủi ro cao. Cần học Sejong 2B hoặc thi TOPIK 2 trước khi nộp.', action: 'Luyện TOPIK', actionSchool: 'knowledge' });
      score -= 20;
    } else if (koreanLevel === 'beginner') {
      warnings.push({ icon: '📖', text: 'Mới bắt đầu học tiếng Hàn — cần ít nhất TOPIK 1-2 trước khi nộp visa.', action: 'Luyện TOPIK', actionSchool: 'knowledge' });
      score -= 10;
    }

    // 3. Tài chính thấp
    var savings = profile.savingsAmount || 0;
    var visaType = profile.visaType || 'D-4-1';
    var minSavings = visaType === 'D-2' ? 18000 : 10000;
    if (savings > 0 && savings < minSavings) {
      warnings.push({ icon: '💰', text: 'Sổ tiết kiệm ' + savings.toLocaleString() + ' USD — chưa đủ mức tối thiểu ' + minSavings.toLocaleString() + ' USD cho ' + visaType + '.', action: 'Xem hướng dẫn', actionSchool: 'checklist' });
      score -= 15;
    } else if (savings === 0) {
      warnings.push({ icon: '💰', text: 'Chưa khai báo sổ tiết kiệm. Cần tối thiểu ' + minSavings.toLocaleString() + ' USD.', action: 'Khai báo ngay', actionSchool: 'checklist' });
      score -= 10;
    }

    // 4. Trượt visa
    if (profile.hasVisaRejection) {
      warnings.push({ icon: '🚫', text: 'Đã từng trượt visa Hàn Quốc — hồ sơ lần này sẽ bị soi kỹ hơn. Cần chuẩn bị kỹ lưỡng.', action: 'Xem phân tích', actionSchool: 'checklist' });
      score -= 20;
    }

    // 5. Gap year dài
    var gapYears = profile.gapYears || 0;
    if (gapYears > 2) {
      warnings.push({ icon: '⏳', text: 'Gap ' + Math.round(gapYears) + ' năm — cần giải trình chi tiết. Nên chọn trường có tỉ lệ đậu visa cao.', action: 'Viết giải trình', actionSchool: 'studyplan' });
      score -= 10;
    } else if (gapYears > 1) {
      warnings.push({ icon: '⏳', text: 'Gap ' + Math.round(gapYears) + ' năm — cần giải trình trong hồ sơ.', action: 'Viết giải trình', actionSchool: 'studyplan' });
      score -= 5;
    }

    // 6. Tuổi cao
    var age = null;
    if (profile.dateOfBirth) {
      var birth = new Date(profile.dateOfBirth);
      age = Math.floor((new Date() - birth) / 31557600000);
    } else if (profile.age) {
      age = profile.age;
    }
    if (age !== null && age > 28) {
      warnings.push({ icon: '👤', text: 'Tuổi ' + age + ' — rủi ro visa cao hơn. Cần chứng minh ràng buộc về nước thật mạnh.', action: 'Chọn trường phù hợp', actionSchool: 'advisor' });
      score -= 10;
    }

    // 7. Người thân bất hợp pháp tại Hàn
    if (profile.hasIllegalRelative) {
      warnings.push({ icon: '🔴', text: 'Có người thân cư trú bất hợp pháp tại Hàn — rủi ro cực cao! Cần tư vấn chuyên sâu.', action: 'Tư vấn ngay', actionSchool: 'advisor' });
      score -= 25;
    }

    // Xác định mức độ
    score = Math.max(0, Math.min(100, score));
    if (score >= 80) level = 'low';
    else if (score >= 60) level = 'medium';
    else if (score >= 40) level = 'high';
    else level = 'critical';

    // Chỉ hiển thị nếu có rủi ro (score < 80 hoặc có warning nghiêm trọng)
    if (level === 'low' && warnings.length <= 1) return null;

    return { level: level, score: score, warnings: warnings };
  }

  // ─── Render banner ───
  function renderBanner(result) {
    if (!result || !result.warnings || result.warnings.length === 0) return;

    var existing = document.querySelector('.rw-banner');
    if (existing) existing.remove();

    var config = {
      low:    { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', label: 'Hồ sơ ổn', icon: '✅' },
      medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Hồ sơ trung bình', icon: '⚠️' },
      high:   { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Hồ sơ rủi ro', icon: '⚠️' },
      critical: { color: '#991b1b', bg: '#fef2f2', border: '#fecaca', label: 'Hồ sơ rủi ro cao', icon: '🚨' },
    };
    var c = config[result.level] || config.medium;

    var html = '<div class="rw-banner" style="background:' + c.bg + ';border:1px solid ' + c.border + ';border-left:4px solid ' + c.color + '">' +
      '<div class="rw-banner-header">' +
      '<span class="rw-banner-icon">' + c.icon + '</span>' +
      '<div class="rw-banner-title">' +
      '<strong style="color:' + c.color + '">' + c.label + '</strong>' +
      '<span class="rw-banner-score" style="color:' + c.color + '">' + result.score + '/100</span>' +
      '</div>' +
      '<button type="button" class="rw-banner-close" onclick="this.parentElement.parentElement.remove()" aria-label="Đóng">&times;</button>' +
      '</div>' +
      '<div class="rw-banner-body">';

    result.warnings.forEach(function(w) {
      html += '<div class="rw-warning-item">' +
        '<span class="rw-warning-icon">' + w.icon + '</span>' +
        '<span class="rw-warning-text">' + escapeHtml(w.text) + '</span>' +
        (w.action ? '<button type="button" class="rw-warning-action" onclick="window.showSchool(\'' + w.actionSchool + '\')">' + escapeHtml(w.action) + ' →</button>' : '') +
        '</div>';
    });

    html += '</div>' +
      '<div class="rw-banner-footer">' +
      '<button type="button" class="rw-footer-btn" onclick="window.showSchool(\'checklist\')">📋 Xem checklist đầy đủ</button>' +
      '<button type="button" class="rw-footer-btn" onclick="window.showSchool(\'advisor\')">🤖 Tư vấn chọn trường</button>' +
      '</div>' +
      '</div>';

    // Chèn banner vào đầu main content
    var main = document.querySelector('.main');
    if (main) {
      main.insertAdjacentHTML('afterbegin', html);
    }
  }

  // ─── Check + render ───
  function checkAndRender() {
    var result = assessRisks();
    if (result) {
      renderBanner(result);
    } else {
      var existing = document.querySelector('.rw-banner');
      if (existing) existing.remove();
    }
  }

  // ─── Khởi động ───
  function init() {
    // Đợi dữ liệu load xong rồi check
    var ready = function() {
      checkAndRender();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('app-data-ready', ready, { once: true });
      });
    } else {
      document.addEventListener('app-data-ready', ready, { once: true });
    }

    // Polling: cập nhật khi profile thay đổi (giống journey tracker)
    setInterval(function() {
      var raw = localStorage.getItem('checklist_data');
      if (raw !== window.__rwCheckData) {
        window.__rwCheckData = raw;
        checkAndRender();
      }
    }, 3000);
  }

  // ─── Styles ───
  var STYLES = '\
    .rw-banner {\
      margin-bottom: 1.25rem;\
      border-radius: 12px;\
      overflow: hidden;\
      font-size: 0.85rem;\
      animation: fadeIn 0.4s ease-out;\
    }\
    .rw-banner-header {\
      display: flex;\
      align-items: center;\
      gap: 0.5rem;\
      padding: 0.65rem 0.85rem;\
    }\
    .rw-banner-icon { font-size: 1.2rem; }\
    .rw-banner-title {\
      flex: 1;\
      display: flex;\
      align-items: center;\
      gap: 0.5rem;\
    }\
    .rw-banner-score {\
      font-size: 0.78rem;\
      font-weight: 700;\
      padding: 0.1rem 0.45rem;\
      border-radius: 999px;\
      background: rgba(0,0,0,0.06);\
    }\
    .rw-banner-close {\
      background: none;\
      border: none;\
      font-size: 1.2rem;\
      color: var(--gray-400);\
      cursor: pointer;\
      padding: 0.1rem 0.3rem;\
      line-height: 1;\
    }\
    .rw-banner-close:hover { color: var(--gray-600); }\
    .rw-banner-body {\
      padding: 0 0.85rem 0.65rem;\
      display: grid;\
      gap: 0.4rem;\
    }\
    .rw-warning-item {\
      display: flex;\
      align-items: center;\
      gap: 0.4rem;\
      padding: 0.35rem 0.5rem;\
      background: rgba(255,255,255,0.7);\
      border-radius: 6px;\
    }\
    .rw-warning-icon { font-size: 0.95rem; flex-shrink: 0; }\
    .rw-warning-text { flex: 1; line-height: 1.35; color: var(--text); }\
    .rw-warning-action {\
      flex-shrink: 0;\
      padding: 0.2rem 0.5rem;\
      border: 1px solid var(--border);\
      border-radius: 6px;\
      background: #fff;\
      color: var(--accent);\
      font: inherit;\
      font-size: 0.72rem;\
      font-weight: 600;\
      cursor: pointer;\
      white-space: nowrap;\
    }\
    .rw-warning-action:hover {\
      background: var(--accent-soft);\
      border-color: var(--accent);\
    }\
    .rw-banner-footer {\
      display: flex;\
      gap: 0.5rem;\
      padding: 0.5rem 0.85rem 0.65rem;\
    }\
    .rw-footer-btn {\
      padding: 0.35rem 0.6rem;\
      border: 1px solid var(--border);\
      border-radius: 6px;\
      background: rgba(255,255,255,0.8);\
      color: var(--text);\
      font: inherit;\
      font-size: 0.75rem;\
      font-weight: 600;\
      cursor: pointer;\
    }\
    .rw-footer-btn:hover {\
      background: #fff;\
      border-color: var(--accent);\
      color: var(--accent);\
    }\
  ';

  function injectStyles() {
    if (document.getElementById('rw-styles')) return;
    var style = document.createElement('style');
    style.id = 'rw-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  injectStyles();
  init();

})();
