# -*- coding: utf-8 -*-
"""Verify Excel video links"""
import openpyxl
import json

wb = openpyxl.load_workbook('Thong_tin_truong_Han_ky_thang_3_2027.xlsx')
results = []
for ws in wb.worksheets:
    v = ws.cell(29, 2).value
    if v and 'youtube' in str(v):
        results.append({'sheet': ws.title, 'video': v})

with open('verify.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Found", len(results), "videos with YouTube links")
