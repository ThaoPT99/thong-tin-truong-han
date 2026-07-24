/**
 * study-plan-upgrade.js — Nâng cấp Study Plan Generator
 * 
 * Cung cấp:
 * 1. Template riêng cho D2-6 và D4-1 (cấu trúc + hướng dẫn)
 * 2. Soạn song ngữ Việt + Hàn
 * 3. Kiểm tra logic câu chuyện du học
 */

(function() {
  'use strict';

  // ─── Inject styles ───
  function injectStyles() {
    var css = `
      .spu-guide {
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 12px;
        padding: 1rem 1.25rem;
        margin: 1rem 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }
      .spu-guide h4 {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text, #1e293b);
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .spu-guide p, .spu-guide li {
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--text-muted, #475569);
      }
      .spu-guide ul, .spu-guide ol {
        margin: 0.25rem 0 0.5rem;
        padding-left: 1.2rem;
      }
      .spu-guide li { margin-bottom: 0.2rem; }

      .spu-template {
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        overflow: hidden;
        margin: 0.75rem 0;
      }
      .spu-template-header {
        padding: 0.6rem 1rem;
        background: rgba(0,0,0,0.02);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--text, #1e293b);
        transition: background 0.2s;
      }
      .spu-template-header:hover { background: rgba(0,0,0,0.04); }
      .spu-template-body {
        padding: 0.75rem 1rem;
        display: none;
        font-size: 0.82rem;
        line-height: 1.5;
        background: rgba(0,0,0,0.01);
      }
      .spu-template-body.open { display: block; }
      .spu-template-body .spu-section-label {
        font-weight: 600;
        color: var(--text, #1e293b);
        margin-top: 0.5rem;
        margin-bottom: 0.15rem;
      }
      .spu-template-body .spu-section-label:first-child { margin-top: 0; }
      .spu-template-body .spu-kr {
        color: #8b5cf6;
        font-weight: 500;
      }

      .spu-bilingual-bar {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 0.6rem 0.75rem;
        background: rgba(139, 92, 246, 0.06);
        border: 1px solid #c4b5fd;
        border-radius: 10px;
        margin: 0.75rem 0;
      }
      .spu-bilingual-bar .spu-bl-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: #6d28d9;
        flex-shrink: 0;
      }
      .spu-bilingual-bar button {
        padding: 4px 14px;
        border-radius: 6px;
        border: 1px solid #c4b5fd;
        background: #fff;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        color: #6d28d9;
        transition: all 0.15s;
      }
      .spu-bilingual-bar button:hover {
        background: #6d28d9;
        color: #fff;
      }

      .spu-logic-result {
        padding: 0.75rem 1rem;
        border-radius: 10px;
        margin: 0.75rem 0;
        font-size: 0.85rem;
        line-height: 1.5;
      }
      .spu-logic-result.spu-logic-good {
        background: rgba(16, 185, 129, 0.06);
        border: 1.5px solid #10b981;
      }
      .spu-logic-result.spu-logic-warn {
        background: rgba(245, 158, 11, 0.06);
        border: 1.5px solid #f59e0b;
      }
      .spu-logic-result.spu-logic-bad {
        background: rgba(239, 68, 68, 0.06);
        border: 1.5px solid #ef4444;
      }
      .spu-logic-result strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
      }
      .spu-logic-result ul {
        margin: 0.25rem 0 0;
        padding-left: 1.2rem;
      }
      .spu-logic-result li {
        margin-bottom: 0.2rem;
        font-size: 0.82rem;
      }

      .spu-kr-section {
        margin-top: 0.75rem;
        padding: 0.75rem 1rem;
        background: rgba(139, 92, 246, 0.04);
        border: 1px solid #e9d5ff;
        border-radius: 10px;
      }
      .spu-kr-section .spu-kr-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: #6d28d9;
        margin-bottom: 0.4rem;
      }
      .spu-kr-section .spu-kr-content {
        font-size: 0.88rem;
        line-height: 1.6;
        color: var(--text, #1e293b);
        white-space: pre-wrap;
      }
      .spu-kr-section .spu-kr-actions {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
      }
      .spu-kr-section .spu-kr-actions button {
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid #c4b5fd;
        background: #fff;
        font-size: 0.78rem;
        cursor: pointer;
        color: #6d28d9;
        transition: all 0.15s;
      }
      .spu-kr-section .spu-kr-actions button:hover {
        background: #6d28d9;
        color: #fff;
      }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ─── Study Plan template structures ───
  var TEMPLATES = {
    'D-4-1': {
      title: 'Cấu trúc Study Plan D-4-1 (Học tiếng Hàn)',
      sections: [
        { label: '1. Giới thiệu bản thân', vi: 'Họ tên, tuổi, quê quán, học vấn hiện tại. Lý do yêu thích Hàn Quốc.', kr: '자기소개 (이름, 나이, 출신, 학력, 한국을 좋아하게 된 계기)' },
        { label: '2. Lý do chọn Hàn Quốc', vi: 'Tại sao học tiếng Hàn tại Hàn Quốc thay vì Việt Nam? (môi trường, văn hoá, cơ hội)', kr: '한국에서 한국어를 공부하려는 이유' },
        { label: '3. Lý do chọn trường', vi: 'Tại sao chọn trường này? Chương trình tiếng có gì phù hợp?', kr: '이 학교를 선택한 이유 (프로그램, 위치, 평판)' },
        { label: '4. Mục tiêu học tập', vi: 'Mục tiêu TOPIK theo từng giai đoạn. Kế hoạch học tập cụ thể.', kr: '학습 목표 (TOPIK 목표, 학습 계획)' },
        { label: '5. Kế hoạch sau tiếng', vi: 'Sau khi học tiếng xong: về nước? Học lên ĐH? Làm việc tại Hàn?', kr: '한국어 과정 후 계획 (귀국, 대학 진학, 취업)' },
        { label: '6. Cam kết về nước', vi: 'Cam kết sẽ về Việt Nam sau khi hoàn thành khóa học. Ràng buộc gia đình, công việc.', kr: '귀국 약속 (가족, 직업, 재산 등 한국과의 연고)' },
      ]
    },
    'D-2': {
      title: 'Cấu trúc Study Plan D-2 (Đại học chính quy)',
      sections: [
        { label: '1. Giới thiệu bản thân', vi: 'Họ tên, tuổi, quê quán, trường ĐH tại VN (nếu có), chuyên ngành.', kr: '자기소개 (이름, 나이, 출신, 전공, 학력)' },
        { label: '2. Lý do chọn Hàn Quốc', vi: 'Tại sao chọn du học ĐH tại Hàn? Chất lượng giáo dục, ngành học, khác biệt với VN.', kr: '한국에서 대학을 다니려는 이유' },
        { label: '3. Lý do chọn trường & ngành', vi: 'Phân tích chương trình đào tạo, thế mạnh trường. Ngành học phù hợp định hướng.', kr: '학교·전공 선택 이유 (교육 과정, 교수진, 취업 기회)' },
        { label: '4. Kế hoạch học tập', vi: 'Mục tiêu GPA từng kỳ. Chứng chỉ (TOPIK, IELTS). Hoạt động ngoại khoá, thực tập.', kr: '학습 계획 (학점 목표, 자격증,课外 활동, 인턴십)' },
        { label: '5. Định hướng tương lai', vi: 'Sau tốt nghiệp: về VN làm việc? Ở lại Hàn (visa E7)? Học lên cao học?', kr: '졸업 후 계획 (귀국 취업, 한국 취업(E7), 대학원 진학)' },
        { label: '6. Cam kết về nước', vi: 'Cam kết về VN. Ràng buộc gia đình, MOU, chương trình liên kết (nếu có).', kr: '귀국 약속 (가족, MOU, 교류 프로그램 등 한국과의 연고)' },
      ]
    }
  };

  // ─── Render template guide ───
  function renderTemplateGuide(visaType) {
    var tpl = TEMPLATES[visaType] || TEMPLATES['D-4-1'];
    var sectionsHtml = tpl.sections.map(function(s, i) {
      return '<div class="spu-section-label">' + s.label + '</div>' +
        '<div>' + s.vi + '</div>' +
        '<div class="spu-kr">' + s.kr + '</div>';
    }).join('');

    return '<div class="spu-guide">' +
      '<h4>📋 ' + tpl.title + '</h4>' +
      '<p>Study Plan nên viết theo cấu trúc dưới đây, mỗi phần 1-2 đoạn ngắn. <strong>Song ngữ Việt + Hàn</strong> được đánh giá cao.</p>' +
      '<div class="spu-template">' +
        '<div class="spu-template-header" onclick="window._spuToggleTemplate(this)">' +
          '<span>Xem cấu trúc chi tiết</span>' +
          '<span class="fg-chevron">▼</span>' +
        '</div>' +
        '<div class="spu-template-body" id="spu-template-body">' + sectionsHtml + '</div>' +
      '</div>' +
    '</div>';
  }

  function toggleTemplate(header) {
    var body = header.parentElement.querySelector('.spu-template-body');
    var chevron = header.querySelector('.fg-chevron');
    if (!body) return;
    body.classList.toggle('open');
    if (chevron) chevron.classList.toggle('open');
  }

  // ─── Bilingual bar ───
  function renderBilingualBar() {
    return '<div class="spu-bilingual-bar">' +
      '<span class="spu-bl-label">🇰🇷 Song ngữ Việt-Hàn</span>' +
      '<span style="font-size:0.78rem;color:var(--text-muted);flex:1;">Tạo thêm bản tiếng Hàn cho Study Plan của bạn (KVAC đánh giá cao)</span>' +
      '<button type="button" onclick="window._spuGenerateKorean()">Dịch sang Hàn</button>' +
    '</div>';
  }

  // ═══ Logic check ═══
  // Kiểm tra nhanh các lỗi logic phổ biến trong Study Plan
  function quickLogicCheck(text) {
    if (!text || text.length < 50) {
      return { score: 0, issues: ['Study Plan quá ngắn (cần tối thiểu 50 ký tự)'], tips: ['Viết Study Plan tối thiểu 300-500 từ'] };
    }

    var issues = [];
    var tips = [];
    var score = 100;
    var lower = text.toLowerCase();

    // Check common patterns
    var checks = [
      { pattern: /chung chung|chung chug|template|mẫu|sao chép/i, msg: 'Chứa từ ngữ "chung chung"/"template" — không nên tự nhận Study Plan của mình là chung chung', deduct: 15 },
      { pattern: /tôi muốn đi du học|tôi muốn đi hàn|tôi thích hàn quốc/i, msg: 'Câu mở đầu quá chung chung ("tôi muốn đi du học") — cần cụ thể hơn', deduct: 10 },
      { pattern: /không có kế hoạch|chưa biết|chưa nghĩ tới/i, msg: 'Thể hiện sự thiếu kế hoạch ("chưa biết", "không có kế hoạch")', deduct: 20 },
      { pattern: /kiếm tiền|đi làm thêm|làm thêm/i, msg: 'Nhắc đến "làm thêm" / "kiếm tiền" — ĐSQ rất nhạy cảm với vấn đề này!', deduct: 25 },
      { pattern: /ở lại|định cư|không về|ở luôn/i, msg: 'Nhắc đến "ở lại" / "định cư" — ĐSQ sẽ lo ngại ý định bỏ trốn!', deduct: 30 },
    ];

    checks.forEach(function(c) {
      if (c.pattern.test(lower)) {
        issues.push(c.msg);
        score -= c.deduct;
      }
    });

    // Check required elements
    if (!text.match(/[가-힣]/)) {
      tips.push('NÊN viết Study Plan bằng tiếng Hàn (hoặc song ngữ) — KVAC đánh giá cao hơn');
    }
    if (text.length < 300) {
      tips.push('Study Plan hơi ngắn (' + text.length + ' ký tự). Nên viết 500-800 từ cho D-4-1, 800-1200 từ cho D-2');
      score -= 10;
    }
    if (!/\bsau khi.*về.*(?:việt nam|nước)\b/i.test(text) && !/\b(?:về|vietnam|việt nam)\s*(?:nước|nhà|sau)\b/i.test(text)) {
      tips.push('Thiếu cam kết về nước — đây là phần QUAN TRỌNG nhất trong Study Plan');
      score -= 15;
    }
    if (!text.match(/[?.!]/)) {
      tips.push('Study Plan không có dấu câu — cần kiểm tra lại ngữ pháp');
      score -= 5;
    }

    score = Math.max(0, Math.min(100, score));
    return { score: score, issues: issues, tips: tips };
  }

  function renderLogicResult(text) {
    var result = quickLogicCheck(text);
    var cls, icon, title;

    if (result.score >= 80) {
      cls = 'spu-logic-good';
      icon = '✅';
      title = 'Study Plan khá tốt (Điểm: ' + result.score + '/100)';
    } else if (result.score >= 60) {
      cls = 'spu-logic-warn';
      icon = '⚠️';
      title = 'Study Plan cần cải thiện (Điểm: ' + result.score + '/100)';
    } else {
      cls = 'spu-logic-bad';
      icon = '🚨';
      title = 'Study Plan có vấn đề (Điểm: ' + result.score + '/100) — cần sửa trước khi nộp!';
    }

    var html = '<div class="spu-logic-result ' + cls + '">' +
      '<strong>' + icon + ' ' + title + '</strong>';

    if (result.issues.length > 0) {
      html += '<div style="margin-top:0.25rem;font-weight:600;font-size:0.82rem;color:#dc2626;">⚠ Vấn đề phát hiện:</div>';
      html += '<ul>' + result.issues.map(function(i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
    }

    if (result.tips.length > 0) {
      html += '<div style="margin-top:0.25rem;font-weight:600;font-size:0.82rem;color:#2563eb;">💡 Gợi ý cải thiện:</div>';
      html += '<ul>' + result.tips.map(function(t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
    }

    html += '</div>';
    return html;
  }

  // ═══ Korean translation section ═══
  function renderKoreanSection(krText) {
    return '<div class="spu-kr-section">' +
      '<div class="spu-kr-title">🇰🇷 Bản tiếng Hàn</div>' +
      '<div class="spu-kr-content" id="spu-kr-content">' + escapeHtml(krText) + '</div>' +
      '<div class="spu-kr-actions">' +
        '<button type="button" onclick="window._spuCopyKorean()">📋 Copy bản Hàn</button>' +
        '<button type="button" onclick="window._spuCopyBoth()">📋 Copy cả Việt + Hàn</button>' +
      '</div>' +
    '</div>';
  }

  // ═══ Generate Korean translation via API ═══
  window._spuGenerateKorean = async function() {
    var btn = document.querySelector('.spu-bilingual-bar button');
    if (!btn) return;
    // Also try to find a clicked button
    var activeBtn = document.activeElement;
    if (activeBtn && activeBtn.matches('.spu-bilingual-bar button')) btn = activeBtn;
    var originalText = '';
    var resultContent = document.getElementById('sp-result-content');
    if (resultContent) {
      originalText = resultContent.textContent || '';
    } else {
      var spContent = document.getElementById('spr-text');
      if (spContent) originalText = spContent.value;
    }
    if (!originalText || originalText.length < 50) {
      alert('Study Plan quá ngắn để dịch. Hãy soạn Study Plan trước.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Đang dịch...';

    try {
      var res = await fetch('/api/deepseek?action=translate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          sourceLang: 'vi',
          targetLang: 'ko',
        }),
      });
      var data = await res.json();

      if (data.success && data.translatedText) {
        // Append Korean section to result
        var existingKr = document.getElementById('spu-kr-section');
        if (existingKr) existingKr.remove();

        // Find result container
        var resultArea = document.querySelector('.sp-result-content') || 
                        document.querySelector('.spr-result-area') ||
                        document.getElementById('sp-result-content')?.parentElement;
        if (resultArea) {
          var krSection = document.createElement('div');
          krSection.id = 'spu-kr-section';
          krSection.innerHTML = renderKoreanSection(data.translatedText);
          resultArea.appendChild(krSection);
        } else {
          // Fallback: show alert
          alert('Bản tiếng Hàn:\n\n' + data.translatedText);
        }
      } else {
        alert('Không thể dịch: ' + (data.error || 'Lỗi không xác định'));
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }

    btn.disabled = false;
    btn.textContent = 'Dịch sang Hàn';
  };

  window._spuCopyKorean = function() {
    var content = document.getElementById('spu-kr-content');
    if (!content) return;
    navigator.clipboard.writeText(content.textContent).then(function() {
      alert('Đã copy bản tiếng Hàn!');
    }).catch(function() {
      alert('Không thể copy tự động. Hãy bôi đen và copy thủ công.');
    });
  };

  window._spuCopyBoth = function() {
    var krContent = document.getElementById('spu-kr-content');
    var viContent = document.querySelector('.sp-result-content') || document.querySelector('.spr-result-area');
    if (!krContent || !viContent) return;

    var viText = viContent.textContent || '';
    var krText = krContent.textContent || '';
    var fullText = '=== TIẾNG VIỆT ===\n' + viText + '\n\n=== 한국어 ===\n' + krText;

    navigator.clipboard.writeText(fullText).then(function() {
      alert('Đã copy cả Việt + Hàn!');
    }).catch(function() {
      alert('Không thể copy tự động. Hãy bôi đen và copy thủ công.');
    });
  };

  window._spuToggleTemplate = toggleTemplate;

  // ═══ Integrate into checklist.js flow: add logic check + bilingual to study plan reviewer ───
  // This is called from clOpenStudyPlanReviewer in checklist.js after the review result is shown
  window._spuEnhanceReviewer = function(container) {
    if (!container) return;
    // Add logic check button
    var checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'btn btn-outline';
    checkBtn.textContent = '🔍 Kiểm tra logic';
    checkBtn.style.marginRight = '0.5rem';
    checkBtn.onclick = function() {
      var textEl = document.getElementById('spr-text');
      if (!textEl || !textEl.value) {
        alert('Chưa có Study Plan để kiểm tra.');
        return;
      }
      var result = quickLogicCheck(textEl.value);
      var resultHtml = renderLogicResult(textEl.value);
      // Show in result area
      var resultArea = document.getElementById('spr-result-area') || container.querySelector('.spr-result-area');
      if (!resultArea) {
        resultArea = document.createElement('div');
        resultArea.id = 'spr-result-area';
        resultArea.className = 'spr-result-area';
        container.appendChild(resultArea);
      }
      resultArea.innerHTML = resultHtml;
    };
    container.appendChild(checkBtn);

    // Add bilingual bar
    var bar = document.createElement('div');
    bar.innerHTML = renderBilingualBar();
    container.appendChild(bar);
  };

  // ═══ Update template guide when visa type changes ───
  window._spuUpdateTemplate = function(visaType) {
    var container = document.getElementById('spr-template-guide');
    if (!container || typeof window.renderTemplateGuide !== 'function') return;
    container.innerHTML = window.renderTemplateGuide(visaType);
  };

  // ═══ Run quick logic check from reviewer ───
  window._spuRunLogicCheck = function() {
    var textEl = document.getElementById('spr-text');
    if (!textEl || !textEl.value || textEl.value.length < 50) {
      alert('Study Plan quá ngắn để kiểm tra. Hãy dán Study Plan vào ô trên (tối thiểu 50 ký tự).');
      return;
    }
    var resultHtml = window.renderLogicResult(textEl.value);
    var resultArea = document.getElementById('spr-logic-result');
    if (!resultArea) {
      resultArea = document.createElement('div');
      resultArea.id = 'spr-logic-result';
      var textarea = document.getElementById('spr-text');
      if (textarea && textarea.parentElement) {
        textarea.parentElement.insertBefore(resultArea, textarea.nextSibling);
      }
    }
    resultArea.innerHTML = resultHtml;
  };

  // ═══ After review hook (called from clSubmitReview in checklist.js) ───
  window._spuAfterReview = function(resultEl, studyPlan, review) {
    if (!resultEl) return;
    // Add logic check + bilingual bar after result
    var resultActions = resultEl.querySelector('.spr-result-actions');
    if (!resultActions || document.getElementById('spu-review-enhanced')) return;

    var enhancer = document.createElement('div');
    enhancer.id = 'spu-review-enhanced';
    resultActions.parentElement.insertBefore(enhancer, resultActions);
    enhancer.innerHTML = '<div id="spr-logic-result-review" style="margin-bottom:0.75rem;">' +
      window.renderLogicResult(studyPlan) + '</div>' +
      window.renderBilingualBar();
  };

  // ═══ Expose ───
  window.renderTemplateGuide = renderTemplateGuide;
  window.renderBilingualBar = renderBilingualBar;
  window.renderLogicResult = renderLogicResult;
  window.quickLogicCheck = quickLogicCheck;
  window._spuEnhanceReviewer = _spuEnhanceReviewer;

  injectStyles();

})();
