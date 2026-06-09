const PLACEHOLDER = "images/placeholder.svg";

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function applyHighlights(html) {
  if (!html || typeof html !== "string") return html;
  return html
    .replace(/(Lưu ý:|LƯU Ý:)/g, "<span class='hl-note'>$1</span>")
    .replace(/(\d[\d.,\s]*(?:KRW|원|won|triệu))/gi, "<span class='hl-money'>$1</span>")
    .replace(/(học bổng|topik|sejong(?: 2b)?)/gi, "<span class='hl-keyword'>$1</span>");
}

function renderText(val) {
  if (val === undefined || val === null || val === "") return "";
  let raw = "";
  if (typeof val === "string") raw = val;
  else if (Array.isArray(val)) raw = val.map(seg => seg.t || "").join("");
  else raw = String(val);
  return applyHighlights(escapeHtml(raw).replace(/\n/g, "<br>"));
}

function renderValue(val) {
  const rendered = renderText(val);
  return rendered || `<span class="muted-empty">Đang cập nhật</span>`;
}

function renderSimpleList(items) {
  if (!items || !items.length) return `<span class="muted-empty">Đang cập nhật</span>`;
  return `<ul class="detail-list">${items.map(item => `<li>${renderText(String(item))}</li>`).join("")}</ul>`;
}

function listToInline(items, limit = 3) {
  if (!items || !items.length) return "Đang cập nhật";
  return items.slice(0, limit).map(item => String(item).replace(/\s+/g, " ").trim()).join("; ");
}

function getSchools() {
  return Object.values(SCHOOLS_DATA || {});
}

function getSchoolById(schoolId) {
  return (SCHOOLS_DATA || {})[schoolId];
}

function getAdvisorRules(schoolId, school) {
  if (typeof ADVISOR_PROFILES !== "undefined" && ADVISOR_PROFILES[schoolId]) {
    return ADVISOR_PROFILES[schoolId];
  }
  if (typeof buildFallbackAdvisorProfile === "function") {
    return buildFallbackAdvisorProfile(school);
  }
  return {
    gender: "all",
    region: "province",
    costLevel: 3,
    visaChance: 3,
    jobOpportunity: 3,
    e7Opportunity: 3,
    studyLoad: 3,
    tags: []
  };
}

function getRegionLabel(region) {
  const labels = {
    any: "Không ưu tiên",
    seoul: "Seoul",
    "near-seoul": "Gần Seoul",
    busan: "Busan",
    gwangju: "Gwangju",
    province: "Tỉnh/thành khác"
  };
  return labels[region] || "Đang cập nhật";
}

function getSchoolSummary(school) {
  const text = [school.nameKr, school.system, ...(school.advantages || [])].join(" ");
  const short = text.replace(/\s+/g, " ").trim();
  return short.length > 120 ? `${short.slice(0, 120)}...` : short || "Thông tin chi tiết được cập nhật theo từng kỳ tuyển sinh.";
}

function getRecentSchools() {
  try {
    return JSON.parse(localStorage.getItem("recentSchools") || "[]");
  } catch (e) {
    return [];
  }
}

function saveRecentSchool(schoolId) {
  if (!schoolId) return;
  const next = [schoolId, ...getRecentSchools().filter(id => id !== schoolId)]
    .filter(id => getSchoolById(id))
    .slice(0, 5);
  localStorage.setItem("recentSchools", JSON.stringify(next));
}

function renderRecentSchools() {
  const recent = getRecentSchools().map(id => getSchoolById(id)).filter(Boolean);
  if (!recent.length) return "";
  return `
    <div class="recent-schools">
      <span>Đã xem gần đây</span>
      <div>
        ${recent.map(s => `<button type="button" data-open-school="${escapeHtml(s.id)}">${escapeHtml(s.name)}</button>`).join("")}
      </div>
    </div>
  `;
}

function buildSchoolSearchText(school) {
  return [
    school.name,
    school.nameKr,
    school.nameEn,
    school.system,
    school.location,
    school.tuition,
    school.ktx,
    school.mou,
    ...(school.conditions || []),
    ...(school.majors || []),
    ...(school.advantages || []),
    ...(school.conversion || []),
    ...(school.documents || []),
    ...(school.partners || []).flatMap(p => [p.code, p.name])
  ].filter(Boolean).join(" ").toLowerCase();
}

