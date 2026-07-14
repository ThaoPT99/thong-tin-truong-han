const PLACEHOLDER = "images/placeholder.svg";
// escapeHtml đã được định nghĩa global trong api-loader.js

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

function renderTuitionWithVND(val) {
  var html = renderValue(val);
  // A/B test: tuition-display — nếu variant B, thêm VND
  if (window.__AB && window.__AB['tuition-display'] === 'b') {
    var krwVal = extractKRWValue(val);
    if (krwVal) {
      var rate = typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 20;
      var vnd = krwVal * rate;
      html += '<br><span style="font-size:0.85rem;color:#0f766e;font-weight:700;">≈ ' + vnd.toLocaleString('vi-VN') + ' ₫</span>';
    }
  }
  return html;
}

function renderSimpleList(items) {
  if (!items || !items.length) return `<span class="muted-empty">Đang cập nhật</span>`;
  return `<ul class="detail-list">${items.map(item => `<li>${renderText(String(item))}</li>`).join("")}</ul>`;
}

function listToInline(items, limit = 3) {
  if (!items || !items.length) return "Đang cập nhật";
  return items.slice(0, limit).map(item => String(item).replace(/\s+/g, " ").trim()).join("; ");
}

// ─── Semester state ───
let currentSemesterId = null;

function getSemesterSchools() {
  const all = Object.values(SCHOOLS_DATA || {});
  if (!currentSemesterId) return all;
  const map = window.SEMESTER_SCHOOLS_MAP || {};
  // map keys là slug (đã convert từ UUID trong api-loader.js), SCHOOLS_DATA key cũng là slug
  return all.filter(function(s) {
    const sids = map[s.id] || [];
    return sids.indexOf(currentSemesterId) !== -1;
  });
}

function getSchools() {
  return getSemesterSchools();
}

function getSchoolById(schoolId) {
  return (SCHOOLS_DATA || {})[schoolId];
}

