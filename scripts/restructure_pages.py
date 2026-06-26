#!/usr/bin/env python3
"""Restructure pages: split compare table into 2, reorder before checklist, update page numbers."""
import sys

FILEPATH = 'public/sach-tuyen-sinh-doi-tac.html'

with open(FILEPATH, 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

print(f"Total lines: {len(lines)}")

# === PAGE STRUCTURE (0-indexed) ===
# Checklist (PHẦN 6): lines 3827-3872 (pages 57-59)
# Compare table (PHẦN 5): lines 3873-4072 (page 60)
# Remaining (PHẦN 7, Phụ lục, Back cover): lines 4073-4188

chk_s = 3827
chk_e = 3872
ct_s  = 3873
ct_e  = 4072
rest_s = 4073
rest_e = len(lines) - 1

# Verify page-nums
for label, s, e in [("Checklist", chk_s, chk_e), ("CompareTable", ct_s, ct_e), ("Remaining", rest_s, rest_e)]:
    for i in range(s, e+1):
        if 'page-num' in lines[i]:
            print(f"  {label}: {lines[i].strip()}")

# === SPLIT COMPARE TABLE AT SCHOOL 9/10 ===
ct_lines = lines[ct_s:ct_e+1]
split_idx = 101  # School 10 starts here

part1 = ct_lines[:split_idx]

print(f"Part1: {len(part1)} lines")
print(f"Part2: {len(ct_lines) - split_idx} lines")

# Find key element positions
legend_s = footer_s = thead_start = thead_end = None
for i, l in enumerate(ct_lines):
    if 'table-legend' in l:
        legend_s = i
    if 'page-footer-bar' in l:
        footer_s = i
    if '<thead>' in l:
        thead_start = i

for i in range(thead_start, len(ct_lines)):
    if '</thead>' in ct_lines[i]:
        thead_end = i + 1
        break

print(f"Legend idx={legend_s}, Footer idx={footer_s}, Thead [{thead_start}-{thead_end-1}]")

# Extract components
page_open     = ct_lines[0:1]    # <div class="page">
page_header   = ct_lines[1:5]    # header div + ph-left + ph-right + side-bar
body_open     = ct_lines[5:6]    # <div class="page-body">
section_title = ct_lines[6:8]    # PHẦN 5 badge + page-title
table_open    = [ct_lines[8]]     # <table class="compare-table">
thead_lines   = ct_lines[thead_start:thead_end]
tbody_open    = ct_lines[thead_end:thead_end+1]
schools_1_9   = ct_lines[thead_end+1:split_idx]  # <tr> rows for schools 1-9
schools_10_18 = ct_lines[split_idx:legend_s]     # <tr> rows for schools 10-18
legend_lines  = ct_lines[legend_s:footer_s]       # table-legend div
footer_lines  = ct_lines[footer_s:]               # page-footer-bar + page-num + close divs

print(f"Schools 1-9: {len(schools_1_9)} lines")
print(f"Schools 10-18: {len(schools_10_18)} lines")
print(f"Legend: {len(legend_lines)} lines")
print(f"Footer: {len(footer_lines)} lines")

# Check first/last school row
print(f"\nFirst school row: {schools_1_9[0][:60]}")
print(f"Last school row (school 9): {schools_1_9[-1][:60]}")
print(f"First school 10: {schools_10_18[0][:60]}")

# ========== ASSEMBLE NEW PAGES ==========

def make_footer(pagenum, ft_lines):
    """Create footer with updated page number."""
    result = []
    for l in ft_lines:
        if 'page-num' in l:
            result.append(f'  <div class="page-num">{pagenum}</div>')
        else:
            result.append(l)
    return result

def make_header():
    """Create standard page header."""
    h = []
    h.append('<div class="page">')
    h.extend(page_header)
    h.extend(body_open)
    return h

# ---- PAGE 58: Compare table (schools 1-9) ----
p1 = []
p1.append('<div class="page">')
p1.extend(page_header)
p1.extend(body_open)
p1.extend(section_title)
p1.append('    <table class="compare-table">')
p1.extend(thead_lines)
p1.extend(tbody_open)
p1.extend(schools_1_9)
p1.append('      </tbody>')
p1.append('    </table>')
p1.extend(legend_lines)
p1.append('  </div>')  # close page-body
p1.extend(make_footer(58, footer_lines))

print(f"\nPage 58 has {len(p1)} lines")

# ---- PAGE 59: Compare table (schools 10-18) ----
p2 = []
p2.append('<div class="page">')
p2.extend(page_header)
p2.extend(body_open)
p2.append('      <h4 class="section-subtitle" style="margin-top:2px;">Bảng so sánh các trường <span style="font-weight:400;color:var(--gray);font-size:12px;">(tiếp)</span></h4>')
p2.append('    <table class="compare-table">')
p2.extend(thead_lines)
p2.extend(tbody_open)
p2.extend(schools_10_18)
p2.append('      </tbody>')
p2.append('    </table>')
p2.extend(legend_lines)
p2.append('  </div>')  # close page-body
p2.extend(make_footer(59, footer_lines))

print(f"Page 59 has {len(p2)} lines")

# ========== REASSEMBLE FILE ==========
# Order: page 58 (compare table 1) + page 59 (compare table 2) + checklist (moved) + remaining

# Checklist pages (need new page-num 60-62)
chk_lines = lines[chk_s:chk_e+1]

# Update page-nums in checklist: 57->60, 58->61, 59->62
# Map old page-nums to new
old_new_map = {57: 60, 58: 61, 59: 62}
new_checklist = []
for l in chk_lines:
    for old, new in old_new_map.items():
        if f'page-num">{old}<' in l or f'page-num">{old}</div>' in l:
            l = l.replace(f'>{old}<', f'>{new}<').replace(f'>{old}</div>', f'>{new}</div>')
            break
    # Also fix the TOC page reference for "Checklist" → now page 61 (was 59)
    new_checklist.append(l)

# Remaining pages (need page-nums shifted +2: 60->62, 61->63)
old_new_map2 = {60: 62, 61: 63}
new_remaining = []
for l in lines[rest_s:rest_e+1]:
    for old, new in old_new_map2.items():
        if f'page-num">{old}<' in l or f'page-num">{old}</div>' in l:
            l = l.replace(f'>{old}<', f'>{new}<').replace(f'>{old}</div>', f'>{new}</div>')
            break
    new_remaining.append(l)

# Build new file
new_lines = lines[:chk_s]  # Everything before the restructured section
new_lines.extend(p1)       # New page 58 - Compare table (1-9)
new_lines.extend(p2)       # New page 59 - Compare table (10-18)
new_lines.extend(new_checklist)  # Moved checklist (pages 60-62)
new_lines.extend(new_remaining)  # Remaining content (pages 63+)

print(f"\nOriginal file: {len(lines)} lines")
print(f"New file: {len(new_lines)} lines")

# ========== UPDATE TOC ==========
# Find TOC entries and update page numbers
# "Bảng so sánh các trường" → tr. 58 (stays 58 since it's now first)
# "Checklist hồ sơ Visa D2-6" → tr. 59→61 (shifted by +2)
# "Lưu ý dành cho đối tác" → tr. 61→63
# "Phụ lục" → tr. 62→64

# Actually let's find and update each TOC entry
# We'll do string-based replacement on the new file content
new_content = '\n'.join(new_lines)

# TOC page updates
updates = [
    ('tr. 58', 'PHẦN 5', 'tr. 58'),  # Compare table stays page 58
    ('tr. 59', 'PHẦN 6', 'tr. 61'),  # Checklist moves to page 61
    ('tr. 61', 'PHẦN 7', 'tr. 63'),  # Lưu ý moves to page 63
    ('tr. 62', 'Phụ lục', 'tr. 64'),  # Phụ lục moves to page 64
]

# For safety, only update TOC entries (they appear before page 58)
# Find where page 58 starts (first occurrence of page-num 58)
toc_end = new_content.find('<div class="page-num">58</div>')
if toc_end == -1:
    toc_end = len(new_content) // 2  # Fallback

# Only do TOC replacements in the first half of the file (before the new content pages)
toc_section = new_content[:toc_end]
rest_section = new_content[toc_end:]

# Update checklist page ref in TOC: "tr. 59" in context of "Checklist"
# We need to be careful - only change TOC entries, not actual page-nums
# The TOC lines contain things like "toc-item-page">tr. 59<"
import re

toc_section = re.sub(r'(Checklist[^<]*?tr\. )59', r'\1'+'61', toc_section)
toc_section = re.sub(r'(Lưu ý[^<]*?tr\. )61', r'\1'+'63', toc_section)
toc_section = re.sub(r'(Phụ lục[^<]*?tr\. )62', r'\1'+'64', toc_section)

new_content = toc_section + rest_section

# Write back
with open(FILEPATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n=== WRITE COMPLETE ===")
print(f"Output: {len(new_content.split(chr(10)))} lines")


PYEOF