function renderSchool(schoolId) {
  const s = getSchoolById(schoolId);
  if (!s) return "";

  const img = (path) => path ? `<img src="${path}" alt="" onerror="this.src='${PLACEHOLDER}'" class="sheet-img">` : "";
  let videoEmbedHtml = "";
  if (s.video?.youtubeId) {
    videoEmbedHtml = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${s.video.youtubeId}" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  } else if (s.video?.url && s.video.url.includes("drive.google.com")) {
    const m = s.video.url.match(/\/d\/([^/]+)/);
    if (m) videoEmbedHtml = `<div class="video-embed"><iframe src="https://drive.google.com/file/d/${m[1]}/preview" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  }

  const videoLinkHtml = s.video?.url ? `<a href="${s.video.url}" target="_blank" rel="noopener" class="video-link">Mở video</a>` : "";
  const videoHtml = videoEmbedHtml
    ? videoEmbedHtml + (videoLinkHtml ? "<br>" + videoLinkHtml : "")
    : videoLinkHtml || (s.video?.title ? `<span>${s.video.title}</span>` : "");

  const partnersToText = (arr) => arr && arr.length
    ? arr.map(p => `<span class="partner-tag">${escapeHtml(p.code || "")}</span> ${escapeHtml(p.name || "")}`).join("<br>")
    : `<span class="muted-empty">Đang cập nhật</span>`;

  const catalogVal = s.links?.catalog
    ? `<a href="${s.links.catalog}" target="_blank" rel="noopener">Mở Catalog</a>`
    : s.images?.catalog ? img(s.images.catalog) : "";
  const locationVal = [renderValue(s.location), s.images?.locationMap ? img(s.images.locationMap) : ""].filter(Boolean).join("<br>");
  const introVal = [s.links?.website ? `<a href="${s.links.website}" target="_blank" rel="noopener">${escapeHtml(s.links.website)}</a>` : "", renderValue(s.intro)].filter(Boolean).join("<br>");
  const docsVal = renderSimpleList(s.documents) + (s.documentsNote ? `<div class="note">${renderText(s.documentsNote)}</div>` : "");
  const invoiceVal = s.links?.invoice
    ? `<a href="${s.links.invoice}" target="_blank" rel="noopener">Mở Invoice</a>`
    : s.images?.invoice ? img(s.images.invoice) : "";
  const rules = getAdvisorRules(schoolId, s);

  return `
    <section class="school-detail">
      <div class="detail-hero">
        <div>
          <div class="detail-breadcrumb"><button type="button" class="back-to-schools">Trường</button><span>/</span><span>${escapeHtml(s.name)}</span></div>
          <p class="detail-kicker">Chi tiết trường</p>
          <h2>${escapeHtml(s.name)}</h2>
          ${s.nameKr ? `<p class="korean">${escapeHtml(s.nameKr)}</p>` : ""}
          ${s.nameEn ? `<p>${escapeHtml(s.nameEn)}</p>` : ""}
        </div>
        <div class="detail-actions">
          <button type="button" class="copy-school-info" data-school-id="${escapeHtml(schoolId)}">Copy thông tin</button>
          <button type="button" class="copy-school-link" data-school-id="${escapeHtml(schoolId)}">Copy link</button>
          <button type="button" class="open-zalo-detail">Tư vấn Zalo</button>
        </div>
      </div>
      <nav class="detail-jump" aria-label="Mục trong trang">
        <a href="#tong-quan">Tổng quan</a>
        <a href="#dieu-kien">Điều kiện</a>
        <a href="#hoc-phi">Học phí</a>
        <a href="#ho-so">Hồ sơ</a>
        <a href="#tai-lieu">Tài liệu</a>
      </nav>
      <div class="detail-overview">
        <div><span>Hệ học</span><strong>${renderValue(s.system)}</strong></div>
        <div><span>Khu vực</span><strong>${escapeHtml(getRegionLabel(rules.region))}</strong></div>
        <div><span>Chỉ tiêu</span><strong>${s.quota ? escapeHtml(String(s.quota)) : `<span class="muted-empty">Đang cập nhật</span>`}</strong></div>
        <div><span>Đối tượng</span><strong>${rules.gender === "female" ? "Nữ sinh" : "Nam/Nữ"}</strong></div>
      </div>
      <div class="detail-grid">
        <article class="detail-card detail-card-wide" id="tong-quan">
          <h3>Tổng quan</h3>
          <div class="detail-readable">${introVal}</div>
        </article>
        <article class="detail-card">
          <h3>Vị trí</h3>
          <div>${locationVal}</div>
        </article>
        <article class="detail-card" id="dieu-kien">
          <h3>Điều kiện tuyển sinh</h3>
          ${renderSimpleList(s.conditions)}
        </article>
        <article class="detail-card">
          <h3>Chuyên ngành</h3>
          ${renderSimpleList(s.majors)}
        </article>
        <article class="detail-card" id="hoc-phi">
          <h3>Học phí</h3>
          <div>${renderValue(s.tuition)}</div>
        </article>
        <article class="detail-card">
          <h3>Ký túc xá</h3>
          <div>${renderValue(s.ktx)}</div>
        </article>
        <article class="detail-card">
          <h3>Ưu điểm</h3>
          ${renderSimpleList(s.advantages)}
        </article>
        <article class="detail-card">
          <h3>Lộ trình chuyển đổi</h3>
          ${renderSimpleList(s.conversion)}
        </article>
        <article class="detail-card detail-card-wide" id="ho-so">
          <h3>Hồ sơ cần lưu ý</h3>
          <details class="detail-more" open>
            <summary>Xem danh sách hồ sơ</summary>
            <div>${docsVal}</div>
          </details>
        </article>
        <article class="detail-card" id="tai-lieu">
          <h3>Tài liệu</h3>
          <div class="detail-links">
            ${catalogVal || `<span class="muted-empty">Catalog đang cập nhật</span>`}
            ${invoiceVal || `<span class="muted-empty">Invoice đang cập nhật</span>`}
          </div>
        </article>
        <article class="detail-card">
          <h3>Video</h3>
          <div>${videoHtml || `<span class="muted-empty">Đang cập nhật</span>`}</div>
        </article>
        <article class="detail-card detail-card-wide">
          <h3>Trường CĐ/ĐH tại Việt Nam</h3>
          <div>${(s.mou ? renderText(s.mou) : "") || partnersToText(s.partners)}</div>
        </article>
      </div>
      <div class="copy-toast" hidden>Đã copy thông tin trường</div>
    </section>
  `;
}

function renderSchoolsDirectory() {
  const schools = getSchools();
  return `
    <section class="directory-view">
      <div class="directory-head">
        <div>
          <p class="advisor-kicker">Danh sách trường</p>
          <h2>${schools.length} trường tuyển sinh</h2>
          <p>Chọn tên trường để xem thông tin chi tiết về điều kiện, học phí, hồ sơ, ký túc xá và tài liệu liên quan.</p>
        </div>
        <div class="directory-tools">
          <input id="school-search" type="search" placeholder="Tìm trường, khu vực, hệ học...">
          <select id="school-region-filter">
            <option value="all">Tất cả khu vực</option>
            <option value="seoul">Seoul</option>
            <option value="near-seoul">Gần Seoul</option>
            <option value="busan">Busan</option>
            <option value="gwangju">Gwangju</option>
            <option value="province">Tỉnh/thành khác</option>
          </select>
        </div>
      </div>
      <div class="quick-filter-bar" aria-label="Bộ lọc nhanh">
        <button type="button" data-quick-filter="all" class="active">Tất cả</button>
        <button type="button" data-quick-filter="seoul">Seoul</button>
        <button type="button" data-quick-filter="near-seoul">Gần Seoul</button>
        <button type="button" data-quick-filter="busan">Busan</button>
        <button type="button" data-quick-filter="low-cost">Chi phí thấp</button>
        <button type="button" data-quick-filter="female">Chỉ nữ</button>
        <button type="button" data-quick-filter="e7">Dễ E7</button>
      </div>
      ${renderRecentSchools()}
      <div class="directory-count"><span id="school-result-count">${schools.length}</span> trường đang hiển thị</div>
      <div id="school-card-grid" class="school-name-grid">
        ${schools.map(renderSchoolCard).join("")}
      </div>
      <p id="school-empty-state" class="muted-empty directory-empty hidden">Không tìm thấy trường phù hợp với bộ lọc hiện tại.</p>
    </section>
  `;
}

function renderSchoolCard(school) {
  const rules = getAdvisorRules(school.id, school);
  const tags = [
    rules.costLevel <= 2 ? "low-cost" : "",
    rules.gender === "female" ? "female" : "",
    rules.e7Opportunity >= 4 ? "e7" : ""
  ].filter(Boolean).join(" ");
  return `
    <button type="button" class="school-name-item" data-school-card data-region="${escapeHtml(rules.region)}" data-tags="${escapeHtml(tags)}" data-search="${escapeHtml(buildSchoolSearchText(school))}" data-open-school="${escapeHtml(school.id)}">
      ${escapeHtml(school.name)}
    </button>
  `;
}

function bindSchoolsDirectory(container) {
  const search = container.querySelector("#school-search");
  const region = container.querySelector("#school-region-filter");
  const quickButtons = Array.from(container.querySelectorAll("[data-quick-filter]"));
  const cards = Array.from(container.querySelectorAll("[data-school-card]"));
  const count = container.querySelector("#school-result-count");
  const empty = container.querySelector("#school-empty-state");
  let quickFilter = "all";

  const applyFilters = () => {
    const q = (search.value || "").trim().toLowerCase();
    const selectedRegion = region.value;
    let visible = 0;
    cards.forEach(card => {
      const matchSearch = !q || card.dataset.search.includes(q);
      const matchRegion = selectedRegion === "all" || card.dataset.region === selectedRegion;
      const matchQuick = quickFilter === "all"
        || card.dataset.region === quickFilter
        || (card.dataset.tags || "").split(" ").includes(quickFilter);
      const isVisible = matchSearch && matchRegion && matchQuick;
      card.classList.toggle("hidden", !isVisible);
      if (isVisible) visible += 1;
    });
    if (count) count.textContent = String(visible);
    empty?.classList.toggle("hidden", visible !== 0);
  };

  search.addEventListener("input", applyFilters);
  region.addEventListener("change", applyFilters);
  quickButtons.forEach(button => {
    button.addEventListener("click", () => {
      quickFilter = button.dataset.quickFilter;
      quickButtons.forEach(btn => btn.classList.toggle("active", btn === button));
      applyFilters();
    });
  });
  container.querySelectorAll("[data-open-school]").forEach(button => {
    button.addEventListener("click", () => showSchool(button.dataset.openSchool));
  });
}

function renderCompare() {
  const schools = getSchools();
  const options = schools.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`).join("");
  return `
    <section class="compare-view">
      <div class="directory-head">
        <div>
          <p class="advisor-kicker">So sánh trường</p>
          <h2>So sánh nhanh theo dữ liệu hiện có</h2>
          <p>Chọn tối đa 3 trường để xem nhanh những điểm khác biệt quan trọng nhất.</p>
        </div>
      </div>
      <div class="compare-picker">
        <select class="compare-select">${options}</select>
        <select class="compare-select">${options}</select>
        <select class="compare-select">${options}</select>
      </div>
      <div id="compare-result"></div>
    </section>
  `;
}