function getAdvisorRules(schoolId, school) {
  const profiles = window.ADVISOR_PROFILES || {};
  let rules = null;
  if (profiles[schoolId]) {
    rules = Object.assign({}, profiles[schoolId]);
  } else if (typeof buildFallbackAdvisorProfile === "function") {
    rules = buildFallbackAdvisorProfile(school) || {};
  } else {
    rules = {
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

  // If the canonical data contains an explicit region, prefer it.
  if (school && school.region) {
    rules.region = school.region;
  }
  return rules;
}

function getRegionLabel(region) {
  if (!region) return "Đang cập nhật";
  // Dùng global REGION_LABELS từ api-loader.js
  if (window.REGION_LABELS && window.REGION_LABELS[region]) {
    // Viết hoa chữ cái đầu cho hiển thị
    const label = window.REGION_LABELS[region];
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  // Fallback: humanize unknown region keys (e.g. "my-region" -> "My Region")
  try {
    return String(region).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  } catch (e) {
    return "Đang cập nhật";
  }
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
  try { localStorage.setItem("recentSchools", JSON.stringify(next)); } catch (e) {}
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
          <button type="button" class="copy-school-zalo" data-school-id="${escapeHtml(schoolId)}">📱 Copy Zalo</button>
          <button type="button" class="zalo-ai-btn" data-school-id="${escapeHtml(schoolId)}">🤖 Soạn Zalo AI</button>
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
          <div>${renderTuitionWithVND(s.tuition)}</div>
        </article>
        <article class="detail-card">
          <h3>Ký túc xá</h3>
          <div>${renderTuitionWithVND(s.ktx)}</div>
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

function renderSemesterSelector() {
  const list = window.SEMESTERS_LIST || [];
  if (list.length <= 1) return '';

  const activeId = currentSemesterId || window.ACTIVE_SEMESTER_ID;
  const options = list.map(function(s) {
    const selected = (s.id === activeId) ? ' selected' : '';
    return '<option value="' + s.id + '"' + selected + '>' + escapeHtml(s.title || 'Kỳ tháng ' + s.ky + '/' + s.nam) + '</option>';
  }).join('');

  return '<div class="semester-selector"><label>Kỳ tuyển sinh:</label><select id="semester-select" onchange="switchSemester(this.value)">' + options + '</select></div>';
}

window.switchSemester = function(semesterId) {
  currentSemesterId = semesterId;
  showSchool('schools');
};

function renderSchoolsDirectory() {
  const schools = getSemesterSchools();
  // Collect unique regions from canonical data or advisor fallback
  const regionSet = new Set();
  schools.forEach(s => {
    if (s && s.region) regionSet.add(s.region);
    else {
      const r = getAdvisorRules(s?.id, s)?.region;
      if (r) regionSet.add(r);
    }
  });
  const regions = Array.from(regionSet).filter(Boolean);
  const regionOptions = [`<option value="all">Tất cả khu vực</option>`, ...regions.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(getRegionLabel(r))}</option>`)].join("\n");

  // Collect unique systems
  const systemSet = new Set();
  schools.forEach(s => { if (s && s.system) systemSet.add(s.system); });
  const systems = Array.from(systemSet).filter(Boolean);
  const systemOptions = [`<option value="all">Tất cả hệ học</option>`, ...systems.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)].join("\n");

  // Skeleton cards (6 items)
  const skeletonCards = Array(6).fill('<div class="skeleton-card"></div>').join("");

  return `
    <section class="directory-view">
      ${renderSemesterSelector()}
      <div class="directory-head">
        <div>
          <p class="advisor-kicker">Danh sách trường</p>
          <h2>${schools.length} trường tuyển sinh</h2>
          <p>Chọn tên trường để xem thông tin chi tiết về điều kiện, học phí, hồ sơ, ký túc xá và tài liệu liên quan.</p>
        </div>
        <div class="directory-tools">
          <div style="position:relative;">
            <input id="school-search" type="search" placeholder="Tìm trường, khu vực, hệ học..." autocomplete="off" role="combobox" aria-expanded="false" aria-controls="search-suggestions">
            <div id="search-suggestions" class="search-suggestions" role="listbox" hidden></div>
            <div id="smart-chips" class="smart-chips"></div>
          </div>
          <select id="school-region-filter">` + regionOptions + `</select>
          <select id="school-system-filter">` + systemOptions + `</select>
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
      <div id="school-card-grid" class="school-name-grid skeleton-loading">
        ${schools.length > 0 ? schools.map(renderSchoolCard).join("") : skeletonCards}
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
    <button type="button" class="school-name-item" data-school-card data-region="${escapeHtml(rules.region)}" data-system="${escapeHtml(school.system || '')}" data-tags="${escapeHtml(tags)}" data-search="${escapeHtml(buildSchoolSearchText(school))}" data-open-school="${escapeHtml(school.id)}">
      ${escapeHtml(school.name)}
    </button>
  `;
}

function bindSchoolsDirectory(container) {
  const search = container.querySelector("#school-search");
  const region = container.querySelector("#school-region-filter");
  const systemFilter = container.querySelector("#school-system-filter");
  const suggestions = container.querySelector("#search-suggestions");
  const quickButtons = Array.from(container.querySelectorAll("[data-quick-filter]"));
  const cards = Array.from(container.querySelectorAll("[data-school-card]"));
  const count = container.querySelector("#school-result-count");
  const empty = container.querySelector("#school-empty-state");
  let quickFilter = "all";

// ─── Region normalization: map DB regions to filter values ───
  // Only normalizes when filter is 'near-seoul' (quick filter or smart search).
  // Dropdown selections like 'gyeonggi'/'incheon' do exact match.
  function normalizeRegionForFilter(cardRegion, filterRegion) {
    if (!cardRegion) return '';
    const r = String(cardRegion).toLowerCase().trim();
    // When filter is 'near-seoul', also match gyeonggi & incheon
    if (filterRegion === 'near-seoul') {
      if (r === 'gyeonggi' || r === 'incheon' || r === 'near-seoul') return 'near-seoul';
    }
    return r;
  }

  // ─── Smart Search: hiểu ý định từ khoá ───
  const INTENT_MAP = {
    region: [
      { patterns: [/seoul|서울/], value: 'seoul', label: 'Seoul' },
      { patterns: [/gần.*seoul|near.*seoul|경기/], value: 'near-seoul', label: 'Gần Seoul' },
      { patterns: [/busan|pusan|부산/], value: 'busan', label: 'Busan' },
      { patterns: [/daegu|대구/], value: 'daegu', label: 'Daegu' },
      { patterns: [/daejeon|대전/], value: 'daejeon', label: 'Daejeon' },
      { patterns: [/gwangju|광주/], value: 'gwangju', label: 'Gwangju' },
    ],
    tag: [
      { patterns: [/nữ|nữ sinh|nữsinh|female|여/], value: 'female', label: 'Chỉ nữ' },
      { patterns: [/chi phí thấp|rẻ|thấp|low.?cost|비용|저렴/], value: 'low-cost', label: 'Chi phí thấp' },
      { patterns: [/e7|việc làm|vieclam|job|취업/], value: 'e7', label: 'Dễ E7' },
    ]
  };

  const chipsContainer = container.querySelector('#smart-chips');
  let currentIntents = {};

  let aiSearchCache = {};
  let aiSearchInFlight = false;

  function parseSearchIntent(query) {
    const q = (query || '').toLowerCase().trim();
    const intents = { region: null, tags: [] };

    if (q.length < 2) return intents;

    // Bước 1: Regex-based parsing (nhanh)
    INTENT_MAP.region.forEach(function(rule) {
      rule.patterns.forEach(function(p) {
        if (p.test(q)) intents.region = rule.value;
      });
    });

    INTENT_MAP.tag.forEach(function(rule) {
      rule.patterns.forEach(function(p) {
        if (p.test(q)) {
          if (intents.tags.indexOf(rule.value) === -1) intents.tags.push(rule.value);
        }
      });
    });

    // Bước 2: Nếu regex không parse được region, thử gọi AI fallback
    if (!intents.region && intents.tags.length === 0 && q.length >= 4) {
      // Sử dụng cache để tránh gọi API liên tục
      if (aiSearchCache[q]) {
        const cached = aiSearchCache[q];
        intents.region = cached.region;
        intents.tags = cached.tags;
      } else if (!aiSearchInFlight) {
        aiSearchInFlight = true;
        fetch('/api/deepseek?action=search-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.success && (data.region || data.tags.length > 0)) {
            aiSearchCache[q] = { region: data.region, tags: data.tags };
            // Re-apply filters if this was a meaningful parse
            if (data.region || data.tags.length > 0) {
              applyFilters();
            }
          }
          aiSearchInFlight = false;
        })
        .catch(function() {
          aiSearchInFlight = false;
        });
      }
    }

    return intents;
  }

  function updateSmartFilterChips(intents) {
    if (!chipsContainer) return;
    const chips = [];
    if (intents.region) {
      let label = 'Seoul';
      INTENT_MAP.region.some(function(r) { if (r.value === intents.region) { label = r.label; return true; } });
      chips.push('<span class="smart-chip smart-chip-region"><span class="smart-chip-label">KV </span>' + escapeHtml(label) + '</span>');
    }
    intents.tags.forEach(function(t) {
      let label = t;
      INTENT_MAP.tag.some(function(r) { if (r.value === t) { label = r.label; return true; } });
      chips.push('<span class="smart-chip smart-chip-tag"><span class="smart-chip-label">⚡ </span>' + escapeHtml(label) + '</span>');
    });
    chipsContainer.innerHTML = chips.join('');
  }

  const applyFilters = () => {
    const q = (search.value || "").trim().toLowerCase();
    const intents = parseSearchIntent(q);
    currentIntents = intents;
    updateSmartFilterChips(intents);

    const selectedRegion = region.value;
    const selectedSystem = systemFilter ? systemFilter.value : "all";

    // Quick filter values that are regions (not tags)
    const regionQuickFilters = ['seoul', 'near-seoul', 'busan', 'daegu', 'daejeon', 'gwangju'];
    
    // Effective region: intent > quick filter (if region) > dropdown
    let effectiveRegion = intents.region;
    if (!effectiveRegion && quickFilter !== 'all' && regionQuickFilters.indexOf(quickFilter) !== -1) {
      effectiveRegion = quickFilter;
    }
    if (!effectiveRegion) effectiveRegion = selectedRegion;

    // Effective tags: intent tags + quick filter (if tag)
    const effectiveTagList = (intents.tags || []).slice();
    if (quickFilter !== 'all' && regionQuickFilters.indexOf(quickFilter) === -1) {
      if (effectiveTagList.indexOf(quickFilter) === -1) {
        effectiveTagList.push(quickFilter);
      }
    }

    let visible = 0;
    cards.forEach(card => {
      // Text search: split query into words, match all (looser than exact substring)
      let matchSearch = true;
      if (q) {
        const words = q.split(/\s+/).filter(Boolean);
        // Remove words that were already used as intents
        const intentWords = [];
        if (intents.region) intentWords.push(intents.region);
        const searchWords = words.filter(function(w) { return intentWords.indexOf(w) === -1; });
        matchSearch = searchWords.length === 0 || searchWords.every(function(w) { return card.dataset.search.indexOf(w) !== -1; });
      }

      const matchRegion = effectiveRegion === "all" || normalizeRegionForFilter(card.dataset.region, effectiveRegion) === effectiveRegion;
      const matchSystem = selectedSystem === "all" || (card.dataset.system || "").includes(selectedSystem);
      const matchTags = effectiveTagList.length === 0 || effectiveTagList.some(function(t) { return (card.dataset.tags || "").split(" ").indexOf(t) !== -1; });

      const isVisible = matchSearch && matchRegion && matchSystem && matchTags;
      card.classList.toggle("hidden", !isVisible);
      if (isVisible) visible += 1;
    });
    if (count) count.textContent = String(visible);
    empty?.classList.toggle("hidden", visible !== 0);

    // Track search queries (chỉ track khi query thay đổi và có nội dung)
    if (q && q !== lastTrackedQuery) {
      lastTrackedQuery = q;
      lastTrackedResultCount = visible;
      if (typeof window.trackAnalytics === 'function') {
        window.trackAnalytics('search', {
          query: q,
          resultCount: visible,
          hasResults: visible > 0,
          filtersUsed: { region: effectiveRegion, tags: effectiveTagList },
          searchType: q.length > 0 ? 'text' : 'filter',
        });
      }
    }
  };


  // Guard null suggestions (search autocomplete)
  const safeSuggestions = suggestions;

  // Search autocomplete
  let autocompleteTimer = null;
  search.addEventListener("input", () => {
    applyFilters();
    if (!safeSuggestions) return;
    clearTimeout(autocompleteTimer);
    autocompleteTimer = setTimeout(() => {
      const q = (search.value || "").trim().toLowerCase();
      if (q.length < 1) {
        safeSuggestions.hidden = true;
        search.setAttribute("aria-expanded", "false");
        return;
      }
      // Find matching schools
      const matches = cards.filter(card => card.dataset.search.includes(q)).slice(0, 8);
      if (matches.length === 0) {
        safeSuggestions.hidden = true;
        search.setAttribute("aria-expanded", "false");
        return;
      }
      safeSuggestions.innerHTML = matches.map(card => {
        const name = card.textContent.trim();
        const id = card.dataset.openSchool;
        return `<button type="button" class="suggestion-item" role="option" data-open-school="${escapeHtml(id)}">
          <span class="suggestion-name">${escapeHtml(name)}</span>
        </button>`;
      }).join("");
      safeSuggestions.hidden = false;
      search.setAttribute("aria-expanded", "true");
      // Bind mousedown on suggestions (fires before blur, avoids race condition)
      safeSuggestions.querySelectorAll(".suggestion-item").forEach(btn => {
        btn.addEventListener("mousedown", (e) => {
          e.preventDefault();
          safeSuggestions.hidden = true;
          search.setAttribute("aria-expanded", "false");
          const schoolId = btn.dataset.openSchool;
          if (window && typeof window.showSchool === "function") {
            window.showSchool(schoolId);
          }
        });
      });
    }, 200);
  });

  // Close suggestions on blur
  search.addEventListener("blur", () => {
    if (!safeSuggestions) return;
    setTimeout(() => {
      safeSuggestions.hidden = true;
      search.setAttribute("aria-expanded", "false");
    }, 200);
  });

  // Close suggestions on Escape
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (safeSuggestions) {
        safeSuggestions.hidden = true;
        search.setAttribute("aria-expanded", "false");
      }
      search.blur();
    }
  });

  region.addEventListener("change", applyFilters);
  if (systemFilter) systemFilter.addEventListener("change", applyFilters);
  quickButtons.forEach(button => {
    button.addEventListener("click", () => {
      quickFilter = button.dataset.quickFilter;
      quickButtons.forEach(btn => btn.classList.toggle("active", btn === button));
      // Sync region dropdown when region quick filter is clicked
      const regionQuickFilters = ['seoul', 'near-seoul', 'busan', 'daegu', 'daejeon', 'gwangju'];
      if (regionQuickFilters.indexOf(quickFilter) !== -1) {
        region.value = quickFilter;
      } else if (quickFilter === 'all') {
        region.value = 'all';
      }
      applyFilters();
    });
  });
  container.querySelectorAll("[data-open-school]").forEach(button => {
    button.addEventListener("click", () => {
      suggestions.hidden = true;
      if (window && typeof window.showSchool === "function") return window.showSchool(button.dataset.openSchool);
      return showSchool(button.dataset.openSchool);
    });
  });

  // Swap skeleton with real cards when data is ready
  if (container.querySelector(".skeleton-loading")) {
    document.addEventListener("app-data-ready", () => {
      const grid = container.querySelector("#school-card-grid");
      if (grid && grid.classList.contains("skeleton-loading")) {
        const schools = getSemesterSchools();
        grid.classList.remove("skeleton-loading");
        grid.innerHTML = schools.map(renderSchoolCard).join("");
        // Re-bind click events for new cards
        grid.querySelectorAll("[data-open-school]").forEach(button => {
          button.addEventListener("click", () => {
            suggestions.hidden = true;
            if (window && typeof window.showSchool === "function") return window.showSchool(button.dataset.openSchool);
            return showSchool(button.dataset.openSchool);
          });
        });
      }
    }, { once: true });
  }
}

function renderCompare() {
  const schools = getSchools();
  const options = schools.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`).join("");
  // Parse URL for pre-selected schools
  const urlParams = new URLSearchParams(window.location.search);
  const compareParam = urlParams.get("compare");
  let preselected = [];
  if (compareParam) {
    preselected = compareParam.split(",").map(s => decodeURIComponent(s.trim())).filter(Boolean);
  }
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
        <select class="compare-select" data-index="0">${options}</select>
        <select class="compare-select" data-index="1">${options}</select>
        <select class="compare-select" data-index="2">${options}</select>
      </div>
      <div class="compare-actions">
        <button type="button" class="btn btn-primary" id="compare-copy-link">🔗 Copy link so sánh</button>
        <button type="button" class="btn btn-outline" id="compare-export">📄 Xuất PDF</button>
      </div>
      <div id="compare-result"></div>
    </section>
  `;
}

function bindCompare(container) {
  const selects = Array.from(container.querySelectorAll(".compare-select"));
  const urlParams = new URLSearchParams(window.location.search);
  const compareParam = urlParams.get("compare");
  const defaults = getSchools().slice(0, 3).map(s => s.id);
  
  if (compareParam) {
    const preselected = compareParam.split(",").map(s => decodeURIComponent(s.trim())).filter(Boolean);
    preselected.forEach((slug, index) => {
      const school = getSchools().find(s => s.slug === slug);
      if (school) defaults[index] = school.id;
    });
  }
  
  selects.forEach((select, index) => {
    if (defaults[index]) select.value = defaults[index];
    select.addEventListener("change", () => {
      renderCompareResult(container);
      updateCompareUrl(container);
      // Track compare view
      if (typeof window.trackAnalytics === 'function') {
        const selectedIds = selects.map(s => s.value).filter(v => v);
        window.trackAnalytics('event', { eventType: 'compare_view', eventData: { schoolCount: selectedIds.length, schoolIds: selectedIds } });
      }
    });
  });
  
  // Copy link button
  const copyBtn = container.querySelector("#compare-copy-link");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyCompareLink(container);
      if (typeof window.trackAnalytics === 'function') {
        window.trackAnalytics('event', { eventType: 'compare_copy_link' });
      }
    });
  }
  
  // Export button
  const exportBtn = container.querySelector("#compare-export");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportComparePDF(container);
      if (typeof window.trackAnalytics === 'function') {
        window.trackAnalytics('event', { eventType: 'compare_export_pdf' });
      }
    });
  }
  
  renderCompareResult(container);
}

function updateCompareUrl(container) {
  const selects = Array.from(container.querySelectorAll(".compare-select"));
  const slugs = selects.map(s => {
    const school = getSchoolById(s.value);
    return school ? school.slug : "";
  }).filter(Boolean);
  
  const url = new URL(window.location.href);
  if (slugs.length > 0) {
    url.searchParams.set("compare", slugs.join(","));
  } else {
    url.searchParams.delete("compare");
  }
  window.history.replaceState({}, "", url);
}

function copyCompareLink(container) {
  const slugs = Array.from(container.querySelectorAll(".compare-select"))
    .map(s => {
      const school = getSchoolById(s.value);
      return school ? school.slug : "";
    })
    .filter(Boolean);
  
  if (slugs.length === 0) {
    toast("Chưa chọn trường để so sánh");
    return;
  }
  
  const url = `${location.origin}${location.pathname}?compare=${slugs.join(",")}`;
  navigator.clipboard.writeText(url).then(() => {
    toast("Đã copy link so sánh!");
  });
}

function exportComparePDF(container) {
  const resultEl = container.querySelector("#compare-result");
  if (!resultEl) return;
  
  const printWindow = window.open("", "_blank");
  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>So sánh trường - ${document.title}</title>
      <link rel="stylesheet" href="${location.origin}/styles.css">
      <style>
        body { padding: 2rem; font-family: 'Be Vietnam Pro', sans-serif; }
        .compare-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
        .compare-table th, .compare-table td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
        .compare-table th { background: #1e3a5f; color: white; }
        .winner { background: #fef3c7 !important; font-weight: 600; }
        .better { background: #d1fae5; }
        .worse { background: #fee2e2; }
        .compare-radar-wrap { page-break-inside: avoid; }
        @media print {
          .compare-actions { display: none; }
          @page { margin: 1.5cm; size: A4; }
        }
      </style>
    </head>
    <body>
      <h1>So sánh trường Hàn Quốc</h1>
      <p>Ngày xuất: ${new Date().toLocaleString("vi-VN")}</p>
      ${resultEl.innerHTML}
    </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
}

function getSchoolZaloText(school) {
  const rules = getAdvisorRules(school.id, school);
  const regionName = rules && rules.region ? (window.REGION_LABELS && window.REGION_LABELS[rules.region] ? window.REGION_LABELS[rules.region].charAt(0).toUpperCase() + window.REGION_LABELS[rules.region].slice(1) : rules.region) : '';
  const line = String.prototype.padEnd ? ''.padEnd(30, '\u2500') : '──────────────────────────────';
  return [
    '📋 TU VAN DU HOC HAN QUOC',
    line,
    '• Truong: ' + (school.name || '') + (school.nameKr ? ' (' + school.nameKr + ')' : ''),
    school.nameEn ? '• Ten tieng Anh: ' + school.nameEn : '',
    school.system ? '• He dao tao: ' + school.system : '',
    regionName ? '• Khu vuc: ' + regionName : '',
    school.tuition ? '• Hoc phi: ' + String(school.tuition).replace(/\n+/g, ' ').substring(0, 200) : '',
    school.ktx ? '• Ky tuc xa: ' + String(school.ktx).replace(/\n+/g, ' ').substring(0, 200) : '',
    '',
    '📞 Can tu van? LH Zalo',
    '🌐 ' + location.origin + location.pathname + '?school=' + encodeURIComponent(school.id)
  ].filter(Boolean).join("\n");
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
      if (typeof window.trackAnalytics === 'function') window.trackAnalytics('event', { eventType: 'copy_info', schoolSlug: schoolId, schoolName: school?.name });
    } catch (e) {
      showCopyToast(container, "Trình duyệt chưa cho phép copy tự động");
    }
  });
  container.querySelector(".copy-school-zalo")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getSchoolZaloText(school));
      showCopyToast(container, "Đã copy nội dung tư vấn Zalo");
      if (typeof window.trackAnalytics === 'function') window.trackAnalytics('event', { eventType: 'copy_zalo', schoolSlug: schoolId, schoolName: school?.name });
    } catch (e) {
      showCopyToast(container, "Trình duyệt chưa cho phép copy tự động");
    }
  });

  // ─── Soạn Zalo AI ───
  const zaloAiBtn = container.querySelector(".zalo-ai-btn");
  if (zaloAiBtn) {
    zaloAiBtn.addEventListener("click", async function() {
      this.disabled = true;
      this.textContent = '⏳ Đang soạn...';
      try {
        const res = await fetch('/api/deepseek?action=generate-zalo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: school.slug || school.id }),
        });
        const data = await res.json();
        if (data.success && data.zaloText) {
          await navigator.clipboard.writeText(data.zaloText);
          showCopyToast(container, '✅ Đã copy nội dung AI vào clipboard!');
        } else {
          // Fallback: dùng text cũ
          await navigator.clipboard.writeText(getSchoolZaloText(school));
          showCopyToast(container, '⚠️ AI không phản hồi, đã copy text mặc định');
        }
      } catch (err) {
        // Fallback
        try {
          await navigator.clipboard.writeText(getSchoolZaloText(school));
          showCopyToast(container, '⚠️ Lỗi kết nối AI, đã copy text mặc định');
        } catch (e) {
          showCopyToast(container, '❌ Lỗi: ' + e.message);
        }
      } finally {
        this.disabled = false;
        this.textContent = '🤖 Soạn Zalo AI';
      }
    });
  }
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
  if (["advisor", "compare", "map", "extra", "ebook", "schools", "cost", "application"].includes(view)) return view;
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

  // Parse values for comparison
  const parsed = schools.map(s => {
    const rules = getAdvisorRules(s.id, s);
    const tuition = extractKRWValue(s.tuition);
    const ktx = extractKRWValue(s.ktx);
    return {
      school: s,
      rules: rules,
      tuition: tuition,
      ktx: ktx,
      costLevel: rules.costLevel || 3,
      visaChance: rules.visaChance || 3,
      jobOpportunity: rules.jobOpportunity || 3,
      e7Opportunity: rules.e7Opportunity || 3,
      studyLoad: rules.studyLoad || 3,
      interviewDifficulty: rules.interviewDifficulty || 2
    };
  });

  // Find winners for numeric criteria (lower is better for cost/tuition/ktx/studyLoad/interviewDifficulty; higher is better for visa/job/e7)
  const criteria = {
    tuition: { lowerBetter: true, values: parsed.map(p => p.tuition).filter(v => v !== null) },
    ktx: { lowerBetter: true, values: parsed.map(p => p.ktx).filter(v => v !== null) },
    costLevel: { lowerBetter: true, values: parsed.map(p => p.costLevel) },
    visaChance: { lowerBetter: false, values: parsed.map(p => p.visaChance) },
    jobOpportunity: { lowerBetter: false, values: parsed.map(p => p.jobOpportunity) },
    e7Opportunity: { lowerBetter: false, values: parsed.map(p => p.e7Opportunity) },
    studyLoad: { lowerBetter: true, values: parsed.map(p => p.studyLoad) },
    interviewDifficulty: { lowerBetter: true, values: parsed.map(p => p.interviewDifficulty) }
  };

  const winners = {};
  Object.keys(criteria).forEach(key => {
    const { lowerBetter, values } = criteria[key];
    if (values.length === 0) return;
    const target = lowerBetter ? Math.min(...values) : Math.max(...values);
    parsed.forEach(p => {
      const val = p[key];
      if (val !== null && val === target) {
        if (!winners[p.school.id]) winners[p.school.id] = [];
        winners[p.school.id].push(key);
      }
    });
  });

  target.innerHTML = `
    ${schools.length > 0 ? `
    <div class="compare-radar-wrap">
      <div class="compare-radar-head">
        <p class="advisor-kicker">Biểu đồ so sánh</p>
        <h3>5 chỉ số đánh giá trường</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.15rem;">Chi phí thấp, dễ đỗ visa, cơ hội việc làm, chuyển đổi E7 và khối lượng học</p>
      </div>
      <div class="compare-radar-canvas-wrap">
        <canvas id="compare-radar-canvas"></canvas>
      </div>
    </div>
    ` : ''}
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            ${schools.map(s => `<th>${escapeHtml(s.name)} ${winners[s.id] ? `<span class="winner-badge" title="Thắng ${winners[s.id].join(', ')}">🏆</span>` : ''}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${renderCompareRow("Hệ học", schools, s => renderValue(s.system))}
          ${renderCompareRow("Khu vực", schools, s => escapeHtml(getRegionLabel(getAdvisorRules(s.id, s).region)))}
          ${renderCompareRowWithDiff("Học phí", schools, s => renderValue(s.tuition), "tuition", true)}
          ${renderCompareRowWithDiff("KTX", schools, s => renderValue(s.ktx), "ktx", true)}
          ${renderCompareRow("Ưu điểm chính", schools, s => renderText(listToInline(s.advantages, 3)))}
          ${renderCompareRow("Rủi ro cần lưu ý", schools, s => renderText(getCompareRisk(s)))}
        </tbody>
      </table>
    </div>
  `;

  // Render radar chart
  if (schools.length > 0) {
    const canvas = target.querySelector("#compare-radar-canvas");
    if (canvas) {
      requestAnimationFrame(function() { renderRadarChart(canvas, schools); });
    }
  }
}

function renderCompareRowWithDiff(label, schools, getValue, criterionKey, lowerBetter) {
  // Find best value for this criterion
  const values = schools.map(s => getValue(s));
  const numericValues = values.map(v => {
    const num = parseFloat(v.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num;
  }).filter(v => v !== null);
  
  let bestVal = null;
  if (numericValues.length > 0) {
    bestVal = lowerBetter ? Math.min(...numericValues) : Math.max(...numericValues);
  }

  return `<tr><td>${label}</td>${schools.map((s, i) => {
    const val = getValue(s);
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    let cls = "";
    if (num !== null && bestVal !== null && num === bestVal) {
      cls = lowerBetter ? " better" : " better";
    } else if (num !== null && bestVal !== null) {
      cls = lowerBetter ? " worse" : " worse";
    }
    return `<td class="${cls}">${val || "Đang cập nhật"}</td>`;
  }).join("")}</tr>`;
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

// ─── Cost Calculator ───
const DEFAULT_EXCHANGE_RATE = 20; // 1 KRW = 20 VND
const MONTHLY_LIVING_COST = 1000000; // 1,000,000 KRW
const VISA_FEE = 5000000; // 5,000,000 KRW (ước lượng)
const FLIGHT_TICKET = 1000000; // 1,000,000 KRW 
const INSURANCE_COST = 500000; // 500,000 KRW/năm

function flattenRichText(val) {
  // Handle rich text segments array from Excel: [{t: "6,000,000", c: "#FF0000"}, {t: " KRW", c: null}]
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.map(function(s) { return s.t || ''; }).join('');
  return String(val);
}

function extractKRWValue(text) {
  const str = flattenRichText(text);
  if (!str) return null;
  // Normalize: replace dots (Vietnamese format) with nothing, keep commas as thousand separators
  const normal = str.replace(/\./g, '');
  // Pattern 1: number with KRW/원/won suffix
  const m = normal.match(/([\d,]+)\s*(?:KRW|원|won)/i);
  if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  // Pattern 2: any large number (likely KRW)
  const big = normal.match(/(\d{4,})/);
  if (big) return parseInt(big[1].replace(/,/g, ''), 10);
  return null;
}

const extractTuitionValue = extractKRWValue;
const extractKtxValue = extractKRWValue;

function formatKRW(amount) {
  if (!amount || isNaN(amount)) return '—';
  return amount.toLocaleString('ko-KR') + ' KRW';
}

function formatVND(amount) {
  if (!amount || isNaN(amount)) return '—';
  return amount.toLocaleString('vi-VN') + ' ₫';
}

function renderCostCalculator() {
  const schools = getSchools();
  const options = schools.map(function(s) {
    return '<option value="' + escapeHtml(s.id) + '">' + escapeHtml(s.name) + '</option>';
  }).join('');
  return `
    <section class="cost-calc">
      <div class="cost-calc-head">
        <div>
          <p class="advisor-kicker">Dự toán chi phí</p>
          <h2>Máy tính chi phí du học 1 năm</h2>
          <p>Chọn trường và điều chỉnh các khoản phí để ước tính tổng chi phí học tập tại Hàn Quốc.</p>
        </div>
      </div>
      <div class="cost-calc-body">
        <div class="cost-calc-form">
          <h3>📋 Thông tin đầu vào</h3>
          <div class="cost-calc-field">
            <label for="cost-school">Trường</label>
            <select id="cost-school">${options}</select>
          </div>
          <div class="cost-calc-field">
            <label for="cost-tuition">Học phí <span class="auto-filled">(tự động từ dữ liệu trường)</span></label>
            <input id="cost-tuition" type="text" inputmode="numeric" placeholder="KRW">
          </div>
          <div class="cost-calc-field">
            <label for="cost-ktx">Ký túc xá <span class="auto-filled">(tự động từ dữ liệu trường)</span></label>
            <input id="cost-ktx" type="text" inputmode="numeric" placeholder="KRW">
          </div>
          <div class="cost-calc-field">
            <label for="cost-insurance">Bảo hiểm (1 năm)</label>
            <input id="cost-insurance" type="text" inputmode="numeric" value="${INSURANCE_COST.toLocaleString('ko-KR')}" placeholder="KRW">
          </div>
          <div class="cost-calc-field">
            <label for="cost-living">Sinh hoạt phí hàng tháng</label>
            <input id="cost-living" type="text" inputmode="numeric" value="${MONTHLY_LIVING_COST.toLocaleString('ko-KR')}" placeholder="KRW/tháng">
          </div>
          <div class="cost-calc-field">
            <label for="cost-months">Số tháng học</label>
            <input id="cost-months" type="number" value="12" min="6" max="24" step="1">
          </div>
          <div class="cost-calc-field">
            <label for="cost-visa-fee">Phí visa + thủ tục</label>
            <input id="cost-visa-fee" type="text" inputmode="numeric" value="${VISA_FEE.toLocaleString('ko-KR')}" placeholder="KRW">
          </div>
          <div class="cost-calc-field">
            <label for="cost-flight">Vé máy bay</label>
            <input id="cost-flight" type="text" inputmode="numeric" value="${FLIGHT_TICKET.toLocaleString('ko-KR')}" placeholder="KRW">
          </div>
          <div class="cost-calc-field">
            <label for="cost-rate">Tỷ giá KRW → VND</label>
            <input id="cost-rate" type="number" value="${DEFAULT_EXCHANGE_RATE}" min="1" max="100" step="1">
          </div>
        </div>
        <div class="cost-calc-result">
          <h3>💰 Dự toán chi phí</h3>
          <table class="cost-table">
            <thead>
              <tr>
                <th>Khoản mục</th>
                <th>KRW</th>
                <th>VND</th>
              </tr>
            </thead>
            <tbody id="cost-result-body">
              <tr>
                <td>Học phí</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Ký túc xá</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Bảo hiểm</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Sinh hoạt phí</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Phí visa + thủ tục</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Vé máy bay</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr class="total">
                <td>Tổng cộng</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
          <div class="cost-note">
            ⚠️ Đây là ước tính tham khảo dựa trên dữ liệu trường và các khoản phí thông thường. 
            Chi phí thực tế có thể thay đổi theo từng trường, kỳ tuyển sinh và nhu cầu cá nhân.
          </div>
        </div>
      </div>
    </section>
  `;
}

function parseKRWInput(value) {
  if (!value) return 0;
  return parseInt(String(value).replace(/[,.]/g, ''), 10) || 0;
}

function updateCostResult(container) {
  const schoolSelect = container.querySelector('#cost-school');
  const schoolId = schoolSelect.value;
  const school = getSchoolById(schoolId);

  const getVal = function(id) { return parseKRWInput(container.querySelector(id).value); };

  const tuition = getVal('#cost-tuition');
  const ktx = getVal('#cost-ktx');
  const insurance = getVal('#cost-insurance');
  const livingMonthly = getVal('#cost-living');
  const months = parseInt(container.querySelector('#cost-months').value, 10) || 12;
  const visaFee = getVal('#cost-visa-fee');
  const flight = getVal('#cost-flight');
  const rate = parseFloat(container.querySelector('#cost-rate').value) || DEFAULT_EXCHANGE_RATE;

  const livingTotal = livingMonthly * months;

  const items = [
    { label: 'Học phí', krw: tuition },
    { label: 'Ký túc xá', krw: ktx },
    { label: 'Bảo hiểm', krw: insurance },
    { label: 'Sinh hoạt phí (' + months + ' tháng)', krw: livingTotal },
    { label: 'Phí visa + thủ tục', krw: visaFee },
    { label: 'Vé máy bay', krw: flight },
  ];

  const totalKRW = items.reduce(function(sum, item) { return sum + item.krw; }, 0);
  const totalVND = totalKRW * rate;

  const tbody = container.querySelector('#cost-result-body');
  if (!tbody) return;

  tbody.innerHTML = items.map(function(item) {
    const vnd = item.krw * rate;
    return '<tr><td>' + escapeHtml(item.label) + '</td><td>' + formatKRW(item.krw) + '</td><td>' + formatVND(vnd) + '</td></tr>';
  }).join('') +
  '<tr class="total"><td>Tổng cộng</td><td>' + formatKRW(totalKRW) + '</td><td>' + formatVND(totalVND) + '</td></tr>';
}

function fetchExchangeRate(callback) {
  // Fetch KRW→VND exchange rate from free API (no key required)
  const rateInput = document.getElementById('cost-rate');
  if (!rateInput) return;
  rateInput.disabled = true;
  rateInput.style.opacity = '0.6';
  fetch('https://open.er-api.com/v6/latest/KRW')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.rates && data.rates.VND) {
        const rate = Math.round(data.rates.VND);
        rateInput.value = rate;
        if (callback) callback();
      }
    })
    .catch(function() {
      // Silent fail - keep existing rate
    })
    .finally(function() {
      rateInput.disabled = false;
      rateInput.style.opacity = '1';
    });
}

function bindCostCalculator(container) {
  if (!container || container.dataset.costBound === 'true') return;
  container.dataset.costBound = 'true';

  const schoolSelect = container.querySelector('#cost-school');
  const tuitionInput = container.querySelector('#cost-tuition');
  const ktxInput = container.querySelector('#cost-ktx');

  function fillSchoolData() {
    const schoolId = schoolSelect.value;
    const school = getSchoolById(schoolId);
    if (!school) return;

    const tuitionVal = extractTuitionValue(school.tuition);
    const ktxVal = extractKtxValue(school.ktx);

    tuitionInput.value = tuitionVal ? tuitionVal.toLocaleString('ko-KR') : '';
    ktxInput.value = ktxVal ? ktxVal.toLocaleString('ko-KR') : '';

    updateCostResult(container);
  }

  fillSchoolData();
  schoolSelect.addEventListener('change', function() {
    fillSchoolData();
    if (typeof window.trackAnalytics === 'function') {
      const schoolId = schoolSelect.value;
      const school = getSchoolById(schoolId);
      window.trackAnalytics('event', { eventType: 'cost_calc', eventData: { schoolSlug: schoolId, schoolName: school?.name } });
    }
  });
  container.addEventListener('input', function() { updateCostResult(container); });

  // Fetch live exchange rate on load
  fetchExchangeRate(function() { updateCostResult(container); });
}

// ─── Radar Chart ───
const RADAR_LABELS = ['Chi phí', 'Visa', 'Việc làm', 'E7', 'Học lực'];
const RADAR_COLORS = ['#2563eb', '#0f766e', '#d97706'];

function getRadarMetrics(school) {
  const rules = getAdvisorRules(school.id, school);
  return {
    cost: 6 - (rules.costLevel || 3),   // invert: lower cost = better score
    visa: rules.visaChance || 3,
    job: rules.jobOpportunity || 3,
    e7: rules.e7Opportunity || 3,
    study: 6 - (rules.studyLoad || 3),  // invert: lower load = better score
  };
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function drawRadarGrid(ctx, cx, cy, maxR, angles, isDark) {
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const axisColor = isDark ? '#475569' : '#cbd5e1';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  for (let level = 1; level <= 5; level++) {
    const r = (level / 5) * maxR;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = level === 5 ? 1.5 : 0.5;
    ctx.stroke();
  }

  for (let i = 0; i < 5; i++) {
    const x = cx + maxR * Math.cos(angles[i]);
    const y = cy + maxR * Math.sin(angles[i]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    const lx = cx + (maxR + 26) * Math.cos(angles[i]);
    const ly = cy + (maxR + 26) * Math.sin(angles[i]);
    ctx.fillStyle = textColor;
    ctx.font = '600 12px "Be Vietnam Pro", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(RADAR_LABELS[i], lx, ly);
  }
}

function drawRadarPolygons(ctx, cx, cy, maxR, angles, activeSchools, scale, isDark, hoveredIndex, colorIndex) {
  const dotBorder = isDark ? '#0f172a' : '#ffffff';

  activeSchools.forEach((school, idx) => {
    const actualIdx = colorIndex !== undefined ? colorIndex : idx;
    const isHovered = hoveredIndex === undefined || hoveredIndex === -1 || hoveredIndex === actualIdx;
    const alpha = isHovered ? 1 : 0.15;

    const metrics = getRadarMetrics(school);
    const values = [metrics.cost, metrics.visa, metrics.job, metrics.e7, metrics.study];
    const color = RADAR_COLORS[actualIdx] || '#888';

    // Fill polygon
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const r = ((values[i] / 5) * maxR) * scale;
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color + (isHovered ? '1A' : '08');  // more transparent when dimmed
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = isHovered ? 2.5 : 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Data points + value labels
    for (let i = 0; i < 5; i++) {
      const r = ((values[i] / 5) * maxR) * scale;
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);

      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = dotBorder;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Value label (chỉ hiện khi scale > 0.1 để tránh chồng text)
      if (scale > 0.1) {
        const vx = cx + ((values[i] / 5) * maxR * scale + 14) * Math.cos(angles[i]);
        const vy = cy + ((values[i] / 5) * maxR * scale + 14) * Math.sin(angles[i]);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.font = '700 10px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(values[i]), vx, vy);
        ctx.globalAlpha = 1;
      }
    }
  });
}

function drawRadarLegend(ctx, cx, h, activeSchools, isDark, hoveredIndex) {
  const textColor = isDark ? '#94a3b8' : '#64748b';
  if (activeSchools.length <= 1) return;

  const legendY = h - 6;
  let totalWidth = 0;
  activeSchools.forEach(function(s, i) {
    ctx.font = '12px "Be Vietnam Pro", sans-serif';
    totalWidth += ctx.measureText(s.name || '').width + 34;
  });
  let lx = cx - totalWidth / 2;

  activeSchools.forEach(function(school, idx) {
    const isHovered = hoveredIndex !== undefined && hoveredIndex !== -1 && hoveredIndex === idx;
    const color = RADAR_COLORS[idx] || '#888';

    // Background highlight khi hover
    if (isHovered) {
      const tw = ctx.measureText(school.name || '').width + 34;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.rect(lx - 4, legendY - 10, tw + 8, 24);
      ctx.fill();
    }

    ctx.fillStyle = color;
    ctx.fillRect(lx, legendY - 5, 12, 12);
    ctx.fillStyle = isHovered ? color : textColor;
    ctx.font = (isHovered ? '700 ' : '') + '12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(school.name || '', lx + 18, legendY);
    lx += ctx.measureText(school.name || '').width + 34;
  });
}

function renderRadarChart(canvas, schools) {
  if (!canvas || !schools || !schools.length) return;

  const isDark = false; // dark mode removed
  const dpr = window.devicePixelRatio || 1;

  const parent = canvas.parentElement;
  const w = parent?.clientWidth || 460;
  const h = Math.min(w, 400);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h / 2 - 8;
  const maxR = Math.min(cx, cy) - 52;

  const angles = [];
  for (let i = 0; i < 5; i++) {
    angles.push((i / 5) * Math.PI * 2 - Math.PI / 2);
  }

  const activeSchools = schools.filter(Boolean);
  const duration = 700; // ms
  const delayPerPolygon = 150; // delay between each school polygon

  let startTime = null;

  function drawFrame(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx.clearRect(0, 0, w, h);

    // Draw grid + axis (static, always visible)
    drawRadarGrid(ctx, cx, cy, maxR, angles, isDark);

    // Draw each school polygon with staggered animation
    activeSchools.forEach(function(school, idx) {
      const schoolElapsed = Math.max(0, elapsed - delayPerPolygon * idx);
      const t = Math.min(1, schoolElapsed / duration);
      const scale = easeOutCubic(t);

      drawRadarPolygons(ctx, cx, cy, maxR, angles, [school], scale, isDark, undefined, idx);
    });

    // Draw legend (appears after first polygon is mostly done)
    if (elapsed > delayPerPolygon + 200) {
      drawRadarLegend(ctx, cx, h, activeSchools, isDark);
    }

    if (elapsed < duration + delayPerPolygon * (activeSchools.length - 1)) {
      requestAnimationFrame(drawFrame);
    } else {
      // Animation done — add hover listeners
      setupHoverListeners();
    }
  }

  // ─── Hover: highlight polygon khi di chuột vào legend ───
  function getLegendHitIndex(mouseX, mouseY) {
    const legendY = h - 6;
    if (Math.abs(mouseY - legendY) > 14) return -1;

    ctx.font = '12px "Be Vietnam Pro", sans-serif';
    const totalWidth = 0;
    const widths = activeSchools.map(function(s) {
      const tw = ctx.measureText(s.name || '').width + 34;
      return tw;
    });
    const total = widths.reduce(function(a, b) { return a + b; }, 0);
    let lx = cx - total / 2;

    for (let i = 0; i < activeSchools.length; i++) {
      if (mouseX >= lx - 4 && mouseX <= lx + widths[i] + 4) {
        return i;
      }
      lx += widths[i];
    }
    return -1;
  }

  function redrawComplete(hoverIdx) {
    ctx.clearRect(0, 0, w, h);
    drawRadarGrid(ctx, cx, cy, maxR, angles, isDark);
    // Draw all polygons at full scale
    activeSchools.forEach(function(school) {
      drawRadarPolygons(ctx, cx, cy, maxR, angles, [school], 1, isDark, hoverIdx, idx);
    });
    drawRadarLegend(ctx, cx, h, activeSchools, isDark, hoverIdx);
  }

  let currentHover = -1;

  function setupHoverListeners() {
    canvas.addEventListener('mousemove', function(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const idx = getLegendHitIndex(mx, my);
      if (idx !== currentHover) {
        currentHover = idx;
        redrawComplete(idx);
      }
    });

    canvas.addEventListener('mouseleave', function() {
      if (currentHover !== -1) {
        currentHover = -1;
        redrawComplete(-1);
      }
    });
  }

  requestAnimationFrame(drawFrame);
}

function getChecklistData() {
  return window.CHECKLIST_GROUPED || [];
}

function renderD26Checklist() {
  const groups = getChecklistData();
  const total = groups.reduce(function(sum, g) { return sum + g.items.length; }, 0);
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
        ${groups.map(function(group, groupIndex) {
          return `
            <article class="checklist-group">
              <h3>${escapeHtml(group.group || 'Khác')}</h3>
              <div class="checklist-items">
                ${group.items.map(function(item, itemIndex) {
                  const id = 'd26-check-' + groupIndex + '-' + itemIndex;
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
                }).join('')}
              </div>
            </article>
          `;
        }).join('')}
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
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) {}
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
  // Expose để các file khác (vd advisor.js) gọi an toàn
  window.showSchool = showSchool;
  const content = document.getElementById("school-content");
  const schools = document.getElementById("schools-content");
  const compare = document.getElementById("compare-content");
  const extra = document.getElementById("extra-content");
  const map = document.getElementById("map-content");
  const ebook = document.getElementById("ebook-content");
  const advisor = document.getElementById("advisor-content");
  const costEl = document.getElementById("cost-content");
  const appEl = document.getElementById("application-content");

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-school="${viewId}"]`)?.classList.add("active");
  if (getSchoolById(viewId)) document.querySelector(`[data-school="schools"]`)?.classList.add("active");
  updateUrlForView(viewId);
  updatePageMeta(viewId, getSchoolById(viewId));

  const hideAll = () => {
    [content, schools, compare, extra, map, ebook, advisor, costEl, appEl].forEach(el => el?.classList.add("hidden"));
  };

  // Track page views
  if (typeof window.trackAnalytics === "function") {
    const pageType = getSchoolById(viewId) ? 'school_detail' : viewId;
    window.trackAnalytics('page_view', {
      pageType: pageType,
      schoolSlug: getSchoolById(viewId) ? viewId : null,
      schoolName: getSchoolById(viewId) ? getSchoolById(viewId).name : null,
    });
  }

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

  if (viewId === "cost") {
    hideAll();
    costEl.classList.remove("hidden");
    costEl.innerHTML = renderCostCalculator();
    bindCostCalculator(costEl);
    return;
  }

  if (viewId === "application") {
    hideAll();
    appEl.classList.remove("hidden");
    if (typeof renderApplicationApp === "function") renderApplicationApp(appEl);
    else appEl.innerHTML = `<div class="empty"><p>Đang tải form đăng ký...</p></div>`;
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
  if (!window.__DATA_READY__) {
    // API loader chưa hoàn thành, hẹn init lại
    document.addEventListener('app-data-ready', init, { once: true });
    return;
  }

  // Set current semester từ active semester
  if (!currentSemesterId && window.ACTIVE_SEMESTER_ID) {
    currentSemesterId = window.ACTIVE_SEMESTER_ID;
  }

  // Ẩn skeleton loading
  const skeleton = document.getElementById('skeleton-loader');
  if (skeleton) skeleton.style.display = 'none';

  const content = document.getElementById("advisor-content");
  if (typeof SCHOOLS_DATA === "undefined" || Object.keys(SCHOOLS_DATA).length === 0) {
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
