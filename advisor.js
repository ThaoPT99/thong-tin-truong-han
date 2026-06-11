const ADVISOR_PROFILES = {
  "dh-osan": {
    gender: "all",
    minGpa: 6.3,
    maxAbsences: 15,
    region: "near-seoul",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 5,
    e7Opportunity: 5,
    studyLoad: 2,
    interviewDifficulty: 5,
    tags: ["job", "e7", "low-cost", "near-seoul"]
  },
  "dh-induk": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "seoul",
    costLevel: 2,
    visaChance: 3,
    jobOpportunity: 5,
    e7Opportunity: 4,
    studyLoad: 2,
    interviewDifficulty: 4,
    tags: ["job", "low-study", "seoul"]
  },
  "dh-yeonsung": {
    gender: "all",
    minGpa: 5.5,
    maxAbsences: 25,
    region: "near-seoul",
    costLevel: 3,
    visaChance: 5,
    jobOpportunity: 4,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 3,
    tags: ["visa", "near-seoul", "balanced"]
  },
  "dh-sangmyung": {
    gender: "all",
    minGpa: 6,
    maxAbsences: 20,
    region: "seoul",
    costLevel: 4,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 5,
    studyLoad: 5,
    interviewDifficulty: 4,
    tags: ["prestige", "e7", "seoul"]
  },
  "dh-nu-sinh-kyungin": {
    gender: "female",
    minGpa: 5.5,
    maxAbsences: 25,
    region: "near-seoul",
    costLevel: 3,
    visaChance: 5,
    jobOpportunity: 4,
    e7Opportunity: 5,
    studyLoad: 3,
    interviewDifficulty: 3,
    tags: ["visa", "female", "e7", "near-seoul"]
  },
  "dh-y-te-dongnam": {
    gender: "all",
    minGpa: 5.5,
    maxAbsences: 20,
    region: "near-seoul",
    costLevel: 3,
    visaChance: 5,
    jobOpportunity: 2,
    e7Opportunity: 4,
    studyLoad: 4,
    interviewDifficulty: 3,
    tags: ["visa", "healthcare", "near-seoul"]
  },
  "dh-dongeui": {
    gender: "all",
    minGpa: 5.5,
    maxAbsences: 25,
    region: "busan",
    costLevel: 3,
    visaChance: 5,
    jobOpportunity: 5,
    e7Opportunity: 5,
    studyLoad: 4,
    interviewDifficulty: 3,
    tags: ["visa", "job", "e7", "busan"]
  },
  "cd-suncheon-jeil": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "province",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 5,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["e7", "low-cost", "province"]
  },
  "dh-nu-sinh-busan": {
    gender: "female",
    minGpa: 5,
    maxAbsences: 30,
    region: "busan",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["female", "low-cost", "busan"]
  },
  "dh-busan-catholic": {
    gender: "all",
    minGpa: 5.5,
    maxAbsences: 25,
    region: "busan",
    costLevel: 3,
    visaChance: 4,
    jobOpportunity: 3,
    e7Opportunity: 4,
    studyLoad: 4,
    interviewDifficulty: 3,
    tags: ["healthcare", "busan", "stable"]
  },
  "dh-gimhae": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "busan",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["low-cost", "technical", "busan"]
  },
  "dh-gwangju": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "gwangju",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["low-cost", "gwangju", "province"]
  },
  "dh-nambu": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "gwangju",
    costLevel: 1,
    visaChance: 5,
    jobOpportunity: 3,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["visa", "low-cost", "gwangju"]
  },
  "dh-daewon": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "province",
    costLevel: 1,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 5,
    studyLoad: 2,
    interviewDifficulty: 2,
    tags: ["low-cost", "e7", "low-study", "province"]
  },
  "dh-sengmyung": {
    gender: "all",
    minGpa: 5,
    maxAbsences: 30,
    region: "province",
    costLevel: 2,
    visaChance: 4,
    jobOpportunity: 3,
    e7Opportunity: 4,
    studyLoad: 3,
    interviewDifficulty: 2,
    tags: ["stable", "low-cost", "province"]
  },
  "dh-nu-sinh-dongduk": {
    gender: "female",
    minGpa: 6,
    maxAbsences: 20,
    region: "seoul",
    costLevel: 4,
    visaChance: 4,
    jobOpportunity: 4,
    e7Opportunity: 4,
    studyLoad: 4,
    interviewDifficulty: 4,
    tags: ["female", "prestige", "seoul", "arts"]
  }
};

