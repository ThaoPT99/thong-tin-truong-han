const PRIORITY_LABELS = {
  visa: "dễ đỗ visa",
  cost: "chi phí thấp",
  job: "việc làm thêm",
  e7: "dễ chuyển E7",
  prestige: "trường uy tín",
  "low-study": "học ít"
};


/** Parse nhanh ho so tu text: "nu, 20t, GPA 6.0, topik 2" */
function parseQuickProfile(text) {
  const q = (text || '').toLowerCase().trim();
  const profile = { gender: '', age: 0, gpa: 0, absences: 10, korean: 'none', visaFail: 'no', region: 'any', budget: 'medium', priorities: ['visa', 'job'] };

  if (!q) return profile;

  // Gender
  if (q.indexOf('nu') !== -1 || q.indexOf('nữ') !== -1 || q.indexOf('female') !== -1) profile.gender = 'female';
  else if (q.indexOf('nam') !== -1 || q.indexOf('male') !== -1) profile.gender = 'male';

  // Age
  const ageMatch = q.match(/(\d+)\s*(t|tuoi|tuổi|age)/);
  if (ageMatch) profile.age = parseInt(ageMatch[1], 10);

  // GPA
  const gpaMatch = q.match(/gpa\s*[:.]?\s*([\d.]+)/);
  if (gpaMatch) profile.gpa = parseFloat(gpaMatch[1]);

  // Absences
  const absMatch = q.match(/(?:nghi|vang|absences?)\s*[:.]?\s*(\d+)/);
  if (absMatch) profile.absences = parseInt(absMatch[1], 10);

  // Korean level
  if (q.indexOf('topik 3') !== -1 || q.indexOf('topik3') !== -1) profile.korean = 'topik3';
  else if (q.indexOf('topik 2') !== -1 || q.indexOf('topik2') !== -1) profile.korean = 'topik2';
  else if (q.indexOf('sejong') !== -1) profile.korean = 'sejong2b';

  // Visa fail
  if (q.indexOf('truot visa') !== -1 || q.indexOf('truot') !== -1 || q.indexOf('fail') !== -1) profile.visaFail = 'yes';

  // Region
  if (q.indexOf('seoul') !== -1) profile.region = 'seoul';
  else if (q.indexOf('gyeonggi') !== -1 || q.indexOf('incheon') !== -1 || q.indexOf('gần seoul') !== -1) profile.region = 'near-seoul';
  else if (q.indexOf('busan') !== -1) profile.region = 'busan';
  else if (q.indexOf('gwangju') !== -1) profile.region = 'gwangju';

  // Budget
  if (q.indexOf('tiet kiem') !== -1 || q.indexOf('re') !== -1 || q.indexOf('thap') !== -1) profile.budget = 'low';
  else if (q.indexOf('cao') !== -1 || q.indexOf('khong ngan') !== -1) profile.budget = 'high';

  // Priorities
  const prios = [];
  if (q.indexOf('visa') !== -1) prios.push('visa');
  if (q.indexOf('viec lam') !== -1 || q.indexOf('job') !== -1) prios.push('job');
  if (q.indexOf('chi phi') !== -1 || q.indexOf('cost') !== -1) prios.push('cost');
  if (q.indexOf('e7') !== -1) prios.push('e7');
  if (q.indexOf('hoc it') !== -1) prios.push('low-study');
  if (q.indexOf('uy tin') !== -1) prios.push('prestige');
  if (prios.length > 0) profile.priorities = prios;

  return profile;
}

// REGION_LABELS đã được định nghĩa global trong api-loader.js


function renderAdvisorApp(container) {
  if (!container.dataset.ready) {
    container.innerHTML = getAdvisorTemplate();
    container.dataset.ready = "true";
    bindAdvisorEvents(container);
  }
}

