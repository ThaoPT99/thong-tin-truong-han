#!/usr/bin/env python3
"""Add quick copy Zalo template + search nhanh ho so features."""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- 1. Add getSchoolZaloText after getSchoolShareText ---
render_path = os.path.join(ROOT, 'public', 'js', 'render.js')
with open(render_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already added
if 'getSchoolZaloText' in content:
    print("getSchoolZaloText already exists in render.js")
else:
    # Find getSchoolShareText and insert our new function after it
    old_func = '''function getSchoolShareText(school) {
  return [
    `Thông tin trường: ${school.name}`,
    school.nameEn ? `Tên tiếng Anh: ${school.nameEn}` : "",
    school.system ? `Hệ học: ${school.system}` : "",
    school.location ? `Vị trí: ${school.location}` : "",
    school.tuition ? `Học phí: ${String(school.tuition).replace(/\\n+/g, " ")}` : "",
    school.ktx ? `KTX: ${String(school.ktx).replace(/\\n+/g, " ")}` : "",
    `Link: ${location.origin}${location.pathname}?school=${encodeURIComponent(school.id)}`
  ].filter(Boolean).join("\\n");
}'''

    new_text = '''function getSchoolZaloText(school) {
  var rules = getAdvisorRules(school.id, school);
  var regionName = rules && rules.region ? (window.REGION_LABELS && window.REGION_LABELS[rules.region] ? window.REGION_LABELS[rules.region].charAt(0).toUpperCase() + window.REGION_LABELS[rules.region].slice(1) : rules.region) : '';
  var line = String.prototype.padEnd ? ''.padEnd(30, '\\u2500') : '──────────────────────────────';
  return [
    '📋 TU VAN DU HOC HAN QUOC',
    line,
    '• Truong: ' + (school.name || '') + (school.nameKr ? ' (' + school.nameKr + ')' : ''),
    school.nameEn ? '• Ten tieng Anh: ' + school.nameEn : '',
    school.system ? '• He dao tao: ' + school.system : '',
    regionName ? '• Khu vuc: ' + regionName : '',
    school.tuition ? '• Hoc phi: ' + String(school.tuition).replace(/\\n+/g, ' ').substring(0, 200) : '',
    school.ktx ? '• Ky tuc xa: ' + String(school.ktx).replace(/\\n+/g, ' ').substring(0, 200) : '',
    '',
    '📞 Can tu van? LH Zalo',
    '🌐 ' + location.origin + location.pathname + '?school=' + encodeURIComponent(school.id)
  ].filter(Boolean).join("\\n");
}

function getSchoolShareText(school) {'''

    content = content.replace(old_func, new_text)
    with open(render_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added getSchoolZaloText to render.js")

    # Also add "Copy Zalo" button in detail-actions
    old_btn = '''          <button type=\"button\" class=\"copy-school-info\" data-school-id=\"${escapeHtml(schoolId)}\">Copy thông tin</button>
          <button type=\"button\" class=\"copy-school-link\" data-school-id=\"${escapeHtml(schoolId)}\">Copy link</button>
          <button type=\"button\" class=\"open-zalo-detail\">Tư vấn Zalo</button>'''
    new_btn = '''          <button type=\"button\" class=\"copy-school-info\" data-school-id=\"${escapeHtml(schoolId)}\">Copy thông tin</button>
          <button type=\"button\" class=\"copy-school-zalo\" data-school-id=\"${escapeHtml(schoolId)}\">📱 Copy Zalo</button>
          <button type=\"button\" class=\"copy-school-link\" data-school-id=\"${escapeHtml(schoolId)}\">Copy link</button>
          <button type=\"button\" class=\"open-zalo-detail\">Tư vấn Zalo</button>'''
    content = content.replace(old_btn, new_btn)
    with open(render_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Copy Zalo button to render.js")

    # Bind the copy-zalo button in bindSchoolDetail
    old_bind = '''  container.querySelector(\".copy-school-info\")?.addEventListener(\"click\", async () => {
    try {
      await navigator.clipboard.writeText(getSchoolShareText(school));
      showCopyToast(container, \"Đã copy thông tin trường\");
    } catch (e) {
      showCopyToast(container, \"Trình duyệt chưa cho phép copy tự động\");
    }
  });'''
    new_bind = '''  container.querySelector(\".copy-school-info\")?.addEventListener(\"click\", async () => {
    try {
      await navigator.clipboard.writeText(getSchoolShareText(school));
      showCopyToast(container, \"Đã copy thông tin trường\");
    } catch (e) {
      showCopyToast(container, \"Trình duyệt chưa cho phép copy tự động\");
    }
  });
  container.querySelector(\".copy-school-zalo\")?.addEventListener(\"click\", async () => {
    try {
      await navigator.clipboard.writeText(getSchoolZaloText(school));
      showCopyToast(container, \"Đã copy nội dung tư vấn Zalo\");
    } catch (e) {
      showCopyToast(container, \"Trình duyệt chưa cho phép copy tự động\");
    }
  });'''
    content = content.replace(old_bind, new_bind)
    with open(render_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Copy Zalo bindings to render.js")


# --- 2. Add search nhanh ho so to advisor.js ---
advisor_path = os.path.join(ROOT, 'public', 'js', 'advisor.js')
with open(advisor_path, 'r', encoding='utf-8') as f:
    advisor_content = f.read()

if 'parseQuickProfile' in advisor_content:
    print("parseQuickProfile already exists in advisor.js")
else:
    # Add parse function after PRIORITY_LABELS
    old_start = "const PRIORITY_LABELS = {"
    parse_func = '''const PRIORITY_LABELS = {

/** Parse nhanh ho so tu text: "nu, 20t, GPA 6.0, topik 2" */
function parseQuickProfile(text) {
  var q = (text || '').toLowerCase().trim();
  var profile = { gender: '', age: 0, gpa: 0, absences: 10, korean: 'none', visaFail: 'no', region: 'any', budget: 'medium', priorities: ['visa', 'job'] };

  if (!q) return profile;

  // Gender
  if (q.indexOf('nu') !== -1 || q.indexOf('nữ') !== -1 || q.indexOf('female') !== -1) profile.gender = 'female';
  else if (q.indexOf('nam') !== -1 || q.indexOf('male') !== -1) profile.gender = 'male';

  // Age
  var ageMatch = q.match(/(\\d+)\\s*(t|tuoi|tuổi|age)/);
  if (ageMatch) profile.age = parseInt(ageMatch[1], 10);

  // GPA
  var gpaMatch = q.match(/gpa\\s*[:.]?\\s*([\\d.]+)/);
  if (gpaMatch) profile.gpa = parseFloat(gpaMatch[1]);

  // Absences
  var absMatch = q.match(/(?:nghi|vang|absences?)\\s*[:.]?\\s*(\\d+)/);
  if (absMatch) profile.absences = parseInt(absMatch[1], 10);

  // Korean level
  if (q.indexOf('topik 3') !== -1 || q.indexOf('topik3') !== -1) profile.korean = 'topik3';
  else if (q.indexOf('topik 2') !== -1 || q.indexOf('topik2') !== -1) profile.korean = 'topik2';
  else if (q.indexOf('sejong') !== -1) profile.korean = 'sejong2b';

  // Visa fail
  if (q.indexOf('truot visa') !== -1 || q.indexOf('truot') !== -1 || q.indexOf('fail') !== -1) profile.visaFail = 'yes';

  // Region
  if (q.indexOf('seoul') !== -1) profile.region = 'seoul';
  else if (q.indexOf('busan') !== -1) profile.region = 'busan';
  else if (q.indexOf('gwangju') !== -1) profile.region = 'gwangju';
  else if (q.indexOf('incheon') !== -1) profile.region = 'incheon';

  // Budget
  if (q.indexOf('tiet kiem') !== -1 || q.indexOf('re') !== -1 || q.indexOf('thap') !== -1) profile.budget = 'low';
  else if (q.indexOf('cao') !== -1 || q.indexOf('khong ngan') !== -1) profile.budget = 'high';

  // Priorities
  var prios = [];
  if (q.indexOf('visa') !== -1) prios.push('visa');
  if (q.indexOf('viec lam') !== -1 || q.indexOf('job') !== -1) prios.push('job');
  if (q.indexOf('chi phi') !== -1 || q.indexOf('cost') !== -1) prios.push('cost');
  if (q.indexOf('e7') !== -1) prios.push('e7');
  if (q.indexOf('hoc it') !== -1) prios.push('low-study');
  if (q.indexOf('uy tin') !== -1) prios.push('prestige');
  if (prios.length > 0) profile.priorities = prios;

  return profile;
}'''

    advisor_content = advisor_content.replace(old_start, parse_func)
    with open(advisor_path, 'w', encoding='utf-8') as f:
        f.write(advisor_content)
    print("Added parseQuickProfile to advisor.js")

    # Add quick-input field to advisor template
    old_template = '''  return \`
    <section class=\"advisor-view\">
      <div class=\"advisor-head\">
        <div>
          <p class=\"advisor-kicker\">Visa D2-6</p>
          <h2>Tư vấn chọn trường phù hợp</h2>
          <p>Nhập hồ sơ học sinh để nhận Top 3 trường nên cân nhắc cùng lý do và rủi ro chính.</p>
        </div>
      </div>'''
    new_template = '''  return \`
    <section class=\"advisor-view\">
      <div class=\"advisor-head\">
        <div>
          <p class=\"advisor-kicker\">Visa D2-6</p>
          <h2>Tư vấn chọn trường phù hợp</h2>
          <p>Nhập hồ sơ học sinh để nhận Top 3 trường nên cân nhắc cùng lý do và rủi ro chính.</p>
        </div>
      </div>

      <div class=\"advisor-quick-input\" style=\"padding:0.75rem 1.5rem;margin-top:0;background:#f8fafc;border-bottom:1px solid #dbe3ee;\">
        <label style=\"font-size:0.82rem;font-weight:700;color:#475569;display:block;margin-bottom:4px;\">⚡ Nhập nhanh hồ sơ</label>
        <div style=\"display:flex;gap:8px;\">
          <input type=\"text\" id=\"advisor-quick-input\" placeholder=\"VD: nữ, 20t, GPA 6.0, topik 2\" style=\"flex:1;min-height:2.55rem;padding:0.5rem 0.7rem;border:1px solid #dbe3ee;border-radius:8px;background:#fff;font:inherit;font-size:0.9rem;\">
          <button type=\"button\" id=\"advisor-quick-btn\" style=\"min-height:2.55rem;padding:0.5rem 0.9rem;border:none;border-radius:8px;background:#2563eb;color:#fff;font:inherit;font-weight:700;cursor:pointer;\">🔍 Điền</button>
        </div>
        <div style=\"font-size:0.78rem;color:#94a3b8;margin-top:4px;\">Nhập tự nhiên: nữ/nam, tuổi, GPA, topik, khu vực, ưu tiên...</div>
      </div>'''
    advisor_content = advisor_content.replace(old_template, new_template)
    with open(advisor_path, 'w', encoding='utf-8') as f:
        f.write(advisor_content)
    print("Added quick input field to advisor.js")

    # Wire up the quick input button in bindAdvisorEvents
    old_bind_events = '''function bindAdvisorEvents(container) {
  const form = container.querySelector(\"#advisor-form\");
  const reset = container.querySelector(\".advisor-reset\");'''
    new_bind_events = '''function bindAdvisorEvents(container) {
  const form = container.querySelector(\"#advisor-form\");
  const reset = container.querySelector(\".advisor-reset\");
  const quickInput = container.querySelector(\"#advisor-quick-input\");
  const quickBtn = container.querySelector(\"#advisor-quick-btn\");

  if (quickInput && quickBtn) {
    quickBtn.addEventListener(\"click\", function() {
      var profile = parseQuickProfile(quickInput.value);
      if (profile.gender) form.querySelector('[name=\"gender\"]').value = profile.gender;
      if (profile.age > 0) form.querySelector('[name=\"age\"]').value = profile.age;
      if (profile.gpa > 0) form.querySelector('[name=\"gpa\"]').value = profile.gpa;
      if (profile.absences !== 10) form.querySelector('[name=\"absences\"]').value = profile.absences;
      if (profile.korean !== 'none') form.querySelector('[name=\"korean\"]').value = profile.korean;
      if (profile.visaFail) form.querySelector('[name=\"visaFail\"]').value = profile.visaFail;
      if (profile.region && profile.region !== 'any') form.querySelector('[name=\"region\"]').value = profile.region;
      if (profile.budget) form.querySelector('[name=\"budget\"]').value = profile.budget;
      // Check priorities
      form.querySelectorAll('[name=\"priorities\"]').forEach(function(cb) {
        cb.checked = profile.priorities.indexOf(cb.value) !== -1;
      });
      // Auto-submit
      form.dispatchEvent(new Event('submit'));
    });

    // Also submit on Enter
    quickInput.addEventListener(\"keydown\", function(e) {
      if (e.key === \"Enter\") { e.preventDefault(); quickBtn.click(); }
    });
  }'''

    advisor_content = advisor_content.replace(old_bind_events, new_bind_events)
    with open(advisor_path, 'w', encoding='utf-8') as f:
        f.write(advisor_content)
    print("Added quick input bindings to advisor.js")


# --- 3. Add CSS for quick input field ---
css_path = os.path.join(ROOT, 'public', 'styles.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

if 'advisor-quick-input' in css_content:
    print("advisor-quick-input CSS already exists")
else:
    css_add = """
/* Quick profile input for advisor */
.advisor-quick-input {
  animation: fadeIn 0.2s ease-out;
}
.advisor-quick-input input:focus {
  outline: 2px solid #bfdbfe;
  border-color: #2563eb !important;
}
"""
    css_content += css_add
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Added quick-input CSS to styles.css")


print("\\n=== ALL FEATURES ADDED SUCCESSFULLY ===")
