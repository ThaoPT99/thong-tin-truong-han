#!/usr/bin/env node
/**
 * Cập nhật catalog_url từ link PDF trực tiếp trên website các trường
 * Cho 6 trường: Gwangju, Induk, Nữ Busan, Sengmyung, Dongnam, YeonSung
 * Chạy: node scripts/update-catalog-urls.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

const SCHOOL_CATALOGS = {
  'dh-gwangju': 'https://ie.gwangju.ac.kr/pages/gw_ie/file/file_2026_3.pdf',
  'dh-induk': 'https://ipsi.induk.ac.kr/ajax/CM_BB01_SVC/CM_BB01_R97.do?TABLE_ID=AP_BBS&PK_COL=46063&ATCH_SN=1&isTemp=false',
  'dh-nu-sinh-busan': 'https://www.bwc.ac.kr/ipsi/upload/2027_guidelines.pdf',
  'dh-sengmyung': 'https://biz.semyung.ac.kr/cmm/fms/FileDown.do?atchFileId=FILE_000000000223232&fileSn=0',
  'dh-y-te-dongnam': 'https://www.dongnam.ac.kr/bbs/ilec/243/VnpTRXpmaWJwL0JtVGlHK0tuVGtZQT09/download.do',
  'dh-yeonsung': 'https://www.yeonsung.ac.kr/sites/en/file/23ys_ko_school.pdf',
};

async function getSchoolList() {
  const res = await fetch(`${API_BASE}/api/schools`);
  const json = await res.json();
  return json.data || [];
}

async function updateSchool(schoolId, data) {
  const res = await fetch(`${API_BASE}/api/admin/schools?id=${schoolId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${json.error || JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  console.log('=== CẬP NHẬT CATALOG_URL TỪ WEB ===\n');
  
  console.log('Lấy danh sách trường...');
  const schools = await getSchoolList();
  console.log(`Tổng: ${schools.length} trường\n`);

  let success = 0;
  let failed = 0;

  for (const school of schools) {
    const slug = school.slug;
    const name = school.name || slug;
    const catalogUrl = SCHOOL_CATALOGS[slug];

    if (!catalogUrl) {
      continue;
    }

    try {
      console.log(`  📝 ${name} (${slug}): ${catalogUrl.substring(0, 70)}...`);
      await updateSchool(school.id, { catalogUrl: catalogUrl });
      console.log(`  ✅ ${name} — Cập nhật thành công`);
      success++;
    } catch (err) {
      console.log(`  ❌ ${name} — Lỗi: ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`✅ Thành công: ${success}`);
  console.log(`❌ Thất bại: ${failed}`);
}

main().catch(console.error);