function getAdvisorTemplate() {
  return `
    <section class="advisor-view">
      <div class="advisor-head">
        <div>
          <p class="advisor-kicker">Visa D2-6</p>
          <h2>Tư vấn chọn trường phù hợp</h2>
          <p>Nhập hồ sơ học sinh để nhận Top 3 trường nên cân nhắc cùng lý do và rủi ro chính.</p>
        </div>
      </div>

      <div class="advisor-quick-input">
        <label style="font-size:0.82rem;font-weight:700;color:#475569;display:block;margin-bottom:4px;">⚡ Nhập nhanh hồ sơ</label>
        <div style="display:flex;gap:8px;">
          <input type="text" id="advisor-quick-input" placeholder="VD: nữ, 20t, GPA 6.0, topik 2" style="flex:1;min-height:2.55rem;padding:0.5rem 0.7rem;border:1px solid #dbe3ee;border-radius:8px;background:#fff;font:inherit;font-size:0.9rem;">
          <button type="button" id="advisor-quick-btn" style="min-height:2.55rem;padding:0.5rem 0.9rem;border:none;border-radius:8px;background:#2563eb;color:#fff;font:inherit;font-weight:700;cursor:pointer;">🔍 Điền</button>
        </div>
        <div style="font-size:0.78rem;color:#94a3b8;margin-top:4px;">Nhập tự nhiên: nữ/nam, tuổi, GPA, topik, khu vực, ưu tiên...</div>
      </div>

      <form id="advisor-form" class="advisor-form">
        <div class="advisor-grid">
          <label class="advisor-field">
            <span>Giới tính</span>
            <select name="gender">
              <option value="female">Nữ</option>
              <option value="male">Nam</option>
            </select>
          </label>

          <label class="advisor-field">
            <span>Tuổi</span>
            <input name="age" type="number" min="16" max="35" value="21">
          </label>

          <label class="advisor-field">
            <span>GPA cấp 3</span>
            <input name="gpa" type="number" min="0" max="10" step="0.1" value="6.5">
          </label>

          <label class="advisor-field">
            <span>Số buổi nghỉ</span>
            <input name="absences" type="number" min="0" max="100" value="10">
          </label>

          <label class="advisor-field">
            <span>Năng lực tiếng Hàn</span>
            <select name="korean">
              <option value="none">Chưa có chứng chỉ</option>
              <option value="sejong2b">Sejong 2B</option>
              <option value="topik2">TOPIK 2</option>
              <option value="topik3">TOPIK 3 trở lên</option>
            </select>
          </label>

          <label class="advisor-field">
            <span>Từng trượt visa</span>
            <select name="visaFail">
              <option value="no">Chưa từng trượt</option>
              <option value="yes">Đã từng trượt</option>
            </select>
          </label>

          <label class="advisor-field">
            <span>Khu vực mong muốn</span>
            <select name="region" id="advisor-region-select">
              <option value="any">Không ưu tiên</option>
            </select>
          </label>


          <label class="advisor-field">
            <span>Ngân sách</span>
            <select name="budget">
              <option value="low">Cần tiết kiệm</option>
              <option value="medium" selected>Trung bình</option>
              <option value="high">Có thể chọn trường phí cao hơn</option>
            </select>
          </label>
        </div>

        <fieldset class="advisor-priorities">
          <legend>Ưu tiên chính</legend>
          <label><input type="checkbox" name="priorities" value="visa" checked> Dễ đỗ visa</label>
          <label><input type="checkbox" name="priorities" value="cost"> Chi phí thấp</label>
          <label><input type="checkbox" name="priorities" value="job" checked> Việc làm thêm</label>
          <label><input type="checkbox" name="priorities" value="e7"> Dễ chuyển E7</label>
          <label><input type="checkbox" name="priorities" value="prestige"> Trường uy tín</label>
          <label><input type="checkbox" name="priorities" value="low-study"> Học ít</label>
        </fieldset>

        <div class="advisor-actions">
          <button type="submit" class="advisor-submit">Phân tích hồ sơ</button>
          <button type="button" class="advisor-ai-btn" id="advisor-ai-btn">🤖 AI Tư vấn</button>
          <button type="button" class="advisor-reset">Nhập lại</button>
        </div>
        <div id="advisor-ai-response" class="advisor-ai-response" style="display:none;margin-top:1rem;padding:1rem;border:2px solid #2563eb;border-radius:12px;background:#eff6ff;white-space:pre-wrap;line-height:1.7;font-size:0.92rem;"></div>
      </form>

      <div id="advisor-results" class="advisor-results" aria-live="polite"></div>
    </section>
  `;
}

