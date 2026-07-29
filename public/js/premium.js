// premium.js — Premium Feature UI
// Consistency Check + Visa Score
(function() {
  'use strict';

  // ─── Check if user has premium ───
  async function hasPremium() {
    try {
      var userData = localStorage.getItem('student_user');
      if (!userData) return false;
      var user = JSON.parse(userData);
      var res = await fetch('/api/payments?action=check-status&email=' + encodeURIComponent(user.email || ''));
      var data = await res.json();
      return data.isPremium || false;
    } catch(e) {
      return false;
    }
  }

  // ─── Show paywall overlay ───
  function showPaywall(container, featureName) {
    container.innerHTML = [
      '<div class="premium-paywall">',
      '<div class="premium-paywall-icon">💎</div>',
      '<h3>' + featureName + '</h3>',
      '<p>Đây là tính năng dành cho người dùng Premium. Nâng cấp ngay để sử dụng!</p>',
      '<ul class="premium-paywall-features">',
      '<li>🔍 Kiểm tra chéo toàn bộ 4 tài liệu tiếng Hàn</li>',
      '<li>📊 Visa Score: chấm điểm hồ sơ của bạn</li>',
      '<li>💡 Gợi ý cải thiện chi tiết từng phần</li>',
      '<li>✅ Yên tâm nộp hồ sơ hơn</li>',
      '</ul>',
      '<button class="premium-btn" onclick="window.openPricingModal(\'basic\')">🎯 Nâng cấp ngay — Chỉ 199.000đ</button>',
      '<p class="premium-paywall-note">So với trung tâm du học: 22-60 triệu → tiết kiệm 99%</p>',
      '</div>',
    ].join('');
  }

  // ─── Render Consistency Check ───
  function renderConsistencyCheck(container) {
    if (!container) return;

    var html = '<div class="premium-feature">';
    html += '<div class="premium-feature-header">';
    html += '<h2>🔍 Kiểm tra chéo tài liệu</h2>';
    html += '<p class="premium-feature-desc">AI sẽ đọc 4 tài liệu tiếng Hàn và kiểm tra tính nhất quán, phát hiện mâu thuẫn, lỗi sai trước khi bạn nộp hồ sơ.</p>';
    html += '</div>';

    // Check if user has documents saved
    var hasDocs = false;
    try {
      var saved = localStorage.getItem('koreanDocsResult');
      hasDocs = saved && JSON.parse(saved) && JSON.parse(saved).documents;
    } catch(e) {}

    if (hasDocs) {
      html += '<button class="premium-action-btn" onclick="window.runConsistencyCheck(this)">';
      html += '🔍 Bắt đầu kiểm tra';
      html += '</button>';
      html += '<div id="consistencyResult"></div>';
    } else {
      html += '<div class="premium-empty">';
      html += '<p>📝 Bạn chưa có tài liệu nào để kiểm tra.</p>';
      html += '<p>Vào mục <strong>Tiện ích → Hồ sơ Hàn</strong> để tạo tài liệu trước, sau đó quay lại kiểm tra.</p>';
      html += '</div>';
    }

    html += '</div>';

    container.innerHTML = html;
  }

  // ─── Run Consistency Check (API call) ───
  async function runConsistencyCheck(btn) {
    if (!btn) return;

    // Check premium first
    var premium = await hasPremium();
    if (!premium) {
      var container = document.getElementById('consistencyResult') || btn.parentElement;
      showPaywall(container, '🔍 Kiểm tra chéo tài liệu');
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Đang kiểm tra...';

    try {
      var saved = localStorage.getItem('koreanDocsResult');
      if (!saved) {
        document.getElementById('consistencyResult').innerHTML = '<p class="error">❌ Không tìm thấy dữ liệu tài liệu. Vui lòng tạo tài liệu trước.</p>';
        btn.disabled = false;
        btn.textContent = '🔍 Bắt đầu kiểm tra';
        return;
      }

      var docsData = JSON.parse(saved);
      var res = await fetch('/api/deepseek?action=check-consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: docsData.documents,
          profile: docsData.profile || {},
        }),
      });
      var data = await res.json();

      if (data.success && data.result) {
        document.getElementById('consistencyResult').innerHTML = formatConsistencyResult(data.result);
      } else {
        document.getElementById('consistencyResult').innerHTML = '<p class="error">❌ ' + (data.error || 'Kiểm tra thất bại, vui lòng thử lại.') + '</p>';
      }
    } catch (err) {
      document.getElementById('consistencyResult').innerHTML = '<p class="error">❌ Lỗi: ' + err.message + '</p>';
    }

    btn.disabled = false;
    btn.textContent = '🔍 Kiểm tra lại';
  }

  // ─── Format Consistency Result ───
  function formatConsistencyResult(result) {
    var score = result.score || 0;
    var scoreColor = score >= 80 ? '#059669' : (score >= 60 ? '#d97706' : '#dc2626');
    var scoreLabel = score >= 80 ? '✅ Tốt' : (score >= 60 ? '⚠️ Cần cải thiện' : '❌ Cần sửa ngay');

    var html = '<div class="consistency-result">';

    // Score
    html += '<div class="consistency-score">';
    html += '<div class="score-circle" style="border-color:' + scoreColor + '">';
    html += '<span class="score-number" style="color:' + scoreColor + '">' + score + '</span>';
    html += '<span class="score-label" style="color:' + scoreColor + '">/100</span>';
    html += '</div>';
    html += '<div class="score-info">';
    html += '<h3>' + scoreLabel + '</h3>';
    html += '<p>' + (result.summary || 'Kiểm tra tính nhất quán của hồ sơ của bạn.') + '</p>';
    html += '</div>';
    html += '</div>';

    // Issues
    if (result.issues && result.issues.length > 0) {
      html += '<h4>📋 Các vấn đề phát hiện</h4>';
      html += '<ul class="consistency-issues">';
      result.issues.forEach(function(issue) {
        var icon = issue.severity === 'high' ? '🔴' : (issue.severity === 'medium' ? '🟡' : '🟢');
        html += '<li class="issue-' + (issue.severity || 'low') + '">';
        html += '<span class="issue-icon">' + icon + '</span>';
        html += '<div class="issue-content">';
        html += '<strong>' + (issue.title || 'Vấn đề') + '</strong>';
        html += '<p>' + (issue.description || '') + '</p>';
        if (issue.suggestion) html += '<p class="issue-suggestion">💡 ' + issue.suggestion + '</p>';
        html += '</div>';
        html += '</li>';
      });
      html += '</ul>';
    }

    // Suggestions
    if (result.suggestions && result.suggestions.length > 0) {
      html += '<h4>💡 Gợi ý cải thiện</h4>';
      html += '<ul class="consistency-suggestions">';
      result.suggestions.forEach(function(s) {
        html += '<li>' + s + '</li>';
      });
      html += '</ul>';
    }

    html += '<div class="consistency-footer">';
    html += '<p>✅ Đã kiểm tra xong. Hãy sửa các lỗi trên trước khi nộp hồ sơ.</p>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  // ─── Render Visa Score ───
  function renderVisaScore(container) {
    if (!container) return;

    var html = '<div class="premium-feature">';
    html += '<div class="premium-feature-header">';
    html += '<h2>📊 Visa Score — Chấm điểm hồ sơ</h2>';
    html += '<p class="premium-feature-desc">AI phân tích hồ sơ của bạn theo 5 nhóm và dự đoán tỉ lệ đậu visa. Biết điểm yếu để cải thiện trước khi nộp.</p>';
    html += '</div>';

    html += '<div class="premium-form" id="visaScoreForm">';
    html += '<div class="form-row">';
    html += '<label>Học lực (GPA)</label>';
    html += '<input type="number" id="vsGpa" min="0" max="10" step="0.1" placeholder="VD: 7.5" />';
    html += '</div>';
    html += '<div class="form-row">';
    html += '<label>Tiếng Hàn</label>';
    html += '<select id="vsKorean"><option value="">Chọn...</option><option value="none">Chưa có</option><option value="sejong2b">Sejong 2B</option><option value="topik1">TOPIK 1</option><option value="topik2">TOPIK 2</option><option value="topik3">TOPIK 3</option><option value="topik4">TOPIK 4+</option></select>';
    html += '</div>';
    html += '<div class="form-row">';
    html += '<label>Đã từng trượt visa?</label>';
    html += '<select id="vsVisaFail"><option value="no">Chưa từng</option><option value="yes">Đã từng</option></select>';
    html += '</div>';
    html += '<div class="form-row">';
    html += '<label>Tài chính (sổ TK ~USD)</label>';
    html += '<input type="number" id="vsFinance" placeholder="VD: 10000" />';
    html += '</div>';
    html += '<div class="form-row">';
    html += '<label>Loại visa</label>';
    html += '<select id="vsVisaType"><option value="D-4-1">D-4-1 (Học tiếng)</option><option value="D-2-6">D-2-6 (Trao đổi)</option><option value="D-2">D-2 (ĐH chính quy)</option></select>';
    html += '</div>';
    html += '<button class="premium-action-btn" onclick="window.runVisaScore(this)">📊 Chấm điểm hồ sơ</button>';
    html += '</div>';

    html += '<div id="visaScoreResult"></div>';
    html += '</div>';

    container.innerHTML = html;
  }

  // ─── Run Visa Score ───
  async function runVisaScore(btn) {
    if (!btn) return;

    // Check premium
    var premium = await hasPremium();
    if (!premium) {
      var container = document.getElementById('visaScoreResult') || btn.parentElement;
      showPaywall(container, '📊 Visa Score');
      return;
    }

    var gpa = document.getElementById('vsGpa')?.value;
    var korean = document.getElementById('vsKorean')?.value;
    var visaFail = document.getElementById('vsVisaFail')?.value;
    var finance = document.getElementById('vsFinance')?.value;
    var visaType = document.getElementById('vsVisaType')?.value;

    if (!gpa || !korean) {
      document.getElementById('visaScoreResult').innerHTML = '<p class="error">❌ Vui lòng nhập GPA và trình độ tiếng Hàn</p>';
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Đang phân tích...';

    try {
      var res = await fetch('/api/deepseek?action=visa-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpa: parseFloat(gpa),
          korean: korean,
          visaFail: visaFail,
          finance: parseFloat(finance) || 0,
          visaType: visaType || 'D-4-1',
        }),
      });
      var data = await res.json();

      if (data.success && data.score) {
        document.getElementById('visaScoreResult').innerHTML = formatVisaScoreResult(data.score, data.details);
      } else {
        document.getElementById('visaScoreResult').innerHTML = '<p class="error">❌ ' + (data.error || 'Phân tích thất bại') + '</p>';
      }
    } catch (err) {
      document.getElementById('visaScoreResult').innerHTML = '<p class="error">❌ Lỗi: ' + err.message + '</p>';
    }

    btn.disabled = false;
    btn.textContent = '📊 Chấm điểm lại';
  }

  // ─── Format Visa Score Result ───
  function formatVisaScoreResult(score, details) {
    var scoreVal = typeof score === 'number' ? score : (score.totalScore || 70);
    var percent = typeof score === 'number' ? score : (score.approvalPercent || 65);
    var scoreColor = percent >= 80 ? '#059669' : (percent >= 60 ? '#d97706' : '#dc2626');
    var scoreLabel = percent >= 80 ? '🟢 Khả năng cao' : (percent >= 60 ? '🟡 Trung bình' : '🔴 Thấp');

    var html = '<div class="visa-score-result">';
    html += '<div class="visa-score-header">';
    html += '<div class="visa-score-circle" style="border-color:' + scoreColor + '">';
    html += '<span class="score-number" style="color:' + scoreColor + '">' + Math.round(percent) + '</span>';
    html += '<span class="score-label" style="color:' + scoreColor + '">%</span>';
    html += '</div>';
    html += '<div class="visa-score-info">';
    html += '<h3 style="color:' + scoreColor + '">' + scoreLabel + '</h3>';
    html += '<p>Tỉ lệ đậu visa dự kiến dựa trên hồ sơ hiện tại</p>';
    html += '</div>';
    html += '</div>';

    // Categories
    if (details && details.categories && details.categories.length > 0) {
      html += '<h4>📊 Chi tiết từng nhóm</h4>';
      html += '<div class="score-categories">';
      details.categories.forEach(function(cat) {
        var catColor = cat.score >= 80 ? '#059669' : (cat.score >= 60 ? '#d97706' : '#dc2626');
        html += '<div class="score-category">';
        html += '<div class="cat-header">';
        html += '<span>' + (cat.name || '') + '</span>';
        html += '<span style="color:' + catColor + ';font-weight:700">' + Math.round(cat.score) + '/100</span>';
        html += '</div>';
        html += '<div class="cat-bar"><div class="cat-fill" style="width:' + Math.round(cat.score) + '%;background:' + catColor + '"></div></div>';
        html += '<p class="cat-desc">' + (cat.description || '') + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Recommendations
    if (details && details.recommendations && details.recommendations.length > 0) {
      html += '<h4>💡 Gợi ý cải thiện</h4>';
      html += '<ul class="score-recommendations">';
      details.recommendations.forEach(function(rec) {
        html += '<li>' + rec + '</li>';
      });
      html += '</ul>';
    }

    html += '</div>';
    return html;
  }

  // ─── Expose globals ───
  window.renderConsistencyCheck = renderConsistencyCheck;
  window.runConsistencyCheck = runConsistencyCheck;
  window.renderVisaScore = renderVisaScore;
  window.runVisaScore = runVisaScore;
  window.hasPremium = hasPremium;
  window.showPaywall = showPaywall;

})();
