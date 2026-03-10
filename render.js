const PLACEHOLDER = "images/placeholder.svg";

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// Highlight nhẹ nhàng - ít màu, dễ đọc
function applyHighlights(html) {
  if (!html || typeof html !== "string") return html;
  return html
    .replace(/(Lưu ý:|LƯU Ý:)/g, "<span class='hl-note'>$1</span>")
    .replace(/(\d[\d.,\s]*(?:KRW|원|won|triệu))/gi, "<span class='hl-money'>$1</span>")
    .replace(/(học bổng|topik|sejong(?: 2b)?)/gi, "<span class='hl-keyword'>$1</span>");
}

// Render text - bỏ màu Excel, chỉ dùng highlight từ khóa
function renderText(val) {
  if (val === undefined || val === null || val === "") return "";
  let raw = "";
  if (typeof val === "string") raw = val;
  else if (Array.isArray(val)) raw = val.map(seg => seg.t || "").join("");
  else raw = String(val);
  const out = escapeHtml(raw).replace(/\n/g, "<br>");
  return applyHighlights(out);
}

// Bố cục giống Excel: bảng 2 cột (Nhãn | Nội dung)
function renderSchool(schoolId) {
  const s = SCHOOLS_DATA[schoolId];
  if (!s) return "";

  const img = (path) => path ? `<img src="${path}" alt="" onerror="this.src='${PLACEHOLDER}'" class="sheet-img">` : "";
  // Video: nhúng trực tiếp (YouTube/Drive) + link dự phòng
  let videoEmbedHtml = "";
  if (s.video?.youtubeId) {
    videoEmbedHtml = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${s.video.youtubeId}" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  } else if (s.video?.url && s.video.url.includes("drive.google.com")) {
    const m = s.video.url.match(/\/d\/([^/]+)/);
    if (m) videoEmbedHtml = `<div class="video-embed"><iframe src="https://drive.google.com/file/d/${m[1]}/preview" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  }
  const videoLinkHtml = s.video?.url ? `<a href="${s.video.url}" target="_blank" rel="noopener" class="video-link">▶ Mở video</a>` : "";
  const videoHtml = videoEmbedHtml
    ? videoEmbedHtml + (videoLinkHtml ? "<br>" + videoLinkHtml : "")
    : videoLinkHtml || (s.video?.title ? `<span>${s.video.title}</span>` : "");

  const row = (label, value) => (value !== undefined && value !== null && value !== "") ? `<tr><td class="col-label">${label}</td><td class="col-value">${value}</td></tr>` : "";

  const listToText = (arr) => arr && arr.length ? arr.map((x, i) => `<strong>${i + 1}.</strong> ${applyHighlights(escapeHtml(String(x)).replace(/\n/g, "<br>"))}`).join("<br>") : "";
  const partnersToText = (arr) => arr && arr.length
    ? arr.map(p => `<span class="partner-tag">${p.code}</span> ${p.name}`).join("<br>")
    : "";

  // Catalog: link Drive/URL - click mở tab mới, giữ nguyên href
  const catalogVal = s.links?.catalog
    ? `<a href="${s.links.catalog}" target="_blank" rel="noopener">📄 Mở Catalog</a>`
    : s.images?.catalog ? img(s.images.catalog) : "";

  const locationVal = [renderText(s.location) || "", s.images?.locationMap ? img(s.images.locationMap) : ""].filter(Boolean).join("<br>");
  const introVal = [s.links?.website ? `<a href="${s.links.website}" target="_blank">${escapeHtml(s.links.website)}</a>` : "", renderText(s.intro) || ""].filter(Boolean).join("<br>");
  const docsVal = listToText(s.documents) + (s.documentsNote ? `<div class="note">${renderText(s.documentsNote)}</div>` : "");
  const invoiceVal = s.links?.invoice
    ? `<a href="${s.links.invoice}" target="_blank" rel="noopener">📄 Mở Invoice</a>`
    : s.images?.invoice ? img(s.images.invoice) : "";

  let html = `
    <section class="sheet-view">
      <table class="data-table">
        <thead>
          <tr>
            <th colspan="2" class="table-header">
              ${s.name} ${s.nameKr ? `<span class="korean">${s.nameKr}</span>` : ""}
              ${s.nameEn ? `<span class="name-en">${s.nameEn}</span>` : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          ${row("Hệ giáo dục", renderText(s.system))}
          ${row("Chỉ tiêu tuyển sinh", s.quota ? String(s.quota) : "")}
          ${row("Trường VN ký MOU", (s.mou ? renderText(s.mou) : "") || partnersToText(s.partners))}
          ${row("Catalog", catalogVal)}
          ${row("Vị trí địa lý", locationVal)}
          ${row("Giới thiệu về trường", introVal)}
          ${row("Điều kiện tuyển sinh", listToText(s.conditions))}
          ${row("Các chuyên ngành tuyển sinh", listToText(s.majors))}
          ${row("Thời gian chuyển đổi", listToText(s.conversion))}
          ${row("Hồ sơ trường Hàn cần lưu ý", docsVal)}
          ${row("Ưu điểm", listToText(s.advantages))}
          ${row("Học phí", renderText(s.tuition))}
          ${row("KTX", renderText(s.ktx))}
          ${row("Bảo hiểm", renderText(s.insurance))}
          ${row("Lịch học", renderText(s.schedule))}
          ${row("Mẫu Invoice", invoiceVal)}
          ${row("Clip giới thiệu về trường", videoHtml)}
          ${row("Trường CĐ/ĐH tại VN", partnersToText(s.partners))}
        </tbody>
      </table>
    </section>
  `;
  return html;
}

function renderExtra() {
  const link = "https://docs.google.com/spreadsheets/d/1LkzsRId4jJ4qLCyggEX_Sj2TzrQ4gu-n";
  let html = `<section class="sheet-view">
    <h2 class="sheet-title">Tài liệu chung</h2>
    <p class="extra-intro"><a href="${link}" target="_blank" rel="noopener">📋 Mở Google Sheet gốc</a></p>`;

  const s = EXTRA_SHEETS;
  // Danh sách trường Hàn - bảng tổng hợp
  if (s.danhSach && s.danhSach.rows && s.danhSach.rows.length) {
    html += `<table class="data-table extra-table">
      <thead><tr><th class="table-header">${s.danhSach.name}</th></tr></thead>
      <tbody><tr><td><table class="summary-table">
        <tr><th>Trường</th><th>Hệ</th><th>Chỉ tiêu</th><th>MOU</th><th>Catalog</th></tr>
        ${s.danhSach.rows.map(r => `<tr>
          <td>${escapeHtml(r.name)} ${r.nameKr ? `<span class="korean">${escapeHtml(r.nameKr)}</span>` : ""}</td>
          <td>${escapeHtml(r.system || "")}</td>
          <td>${r.quota || ""}</td>
          <td>${escapeHtml(r.mou || "")}</td>
          <td>${r.catalog ? `<a href="${r.catalog}" target="_blank">📄 Mở</a>` : ""}</td>
        </tr>`).join("")}
      </table></td></tr></tbody>
    </table>`;
  }
  // Check list Visa
  if (s.visaChecklist && s.visaChecklist.items && s.visaChecklist.items.length) {
    html += `<table class="data-table extra-table">
      <thead><tr><th class="table-header">${s.visaChecklist.name}</th></tr></thead>
      <tbody>${s.visaChecklist.items.map(it => `<tr>
        <td class="col-label">${escapeHtml(it.stt || "")}</td>
        <td class="col-value">${escapeHtml(it.noidung || "")}${it.luuy ? `<br><em>${escapeHtml(it.luuy)}</em>` : ""}
        ${it.link ? `<br><a href="${it.link}" target="_blank" rel="noopener">📄 ${escapeHtml(it.linkText || "Mở tài liệu")}</a>` : it.linkText ? `<br>${escapeHtml(it.linkText)}` : ""}
        </td></tr>`).join("")}
      </tbody>
    </table>`;
  }
  // Tài liệu ôn phỏng vấn
  if (s.phongVan && s.phongVan.items && s.phongVan.items.length) {
    html += `<table class="data-table extra-table">
      <thead><tr><th class="table-header">${s.phongVan.name}</th></tr></thead>
      <tbody>${s.phongVan.items.map(it => `<tr>
        <td class="col-label">${escapeHtml(it.stt || "")}</td>
        <td class="col-value">${escapeHtml(it.noidung || "")}
        ${it.link ? `<br><a href="${it.link}" target="_blank" rel="noopener">📄 ${escapeHtml(it.linkText || "Mở")}</a>` : it.linkText ? `<br>${escapeHtml(it.linkText)}` : ""}
        </td></tr>`).join("")}
      </tbody>
    </table>`;
  }
  // Application theo trường
  if (s.application && s.application.schools && s.application.schools.length) {
    html += `<table class="data-table extra-table">
      <thead><tr><th class="table-header">${s.application.name}</th></tr></thead>
      <tbody>${s.application.schools.map(sh => `<tr>
        <td class="col-value"><strong>${escapeHtml(sh.school)}</strong><br>
        ${(sh.items || []).filter(i => i.type || i.link || i.linkText).map(i =>
          (i.type ? escapeHtml(i.type) + ": " : "") +
          (i.link ? `<a href="${i.link}" target="_blank" rel="noopener">📄 ${escapeHtml(i.linkText || "Mở")}</a>` : escapeHtml(i.linkText || ""))
        ).join("<br>")}
        </td></tr>`).join("")}
      </tbody>
    </table>`;
  }
  // Thông tin làm tem
  if (s.tem && s.tem.schools && s.tem.schools.length) {
    html += `<table class="data-table extra-table">
      <thead><tr><th class="table-header">${s.tem.name}</th></tr></thead>
      <tbody>${s.tem.schools.map(sh => `<tr>
        <td class="col-value"><strong>${escapeHtml(sh.name || "")}</strong><br>
        ${sh.address ? "Địa chỉ: " + escapeHtml(sh.address) + "<br>" : ""}
        ${sh.phone ? "Điện thoại: " + escapeHtml(sh.phone) + "<br>" : ""}
        ${sh.email ? "Email: " + escapeHtml(sh.email) : ""}
        </td></tr>`).join("")}
      </tbody>
    </table>`;
  }
  html += `</section>`;
  return html;
}

function showSchool(schoolId) {
  const content = document.getElementById("school-content");
  const extra = document.getElementById("extra-content");
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-school="${schoolId}"]`)?.classList.add("active");

  if (schoolId === "extra") {
    content.classList.add("hidden");
    extra.classList.remove("hidden");
    extra.innerHTML = renderExtra();
  } else {
    extra.classList.add("hidden");
    content.classList.remove("hidden");
    content.innerHTML = renderSchool(schoolId) || `<p class="empty">Chưa có dữ liệu.</p>`;
  }
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => showSchool(btn.dataset.school));
});

// Khởi tạo khi DOM sẵn sàng
function init() {
  const content = document.getElementById("school-content");
  if (typeof SCHOOLS_DATA === "undefined") {
    content.innerHTML = `<p class="empty" style="padding:2rem;color:#dc2626;">
      Không tải được dữ liệu. Kiểm tra:<br>
      1) File <code>data.js</code> có trong cùng thư mục?<br>
      2) Thử mở bằng local server: <code>npx serve .</code> hoặc <code>python -m http.server 8080</code>
    </p>`;
    return;
  }
  try {
    showSchool("dong-eui");
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
