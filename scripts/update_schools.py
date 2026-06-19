# -*- coding: utf-8 -*-
"""Update school data in Supabase via admin API"""
import json
import subprocess
import sys
import os

# Set UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E"

# School website URLs from official sources
SCHOOL_WEBSITES = {
    "dh-osan": "https://www.osan.ac.kr",
    "dh-induk": "https://www.induk.ac.kr",
    "dh-yeonsung": "https://www.yeonsung.ac.kr",
    "dh-sangmyung": "https://www.smu.ac.kr",
    "dh-nu-sinh-kyungin": "https://www.kiwu.ac.kr",
    "dh-y-te-dongnam": "https://www.dongnam.ac.kr",
    "dh-dongeui": "https://www.deu.ac.kr",
    "cd-suncheon-jeil": "https://www.suncheon.ac.kr",
    "dh-nu-sinh-busan": "https://www.bwc.ac.kr",
    "dh-busan-catholic": "https://www.cup.ac.kr",
    "dh-gimhae": "https://www.gimhae.ac.kr",
    "dh-gwangju": "https://www.gwangju.ac.kr",
    "dh-nambu": "https://www.nambu.ac.kr",
    "dh-daewon": "https://www.daewon.ac.kr",
    "dh-sengmyung": "https://www.semyung.ac.kr",
    "dh-nu-sinh-dongduk": "https://www.dongduk.ac.kr",
    "dh-catholic-kwandong": "https://www.cku.ac.kr",
    "dh-jeonju": "https://www.jj.ac.kr",
}

# School IDs from database
SCHOOL_IDS = {
    "cd-suncheon-jeil": "5775c5ab-1723-4567-b11a-6fa73ce58a3a",
    "dh-busan-catholic": "07a8b215-8f4d-4726-855a-13a574a1f761",
    "dh-catholic-kwandong": "6c0e70b2-6b62-411e-8a7c-2148100143cc",
    "dh-daewon": "7fde9700-a3d2-48ce-bf71-5e0925c5346c",
    "dh-dongeui": "c8641676-ed82-48ee-b0e0-3166d77f3fc4",
    "dh-gimhae": "bc0ed894-4b7d-4a59-abb9-e8e334661586",
    "dh-gwangju": "c7a30b2b-1ed7-4809-b02a-024d8b03d897",
    "dh-induk": "b6d536c2-e7d3-447c-ac7a-d1035df50818",
    "dh-jeonju": "19234153-c8c4-4dd8-b2e0-bda8f54487cf",
    "dh-nambu": "442aaab9-9817-4a8a-99ff-21a36c04a3d5",
    "dh-nu-sinh-busan": "0ca5272d-282b-4082-80bd-45278af2ba25",
    "dh-nu-sinh-dongduk": "cee92c42-3a48-41ec-85b2-6ea2a5db83cd",
    "dh-nu-sinh-kyungin": "cdaea1e4-6148-46f0-86dd-2742da51bde7",
    "dh-osan": "b61c45e9-f85a-4f9e-a02f-d03edcdedb07",
    "dh-sangmyung": "bcf645cf-f283-4f0f-8a06-72ccab1d576d",
    "dh-sengmyung": "8338a320-4cd7-405a-9af4-2de27a70ba77",
    "dh-y-te-dongnam": "99d4fd71-98af-4f8b-823a-f7de876bc8b1",
    "dh-yeonsung": "6053a52d-d87e-49ee-95d4-68bf1839e860",
}


def curl_get(url, headers=None):
    """Make a GET request"""
    cmd = ["curl", "-s", url]
    if headers:
        for h in headers:
            cmd.extend(["-H", h])
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    return json.loads(result.stdout)


def curl_put(url, data, headers=None):
    """Make a PUT request"""
    cmd = ["curl", "-s", "-X", "PUT", url, "-H", "Content-Type: application/json"]
    if headers:
        for h in headers:
            cmd.extend(["-H", h])
    cmd.extend(["-d", json.dumps(data, ensure_ascii=False)])
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    try:
        return json.loads(result.stdout)
    except:
        return {"error": result.stdout[:500]}