function bindCompare(container) {
  const selects = Array.from(container.querySelectorAll(".compare-select"));
  const defaults = getSchools().slice(0, 3).map(s => s.id);
  selects.forEach((select, index) => {
    if (defaults[index]) select.value = defaults[index];
    select.addEventListener("change", () => renderCompareResult(container));
  });
  renderCompareResult(container);
}

function getSchoolShareText(school) {
  return [
    `Thông tin trường: ${school.name}`,
    school.nameEn ? `Tên tiếng Anh: ${school.nameEn}` : "",
    school.system ? `Hệ học: ${school.system}` : "",
    school.location ? `Vị trí: ${school.location}` : "",
    school.tuition ? `Học phí: ${String(school.tuition).replace(/\n+/g, " ")}` : "",
    school.ktx ? `KTX: ${String(school.ktx).replace(/\n+/g, " ")}` : "",
    `Link: ${location.origin}${location.pathname}?school=${encodeURIComponent(school.id)}`
  ].filter(Boolean).join("\n");
}

function showCopyToast(container, message) {
  const toast = container.querySelector(".copy-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 1800);
}

function updatePageMeta(viewId, school) {
  const semester = typeof SEMESTER_INFO !== "undefined"
    ? `Kỳ tháng ${SEMESTER_INFO.ky || "3"}/${SEMESTER_INFO.nam || "2027"}`
    : "Visa D2-6";
  const title = school
    ? `${school.name} - Thông tin trường Hàn`
    : `Thông tin trường Hàn - ${semester}`;
  const desc = school
    ? `${school.name}: điều kiện, học phí, ký túc xá, hồ sơ và tài liệu liên quan cho chương trình Visa D2-6.`
    : `${semester} - Tra cứu danh sách trường Hàn, so sánh lựa chọn và phân tích hồ sơ D2-6.`;

  document.title = title;
  const ogTitle = document.getElementById("og-title");
  const ogDesc = document.getElementById("og-desc");
  if (ogTitle) ogTitle.content = title;
  if (ogDesc) ogDesc.content = desc;
}

function bindSchoolDetail(container, schoolId) {
  const school = getSchoolById(schoolId);
  saveRecentSchool(schoolId);
  container.querySelector(".back-to-schools")?.addEventListener("click", () => showSchool("schools"));
  container.querySelector(".open-zalo-detail")?.addEventListener("click", () => {
    if (typeof openZaloPopup === "function") openZaloPopup();
  });
  container.querySelector(".copy-school-info")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getSchoolShareText(school));
      showCopyToast(container, "Đã copy thông tin trường");
    } catch (e) {
      showCopyToast(container, "Trình duyệt chưa cho phép copy tự động");
    }
  });
  container.querySelector(".copy-school-link")?.addEventListener("click", async () => {
    const link = `${location.origin}${location.pathname}?school=${encodeURIComponent(schoolId)}`;
    try {
      await navigator.clipboard.writeText(link);
      showCopyToast(container, "Đã copy link trường");
    } catch (e) {
      showCopyToast(container, "Trình duyệt chưa cho phép copy tự động");
    }
  });
}

