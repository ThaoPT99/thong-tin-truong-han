#!/usr/bin/env node
/**
 * Cập nhật majors cho 18 trường từ dữ liệu website chính thức
 * 
 * Chạy: node scripts/update-majors-from-web.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

// School slugs and their official majors from university websites
const SCHOOL_MAJORS = {
  'dh-osan': [
    '미래공학부 - 기계공학과',
    '미래공학부 - 안전보건관리과',
    '미래공학부 - 전기공학과',
    '미래공학부 - 반도체장비과',
    '미래공학부 - AI반도체계열',
    '자동차학부 - 자동차공학계열',
    '자동차학부 - 미래전기자동차전공',
    '자동차학부 - 자동차튜닝과',
    '크리에이티브콘텐츠학부 - 디지털콘텐츠디자인계열',
    '크리에이티브콘텐츠학부 - 컴퓨터소프트웨어과',
    '휴먼케어학부 - 건강재활과',
    '휴먼케어학부 - 소방안전관리과',
    '휴먼케어학부 - 반려동물관리과',
    '휴먼케어학부 - 스포츠지도과',
    '사회서비스학부 - 경찰행정학과',
    '사회서비스학부 - 유아교육과',
    '사회서비스학부 - 사회복지상담과',
    '사회서비스학부 - 미디어마케팅경영과',
    '사회서비스학부 - 세무회계과',
    '사회서비스학부 - 평생학습학과',
    '호텔관광서비스학부 - 호텔조리계열',
    '호텔관광서비스학부 - 항공서비스과',
    '호텔관광서비스학부 - 호텔관광경영과',
    '호텔관광서비스학부 - 카페바리스타과',
    'K-뷰티예술학부 - 뷰티코스메틱계열',
    'K-뷰티예술학부 - 준오헤어시그니처과',
    'K-뷰티예술학부 - 패션스타일리스트과',
    '문화예술학부 - 공연축제콘텐츠과',
    '문화예술학부 - 보컬·K-POP콘텐츠과',
    '문화예술학부 - e스포츠과',
    '보건의료학부 - 동물보건과',
    '보건의료학부 - 작업치료과',
    '군사학부 - 전투드론과',
    '자유전공학부 - 자유전공학과',
  ],
  'dh-induk': [
    'AI융합학부 - 컴퓨터전자공학과',
    'AI융합학부 - 산업경영공학과',
    'AI융합학부 - 컴퓨터소프트웨어학과',
    'AI융합학부 - 메카트로닉스공학과',
    'AI융합학부 - 정보통신공학과',
    'AI융합학부 - 기계자동차공학과',
    'AI융합학부 - 기계공학과',
    '스마트시티학부 - 토목공학과',
    '스마트시티학부 - 건축학과',
    '스마트시티학부 - 스마트건설방재학과',
    '크리에이티브디자인학부 - 디지털산업디자인학과',
    '크리에이티브디자인학부 - 주얼리디자인학과',
    '크리에이티브디자인학부 - 시각디자인학과',
    '크리에이티브디자인학부 - 멀티미디어디자인학과',
    '크리에이티브디자인학부 - 리빙세라믹디자인학과',
    '융합미디어콘텐츠학부 - 방송영상미디어학과',
    '융합미디어콘텐츠학부 - 연기예술학과',
    '융합미디어콘텐츠학부 - 웹툰만화학과',
    '융합미디어콘텐츠학부 - 게임&VR콘텐츠디자인학과',
    '서비스경영학부 - 스마트경영·비서학과',
    '서비스경영학부 - 관광서비스경영학과',
    '서비스경영학부 - 사회복지학과',
    '서비스경영학부 - 세무회계학과',
    '서비스경영학부 - 글로벌항공서비스학과',
    '글로벌학부 - 비즈니스중국어학과',
    'K-뷰티아트학부 - 방송메이크업학과',
    'K-뷰티아트학부 - 방송헤어미용예술학과',
    '자율전공학부',
    '외국인전담학과 - 한국어관광서비스학과',
  ],
  'dh-yeonsung': [
    '스마트ICT계열 - 전자공학과',
    '스마트ICT계열 - 전기과',
    '스마트ICT계열 - 컴퓨터소프트웨어과',
    '라이프디자인계열 - 건축과',
    '라이프디자인계열 - 실내건축과',
    '라이프디자인계열 - 패션디자인비즈니스과',
    '라이프디자인계열 - 뷰티스타일리스트과',
    '문화콘텐츠계열 - 게임콘텐츠과',
    '문화콘텐츠계열 - 웹툰만화콘텐츠과',
    '문화콘텐츠계열 - 영상콘텐츠과',
    '문화콘텐츠계열 - 시각디자인과',
    '문화콘텐츠계열 - K-POP과',
    '사회·교육계열 - 경영학과',
    '사회·교육계열 - 세무회계과',
    '사회·교육계열 - 국방군사학과',
    '사회·교육계열 - 경찰경호보안과',
    '사회·교육계열 - 사회복지과',
    '사회·교육계열 - 유아교육과',
    '보건생명계열 - 간호학과',
    '보건생명계열 - 치위생과',
    '보건생명계열 - 치기공과',
    '보건생명계열 - 작업치료과',
    '보건생명계열 - 응급구조과',
    '보건생명계열 - 보건의료행정과',
    '보건생명계열 - 스포츠재활과',
    '보건생명계열 - 식품영양학과',
    '보건생명계열 - 반려동물보건과',
    '보건생명계열 - 반려동물산업과',
    '관광조리계열 - 항공서비스과',
    '관광조리계열 - 관광영어과',
    '관광조리계열 - 호텔관광과',
    '관광조리계열 - 호텔외식조리과',
    '관광조리계열 - 카페·베이커리과',
    '자유전공학과',
  ],
  'dh-sangmyung': [
    'Khoa Kinh doanh Quốc tế (International Business)',
    'Khoa Công nghệ Thông tin (IT)',
    'Khoa Thiết kế (Design)',
  ],
  'dh-nu-sinh-kyungin': [
    '간호복지학부 (Nursing & Welfare)',
    '관광외식학부 (Tourism & Food)',
    '사회행정학부 (Society & Administration)',
    '아동교육학부 (Child Education)',
    '디자인학부 (Design)',
    '정보학부 (Information)',
  ],
  'dh-y-te-dongnam': [
    '방사선과 (Radiology)',
    '간호학과 (Nursing)',
    '물리치료과 (Physical Therapy)',
    '뷰티케어과 (Beauty Care)',
    '관광서비스과 (Tourism Service)',
    '식품영양과 (Food & Nutrition)',
  ],
  'dh-dongeui': [
    'Khoa Cơ khí (Mechanical Engineering)',
    'Khoa Du lịch Quốc tế (International Tourism)',
    'Khoa Quản trị Kinh doanh (Business Administration)',
    'Khoa Kỹ thuật Ô tô (Automotive Engineering)',
  ],
  'cd-suncheon-jeil': [
    '스마트건설환경과 (Smart Construction & Environment)',
    '건축인테리어과 (Architecture & Interior)',
    '기계과 (Mechanical)',
    '전기자동화과 (Electrical Automation)',
    '보건행정과 (Health Administration)',
  ],
  'dh-nu-sinh-busan': [
    '아동학부 - 유아교육 (Early Childhood Education)',
    '아동학부 - 아동예술무용 (Children\'s Art & Dance)',
    '관광학부 - 바리스타 (Barista)',
    '관광학부 - 외식조리 (Culinary)',
    '관광학부 - 제과제빵 (Baking)',
    '보건복지학부 - 간호 (Nursing)',
    '보건복지학부 - 안경광학 (Optometry)',
    '보건복지학부 - 치위생 (Dental Hygiene)',
    '보건복지학부 - 미용 (Beauty)',
    '보건복지학부 - 사회복지 (Social Welfare)',
    '보건복지학부 - 동물보건 (Animal Health)',
    '보건복지학부 - 문헌정보 (Library & Information)',
    '평생교육학부 - 스마트건강운동 (Smart Health Exercise)',
    '평생교육학부 - 생활문화 (Lifestyle & Culture)',
    '평생교육학부 - 시니어모델 (Senior Model)',
  ],
  'dh-busan-catholic': [
    'Nursing (간호학과)',
    'Health Sciences (보건과학)',
    'Computer Science (컴퓨터공학)',
    'Social Welfare (사회복지학)',
    'Counseling Psychology (상담심리학)',
    'Business Administration (경영학)',
  ],
  'dh-gimhae': [
    'Khoa Cơ khí (Mechanical Engineering)',
    'Khoa Quản trị Kinh doanh (Business Administration)',
    'Khoa Kỹ thuật Ô tô (Automotive Engineering)',
    'Khoa Điện - Điện tử (Electrical & Electronic Engineering)',
  ],
  'dh-gwangju': [
    'Khoa Quản trị Kinh doanh (Business Administration)',
    'Khoa Công nghệ Thông tin (IT)',
    'Khoa Kỹ thuật Công nghiệp (Industrial Engineering)',
    'Khoa Điều dưỡng (Nursing)',
  ],
  'dh-nambu': [
    'Khoa Quản trị Kinh doanh (Business Administration)',
    'Khoa Kỹ thuật Công nghiệp (Industrial Engineering)',
    'Khoa Công nghệ Thực phẩm (Food Technology)',
    'Khoa Thiết kế (Design)',
  ],
  'dh-daewon': [
    '공학계열 - 전기전자과 (Electrical & Electronic)',
    '공학계열 - 철도건설과 (Railway Construction)',
    '공학계열 - 멀티미디어과 (Multimedia)',
    '자연과학계열 - 간호학부 (Nursing)',
    '자연과학계열 - 물리치료과 (Physical Therapy)',
    '자연과학계열 - 방사선과 (Radiology)',
    '자연과학계열 - 응급구조과 (Emergency Medical)',
    '자연과학계열 - 치위생과 (Dental Hygiene)',
    '자연과학계열 - 뷰티과 (Beauty)',
    '자연과학계열 - 보건의료행정과 (Healthcare Admin)',
    '자연과학계열 - 재활운동과 (Rehabilitation Exercise)',
    '자연과학계열 - 바이오메디컬과 (Biomedical)',
    '자연과학계열 - 호텔조리제빵과 (Hotel Culinary)',
    '인문사회계열 - 유아교육과 (Early Childhood Ed)',
    '인문사회계열 - 호텔관광경영과 (Hotel Tourism)',
    '인문사회계열 - 사회복지과 (Social Welfare)',
    '인문사회계열 - 경찰경호행정과 (Police Security)',
    '인문사회계열 - 문헌정보과 (Library & Info)',
    'K-글로벌학부 (K-Global)',
  ],
  'dh-sengmyung': [
    '미디어콘텐츠창작학과 (Media Content Creation)',
    '아트앤산업디자인학과 (Art & Industrial Design)',
    '실내디자인학과 (Interior Design)',
    '시각·영상디자인학과 (Visual & Video Design)',
    '패션디자인학과 (Fashion Design)',
    '공연예술학과 (Performing Arts)',
    '경영학과 (Business Administration)',
    '호텔경영학과 (Hotel Management)',
    '항공서비스학과 (Aviation Service)',
    '사회복지학과 (Social Welfare)',
    '상담심리학과 (Counseling Psychology)',
    'AI컴퓨터학부 (AI Computer Science)',
    '스마트IT학부 (Smart IT)',
    '전기전자공학과 (Electrical & Electronic)',
    '간호학과 (Nursing)',
    '임상병리학과 (Clinical Pathology)',
    '뷰티케어학과 (Beauty Care)',
    '동물보건학과 (Animal Health)',
    '생활체육학과 (Sports & Leisure)',
  ],
  'dh-nu-sinh-dongduk': [
    '인문학부 - 국어국문학전공 (Korean Language & Literature)',
    '인문학부 - 국사학전공 (Korean History)',
    '인문학부 - 문예창작전공 (Creative Writing)',
    '글로벌지역학부 - 영어전공 (English)',
    '글로벌지역학부 - 일어일본학전공 (Japanese)',
    '글로벌지역학부 - 중어중국학전공 (Chinese)',
    '사회과학부 - 문헌정보학전공 (Library & Info Science)',
    '사회과학부 - 사회복지학전공 (Social Welfare)',
    '사회과학부 - 아동학전공 (Child Studies)',
    '경영융합학부 (Business Convergence)',
    '자연과학부 - 식품영양학전공 (Food & Nutrition)',
    '자연과학부 - 보건관리학전공 (Health Management)',
    '자연과학부 - 응용화학전공 (Applied Chemistry)',
    '자연과학부 - 화장품학전공 (Cosmetics)',
    '정보학부 - 컴퓨터학전공 (Computer Science)',
    '약학과 (Pharmacy)',
    '미술학부 - 회화전공 (Fine Arts)',
    '디자인학부 - 패션디자인전공 (Fashion Design)',
    '디자인학부 - 시각&실내디자인전공 (Visual & Interior Design)',
    '공연예술학부 - 방송연예전공 (Broadcasting & Entertainment)',
    '공연예술학부 - 실용음악전공 (Practical Music)',
    '공연예술학부 - 무용전공 (Dance)',
    '공연예술학부 - 모델전공 (Model)',
  ],
  'dh-catholic-kwandong': [
    '자율전공학부 (Self-Designed Major)',
    '경영학전공 (Business Administration)',
    '행정학전공 (Public Administration)',
    '경찰행정학전공 (Police Administration)',
    '사회복지학전공 (Social Welfare)',
    '호텔관광경영학전공 (Hotel & Tourism Management)',
    '항공교통물류전공 (Aviation Transport & Logistics)',
    '미디어콘텐츠전공 (Media Content)',
    '의생명과학전공 (Biomedical Science)',
    '건축공학전공 (Architectural Engineering)',
    '항공운항전공 (Aviation Operation)',
    '항공정비학전공 (Aircraft Maintenance)',
    'AI소프트웨어융합학부 (AI Software Convergence)',
    '컴퓨터소프트웨어전공 (Computer Software)',
    '스포츠레저학전공 (Sports & Leisure)',
    '실용음악전공 (Practical Music)',
    'CG디자인전공 (CG Design)',
    '사범대학 - 국어교육과 (Korean Language Education)',
    '사범대학 - 영어교육과 (English Education)',
    '사범대학 - 수학교육과 (Mathematics Education)',
    '의과대학 - 의학과 (Medicine)',
    '의과대학 - 간호학과 (Nursing)',
    '헬스케어융합대학 - 임상병리학과 (Clinical Pathology)',
    '헬스케어융합대학 - 치위생학과 (Dental Hygiene)',
    '헬스케어융합대학 - 작업치료학과 (Occupational Therapy)',
    '휴먼서비스대학 - 언어재활학과 (Speech Rehabilitation)',
    '휴먼서비스대학 - 복지상담학과 (Welfare Counseling)',
  ],
  'dh-jeonju': [
    '신학과경배찬양학과 (Theology & Worship)',
    '영어영문학과 (English Language & Literature)',
    '일본언어문화학과 (Japanese Language & Culture)',
    '중국어중국학과 (Chinese Language & Studies)',
    '역사콘텐츠학과 (History Content)',
    '웹툰만화콘텐츠학과 (Webtoon & Comic Content)',
    '한국어문학과 (Korean Language & Literature)',
    '경찰학과 (Police Science)',
    '문헌정보학과 (Library & Info Science)',
    '법학과 (Law)',
    '사회복지학과 (Social Welfare)',
    '상담심리학과 (Counseling Psychology)',
    '행정학과 (Public Administration)',
    '경영학과 (Business Administration)',
    '물류무역학과 (Logistics & Trade)',
    '회계세무학과 (Accounting & Tax)',
    '간호학과 (Nursing)',
    '물리치료학과 (Physical Therapy)',
    '방사선학과 (Radiology)',
    '작업치료학과 (Occupational Therapy)',
    '식품영양학과 (Food & Nutrition)',
    '기계공학과 (Mechanical Engineering)',
    '기계자동차공학과 (Mechanical & Automotive)',
    '전기전자공학과 (Electrical & Electronic)',
    '정보통신공학과 (Information & Communication)',
    '컴퓨터공학과 (Computer Engineering)',
    '인공지능학과 (Artificial Intelligence)',
    '데이터사이언스학과 (Data Science)',
    '게임콘텐츠학과 (Game Content)',
    '시각디자인학과 (Visual Design)',
    '공연예술학과 (Performing Arts)',
    '영화방송학과 (Film & Broadcasting)',
    '생활체육학과 (Sports & Leisure)',
    '태권도학과 (Taekwondo)',
    '관광경영학과 (Tourism Management)',
    '외식산업조리학과 (Food Service & Culinary)',
    '호텔경영학과 (Hotel Management)',
    '영어교육과 (English Education)',
    '수학교육과 (Mathematics Education)',
    '유아특수교육과 (Early Childhood Special Education)',
  ],
};

async function getSchoolList() {
  const res = await fetch(`${API_BASE}/api/schools`);
  const json = await res.json();
  return json.data || [];
}

async function updateSchoolMajors(schoolId, majors) {
  const res = await fetch(`${API_BASE}/api/admin/schools?id=${schoolId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ majors }),
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
    const majors = SCHOOL_MAJORS[slug];

    if (!majors) {
      console.log(`  ⏭️  ${name} (${slug}) — Không có dữ liệu mới, bỏ qua`);
      continue;
    }

    const oldCount = (school.majors || []).length;
    const newCount = majors.length;

    try {
      console.log(`  📝 ${name} (${slug}): ${oldCount} → ${newCount} majors...`);
      await updateSchoolMajors(school.id, majors);
      console.log(`  ✅ ${name} — Cập nhật thành công (${newCount} majors)`);
      success++;
    } catch (err) {
      console.log(`  ❌ ${name} — Lỗi: ${err.message}`);
      failed++;
    }

    // Delay nhẹ giữa các request
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`✅ Thành công: ${success}`);
  console.log(`❌ Thất bại: ${failed}`);
}

main().catch(console.error);