def update_school(slug):
    """Update a single school's data"""
    school_id = SCHOOL_IDS.get(slug)
    if not school_id:
        print(f"  [SKIP] No ID for {slug}")
        return False
    
    website = SCHOOL_WEBSITES.get(slug, "")
    
    # Get current full data from public API
    url = f"https://thongtintruonghan.vercel.app/api/schools?slug={slug}"
    data = curl_get(url)
    s = data.get('data', {})
    
    if not s:
        print(f"  [FAIL] Could not get data for {slug}")
        return False
    
    name = s.get('name', slug)
    
    # Build update payload preserving all current data
    # Helper to extract text from child records
    def extract_texts(items):
        if not items:
            return []
        result = []
        for item in items:
            if isinstance(item, dict):
                result.append(item.get('text', ''))
            else:
                result.append(str(item))
        return result
    
    payload = {
        "name": s.get("name", ""),
        "nameKr": s.get("name_kr", ""),
        "nameEn": s.get("name_en", ""),
        "system": s.get("system", ""),
        "quota": s.get("quota", 0),
        "region": s.get("region", ""),
        "location": s.get("location", ""),
        "intro": s.get("intro", ""),
        "tuition": s.get("tuition", ""),
        "insurance": s.get("insurance", ""),
        "ktx": s.get("ktx", ""),
        "schedule": s.get("schedule", ""),
        "documentsNote": s.get("documents_note", ""),
        "mou": s.get("mou", ""),
        "website": website,
        "catalogUrl": s.get("catalog_url", ""),
        "invoiceUrl": s.get("invoice_url", ""),
        "videoUrl": s.get("video_url", ""),
        "videoYoutubeId": s.get("video_youtube_id", ""),
        "videoTitle": s.get("video_title", ""),
        "imageMain": s.get("image_main", "images/placeholder.svg"),
        "imageCatalog": s.get("image_catalog", ""),
        "imageLocation": s.get("image_location", ""),
        "imageInvoice": s.get("image_invoice", ""),
        "conditions": extract_texts(s.get("conditions")),
        "majors": extract_texts(s.get("majors")),
        "advantages": extract_texts(s.get("advantages")),
        "conversion": extract_texts(s.get("conversion")),
        "documents": extract_texts(s.get("documents")),
        "partners": [{"code": p.get("code", ""), "name": p.get("name", ""), "nameKr": p.get("name_kr", "")} for p in (s.get("partners") or [])],
    }
    
    # Handle advisor profile
    ap = s.get("advisorProfile")
    if ap:
        payload["advisorProfile"] = {
            "gender": ap.get("gender", "all"),
            "minGpa": float(ap.get("min_gpa", 5.0)),
            "maxAbsences": int(ap.get("max_absences", 30)),
            "costLevel": int(ap.get("cost_level", 3)),
            "visaChance": int(ap.get("visa_chance", 3)),
            "jobOpportunity": int(ap.get("job_opportunity", 3)),
            "e7Opportunity": int(ap.get("e7_opportunity", 3)),
            "studyLoad": int(ap.get("study_load", 3)),
            "interviewDifficulty": int(ap.get("interview_difficulty", 2)),
            "tags": ap.get("tags", []),
        }
    
    # Make PUT request
    auth_header = f"Authorization: Bearer {TOKEN}"
    put_url = f"https://thongtintruonghan.vercel.app/api/admin/schools?id={school_id}"
    response = curl_put(put_url, payload, [auth_header])
    
    if response.get("success"):
        print(f"  [OK] {name} ({slug}) - website={website}")
        return True
    else:
        err = response.get("error", str(response)[:100])
        print(f"  [FAIL] {name} ({slug}): {err}")
        return False


def main():
    print("=" * 60)
    print("Cập nhật dữ liệu trường Hàn Quốc")
    print("=" * 60)
    print()
    
    success = 0
    fail = 0
    
    for slug in sorted(SCHOOL_IDS.keys()):
        print(f"\n>>> {slug}...")
        if update_school(slug):
            success += 1
        else:
            fail += 1
            print(f"    Failed to update {slug}")
    
    print()
    print("=" * 60)
    print(f"Kết quả: {success}/{success + fail} trường cập nhật thành công")
    if fail:
        print(f"Thất bại: {fail} trường")
    print("=" * 60)


if __name__ == "__main__":
    main()