function updateUrlForView(viewId) {
  const url = new URL(window.location.href);
  url.searchParams.delete("school");
  url.searchParams.delete("view");
  if (getSchoolById(viewId)) url.searchParams.set("school", viewId);
  else if (viewId !== "schools") url.searchParams.set("view", viewId);
  window.history.replaceState({}, "", url);
}

function getInitialView() {
  const params = new URLSearchParams(window.location.search);
  const schoolId = params.get("school");
  if (schoolId && getSchoolById(schoolId)) return schoolId;
  const view = params.get("view");
  if (["advisor", "compare", "map", "extra", "ebook", "schools"].includes(view)) return view;
  return "schools";
}

function bindGuide(container) {
  if (!container || container.dataset.bound === "true") return;
  const buttons = Array.from(container.querySelectorAll("[data-guide-section]"));
  const panels = Array.from(container.querySelectorAll("[data-guide-panel]"));
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const section = button.dataset.guideSection;
      buttons.forEach(btn => btn.classList.toggle("active", btn === button));
      panels.forEach(panel => panel.classList.toggle("active", panel.dataset.guidePanel === section));
    });
  });
  container.querySelectorAll("[data-school]").forEach(button => {
    button.addEventListener("click", () => showSchool(button.dataset.school));
  });
  container.dataset.bound = "true";
}

