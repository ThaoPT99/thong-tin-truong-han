# -*- coding: utf-8 -*-
"""Update video links for all schools"""
import json
import re

# Map school order to YouTube videos (15 schools)
school_videos = {
    'dh-osan': 'noj5lFV5Feg',
    'dh-induk': 'VNYkbySK0vg',
    'dh-yeonsung': 'ICVUWdCIUU4',
    'dh-sangmyung': 'umdE4TXwaXI',
    'dh-nu-sinh-kyungin': 'Vup7-eqakBE',
    'dh-y-te-dongnam': '2JCs1paO_Zo',
    'dh-dongeui': 'xqT-_-3l8Yk',
    'cd-suncheon-jeil': 'kwbtipY_jis',
    'dh-nu-sinh-busan': 'dBuO1y3L1U4',
    'dh-busan-catholic': 'Uw413FDFQG8',
    'dh-gimhae': 'FTKBjPUMesA',
    'dh-gwangju': '2GJEzQd1w_E',
    'dh-nambu': 'SfPG7mkLXiw',
    'dh-daewon': 'Qcui82cohB4',
    'dh-sengmyung': 'c9e0v_zZOFI',
}

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse JSON
start = content.find('SCHOOLS_DATA = ') + 15
end = content.find(';', start)
data = json.loads(content[start:end])

# Update each school's video
for school_id, video_id in school_videos.items():
    if school_id in data:
        data[school_id]['video']['youtubeId'] = video_id
        data[school_id]['video']['url'] = 'https://www.youtube.com/watch?v=' + video_id

# Write back
header = """// Dữ liệu các trường Hàn - Tự động sinh từ Excel
// File nguồn: Thong_tin_truong_Han_ky_thang_3_2027.xlsx
// Chạy: python excel_to_data.py

const SEMESTER_INFO = {"ky": "3", "nam": "2027", "title": "DANH SÁCH TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027"};

"""

new_content = header + 'const SCHOOLS_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';'

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated video links for 15 schools:')
for school_id, video_id in school_videos.items():
    name = data[school_id]['name'] if school_id in data else school_id
    print(f'  {name}: {video_id}')
