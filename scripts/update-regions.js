#!/usr/bin/env node
/**
 * Cập nhật region cho tất cả trường và ktx cho Dongnam
 * 
 * Chạy: node scripts/update-regions.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

// Region mapping based on location data
const SCHOOL_REGIONS = {
  'cd-suncheon-jeil': 'jeollanam',           // Suncheon, Jeollanam-do
  'dh-busan-catholic': 'busan',               // Busan
  'dh-catholic-kwandong': 'gangwon',          // Gangneung, Gangwon-do
  'dh-daewon': 'chungcheongbuk',              // Jecheon, Chungcheongbuk-do
  'dh-dongeui': 'busan',                      // Busan
  'dh-gimhae': 'gyeongsangnam',               // Gimhae, Gyeongsangnam-do
  'dh-gwangju': 'gwangju',                    // Gwangju
  'dh-induk': 'seoul',                        // Seoul
  'dh-jeonju': 'jeollabuk',                   // Jeonju
  'dh-nambu': 'gwangju',                      // Gwangju
  'dh-nu-sinh-busan': 'busan',                // Busan
  'dh-nu-sinh-dongduk': 'seoul',              // Seoul
  'dh-nu-sinh-kyungin': 'incheon',            // Incheon
  'dh-osan': 'gyeonggi',                      // Osan, Gyeonggi-do
  'dh-sangmyung': 'seoul',                    // Seoul
  'dh-sengmyung': 'chungcheongbuk',           // Jecheon, Chungcheongbuk-do
  'dh-y-te-dongnam': 'gyeonggi',              // Suwon, Gyeonggi-do
  'dh-yeonsung': 'gyeonggi',                  // Anyang, Gyeonggi-do
};

// Additional KTX info for Dongnam (currently empty)
const SCHOOL_KTX = {
  'dh-y-te-dongnam': '행복기숙사 (Happy Dormitory): ~250,000 KRW/tháng\nKTX trong khuôn viên trường, 8 tầng, ~418 chỗ\nChi phí có thể thay đổi theo từng kỳ',
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
  console.log('Lấy danh sách trường...');
  const schools = await getSchoolList();
  console.log(`Tổng: ${schools.length} trường\n`);

  let success = 0;
  let failed = 0;

  for (const school of schools) {
    const slug = school.slug;
    const name = school.name || slug;
    const updateData = {};

    // Add region
    const region = SCHOOL_REGIONS[slug];
    if (region) {
      updateData.region = region;
    }

    // Add KTX for Dongnam
    const ktx = SCHOOL_KTX[slug];
    if (ktx) {
      updateData.ktx = ktx;
    }

    if (Object.keys(updateData).length === 0) {
      console.log(`  ⏭️  ${name} (${slug}) — Không có dữ liệu cập nhật, bỏ qua`);
      continue;
    }

    try {
      const changes = Object.keys(updateData).join(', ');
      console.log(`  📝 ${name} (${slug}) — Cập nhật: ${changes}...`);
      await updateSchool(school.id, updateData);
      console.log(`  ✅ ${name} — Thành công`);
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