function renderCompareResult(container) {
  const target = container.querySelector("#compare-result");
  const ids = Array.from(container.querySelectorAll(".compare-select")).map(select => select.value);
  const uniqueIds = [...new Set(ids)];
  const schools = uniqueIds.map(id => getSchoolById(id)).filter(Boolean);
  target.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            ${schools.map(s => `<th>${escapeHtml(s.name)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${renderCompareRow("Hệ học", schools, s => renderValue(s.system))}
          ${renderCompareRow("Khu vực", schools, s => escapeHtml(getRegionLabel(getAdvisorRules(s.id, s).region)))}
          ${renderCompareRow("Học phí", schools, s => renderValue(s.tuition))}
          ${renderCompareRow("KTX", schools, s => renderValue(s.ktx))}
          ${renderCompareRow("Ưu điểm chính", schools, s => renderText(listToInline(s.advantages, 3)))}
          ${renderCompareRow("Rủi ro cần lưu ý", schools, s => renderText(getCompareRisk(s)))}
        </tbody>
      </table>
    </div>
  `;
}

function renderCompareRow(label, schools, getValue) {
  return `<tr><td>${label}</td>${schools.map(s => `<td>${getValue(s) || "Đang cập nhật"}</td>`).join("")}</tr>`;
}

function renderAdvisorMetrics(school) {
  const r = getAdvisorRules(school.id, school);
  return `
    Visa ${r.visaChance || 3}/5<br>
    Việc làm ${r.jobOpportunity || 3}/5<br>
    E7 ${r.e7Opportunity || 3}/5<br>
    Chi phí ${r.costLevel || 3}/5
  `;
}

function getCompareRisk(school) {
  const rules = getAdvisorRules(school.id, school);
  const risks = [];
  if (rules.interviewDifficulty >= 4) risks.push("Phỏng vấn/đánh giá đầu vào cần chuẩn bị kỹ");
  if (rules.studyLoad >= 4) risks.push("Khối lượng học tương đối nặng");
  if (rules.costLevel >= 4) risks.push("Chi phí thuộc nhóm cao");
  if (rules.gender === "female") risks.push("Chỉ phù hợp nữ sinh");
  return risks.join("; ") || "Chưa có rủi ro nổi bật";
}

const D26_SAMPLE_CHECKLIST = [
  {
    group: "Hồ sơ visa",
    items: [
      { name: "Application form Đại sứ quán", level: "Bắt buộc", note: "Điền đúng mẫu hiện hành của ĐSQ/LSQ." },
      { name: "Đơn xác nhận lịch sử bị từ chối visa", level: "Bắt buộc", note: "Cần khai trung thực lịch sử visa trước đó." },
      { name: "Thư mời nhập học", level: "Bắt buộc", note: "Dùng bản do trường Hàn phát hành." },
      { name: "Đăng ký kinh doanh trường Hàn", level: "Bắt buộc", note: "Thường nộp bản photo hoặc file trường cung cấp." },
      { name: "MOU giữa trường Việt Nam và trường Hàn", level: "Bắt buộc", note: "Kiểm tra đúng cặp trường/hệ chương trình." },
      { name: "Quyết định trao đổi sinh viên", level: "Bắt buộc", note: "Thông tin học sinh và trường phải khớp hồ sơ." },
      { name: "Thư tiến cử", level: "Bắt buộc", note: "Thường do trường Việt Nam cấp theo mẫu." },
      { name: "Giấy khám sức khỏe", level: "Bắt buộc", note: "Lưu ý yêu cầu lao phổi và thời hạn giấy khám." }
    ]
  },
  {
    group: "Hồ sơ học tập",
    items: [
      { name: "Kế hoạch học tập", level: "Bắt buộc", note: "Nội dung cần hợp lý với ngành, trường và lộ trình D2-6." },
      { name: "Giới thiệu bản thân", level: "Bắt buộc", note: "Tránh viết chung chung, cần khớp hoàn cảnh hồ sơ." },
      { name: "Giấy xác nhận sinh viên", level: "Bắt buộc", note: "Chuẩn bị cả bản dịch/công chứng nếu được yêu cầu." },
      { name: "Bảng điểm cao đẳng/đại học", level: "Bắt buộc", note: "Thông tin điểm, kỳ học, tên trường phải rõ ràng." },
      { name: "Học bạ THPT", level: "Bắt buộc", note: "Kiểm tra GPA và số buổi nghỉ trước khi chọn trường." },
      { name: "Bằng tốt nghiệp THPT", level: "Bắt buộc", note: "Cần đối chiếu bản gốc khi nộp hoặc phỏng vấn." },
      { name: "Tem tím bằng tốt nghiệp", level: "Bắt buộc", note: "Số lượng bản tùy yêu cầu trường/ĐSQ." },
      { name: "Tem tím học bạ", level: "Bắt buộc", note: "Nên chuẩn bị dư theo kế hoạch nộp trường và visa." },
      { name: "Tem tím bảng điểm", level: "Bắt buộc", note: "Áp dụng với hồ sơ đang học/đã học CĐ/ĐH." },
      { name: "Tem tím giấy xác nhận sinh viên", level: "Bắt buộc", note: "Thông tin phải khớp giấy xác nhận gốc." }
    ]
  },
  {
    group: "Hồ sơ tài chính",
    items: [
      { name: "Sổ tiết kiệm học sinh", level: "Bắt buộc", note: "Ưu tiên đứng tên học sinh, kiểm tra số tiền và thời hạn." },
      { name: "Xác nhận số dư tài khoản", level: "Bắt buộc", note: "Phát hành gần thời điểm nộp theo yêu cầu hồ sơ." },
      { name: "Xác nhận thu nhập", level: "Bắt buộc", note: "Cần logic với nghề nghiệp và dòng tiền gia đình." },
      { name: "Hợp đồng lao động hoặc giấy xác nhận công việc", level: "Nên có", note: "Giúp làm rõ nguồn thu nhập của người bảo lãnh." },
      { name: "Sao kê tài khoản bố", level: "Nên có", note: "Cần khi chứng minh dòng tiền hoặc thu nhập gia đình." },
      { name: "Sao kê tài khoản mẹ", level: "Nên có", note: "Bổ sung nếu mẹ là người bảo lãnh hoặc có dòng tiền chính." },
      { name: "Sổ đỏ hoặc giấy tờ tài sản", level: "Nên có", note: "Tăng độ tin cậy tài chính nếu gia đình có tài sản." },
      { name: "Giải trình sao kê", level: "Tùy trường hợp", note: "Cần khi dòng tiền lớn, bất thường hoặc khó giải thích." },
      { name: "Giải trình đăng ký kinh doanh", level: "Tùy trường hợp", note: "Dùng khi gia đình kinh doanh hoặc nguồn thu từ hộ kinh doanh." },
      { name: "Cam kết bảo lãnh tài chính", level: "Bắt buộc", note: "Thông tin người bảo lãnh phải khớp giấy tờ nhân thân." }
    ]
  },
  {
    group: "Hồ sơ nhân thân",
    items: [
      { name: "Giấy khai sinh", level: "Bắt buộc", note: "Dùng để chứng minh quan hệ gia đình." },
      { name: "CT07", level: "Bắt buộc", note: "Cần đúng mẫu và thông tin cư trú phải khớp." },
      { name: "Photo hộ chiếu", level: "Bắt buộc", note: "Hộ chiếu còn hạn và thông tin rõ nét." },
      { name: "CCCD học sinh", level: "Bắt buộc", note: "Thông tin phải khớp hộ chiếu và hồ sơ học tập." },
      { name: "CCCD bố", level: "Bắt buộc", note: "Cần nếu bố là người bảo lãnh hoặc chứng minh quan hệ." },
      { name: "CCCD mẹ", level: "Bắt buộc", note: "Cần nếu mẹ là người bảo lãnh hoặc chứng minh quan hệ." }
    ]
  },
  {
    group: "Hồ sơ bổ sung",
    items: [
      { name: "Giải trình địa chỉ", level: "Tùy trường hợp", note: "Dùng khi địa chỉ trên các giấy tờ chưa thống nhất." },
      { name: "Bảo hiểm nhân thọ", level: "Nên có", note: "Có thể bổ sung như một bằng chứng tài sản nếu phù hợp." },
      { name: "Giấy tờ nghề nghiệp đặc thù của gia đình", level: "Tùy trường hợp", note: "Ví dụ giấy tờ tàu cá, nông nghiệp, kinh doanh, cho thuê tài sản." },
      { name: "Hồ sơ gốc mang theo khi nộp/đối chiếu", level: "Bắt buộc", note: "Bằng gốc, học bạ gốc, bảng điểm gốc, giấy xác nhận sinh viên gốc." }
    ]
  }
];

function renderD26Checklist() {
  const total = D26_SAMPLE_CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);
  return `
    <section class="d26-checklist">
      <div class="checklist-head">
        <div>
          <p class="advisor-kicker">Bộ hồ sơ mẫu sạch</p>
          <h2>Checklist hồ sơ Visa D2-6</h2>
          <p>Tổng hợp các giấy tờ cần chuẩn bị khi làm hồ sơ D2-6, chia theo từng nhóm để dễ kiểm tra và theo dõi tiến độ.</p>
        </div>
        <span>${total} đầu mục</span>
      </div>
      <div class="checklist-groups">
        ${D26_SAMPLE_CHECKLIST.map((group, groupIndex) => `
          <article class="checklist-group">
            <h3>${escapeHtml(group.group)}</h3>
            <div class="checklist-items">
              ${group.items.map((item, itemIndex) => {
                const id = `d26-check-${groupIndex}-${itemIndex}`;
                return `
                  <label class="checklist-item" for="${id}">
                    <input id="${id}" type="checkbox" data-check-id="${id}">
                    <span class="checklist-main">
                      <strong>${escapeHtml(item.name)}</strong>
                      <small>${escapeHtml(item.note)}</small>
                    </span>
                    <span class="checklist-level checklist-level-${getChecklistLevelClass(item.level)}">${escapeHtml(item.level)}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <div class="checklist-warning">
        Không dùng checklist này thay thế việc kiểm tra yêu cầu mới nhất từ trường, ĐSQ/LSQ và từng hồ sơ cụ thể.
      </div>
    </section>
  `;
}

function getChecklistLevelClass(level) {
  if (level === "Bắt buộc") return "required";
  if (level === "Nên có") return "recommended";
  return "conditional";
}

function bindD26Checklist(container) {
  const storageKey = "d26ChecklistState";
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (e) {
    state = {};
  }

  container.querySelectorAll("[data-check-id]").forEach(input => {
    input.checked = Boolean(state[input.dataset.checkId]);
    input.addEventListener("change", () => {
      state[input.dataset.checkId] = input.checked;
      localStorage.setItem(storageKey, JSON.stringify(state));
    });
  });
}

function getDataHealthReport() {
  const required = [
    ["Hệ học", s => s.system],
    ["Khu vực", s => s.location],
    ["Điều kiện", s => s.conditions?.length],
    ["Chuyên ngành", s => s.majors?.length],
    ["Học phí", s => s.tuition],
    ["Ký túc xá", s => s.ktx],
    ["Catalog", s => s.links?.catalog || s.images?.catalog],
    ["Video", s => s.video?.url || s.video?.youtubeId]
  ];

  return getSchools().map(school => {
    const missing = required.filter(([, hasValue]) => !hasValue(school)).map(([label]) => label);
    return { school, missing };
  });
}

function renderDataHealthReport() {
  const rows = getDataHealthReport();
  const complete = rows.filter(row => row.missing.length === 0).length;
  return `
    <section class="data-health">
      <div class="docs-section-head">
        <div>
          <p class="advisor-kicker">Kiểm tra thông tin</p>
          <h2>Tình trạng thông tin trường</h2>
        </div>
        <span>${complete}/${rows.length} trường đủ mục chính</span>
      </div>
      <div class="data-health-grid">
        ${rows.map(({ school, missing }) => `
          <div class="data-health-row ${missing.length ? "" : "is-complete"}">
            <strong>${escapeHtml(school.name)}</strong>
            <span>${missing.length ? `Cần bổ sung: ${escapeHtml(missing.join(", "))}` : "Đã đủ các mục chính"}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGeneralDocs(sheet) {
  let html = `
    <section class="docs-panel">
      <div class="docs-section-head">
        <div>
          <p class="advisor-kicker">Tài liệu tham khảo</p>
          <h2>Tài liệu chung</h2>
        </div>
        <div class="docs-actions">
          <a href="${sheet}" target="_blank" rel="noopener">Mở bảng tổng hợp</a>
          <a href="#" class="ebook-tab-link" data-school="ebook">Cẩm nang D2-6</a>
        </div>
      </div>
  `;

  if (EXTRA_SHEETS?.danhSach?.rows?.length) {
    html += `<details class="docs-detail">
      <summary>Danh sách trường tổng hợp</summary>
      <div class="table-scroll"><table class="summary-table">
        <tr><th>Trường</th><th>Hệ</th><th>Chỉ tiêu</th><th>MOU</th><th>Catalog</th></tr>
        ${EXTRA_SHEETS.danhSach.rows.map(r => `<tr>
          <td>${escapeHtml(r.name)} ${r.nameKr ? `<span class="korean">${escapeHtml(r.nameKr)}</span>` : ""}</td>
          <td>${escapeHtml(r.system || "")}</td>
          <td>${r.quota || ""}</td>
          <td>${escapeHtml(r.mou || "")}</td>
          <td>${r.catalog ? `<a href="${r.catalog}" target="_blank" rel="noopener">Mở</a>` : ""}</td>
        </tr>`).join("")}
      </table></div>
    </details>`;
  }

  if (EXTRA_SHEETS?.visaChecklist?.items?.length) {
    html += `<details class="docs-detail">
      <summary>Checklist từ bảng tổng hợp</summary>
      <div class="table-scroll"><table class="summary-table">
        ${EXTRA_SHEETS.visaChecklist.items.map(it => `<tr>
          <td>${escapeHtml(it.stt || "")}</td>
          <td>${escapeHtml(it.noidung || "")}${it.luuy ? `<br><em>${escapeHtml(it.luuy)}</em>` : ""}
          ${it.link ? `<br><a href="${it.link}" target="_blank" rel="noopener">${escapeHtml(it.linkText || "Mở tài liệu")}</a>` : it.linkText ? `<br>${escapeHtml(it.linkText)}` : ""}
          </td></tr>`).join("")}
      </table></div>
    </details>`;
  }

  html += `</section>`;
  return html;
}

function renderExtra() {
  const sheet = "https://docs.google.com/spreadsheets/d/1H5tFffhJeLETHrNeRLV2l_gpg-KDQITD/edit?usp=sharing&ouid=112929137164133989656&rtpof=true&sd=true";
  return `
    <section class="docs-view">
      ${renderD26Checklist()}
      ${renderGeneralDocs(sheet)}
      ${renderDataHealthReport()}
    </section>
  `;
}

function showSchool(viewId) {
  const content = document.getElementById("school-content");
  const schools = document.getElementById("schools-content");
  const compare = document.getElementById("compare-content");
  const extra = document.getElementById("extra-content");
  const map = document.getElementById("map-content");
  const ebook = document.getElementById("ebook-content");
  const advisor = document.getElementById("advisor-content");

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-school="${viewId}"]`)?.classList.add("active");
  if (getSchoolById(viewId)) document.querySelector(`[data-school="schools"]`)?.classList.add("active");
  updateUrlForView(viewId);
  updatePageMeta(viewId, getSchoolById(viewId));

  const hideAll = () => {
    [content, schools, compare, extra, map, ebook, advisor].forEach(el => el?.classList.add("hidden"));
  };

  if (viewId === "advisor") {
    hideAll();
    advisor.classList.remove("hidden");
    if (typeof renderAdvisorApp === "function") renderAdvisorApp(advisor);
    else advisor.innerHTML = `<p class="empty">Chưa tải được công cụ tư vấn.</p>`;
    return;
  }

  if (viewId === "schools") {
    hideAll();
    schools.classList.remove("hidden");
    schools.innerHTML = renderSchoolsDirectory();
    bindSchoolsDirectory(schools);
    return;
  }

  if (viewId === "compare") {
    hideAll();
    compare.classList.remove("hidden");
    compare.innerHTML = renderCompare();
    bindCompare(compare);
    return;
  }

  if (viewId === "map") {
    hideAll();
    map.classList.remove("hidden");
    return;
  }

  if (viewId === "extra") {
    hideAll();
    extra.classList.remove("hidden");
    extra.innerHTML = renderExtra();
    bindD26Checklist(extra);
    extra.querySelector(".ebook-tab-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      showSchool("ebook");
    });
    return;
  }

  if (viewId === "ebook") {
    hideAll();
    ebook.classList.remove("hidden");
    bindGuide(ebook);
    return;
  }

  hideAll();
  content.classList.remove("hidden");
  content.innerHTML = renderSchool(viewId) || `<p class="empty">Chưa có dữ liệu.</p>`;
  bindSchoolDetail(content, viewId);
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => showSchool(btn.dataset.school));
});

document.querySelectorAll(".topbar-action").forEach(btn => {
  btn.addEventListener("click", () => showSchool(btn.dataset.school));
});

function init() {
  const content = document.getElementById("advisor-content");
  if (typeof SCHOOLS_DATA === "undefined") {
    content.innerHTML = `<p class="empty" style="padding:2rem;color:#dc2626;">
      Chưa tải được thông tin trường. Vui lòng thử lại sau.
    </p>`;
    return;
  }

  if (typeof SEMESTER_INFO !== "undefined") {
    const ky = SEMESTER_INFO.ky || "3";
    const nam = SEMESTER_INFO.nam || "2027";
    document.title = `Thông tin trường Hàn - Kỳ tháng ${ky}/${nam}`;
    const ogTitle = document.getElementById("og-title");
    const ogDesc = document.getElementById("og-desc");
    if (ogTitle) ogTitle.content = `Thông tin trường Hàn - Kỳ tháng ${ky}/${nam}`;
    if (ogDesc) ogDesc.content = `Kỳ tuyển sinh tháng ${ky}/${nam} - Thông tin trường Hàn`;
    const sub = document.querySelector(".subtitle");
    if (sub) sub.textContent = `Kỳ tuyển sinh tháng ${ky}/${nam}`;
  }

  const schoolCount = document.getElementById("topbar-school-count");
  if (schoolCount) schoolCount.textContent = String(getSchools().length);

  try {
    showSchool(getInitialView());
  } catch (e) {
    content.innerHTML = `<p class="empty" style="padding:2rem;color:#dc2626;">Lỗi: ${escapeHtml(String(e.message))}</p>`;
    console.error(e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