function bindAdvisorEvents(container) {
  const form = container.querySelector("#advisor-form");
  const reset = container.querySelector(".advisor-reset");
  const quickInput = container.querySelector("#advisor-quick-input");
  const quickBtn = container.querySelector("#advisor-quick-btn");
  const aiBtn = container.querySelector("#advisor-ai-btn");
  const aiResponse = container.querySelector("#advisor-ai-response");

  if (quickInput && quickBtn) {
    quickBtn.addEventListener("click", function() {
      const profile = parseQuickProfile(quickInput.value);
      if (profile.gender) form.querySelector('[name="gender"]').value = profile.gender;
      if (profile.age > 0) form.querySelector('[name="age"]').value = profile.age;
      if (profile.gpa > 0) form.querySelector('[name="gpa"]').value = profile.gpa;
      if (profile.absences !== 10) form.querySelector('[name="absences"]').value = profile.absences;
      if (profile.korean !== 'none') form.querySelector('[name="korean"]').value = profile.korean;
      if (profile.visaFail) form.querySelector('[name="visaFail"]').value = profile.visaFail;
      if (profile.region && profile.region !== 'any') form.querySelector('[name="region"]').value = profile.region;
      if (profile.budget) form.querySelector('[name="budget"]').value = profile.budget;
      // Check priorities
      form.querySelectorAll('[name="priorities"]').forEach(function(cb) {
        cb.checked = profile.priorities.indexOf(cb.value) !== -1;
      });
      // Auto-submit
      form.dispatchEvent(new Event('submit'));
    });

    // Also submit on Enter
    quickInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") { e.preventDefault(); quickBtn.click(); }
    });
  }

  const regionSelect = container.querySelector("#advisor-region-select");
  if (regionSelect && !regionSelect.dataset.populated) {
    // Chỉ hiển thị các khu vực thực sự xuất hiện trong data (SCHOOLS_DATA)
    const regionKeys = Array.from(new Set(
      Object.values(SCHOOLS_DATA || {})
        .map(s => s?.region)
        .filter(Boolean)
    ));
    // Fill region dropdown based on region keys from data.js
    regionKeys.forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = REGION_LABELS[key] || key;
      regionSelect.appendChild(opt);
    });
    regionSelect.dataset.populated = "true";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = readAdvisorForm(form);
    const results = analyzeSchools(profile);
    renderAdvisorResults(container.querySelector("#advisor-results"), profile, results);
    // Track advisor analysis
    if (typeof window.trackAnalytics === 'function') {
      window.trackAnalytics('event', { eventType: 'advisor_analyze', eventData: { region: profile.region, priorities: profile.priorities } });
    }
  });
  reset.addEventListener("click", () => {
    form.reset();
    container.querySelector("#advisor-results").innerHTML = "";
    if (aiResponse) { aiResponse.style.display = 'none'; aiResponse.textContent = ''; }
  });

  // ─── AI Tư vấn ───
  if (aiBtn && aiResponse) {
    aiBtn.addEventListener("click", async function() {
      const profile = readAdvisorForm(form);
      aiBtn.disabled = true;
      aiBtn.textContent = '⏳ Đang phân tích...';
      aiResponse.style.display = 'block';
      aiResponse.textContent = '⏳ Đang gọi AI phân tích hồ sơ...';

      try {
        const res = await fetch('/api/deepseek?action=advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        const data = await res.json();

        // Track AI advisor usage
        if (typeof window.trackAnalytics === 'function') {
          window.trackAnalytics('event', { eventType: 'ai_advisor', eventData: { region: profile.region } });
        }
        if (data.success && data.advice) {
          // Convert response safely: chỉ allow <br> và <strong>, escape mọi thứ khác
          let safeText = data.advice
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          // Restore allowed formatting
          safeText = safeText
            .replace(/&lt;br&gt;/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/<br>- /g, '<br>• ');
          aiResponse.innerHTML = safeText;
        } else {
          aiResponse.textContent = '❌ Lỗi: ' + (data.error || 'Không nhận được phản hồi');
        }
      } catch (err) {
        aiResponse.textContent = '❌ Lỗi kết nối: ' + err.message;
      } finally {
        aiBtn.disabled = false;
        aiBtn.textContent = '🤖 AI Tư vấn';
      }
    });
  }
}

function readAdvisorForm(form) {
  const data = new FormData(form);
  return {
    gender: data.get("gender"),
    age: Number(data.get("age") || 0),
    gpa: Number(data.get("gpa") || 0),
    absences: Number(data.get("absences") || 0),
    korean: data.get("korean"),
    visaFail: data.get("visaFail"),
    region: data.get("region"),
    budget: data.get("budget"),
    priorities: data.getAll("priorities")
  };
}

