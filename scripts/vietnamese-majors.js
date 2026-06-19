#!/usr/bin/env node
/**
 * Cập nhật majors sang tiếng Việt cho các trường
 * Chạy: node scripts/vietnamese-majors.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

// Vietnamese translations of majors
const SCHOOL_MAJORS = {
  'cd-suncheon-jeil': [
    'Khoa Môi trường Xây dựng Thông minh (Smart Construction & Environment)',
    'Khoa Kiến trúc & Nội thất (Architecture & Interior)',
    'Khoa Cơ khí (Mechanical Engineering)',
    'Khoa Tự động hóa Điện (Electrical Automation)',
    'Khoa Quản trị Y tế (Health Administration)',
  ],
  'dh-busan-catholic': [
    'Điều dưỡng (Nursing)',
    'Khoa học Sức khỏe (Health Sciences)',
    'Khoa học Máy tính (Computer Science)',
    'Phúc lợi Xã hội (Social Welfare)',
    'Tâm lý Tham vấn (Counseling Psychology)',
    'Quản trị Kinh doanh (Business Administration)',
  ],
  'dh-catholic-kwandong': [
    'Khoa Tự chọn (Self-Designed Major)',
    'Quản trị Kinh doanh (Business Administration)',
    'Hành chính Công (Public Administration)',
    'Hành chính Cảnh sát (Police Administration)',
    'Phúc lợi Xã hội (Social Welfare)',
    'Quản lý Khách sạn & Du lịch (Hotel & Tourism Management)',
    'Vận tải Hàng không & Logistics (Aviation Transport & Logistics)',
    'Truyền thông Đa phương tiện (Media Content)',
    'Khoa học Y sinh (Biomedical Science)',
    'Kỹ thuật Kiến trúc (Architectural Engineering)',
    'Khai thác Hàng không (Aviation Operation)',
    'Bảo dưỡng Máy bay (Aircraft Maintenance)',
    'Khoa Công nghệ Phần mềm & AI (AI Software Convergence)',
    'Khoa học Máy tính (Computer Software)',
    'Thể thao & Giải trí (Sports & Leisure)',
    'Âm nhạc Ứng dụng (Practical Music)',
    'Thiết kế Đồ họa Máy tính (CG Design)',
    'Sư phạm Tiếng Hàn (Korean Language Education)',
    'Sư phạm Tiếng Anh (English Education)',
    'Sư phạm Toán học (Mathematics Education)',
    'Y học (Medicine)',
    'Điều dưỡng (Nursing)',
    'Xét nghiệm Y học (Clinical Pathology)',
    'Vệ sinh Răng miệng (Dental Hygiene)',
    'Trị liệu Hồi phục (Occupational Therapy)',
    'Trị liệu Ngôn ngữ (Speech Rehabilitation)',
    'Tham vấn Phúc lợi (Welfare Counseling)',
  ],
  'dh-daewon': [
    'Kỹ thuật Điện - Điện tử (Electrical & Electronic)',
    'Kỹ thuật Xây dựng Đường sắt (Railway Construction)',
    'Đa phương tiện (Multimedia)',
    'Điều dưỡng (Nursing)',
    'Vật lý Trị liệu (Physical Therapy)',
    'X-quang (Radiology)',
    'Cấp cứu Y tế (Emergency Medical)',
    'Vệ sinh Răng miệng (Dental Hygiene)',
    'Thẩm mỹ (Beauty)',
    'Quản trị Y tế (Healthcare Admin)',
    'Phục hồi chức năng (Rehabilitation Exercise)',
    'Y sinh học (Biomedical)',
    'Nấu ăn Khách sạn (Hotel Culinary)',
    'Giáo dục Mầm non (Early Childhood Ed)',
    'Quản lý Khách sạn & Du lịch (Hotel Tourism)',
    'Phúc lợi Xã hội (Social Welfare)',
    'Hành chính Cảnh sát (Police Security)',
    'Thư viện & Thông tin (Library & Info)',
    'Khoa K-Toàn cầu (K-Global)',
  ],
  'dh-induk': [
    'Khoa Hội tụ AI - Kỹ thuật Máy tính & Điện tử (Computer & Electronic Eng.)',
    'Khoa Hội tụ AI - Kỹ thuật Quản lý Công nghiệp (Industrial Management Eng.)',
    'Khoa Hội tụ AI - Khoa học Máy tính (Computer Software)',
    'Khoa Hội tụ AI - Kỹ thuật Cơ điện tử (Mechatronics Eng.)',
    'Khoa Hội tụ AI - Kỹ thuật Viễn thông (Info & Communication Eng.)',
    'Khoa Hội tụ AI - Kỹ thuật Cơ khí Ô tô (Mechanical & Automotive Eng.)',
    'Khoa Hội tụ AI - Kỹ thuật Cơ khí (Mechanical Eng.)',
    'Khoa Thành phố Thông minh - Kỹ thuật Xây dựng (Civil Eng.)',
    'Khoa Thành phố Thông minh - Kiến trúc (Architecture)',
    'Khoa Thành phố Thông minh - Phòng chống Thiên tai (Smart Disaster Prevention)',
    'Khoa Thiết kế Sáng tạo - Thiết kế Công nghiệp Kỹ thuật số (Digital Industrial Design)',
    'Khoa Thiết kế Sáng tạo - Thiết kế Trang sức (Jewelry Design)',
    'Khoa Thiết kế Sáng tạo - Thiết kế Đồ họa (Visual Design)',
    'Khoa Thiết kế Sáng tạo - Thiết kế Đa phương tiện (Multimedia Design)',
    'Khoa Thiết kế Sáng tạo - Thiết kế Gốm sứ (Living Ceramic Design)',
    'Khoa Nội dung Truyền thông Hội tụ - Truyền thông Phát thanh (Broadcasting Media)',
    'Khoa Nội dung Truyền thông Hội tụ - Nghệ thuật Diễn xuất (Performing Arts)',
    'Khoa Nội dung Truyền thông Hội tụ - Truyện tranh Webtoon (Webtoon & Comic)',
    'Khoa Nội dung Truyền thông Hội tụ - Thiết kế Game & VR (Game & VR Content Design)',
    'Khoa Quản lý Dịch vụ - Quản lý Thông minh & Thư ký (Smart Management & Secretary)',
    'Khoa Quản lý Dịch vụ - Quản lý Dịch vụ Du lịch (Tourism Service Management)',
    'Khoa Quản lý Dịch vụ - Phúc lợi Xã hội (Social Welfare)',
    'Khoa Quản lý Dịch vụ - Kế toán Thuế (Tax & Accounting)',
    'Khoa Quản lý Dịch vụ - Dịch vụ Hàng không Toàn cầu (Global Aviation Service)',
    'Khoa Toàn cầu - Tiếng Trung Kinh doanh (Business Chinese)',
    'Khoa Nghệ thuật K-Beauty - Trang điểm Truyền hình (Broadcasting Makeup)',
    'Khoa Nghệ thuật K-Beauty - Làm đẹp Tóc (Broadcasting Hair Beauty)',
    'Khoa Tự chọn (Self-Designed Major)',
    'Khoa Du học sinh - Dịch vụ Du lịch Tiếng Hàn (Korean Tourism Service)',
  ],
  'dh-jeonju': [
    'Thần học & Thờ phượng (Theology & Worship)',
    'Ngôn ngữ & Văn học Anh (English Language & Literature)',
    'Ngôn ngữ & Văn hóa Nhật (Japanese Language & Culture)',
    'Ngôn ngữ & Trung Quốc học (Chinese Language & Studies)',
    'Nội dung Lịch sử (History Content)',
    'Nội dung Webtoon & Truyện tranh (Webtoon & Comic Content)',
    'Ngôn ngữ & Văn học Hàn (Korean Language & Literature)',
    'Khoa học Cảnh sát (Police Science)',
    'Thư viện & Khoa học Thông tin (Library & Info Science)',
    'Luật (Law)',
    'Phúc lợi Xã hội (Social Welfare)',
    'Tâm lý Tham vấn (Counseling Psychology)',
    'Hành chính Công (Public Administration)',
    'Quản trị Kinh doanh (Business Administration)',
    'Logistics & Thương mại (Logistics & Trade)',
    'Kế toán & Thuế (Accounting & Tax)',
    'Điều dưỡng (Nursing)',
    'Vật lý Trị liệu (Physical Therapy)',
    'X-quang (Radiology)',
    'Trị liệu Hồi phục (Occupational Therapy)',
    'Thực phẩm & Dinh dưỡng (Food & Nutrition)',
    'Kỹ thuật Cơ khí (Mechanical Engineering)',
    'Kỹ thuật Cơ khí Ô tô (Mechanical & Automotive)',
    'Kỹ thuật Điện - Điện tử (Electrical & Electronic)',
    'Kỹ thuật Thông tin & Truyền thông (Info & Communication)',
    'Kỹ thuật Máy tính (Computer Engineering)',
    'Trí tuệ Nhân tạo (Artificial Intelligence)',
    'Khoa học Dữ liệu (Data Science)',
    'Nội dung Game (Game Content)',
    'Thiết kế Đồ họa (Visual Design)',
    'Nghệ thuật Biểu diễn (Performing Arts)',
    'Điện ảnh & Phát thanh (Film & Broadcasting)',
    'Thể thao & Giải trí (Sports & Leisure)',
    'Taekwondo (Taekwondo)',
    'Quản lý Du lịch (Tourism Management)',
    'Ẩm thực & Dịch vụ Ăn uống (Food Service & Culinary)',
    'Quản lý Khách sạn (Hotel Management)',
    'Sư phạm Tiếng Anh (English Education)',
    'Sư phạm Toán học (Mathematics Education)',
    'Giáo dục Đặc biệt Mầm non (Early Childhood Special Education)',
  ],
  'dh-nu-sinh-busan': [
    'Khoa Trẻ em - Giáo dục Mầm non (Early Childhood Education)',
    'Khoa Trẻ em - Nghệ thuật Múa Thiếu nhi (Children\'s Art & Dance)',
    'Khoa Du lịch - Pha chế Cà phê (Barista)',
    'Khoa Du lịch - Ẩm thực (Culinary)',
    'Khoa Du lịch - Làm Bánh (Baking)',
    'Khoa Sức khỏe & Phúc lợi - Điều dưỡng (Nursing)',
    'Khoa Sức khỏe & Phúc lợi - Quang học (Optometry)',
    'Khoa Sức khỏe & Phúc lợi - Vệ sinh Răng miệng (Dental Hygiene)',
    'Khoa Sức khỏe & Phúc lợi - Thẩm mỹ (Beauty)',
    'Khoa Sức khỏe & Phúc lợi - Phúc lợi Xã hội (Social Welfare)',
    'Khoa Sức khỏe & Phúc lợi - Sức khỏe Động vật (Animal Health)',
    'Khoa Sức khỏe & Phúc lợi - Thư viện & Thông tin (Library & Info)',
    'Khoa Giáo dục Suốt đời - Tập luyện Sức khỏe Thông minh (Smart Health Exercise)',
    'Khoa Giáo dục Suốt đời - Văn hóa Đời sống (Lifestyle & Culture)',
    'Khoa Giáo dục Suốt đời - Người mẫu Cao tuổi (Senior Model)',
  ],
  'dh-nu-sinh-dongduk': [
    'Khoa Nhân văn - Ngôn ngữ & Văn học Hàn (Korean Language & Literature)',
    'Khoa Nhân văn - Lịch sử Hàn Quốc (Korean History)',
    'Khoa Nhân văn - Sáng tác Văn học (Creative Writing)',
    'Khoa Khu vực Toàn cầu - Tiếng Anh (English)',
    'Khoa Khu vực Toàn cầu - Tiếng Nhật & Nhật Bản học (Japanese)',
    'Khoa Khu vực Toàn cầu - Tiếng Trung & Trung Quốc học (Chinese)',
    'Khoa Khoa học Xã hội - Thư viện & Thông tin (Library & Info Science)',
    'Khoa Khoa học Xã hội - Phúc lợi Xã hội (Social Welfare)',
    'Khoa Khoa học Xã hội - Nhi đồng học (Child Studies)',
    'Khoa Hội tụ Kinh doanh (Business Convergence)',
    'Khoa Khoa học Tự nhiên - Thực phẩm & Dinh dưỡng (Food & Nutrition)',
    'Khoa Khoa học Tự nhiên - Quản lý Y tế (Health Management)',
    'Khoa Khoa học Tự nhiên - Hóa Ứng dụng (Applied Chemistry)',
    'Khoa Khoa học Tự nhiên - Mỹ phẩm học (Cosmetics)',
    'Khoa Thông tin - Khoa học Máy tính (Computer Science)',
    'Dược học (Pharmacy)',
    'Khoa Mỹ thuật - Hội họa (Fine Arts)',
    'Khoa Thiết kế - Thiết kế Thời trang (Fashion Design)',
    'Khoa Thiết kế - Thiết kế Thị giác & Nội thất (Visual & Interior Design)',
    'Khoa Nghệ thuật Biểu diễn - Phát thanh & Giải trí (Broadcasting & Entertainment)',
    'Khoa Nghệ thuật Biểu diễn - Âm nhạc Ứng dụng (Practical Music)',
    'Khoa Nghệ thuật Biểu diễn - Múa (Dance)',
    'Khoa Nghệ thuật Biểu diễn - Người mẫu (Model)',
  ],
  'dh-nu-sinh-kyungin': [
    'Khoa Điều dưỡng & Phúc lợi (Nursing & Welfare)',
    'Khoa Du lịch & Ẩm thực (Tourism & Food)',
    'Khoa Xã hội & Hành chính (Society & Administration)',
    'Khoa Giáo dục Trẻ em (Child Education)',
    'Khoa Thiết kế (Design)',
    'Khoa Thông tin (Information)',
  ],
  'dh-osan': [
    'Khoa Kỹ thuật Tương lai - Kỹ thuật Cơ khí (Mechanical Engineering)',
    'Khoa Kỹ thuật Tương lai - Quản lý An toàn Sức khỏe (Safety & Health Management)',
    'Khoa Kỹ thuật Tương lai - Kỹ thuật Điện (Electrical Engineering)',
    'Khoa Kỹ thuật Tương lai - Thiết bị Bán dẫn (Semiconductor Equipment)',
    'Khoa Kỹ thuật Tương lai - Ngành Bán dẫn AI (AI Semiconductor)',
    'Khoa Ô tô - Kỹ thuật Ô tô (Automotive Engineering)',
    'Khoa Ô tô - Ô tô Điện Tương lai (Future Electric Vehicle)',
    'Khoa Ô tô - Độ xe & Tuning (Car Tuning)',
    'Khoa Nội dung Sáng tạo - Thiết kế Nội dung Kỹ thuật số (Digital Content Design)',
    'Khoa Nội dung Sáng tạo - Khoa học Máy tính (Computer Software)',
    'Khoa Chăm sóc Nhân văn - Phục hồi Sức khỏe (Health Rehabilitation)',
    'Khoa Chăm sóc Nhân văn - Quản lý An toàn PCCC (Fire Safety Management)',
    'Khoa Chăm sóc Nhân văn - Quản lý Thú cưng (Pet Care)',
    'Khoa Chăm sóc Nhân văn - Hướng dẫn Thể thao (Sports Coaching)',
    'Khoa Dịch vụ Xã hội - Hành chính Cảnh sát (Police Administration)',
    'Khoa Dịch vụ Xã hội - Giáo dục Mầm non (Early Childhood Education)',
    'Khoa Dịch vụ Xã hội - Tham vấn Phúc lợi Xã hội (Social Welfare Counseling)',
    'Khoa Dịch vụ Xã hội - Quản lý Marketing Truyền thông (Media Marketing Management)',
    'Khoa Dịch vụ Xã hội - Kế toán Thuế (Tax Accounting)',
    'Khoa Dịch vụ Xã hội - Học tập Suốt đời (Lifelong Learning)',
    'Khoa Dịch vụ Khách sạn & Du lịch - Ẩm thực Khách sạn (Hotel Culinary)',
    'Khoa Dịch vụ Khách sạn & Du lịch - Dịch vụ Hàng không (Aviation Service)',
    'Khoa Dịch vụ Khách sạn & Du lịch - Quản lý Khách sạn & Du lịch (Hotel Tourism Mgmt)',
    'Khoa Dịch vụ Khách sạn & Du lịch - Pha chế Cà phê (Barista)',
    'Khoa Nghệ thuật K-Beauty - Ngành Mỹ phẩm Làm đẹp (Beauty Cosmetics)',
    'Khoa Nghệ thuật K-Beauty - Tạo mẫu Tóc (Hair Signature)',
    'Khoa Nghệ thuật K-Beauty - Tạo mẫu Thời trang (Fashion Stylist)',
    'Khoa Văn hóa Nghệ thuật - Tổ chức Sự kiện & Lễ hội (Festival Content)',
    'Khoa Văn hóa Nghệ thuật - Giọng hát & K-POP (Vocal & K-POP Content)',
    'Khoa Văn hóa Nghệ thuật - Thể thao Điện tử (eSports)',
    'Khoa Y tế - Sức khỏe Động vật (Animal Health)',
    'Khoa Y tế - Trị liệu Hồi phục (Occupational Therapy)',
    'Khoa Quân sự - Máy bay Không người lái (Combat Drone)',
    'Khoa Tự chọn (Self-Designed Major)',
  ],
  'dh-sengmyung': [
    'Sáng tạo Nội dung Truyền thông (Media Content Creation)',
    'Thiết kế Nghệ thuật & Công nghiệp (Art & Industrial Design)',
    'Thiết kế Nội thất (Interior Design)',
    'Thiết kế Thị giác & Đa phương tiện (Visual & Video Design)',
    'Thiết kế Thời trang (Fashion Design)',
    'Nghệ thuật Biểu diễn (Performing Arts)',
    'Quản trị Kinh doanh (Business Administration)',
    'Quản lý Khách sạn (Hotel Management)',
    'Dịch vụ Hàng không (Aviation Service)',
    'Phúc lợi Xã hội (Social Welfare)',
    'Tâm lý Tham vấn (Counseling Psychology)',
    'Khoa Máy tính & AI (AI Computer Science)',
    'Công nghệ Thông tin Thông minh (Smart IT)',
    'Kỹ thuật Điện - Điện tử (Electrical & Electronic)',
    'Điều dưỡng (Nursing)',
    'Xét nghiệm Bệnh học (Clinical Pathology)',
    'Chăm sóc Sắc đẹp (Beauty Care)',
    'Sức khỏe Động vật (Animal Health)',
    'Thể thao & Giải trí (Sports & Leisure)',
  ],
  'dh-y-te-dongnam': [
    'X-quang (Radiology)',
    'Điều dưỡng (Nursing)',
    'Vật lý Trị liệu (Physical Therapy)',
    'Chăm sóc Sắc đẹp (Beauty Care)',
    'Dịch vụ Du lịch (Tourism Service)',
    'Thực phẩm & Dinh dưỡng (Food & Nutrition)',
  ],
  'dh-yeonsung': [
    'Ngành ICT Thông minh - Kỹ thuật Điện tử (Electronic Engineering)',
    'Ngành ICT Thông minh - Kỹ thuật Điện (Electrical)',
    'Ngành ICT Thông minh - Khoa học Máy tính (Computer Software)',
    'Ngành Thiết kế Cuộc sống - Kiến trúc (Architecture)',
    'Ngành Thiết kế Cuộc sống - Thiết kế Nội thất (Interior Design)',
    'Ngành Thiết kế Cuộc sống - Kinh doanh Thời trang (Fashion Design Business)',
    'Ngành Thiết kế Cuộc sống - Tạo mẫu Làm đẹp (Beauty Stylist)',
    'Ngành Nội dung Văn hóa - Nội dung Game (Game Content)',
    'Ngành Nội dung Văn hóa - Nội dung Webtoon (Webtoon & Comic Content)',
    'Ngành Nội dung Văn hóa - Nội dung Video (Video Content)',
    'Ngành Nội dung Văn hóa - Thiết kế Đồ họa (Visual Design)',
    'Ngành Nội dung Văn hóa - K-POP',
    'Ngành Xã hội & Giáo dục - Quản trị Kinh doanh (Business Administration)',
    'Ngành Xã hội & Giáo dục - Kế toán Thuế (Tax Accounting)',
    'Ngành Xã hội & Giáo dục - Quân sự Quốc phòng (National Defense & Military)',
    'Ngành Xã hội & Giáo dục - An ninh Cảnh sát (Police Security)',
    'Ngành Xã hội & Giáo dục - Phúc lợi Xã hội (Social Welfare)',
    'Ngành Xã hội & Giáo dục - Giáo dục Mầm non (Early Childhood Education)',
    'Ngành Sức khỏe & Sinh học - Điều dưỡng (Nursing)',
    'Ngành Sức khỏe & Sinh học - Vệ sinh Răng miệng (Dental Hygiene)',
    'Ngành Sức khỏe & Sinh học - Kỹ thuật Răng (Dental Technology)',
    'Ngành Sức khỏe & Sinh học - Trị liệu Hồi phục (Occupational Therapy)',
    'Ngành Sức khỏe & Sinh học - Cấp cứu Y tế (Emergency Medical)',
    'Ngành Sức khỏe & Sinh học - Quản trị Y tế (Health Care Administration)',
    'Ngành Sức khỏe & Sinh học - Phục hồi Thể thao (Sports Rehabilitation)',
    'Ngành Sức khỏe & Sinh học - Thực phẩm & Dinh dưỡng (Food & Nutrition)',
    'Ngành Sức khỏe & Sinh học - Sức khỏe Động vật (Animal Health)',
    'Ngành Sức khỏe & Sinh học - Ngành Công nghiệp Thú cưng (Pet Industry)',
    'Ngành Du lịch & Ẩm thực - Dịch vụ Hàng không (Aviation Service)',
    'Ngành Du lịch & Ẩm thực - Tiếng Anh Du lịch (Tourism English)',
    'Ngành Du lịch & Ẩm thực - Khách sạn & Du lịch (Hotel & Tourism)',
    'Ngành Du lịch & Ẩm thực - Ẩm thực Khách sạn (Hotel Culinary)',
    'Ngành Du lịch & Ẩm thực - Cà phê & Bánh (Cafe & Bakery)',
    'Ngành Tự chọn (Free Major)',
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
      console.log(`  ⏭️  ${name} (${slug}) — Giữ nguyên (đã là tiếng Việt)`);
      continue;
    }

    try {
      console.log(`  📝 ${name} (${slug}): ${majors.length} majors (Tiếng Việt)...`);
      await updateSchoolMajors(school.id, majors);
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
  console.log(`⏭️  Giữ nguyên: ${schools.length - success - failed}`);
  console.log(`❌ Thất bại: ${failed}`);
}

main().catch(console.error);
