#!/usr/bin/env python3
"""Fix parseQuickProfile placement - it was placed INSIDE PRIORITY_LABELS object."""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
advisor_path = os.path.join(ROOT, 'public', 'js', 'advisor.js')

with open(advisor_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if the function is inside the object (bug)
if 'const PRIORITY_LABELS = {\n\n/** Parse nhanh' in content:
    # Fix: move the function AFTER the PRIORITY_LABELS object
    
    # The current (buggy) structure:
    # const PRIORITY_LABELS = {
    #
    # /** Parse nhanh... */
    # function parseQuickProfile(text) {
    #   ...
    # }
    #   visa: "dễ đỗ visa",
    #   ...
    # };
    
    # We need to:
    # 1. Extract the function declaration
    # 2. Place it AFTER the const PRIORITY_LABELS = { ... };
    
    old = 'const PRIORITY_LABELS = {\n\n/** Parse nhanh ho so tu text: "nu, 20t, GPA 6.0, topik 2" */\nfunction parseQuickProfile(text) {\n  var q = (text || \'\').toLowerCase().trim();\n  var profile = { gender: \'\', age: 0, gpa: 0, absences: 10, korean: \'none\', visaFail: \'no\', region: \'any\', budget: \'medium\', priorities: [\'visa\', \'job\'] };\n\n  if (!q) return profile;\n\n  // Gender\n  if (q.indexOf(\'nu\') !== -1 || q.indexOf(\'nữ\') !== -1 || q.indexOf(\'female\') !== -1) profile.gender = \'female\';\n  else if (q.indexOf(\'nam\') !== -1 || q.indexOf(\'male\') !== -1) profile.gender = \'male\';\n\n  // Age\n  var ageMatch = q.match(/(\\d+)\\s*(t|tuoi|tuổi|age)/);\n  if (ageMatch) profile.age = parseInt(ageMatch[1], 10);\n\n  // GPA\n  var gpaMatch = q.match(/gpa\\s*[:.]?\\s*([\\d.]+)/);\n  if (gpaMatch) profile.gpa = parseFloat(gpaMatch[1]);\n\n  // Absences\n  var absMatch = q.match(/(?:nghi|vang|absences?)\\s*[:.]?\\s*(\\d+)/);\n  if (absMatch) profile.absences = parseInt(absMatch[1], 10);\n\n  // Korean level\n  if (q.indexOf(\'topik 3\') !== -1 || q.indexOf(\'topik3\') !== -1) profile.korean = \'topik3\';\n  else if (q.indexOf(\'topik 2\') !== -1 || q.indexOf(\'topik2\') !== -1) profile.korean = \'topik2\';\n  else if (q.indexOf(\'sejong\') !== -1) profile.korean = \'sejong2b\';\n\n  // Visa fail\n  if (q.indexOf(\'truot visa\') !== -1 || q.indexOf(\'truot\') !== -1 || q.indexOf(\'fail\') !== -1) profile.visaFail = \'yes\';\n\n  // Region\n  if (q.indexOf(\'seoul\') !== -1) profile.region = \'seoul\';\n  else if (q.indexOf(\'busan\') !== -1) profile.region = \'busan\';\n  else if (q.indexOf(\'gwangju\') !== -1) profile.region = \'gwangju\';\n  else if (q.indexOf(\'incheon\') !== -1) profile.region = \'incheon\';\n\n  // Budget\n  if (q.indexOf(\'tiet kiem\') !== -1 || q.indexOf(\'re\') !== -1 || q.indexOf(\'thap\') !== -1) profile.budget = \'low\';\n  else if (q.indexOf(\'cao\') !== -1 || q.indexOf(\'khong ngan\') !== -1) profile.budget = \'high\';\n\n  // Priorities\n  var prios = [];\n  if (q.indexOf(\'visa\') !== -1) prios.push(\'visa\');\n  if (q.indexOf(\'viec lam\') !== -1 || q.indexOf(\'job\') !== -1) prios.push(\'job\');\n  if (q.indexOf(\'chi phi\') !== -1 || q.indexOf(\'cost\') !== -1) prios.push(\'cost\');\n  if (q.indexOf(\'e7\') !== -1) prios.push(\'e7\');\n  if (q.indexOf(\'hoc it\') !== -1) prios.push(\'low-study\');\n  if (q.indexOf(\'uy tin\') !== -1) prios.push(\'prestige\');\n  if (prios.length > 0) profile.priorities = prios;\n\n  return profile;\n}\n\n  visa: "dễ đỗ visa",'

    new_text = 'const PRIORITY_LABELS = {\n  visa: "dễ đỗ visa",'

    content = content.replace(old, new_text)
    
    # Now add the function AFTER the REGION_LABELS declaration or at end of file
    # Find the function that was moved externally to replace it properly
    
    # Check if function needs to be added after PRIORITY_LABELS definition ends
    # We'll look for the line after PRIORITY_LABELS closes and check for REGION_LABELS
    
    # The function body should be placed right BEFORE the REGION_LABELS line
    func_def = '\n\n/** Parse nhanh ho so tu text: "nu, 20t, GPA 6.0, topik 2" */\nfunction parseQuickProfile(text) {\n  var q = (text || \'\').toLowerCase().trim();\n  var profile = { gender: \'\', age: 0, gpa: 0, absences: 10, korean: \'none\', visaFail: \'no\', region: \'any\', budget: \'medium\', priorities: [\'visa\', \'job\'] };\n\n  if (!q) return profile;\n\n  // Gender\n  if (q.indexOf(\'nu\') !== -1 || q.indexOf(\'nữ\') !== -1 || q.indexOf(\'female\') !== -1) profile.gender = \'female\';\n  else if (q.indexOf(\'nam\') !== -1 || q.indexOf(\'male\') !== -1) profile.gender = \'male\';\n\n  // Age\n  var ageMatch = q.match(/(\\d+)\\s*(t|tuoi|tuổi|age)/);\n  if (ageMatch) profile.age = parseInt(ageMatch[1], 10);\n\n  // GPA\n  var gpaMatch = q.match(/gpa\\s*[:.]?\\s*([\\d.]+)/);\n  if (gpaMatch) profile.gpa = parseFloat(gpaMatch[1]);\n\n  // Absences\n  var absMatch = q.match(/(?:nghi|vang|absences?)\\s*[:.]?\\s*(\\d+)/);\n  if (absMatch) profile.absences = parseInt(absMatch[1], 10);\n\n  // Korean level\n  if (q.indexOf(\'topik 3\') !== -1 || q.indexOf(\'topik3\') !== -1) profile.korean = \'topik3\';\n  else if (q.indexOf(\'topik 2\') !== -1 || q.indexOf(\'topik2\') !== -1) profile.korean = \'topik2\';\n  else if (q.indexOf(\'sejong\') !== -1) profile.korean = \'sejong2b\';\n\n  // Visa fail\n  if (q.indexOf(\'truot visa\') !== -1 || q.indexOf(\'truot\') !== -1 || q.indexOf(\'fail\') !== -1) profile.visaFail = \'yes\';\n\n  // Region\n  if (q.indexOf(\'seoul\') !== -1) profile.region = \'seoul\';\n  else if (q.indexOf(\'busan\') !== -1) profile.region = \'busan\';\n  else if (q.indexOf(\'gwangju\') !== -1) profile.region = \'gwangju\';\n  else if (q.indexOf(\'incheon\') !== -1) profile.region = \'incheon\';\n\n  // Budget\n  if (q.indexOf(\'tiet kiem\') !== -1 || q.indexOf(\'re\') !== -1 || q.indexOf(\'thap\') !== -1) profile.budget = \'low\';\n  else if (q.indexOf(\'cao\') !== -1 || q.indexOf(\'khong ngan\') !== -1) profile.budget = \'high\';\n\n  // Priorities\n  var prios = [];\n  if (q.indexOf(\'visa\') !== -1) prios.push(\'visa\');\n  if (q.indexOf(\'viec lam\') !== -1 || q.indexOf(\'job\') !== -1) prios.push(\'job\');\n  if (q.indexOf(\'chi phi\') !== -1 || q.indexOf(\'cost\') !== -1) prios.push(\'cost\');\n  if (q.indexOf(\'e7\') !== -1) prios.push(\'e7\');\n  if (q.indexOf(\'hoc it\') !== -1) prios.push(\'low-study\');\n  if (q.indexOf(\'uy tin\') !== -1) prios.push(\'prestige\');\n  if (prios.length > 0) profile.priorities = prios;\n\n  return profile;\n}\n\n// REGION_LABELS đã được định nghĩa global trong api-loader.js'

    old_region = '\n// REGION_LABELS đã được định nghĩa global trong api-loader.js'
    new_region = func_def

    content = content.replace(old_region, new_region)

    with open(advisor_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("FIXED: parseQuickProfile moved outside PRIORITY_LABELS object")
    print("DONE")
else:
    print("parseQuickProfile not inside PRIORITY_LABELS - no fix needed")