function analyzeSchools(profile) {
  return Object.keys(SCHOOLS_DATA || {})
    .map((schoolId) => scoreSchool(schoolId, SCHOOLS_DATA[schoolId], profile))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function scoreSchool(schoolId, school, profile) {
  // Ưu tiên: 1) API advisor profiles > 2) Fallback
  const profiles = window.ADVISOR_PROFILES || {};
  let rules = null;
  if (profiles[schoolId]) {
    rules = Object.assign({}, profiles[schoolId]);
  } else {
    rules = buildFallbackAdvisorProfile(school) || {};
  }
  // Prefer canonical region from SCHOOLS_DATA when provided
  if (school && school.region) {
    rules.region = school.region;
  }
  const reasons = [];
  const risks = [];
  let score = 55;

  if (rules.gender === "female" && profile.gender !== "female") {
    score -= 80;
    risks.push("Trường này chỉ phù hợp nữ sinh, nên hồ sơ nam gần như không nên chọn.");
  } else if (rules.gender === "female") {
    score += 8;
    reasons.push("Trường có định hướng tuyển nữ sinh, phù hợp với giới tính của hồ sơ.");
  }

  if (profile.age > 25) {
    score -= 18;
    risks.push("Tuổi trên 25 cần kiểm tra kỹ yêu cầu trường và chiến lược giải trình hồ sơ.");
  } else if (profile.age >= 18) {
    score += 5;
    reasons.push("Độ tuổi nằm trong nhóm hồ sơ D2-6 thường dễ xử lý hơn.");
  }

  if (profile.gpa >= rules.minGpa + 0.5) {
    score += 12;
    reasons.push(`GPA ${profile.gpa.toFixed(1)} cao hơn mức tham chiếu của trường.`);
  } else if (profile.gpa >= rules.minGpa) {
    score += 6;
    reasons.push(`GPA đạt mức tham chiếu của trường (${rules.minGpa}).`);
  } else {
    const gap = (rules.minGpa - profile.gpa).toFixed(1);
    score -= Math.min(24, 8 + gap * 5);
    risks.push(`GPA thấp hơn mức tham chiếu khoảng ${gap} điểm, cần cân nhắc phương án dự phòng.`);
  }

  if (profile.absences <= rules.maxAbsences) {
    score += 8;
    reasons.push("Số buổi nghỉ đang nằm trong ngưỡng an toàn của trường.");
  } else {
    score -= Math.min(30, 10 + (profile.absences - rules.maxAbsences));
    risks.push(`Số buổi nghỉ vượt ngưỡng tham chiếu ${rules.maxAbsences} buổi.`);
  }

  if (profile.korean === "topik3") {
    score += 12;
    reasons.push("Có TOPIK 3 trở lên là điểm cộng mạnh cho visa và chuyển chuyên ngành.");
  } else if (profile.korean === "topik2" || profile.korean === "sejong2b") {
    score += 9;
    reasons.push("Có TOPIK 2/Sejong 2B giúp hồ sơ an toàn hơn.");
  } else {
    score -= rules.interviewDifficulty >= 4 ? 8 : 3;
    risks.push("Chưa có chứng chỉ tiếng Hàn, nên ưu tiên trường ít rủi ro phỏng vấn hơn.");
  }

  if (profile.visaFail === "yes") {
    score -= rules.visaChance >= 5 ? 4 : 12;
    risks.push("Đã từng trượt visa, cần ưu tiên trường có tỷ lệ visa ổn định và chuẩn bị giải trình kỹ.");
  }

  if (profile.region !== "any") {
    // Normalize school region for comparison (gyeonggi/incheon → near-seoul)
    let schoolRegionNorm = rules.region;
    if (schoolRegionNorm === 'gyeonggi' || schoolRegionNorm === 'incheon') {
      schoolRegionNorm = 'near-seoul';
    }

    if (profile.region === schoolRegionNorm) {
      score += 10;
      reasons.push(`Khu vực trường khớp mong muốn: ${REGION_LABELS[schoolRegionNorm]}.`);
    } else if (profile.region === "seoul" && schoolRegionNorm === "near-seoul") {
      score += 5;
      reasons.push("Trường gần Seoul, vẫn phù hợp nếu học sinh muốn tiếp cận khu vực thủ đô.");
    } else if (profile.region === "near-seoul" && schoolRegionNorm === "seoul") {
      score += 5;
      reasons.push("Trường ở Seoul, phù hợp nếu học sinh muốn khu vực gần thủ đô.");
    } else {
      score -= 5;
      risks.push(`Khu vực trường là ${REGION_LABELS[rules.region]}, chưa khớp mong muốn ban đầu.`);
    }
  }

  if (profile.budget === "low") {
    score += (6 - rules.costLevel) * 3;
    if (rules.costLevel <= 2) reasons.push("Chi phí thuộc nhóm dễ chịu, hợp hồ sơ cần tiết kiệm.");
    if (rules.costLevel >= 4) risks.push("Chi phí trường cao hơn nhóm tiết kiệm.");
  } else if (profile.budget === "high" && rules.costLevel >= 3) {
    score += 3;
  }

  profile.priorities.forEach((priority) => {
    if (priority === "visa") score += rules.visaChance * 3;
    if (priority === "job") score += rules.jobOpportunity * 3;
    if (priority === "e7") score += rules.e7Opportunity * 3;
    if (priority === "cost") score += (6 - rules.costLevel) * 3;
    if (priority === "prestige" && rules.tags.includes("prestige")) score += 14;
    if (priority === "low-study") score += (6 - rules.studyLoad) * 2;
  });

  addPriorityReasons(profile, rules, reasons);

  const normalizedScore = normalizeAdvisorScore(score);
  return {
    id: schoolId,
    school,
    score: normalizedScore,
    level: getFitLevel(normalizedScore),
    reasons: reasons.slice(0, 4),
    risks: risks.slice(0, 3),
    rules
  };
}

function normalizeAdvisorScore(rawScore) {
  const curved = 100 / (1 + Math.exp(-(rawScore - 70) / 18));
  return Math.max(4, Math.min(98, Math.round(curved)));
}

function buildFallbackAdvisorProfile(school) {
  const text = [
    school?.name,
    school?.nameKr,
    school?.location,
    ...(school?.advantages || [])
  ].join(" ").toLowerCase();

  return {
    gender: text.includes("nữ") || text.includes("여자") ? "female" : "all",
    minGpa: 5.5,
    maxAbsences: 25,
    region: text.includes("seoul") ? "seoul" : text.includes("gyeonggi") || text.includes("incheon") ? "near-seoul" : text.includes("busan") ? "busan" : text.includes("gwangju") ? "gwangju" : "province",
    costLevel: text.includes("chi phí thấp") || text.includes("học phí rẻ") ? 2 : 3,
    visaChance: text.includes("tỷ lệ đỗ") || text.includes("visa tốt") ? 4 : 3,
    jobOpportunity: text.includes("việc làm nhiều") || text.includes("làm thêm") ? 4 : 3,
    e7Opportunity: text.includes("e7") ? 4 : 3,
    studyLoad: text.includes("học nặng") ? 4 : 3,
    interviewDifficulty: text.includes("phỏng vấn") ? 4 : 3,
    tags: []
  };
}

function addPriorityReasons(profile, rules, reasons) {
  if (profile.priorities.includes("visa") && rules.visaChance >= 4) {
    reasons.push("Trường có mức độ visa tương đối tốt theo bộ đánh giá tư vấn.");
  }
  if (profile.priorities.includes("job") && rules.jobOpportunity >= 4) {
    reasons.push("Phù hợp với học sinh ưu tiên cơ hội việc làm thêm.");
  }
  if (profile.priorities.includes("e7") && rules.e7Opportunity >= 4) {
    reasons.push("Có lợi thế nếu mục tiêu dài hạn là chuyển đổi E7.");
  }
  if (profile.priorities.includes("low-study") && rules.studyLoad <= 2) {
    reasons.push("Lịch học/khối lượng học thuộc nhóm nhẹ hơn.");
  }
}

function getFitLevel(score) {
  if (score >= 82) return "Rất phù hợp";
  if (score >= 68) return "Phù hợp";
  if (score >= 50) return "Cân nhắc";
  return "Rủi ro cao";
}

function buildAdvisorShareText(profile, results) {
  const top = results.slice(0, 3);
  const priorities = profile.priorities.map((p) => PRIORITY_LABELS[p]).join(", ") || "chưa chọn";
  return [
    "Kết quả gợi ý trường D2-6",
    `Khu vực ưu tiên: ${REGION_LABELS[profile.region]}`,
    `Ưu tiên: ${priorities}`,
    "",
    ...top.map(item => [
      `#${item.rank} ${item.school.name} - ${item.score}% (${item.level})`,
      `Lý do: ${item.reasons.slice(0, 2).join("; ")}`,
      item.risks.length ? `Cần kiểm tra: ${item.risks.slice(0, 2).join("; ")}` : ""
    ].filter(Boolean).join("\n")),
    "",
    `Link web: ${location.origin}${location.pathname}`
  ].filter(Boolean).join("\n\n");
}

function renderAdvisorResults(target, profile, results) {
  const top = results.slice(0, 3);
  const excluded = results.filter((item) => item.score < 35).length;
  const priorities = profile.priorities.map((p) => PRIORITY_LABELS[p]).join(", ") || "chưa chọn";
  const shareText = buildAdvisorShareText(profile, results);

  target.innerHTML = `
    <div class="advisor-summary">
      <div>
        <p class="advisor-kicker">Kết quả phân tích</p>
        <h3>Top 3 trường phù hợp nhất</h3>
        <p>Ưu tiên: ${escapeHtml(priorities)}. Khu vực: ${escapeHtml(REGION_LABELS[profile.region])}.</p>
      </div>
      <div class="advisor-score-pill">${top[0]?.score || 0}% phù hợp nhất</div>
    </div>
    <div class="advisor-result-actions">
      <button type="button" data-copy-advisor>Copy kết quả</button>
      <button type="button" data-save-advisor>Lưu kết quả</button>
      <button type="button" data-zalo-advisor>Gửi Zalo</button>
      <span class="advisor-save-status" hidden></span>
    </div>

    <div class="advisor-result-list">
      ${top.map(renderAdvisorCard).join("")}
    </div>

    <div class="advisor-note-box">
      <strong>Lưu ý tư vấn:</strong> Kết quả này là bản MVP dùng để sàng lọc ban đầu. Trước khi chốt trường vẫn cần kiểm tra lại hồ sơ gốc, tài chính, MOU, lịch tuyển sinh và yêu cầu mới nhất từ trường.
      ${excluded ? `<br>${excluded} trường đang bị đánh dấu rủi ro cao với hồ sơ này.` : ""}
    </div>
  `;

  target.querySelectorAll("[data-open-school]").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof window.showSchool === "function") window.showSchool(button.dataset.openSchool);
    });
  });
  const status = target.querySelector(".advisor-save-status");
  const showStatus = (message) => {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
    window.setTimeout(() => { status.hidden = true; }, 1800);
  };
  target.querySelector("[data-copy-advisor]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showStatus("Đã copy kết quả");
      if (typeof window.trackAnalytics === 'function') window.trackAnalytics('event', { eventType: 'advisor_copy' });
    } catch (e) {
      showStatus("Trình duyệt chưa cho phép copy tự động");
    }
  });
  target.querySelector("[data-save-advisor]")?.addEventListener("click", () => {
    try {
      localStorage.setItem("d26AdvisorLastResult", JSON.stringify({
        savedAt: new Date().toISOString(),
        profile,
        top: top.map(item => ({
          id: item.id,
          name: item.school.name,
          score: item.score,
          level: item.level,
          reasons: item.reasons,
          risks: item.risks
        }))
      }));
      if (typeof window.trackAnalytics === 'function') window.trackAnalytics('event', { eventType: 'advisor_save' });
    } catch (e) {}
    showStatus("Đã lưu trên trình duyệt này");
  });
  target.querySelector("[data-zalo-advisor]")?.addEventListener("click", () => {
    if (typeof openZaloPopup === "function") openZaloPopup();
    if (typeof window.trackAnalytics === 'function') window.trackAnalytics('event', { eventType: 'zalo_popup', eventData: { source: 'advisor' } });
  });
}

function renderAdvisorCard(item) {
  const risks = item.risks.length ? item.risks : ["Chưa có rủi ro lớn trong bộ tiêu chí MVP."];
  return `
    <article class="advisor-card">
      <div class="advisor-card-top">
        <div>
          <span class="advisor-rank">#${item.rank}</span>
          <h4>${escapeHtml(item.school.name)}</h4>
          <p>${escapeHtml(item.school.nameKr || item.school.nameEn || "")}</p>
        </div>
        <div class="advisor-percent">${item.score}%</div>
      </div>
      <div class="advisor-meter"><span style="width:${item.score}%"></span></div>
      <div class="advisor-badges">
        <span>${item.level}</span>
        <span>${escapeHtml(REGION_LABELS[item.rules.region])}</span>
        <span>Chi phí mức ${item.rules.costLevel}/5</span>
      </div>
      <div class="advisor-columns">
        <div>
          <strong>Lý do nên cân nhắc</strong>
          <ul>${item.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Rủi ro cần kiểm tra</strong>
          <ul>${risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("")}</ul>
        </div>
      </div>
      <button type="button" class="advisor-open-school" data-open-school="${item.id}">Xem chi tiết trường</button>
    </article>
  `;
}
