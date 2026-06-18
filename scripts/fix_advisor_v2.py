#!/usr/bin/env python3
"""Fix advisor.js: remove broken code from inside PRIORITY_LABELS + add quick-input HTML template."""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(ROOT, 'public', 'js', 'advisor.js')

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Fix PRIORITY_LABELS - remove the leaked function body
old_obj_start = '''const PRIORITY_LABELS = {

/** Parse nhanh ho so tu text: "nu, 20t, GPA 6.0, topik 2" */
/* parseQuickProfile defined below */;

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
}
  visa: "dễ đỗ visa"'''

new_obj_start = '''const PRIORITY_LABELS = {
  visa: "dễ đỗ visa"'''

content = content.replace(old_obj_start, new_obj_start)

# Step 2: Add quick-input HTML template to getAdvisorTemplate()
# Find the section after advisor-head and before advisor-form
old_template = '''      </div>\n\n      <form id=\"advisor-form\" class=\"advisor-form\">'''

new_template = '''      </div>

      <div class=\"advisor-quick-input\">
        <label style=\"font-size:0.82rem;font-weight:700;color:#475569;display:block;margin-bottom:4px;\">⚡ Nhập nhanh hồ sơ</label>
        <div style=\"display:flex;gap:8px;\">
          <input type=\"text\" id=\"advisor-quick-input\" placeholder=\"VD: nữ, 20t, GPA 6.0, topik 2\" style=\"flex:1;min-height:2.55rem;padding:0.5rem 0.7rem;border:1px solid #dbe3ee;border-radius:8px;background:#fff;font:inherit;font-size:0.9rem;\">
          <button type=\"button\" id=\"advisor-quick-btn\" style=\"min-height:2.55rem;padding:0.5rem 0.9rem;border:none;border-radius:8px;background:#2563eb;color:#fff;font:inherit;font-weight:700;cursor:pointer;\">\U0001f50d Điền</button>
        </div>
        <div style=\"font-size:0.78rem;color:#94a3b8;margin-top:4px;\">Nhập tự nhiên: nữ/nam, tuổi, GPA, topik, khu vực, ưu tiên...</div>
      </div>

      <form id=\"advisor-form\" class=\"advisor-form\">'''

content = content.replace(old_template, new_template)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
with open(path, 'r', encoding='utf-8') as f:
    verify = f.read()

# Count parseQuickProfile
count = verify.count('function parseQuickProfile')
print(f'parseQuickProfile count: {count}')

# Check if advisor-quick-input is in template
has_input = 'advisor-quick-input' in verify
print(f'Has quick-input HTML: {has_input}')

# Check PRIORITY_LABELS is clean
clean = 'const PRIORITY_LABELS = {\n  visa: "dễ đỗ visa"' in verify
print(f'PRIORITY_LABELS clean: {clean}')

print('DONE')
