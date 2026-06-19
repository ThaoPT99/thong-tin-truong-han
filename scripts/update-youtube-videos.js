#!/usr/bin/env node
/**
 * Cập nhật video_url và video_youtube_id từ YouTube cho 18 trường
 * Chạy: node scripts/update-youtube-videos.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

// YouTube video data cho 18 trường
const SCHOOL_VIDEOS = {
  'cd-suncheon-jeil': { id: 'mua0KiVG_ok', title: '순천제일대학교 홍보영상' },
  'dh-busan-catholic': { id: 'n1TR_jnKlqs', title: '부산가톨릭대학교 개교 60주년 홍보' },
  'dh-catholic-kwandong': { id: 'xrbkiw3GTvM', title: '가톨릭관동대학교 70주년 기념 공식 홍보영상' },
  'dh-daewon': { id: 'Qcui82cohB4', title: '대원대학교 홍보영상' },
  'dh-dongeui': { id: 'EVspM9Kpw_I', title: '동의대학교 2019 공식 홍보영상' },
  'dh-gimhae': { id: 'F7yRdJEyvd4', title: '2024학년도 김해대학교 공식 홍보영상' },
  'dh-gwangju': { id: '18R7PuUszhs', title: '2025학년도 광주대학교 홍보영상' },
  'dh-induk': { id: 'o6kt2V8GaBA', title: '2025학년도 인덕대학교 대표 홍보영상' },
  'dh-jeonju': { id: 'DLkiMasLb3o', title: 'Welcome to Jeonju University | Study in Korea' },
  'dh-nambu': { id: '7KnbZz5KT4c', title: '남부대학교 소개' },
  'dh-nu-sinh-busan': { id: 'Te_5wn3_ekU', title: '부산여자대학교 대학홍보영상' },
  'dh-nu-sinh-dongduk': { id: '2BQlcfA0yMI', title: '2026년 동덕여자대학교 공식 홍보영상' },
  'dh-nu-sinh-kyungin': { id: 'Tu4Z6SDDleQ', title: '경인여자대학교 홍보영상' },
  'dh-osan': { id: 'Cz18VV91EvI', title: 'Introduction to Osan University Facilities' },
  'dh-sangmyung': { id: 'OG9F7sETG3M', title: '2026 상명대학교 홍보영상' },
  'dh-sengmyung': { id: '0TCsIPRjYQw', title: '2025 세명대학교 홍보영상' },
  'dh-y-te-dongnam': { id: 'ssuiG3ITuL8', title: '2024 동남보건대학교 홍보영상' },
  'dh-yeonsung': { id: 'uOYHoDm_oMY', title: '2022 연성대학교 공식홍보영상' },
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
  console.log('=== CẬP NHẬT YOUTUBE VIDEO CHO 18 TRƯỜNG ===\n');

  console.log('Lấy danh sách trường...');
  const schools = await getSchoolList();
  console.log(`Tổng: ${schools.length} trường\n`);

  let success = 0;
  let failed = 0;

  for (const school of schools) {
    const slug = school.slug;
    const name = school.name || slug;
    const video = SCHOOL_VIDEOS[slug];

    if (!video) {
      continue;
    }

    try {
      const data = {
        videoYoutubeId: video.id,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
        videoTitle: video.title,
      };
      console.log(`  📝 ${name} (${slug}): ${video.id} — ${video.title.substring(0, 50)}`);
      await updateSchool(school.id, data);
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