const PRIORITY_LABELS = {
  visa: "dễ đỗ visa",
  cost: "chi phí thấp",
  job: "việc làm thêm",
  e7: "dễ chuyển E7",
  prestige: "trường uy tín",
  "low-study": "học ít"
};

const REGION_LABELS = {
  any: "không ưu tiên khu vực",

  // Nhóm cũ (giữ để tương thích)
  seoul: "Seoul",
  "near-seoul": "gần Seoul",
  busan: "Busan",
  gwangju: "Gwangju",
  province: "tỉnh/thành khác",

  // Key region chi tiết theo data.js
  incheon: "Incheon",
  gyeonggi: "Gyeonggi",
  chungcheongbuk: "Chungcheongbuk",
  jeollanam: "Jeollanam",
  jeollabuk: "Jeollabuk",
  gyeongsangnam: "Gyeongsangnam",
  gyeongsangbuk: "Gyeongsangbuk",
  gangwon: "Gangwon",
  chungcheongnam: "Chungcheongnam",
  daegu: "Daegu",
  daejeon: "Daejeon",
  ulsan: "Ulsan",
  sejong: "Sejong",
  jeju: "Jeju"
};


function advisorEscapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
}

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
          <button type="button" class="advisor-reset">Nhập lại</button>
        </div>
      </form>

      <div id="advisor-results" class="advisor-results" aria-live="polite"></div>
    </section>
  `;
}

function bindAdvisorEvents(container) {
  const form = container.querySelector("#advisor-form");
  const reset = container.querySelector(".advisor-reset");

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
  });
  reset.addEventListener("click", () => {
    form.reset();
    container.querySelector("#advisor-results").innerHTML = "";
  });
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
  let rules = ADVISOR_PROFILES[schoolId] ? Object.assign({}, ADVISOR_PROFILES[schoolId]) : (buildFallbackAdvisorProfile(school) || {});
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
    if (profile.region === rules.region) {
      score += 10;
      reasons.push(`Khu vực trường khớp mong muốn: ${REGION_LABELS[rules.region]}.`);
    } else if (profile.region === "seoul" && rules.region === "near-seoul") {
      score += 5;
      reasons.push("Trường gần Seoul, vẫn phù hợp nếu học sinh muốn tiếp cận khu vực thủ đô.");
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
    region: text.includes("seoul") ? "seoul" : text.includes("busan") ? "busan" : text.includes("gwangju") ? "gwangju" : "province",
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
        <p>Ưu tiên: ${advisorEscapeHtml(priorities)}. Khu vực: ${advisorEscapeHtml(REGION_LABELS[profile.region])}.</p>
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
    button.addEventListener("click", () => showSchool(button.dataset.openSchool));
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
    } catch (e) {
      showStatus("Trình duyệt chưa cho phép copy tự động");
    }
  });
  target.querySelector("[data-save-advisor]")?.addEventListener("click", () => {
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
    showStatus("Đã lưu trên trình duyệt này");
  });
  target.querySelector("[data-zalo-advisor]")?.addEventListener("click", () => {
    if (typeof openZaloPopup === "function") openZaloPopup();
  });
}

function renderAdvisorCard(item) {
  const risks = item.risks.length ? item.risks : ["Chưa có rủi ro lớn trong bộ tiêu chí MVP."];
  return `
    <article class="advisor-card">
      <div class="advisor-card-top">
        <div>
          <span class="advisor-rank">#${item.rank}</span>
          <h4>${advisorEscapeHtml(item.school.name)}</h4>
          <p>${advisorEscapeHtml(item.school.nameKr || item.school.nameEn || "")}</p>
        </div>
        <div class="advisor-percent">${item.score}%</div>
      </div>
      <div class="advisor-meter"><span style="width:${item.score}%"></span></div>
      <div class="advisor-badges">
        <span>${item.level}</span>
        <span>${advisorEscapeHtml(REGION_LABELS[item.rules.region])}</span>
        <span>Chi phí mức ${item.rules.costLevel}/5</span>
      </div>
      <div class="advisor-columns">
        <div>
          <strong>Lý do nên cân nhắc</strong>
          <ul>${item.reasons.map((reason) => `<li>${advisorEscapeHtml(reason)}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Rủi ro cần kiểm tra</strong>
          <ul>${risks.map((risk) => `<li>${advisorEscapeHtml(risk)}</li>`).join("")}</ul>
        </div>
      </div>
      <button type="button" class="advisor-open-school" data-open-school="${item.id}">Xem chi tiết trường</button>
    </article>
  `;
}
