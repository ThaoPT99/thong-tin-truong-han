#!/usr/bin/env node
/**
 * Làm sạch và thống nhất majors: bỏ English trong ngoặc, rút gọn tên, mở rộng trường thiếu
 * Chạy: node scripts/clean-majors.js
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlY2VmOGZkLTZlMzEtNDBkMi1iMmFkLTAzZThhNzg3MWM5ZSIsImVtYWlsIjoicGhhbnRydW9uZ3RoYW8xOTlAZ21haWwuY29tIiwicm9sZSI6ImRpcmVjdG9yIiwiaWF0IjoxNzgxODcwMjA5LCJleHAiOjE3ODE5NTY2MDl9.jXmi1oge4CXrTt6LGEkjWXYCIp8LTSEq7gJaC78cJ3E';
const API_BASE = 'https://thongtintruonghan.vercel.app';

// Clean Vietnamese majors — no English in parentheses, concise names
const SCHOOL_MAJORS = {
  // === Các trường đã có tiếng Việt, chỉ cần rút gọn ===
  'cd-suncheon-jeil': [
    'Môi trường Xây dựng Thông minh',
    'Kiến trúc & Nội thất',
    'Cơ khí',
    'Tự động hóa Điện',
    'Quản trị Y tế',
  ],
  'dh-busan-catholic': [
    'Điều dưỡng',
    'Khoa học Sức khỏe',
    'Khoa học Máy tính',
    'Phúc lợi Xã hội',
    'Tâm lý Tham vấn',
    'Quản trị Kinh doanh',
  ],
  'dh-catholic-kwandong': [
    'Khoa Tự chọn',
    'Quản trị Kinh doanh',
    'Hành chính Công',
    'Hành chính Cảnh sát',
    'Phúc lợi Xã hội',
    'Quản lý Khách sạn & Du lịch',
    'Vận tải Hàng không & Logistics',
    'Truyền thông Đa phương tiện',
    'Khoa học Y sinh',
    'Kỹ thuật Kiến trúc',
    'Khai thác Hàng không',
    'Bảo dưỡng Máy bay',
    'Công nghệ Phần mềm & AI',
    'Khoa học Máy tính',
    'Thể thao & Giải trí',
    'Âm nhạc Ứng dụng',
    'Thiết kế Đồ họa',
    'Sư phạm Tiếng Hàn',
    'Sư phạm Tiếng Anh',
    'Sư phạm Toán học',
    'Y học',
    'Điều dưỡng',
    'Xét nghiệm Y học',
    'Vệ sinh Răng miệng',
    'Trị liệu Hồi phục',
    'Trị liệu Ngôn ngữ',
    'Tham vấn Phúc lợi',
  ],
  'dh-daewon': [
    'Kỹ thuật Điện - Điện tử',
    'Kỹ thuật Xây dựng Đường sắt',
    'Đa phương tiện',
    'Điều dưỡng',
    'Vật lý Trị liệu',
    'X-quang',
    'Cấp cứu Y tế',
    'Vệ sinh Răng miệng',
    'Thẩm mỹ',
    'Quản trị Y tế',
    'Phục hồi chức năng',
    'Y sinh học',
    'Nấu ăn Khách sạn',
    'Giáo dục Mầm non',
    'Quản lý Khách sạn & Du lịch',
    'Phúc lợi Xã hội',
    'Hành chính Cảnh sát',
    'Thư viện & Thông tin',
    'Khoa K-Toàn cầu',
  ],
  'dh-dongeui': [
    'Cơ khí',
    'Du lịch Quốc tế',
    'Quản trị Kinh doanh',
    'Kỹ thuật Ô tô',
    'Điều dưỡng',
    'Thiết kế',
    'Công nghệ Thông tin',
    'Kỹ thuật Xây dựng',
  ],
  'dh-gimhae': [
    'Cơ khí',
    'Quản trị Kinh doanh',
    'Kỹ thuật Ô tô',
    'Điện - Điện tử',
    'Điều dưỡng',
    'Vật lý Trị liệu',
    'Chăm sóc Sắc đẹp',
    'Quản lý Khách sạn & Du lịch',
    'Công nghệ Thực phẩm',
  ],
  'dh-gwangju': [
    'Quản trị Kinh doanh',
    'Công nghệ Thông tin',
    'Kỹ thuật Công nghiệp',
    'Điều dưỡng',
    'Ngôn ngữ & Văn hóa Hàn',
    'Công tác Xã hội',
    'Thiết kế',
    'Kỹ thuật Xây dựng',
  ],
  'dh-induk': [
    'Hội tụ AI - Kỹ thuật Máy tính & Điện tử',
    'Hội tụ AI - Quản lý Công nghiệp',
    'Hội tụ AI - Khoa học Máy tính',
    'Hội tụ AI - Cơ điện tử',
    'Hội tụ AI - Viễn thông',
    'Hội tụ AI - Cơ khí Ô tô',
    'Hội tụ AI - Cơ khí',
    'Thành phố Thông minh - Xây dựng',
    'Thành phố Thông minh - Kiến trúc',
    'Thành phố Thông minh - Phòng chống Thiên tai',
    'Thiết kế Sáng tạo - Thiết kế Công nghiệp',
    'Thiết kế Sáng tạo - Trang sức',
    'Thiết kế Sáng tạo - Đồ họa',
    'Thiết kế Sáng tạo - Đa phương tiện',
    'Thiết kế Sáng tạo - Gốm sứ',
    'Nội dung Truyền thông - Phát thanh Truyền hình',
    'Nội dung Truyền thông - Diễn xuất',
    'Nội dung Truyền thông - Webtoon & Truyện tranh',
    'Nội dung Truyền thông - Game & VR',
    'Quản lý Dịch vụ - Quản lý Thông minh',
    'Quản lý Dịch vụ - Du lịch',
    'Quản lý Dịch vụ - Phúc lợi Xã hội',
    'Quản lý Dịch vụ - Kế toán Thuế',
    'Quản lý Dịch vụ - Hàng không Toàn cầu',
    'Khoa Toàn cầu - Tiếng Trung Kinh doanh',
    'Nghệ thuật K-Beauty - Trang điểm Truyền hình',
    'Nghệ thuật K-Beauty - Làm đẹp Tóc',
    'Khoa Tự chọn',
    'Du học sinh - Dịch vụ Du lịch Tiếng Hàn',
  ],
  'dh-jeonju': [
    'Thần học & Thờ phượng',
    'Ngôn ngữ & Văn học Anh',
    'Ngôn ngữ & Văn hóa Nhật',
    'Ngôn ngữ & Trung Quốc học',
    'Nội dung Lịch sử',
    'Nội dung Webtoon & Truyện tranh',
    'Ngôn ngữ & Văn học Hàn',
    'Khoa học Cảnh sát',
    'Thư viện & Khoa học Thông tin',
    'Luật',
    'Phúc lợi Xã hội',
    'Tâm lý Tham vấn',
    'Hành chính Công',
    'Quản trị Kinh doanh',
    'Logistics & Thương mại',
    'Kế toán & Thuế',
    'Điều dưỡng',
    'Vật lý Trị liệu',
    'X-quang',
    'Trị liệu Hồi phục',
    'Thực phẩm & Dinh dưỡng',
    'Kỹ thuật Cơ khí',
    'Kỹ thuật Cơ khí Ô tô',
    'Kỹ thuật Điện - Điện tử',
    'Kỹ thuật Thông tin & Truyền thông',
    'Kỹ thuật Máy tính',
    'Trí tuệ Nhân tạo',
    'Khoa học Dữ liệu',
    'Nội dung Game',
    'Thiết kế Đồ họa',
    'Nghệ thuật Biểu diễn',
    'Điện ảnh & Phát thanh',
    'Thể thao & Giải trí',
    'Taekwondo',
    'Quản lý Du lịch',
    'Ẩm thực',
    'Quản lý Khách sạn',
    'Sư phạm Tiếng Anh',
    'Sư phạm Toán học',
    'Giáo dục Đặc biệt Mầm non',
  ],
  'dh-nambu': [
    'Quản trị Kinh doanh',
    'Kỹ thuật Công nghiệp',
    'Công nghệ Thực phẩm',
    'Thiết kế',
    'Công nghệ Thông tin',
    'Du lịch & Khách sạn',
    'Điều dưỡng',
    'Xã hội học',
  ],
  'dh-nu-sinh-busan': [
    'Trẻ em - Giáo dục Mầm non',
    'Trẻ em - Nghệ thuật Múa Thiếu nhi',
    'Du lịch - Pha chế Cà phê',
    'Du lịch - Ẩm thực',
    'Du lịch - Làm Bánh',
    'Sức khỏe & Phúc lợi - Điều dưỡng',
    'Sức khỏe & Phúc lợi - Quang học',
    'Sức khỏe & Phúc lợi - Vệ sinh Răng miệng',
    'Sức khỏe & Phúc lợi - Thẩm mỹ',
    'Sức khỏe & Phúc lợi - Phúc lợi Xã hội',
    'Sức khỏe & Phúc lợi - Sức khỏe Động vật',
    'Sức khỏe & Phúc lợi - Thư viện & Thông tin',
    'Giáo dục Suốt đời - Tập luyện Sức khỏe',
    'Giáo dục Suốt đời - Văn hóa Đời sống',
    'Giáo dục Suốt đời - Người mẫu Cao tuổi',
  ],
  'dh-nu-sinh-dongduk': [
    'Nhân văn - Ngôn ngữ & Văn học Hàn',
    'Nhân văn - Lịch sử Hàn Quốc',
    'Nhân văn - Sáng tác Văn học',
    'Khu vực Toàn cầu - Tiếng Anh',
    'Khu vực Toàn cầu - Tiếng Nhật',
    'Khu vực Toàn cầu - Tiếng Trung',
    'Xã hội - Thư viện & Thông tin',
    'Xã hội - Phúc lợi Xã hội',
    'Xã hội - Nhi đồng học',
    'Hội tụ Kinh doanh',
    'Tự nhiên - Thực phẩm & Dinh dưỡng',
    'Tự nhiên - Quản lý Y tế',
    'Tự nhiên - Hóa Ứng dụng',
    'Tự nhiên - Mỹ phẩm học',
    'Thông tin - Khoa học Máy tính',
    'Dược học',
    'Mỹ thuật - Hội họa',
    'Thiết kế - Thời trang',
    'Thiết kế - Thị giác & Nội thất',
    'Nghệ thuật Biểu diễn - Phát thanh & Giải trí',
    'Nghệ thuật Biểu diễn - Âm nhạc Ứng dụng',
    'Nghệ thuật Biểu diễn - Múa',
    'Nghệ thuật Biểu diễn - Người mẫu',
  ],
  'dh-nu-sinh-kyungin': [
    'Điều dưỡng & Phúc lợi',
    'Du lịch & Ẩm thực',
    'Xã hội & Hành chính',
    'Giáo dục Trẻ em',
    'Thiết kế',
    'Thông tin',
  ],
  'dh-osan': [
    'Kỹ thuật Tương lai - Cơ khí',
    'Kỹ thuật Tương lai - An toàn Sức khỏe',
    'Kỹ thuật Tương lai - Điện',
    'Kỹ thuật Tương lai - Thiết bị Bán dẫn',
    'Kỹ thuật Tương lai - Bán dẫn AI',
    'Ô tô - Kỹ thuật Ô tô',
    'Ô tô - Ô tô Điện Tương lai',
    'Ô tô - Độ xe & Tuning',
    'Nội dung Sáng tạo - Thiết kế Nội dung Kỹ thuật số',
    'Nội dung Sáng tạo - Khoa học Máy tính',
    'Chăm sóc Nhân văn - Phục hồi Sức khỏe',
    'Chăm sóc Nhân văn - An toàn PCCC',
    'Chăm sóc Nhân văn - Thú cưng',
    'Chăm sóc Nhân văn - Hướng dẫn Thể thao',
    'Dịch vụ Xã hội - Hành chính Cảnh sát',
    'Dịch vụ Xã hội - Giáo dục Mầm non',
    'Dịch vụ Xã hội - Tham vấn Phúc lợi',
    'Dịch vụ Xã hội - Marketing Truyền thông',
    'Dịch vụ Xã hội - Kế toán Thuế',
    'Dịch vụ Xã hội - Học tập Suốt đời',
    'Khách sạn & Du lịch - Ẩm thực Khách sạn',
    'Khách sạn & Du lịch - Dịch vụ Hàng không',
    'Khách sạn & Du lịch - Quản lý Du lịch',
    'Khách sạn & Du lịch - Pha chế Cà phê',
    'Nghệ thuật K-Beauty - Mỹ phẩm Làm đẹp',
    'Nghệ thuật K-Beauty - Tạo mẫu Tóc',
    'Nghệ thuật K-Beauty - Tạo mẫu Thời trang',
    'Văn hóa Nghệ thuật - Sự kiện & Lễ hội',
    'Văn hóa Nghệ thuật - Giọng hát & K-POP',
    'Văn hóa Nghệ thuật - Thể thao Điện tử',
    'Y tế - Sức khỏe Động vật',
    'Y tế - Trị liệu Hồi phục',
    'Quân sự - Máy bay Không người lái',
    'Khoa Tự chọn',
  ],
  'dh-sangmyung': [
    'Kinh doanh Quốc tế',
    'Công nghệ Thông tin',
    'Thiết kế',
    'Kỹ thuật Cơ khí',
    'Kỹ thuật Điện tử',
    'Kiến trúc',
    'Ngôn ngữ Anh',
    'Quản trị Kinh doanh',
    'Du lịch & Khách sạn',
  ],
  'dh-sengmyung': [
    'Sáng tạo Nội dung Truyền thông',
    'Thiết kế Công nghiệp & Nghệ thuật',
    'Thiết kế Nội thất',
    'Thiết kế Đồ họa & Đa phương tiện',
    'Thiết kế Thời trang',
    'Nghệ thuật Biểu diễn',
    'Quản trị Kinh doanh',
    'Quản lý Khách sạn',
    'Dịch vụ Hàng không',
    'Phúc lợi Xã hội',
    'Tâm lý Tham vấn',
    'Khoa học Máy tính & AI',
    'Công nghệ Thông tin Thông minh',
    'Kỹ thuật Điện - Điện tử',
    'Điều dưỡng',
    'Xét nghiệm Bệnh học',
    'Chăm sóc Sắc đẹp',
    'Sức khỏe Động vật',
    'Thể thao & Giải trí',
  ],
  'dh-y-te-dongnam': [
    'X-quang',
    'Điều dưỡng',
    'Vật lý Trị liệu',
    'Chăm sóc Sắc đẹp',
    'Dịch vụ Du lịch',
    'Thực phẩm & Dinh dưỡng',
  ],
  'dh-yeonsung': [
    'ICT Thông minh - Điện tử',
    'ICT Thông minh - Điện',
    'ICT Thông minh - Khoa học Máy tính',
    'Thiết kế Cuộc sống - Kiến trúc',
    'Thiết kế Cuộc sống - Nội thất',
    'Thiết kế Cuộc sống - Kinh doanh Thời trang',
    'Thiết kế Cuộc sống - Làm đẹp',
    'Nội dung Văn hóa - Game',
    'Nội dung Văn hóa - Webtoon',
    'Nội dung Văn hóa - Video',
    'Nội dung Văn hóa - Đồ họa',
    'Nội dung Văn hóa - K-POP',
    'Xã hội & Giáo dục - Quản trị Kinh doanh',
    'Xã hội & Giáo dục - Kế toán Thuế',
    'Xã hội & Giáo dục - An ninh Cảnh sát',
    'Xã hội & Giáo dục - Phúc lợi Xã hội',
    'Xã hội & Giáo dục - Giáo dục Mầm non',
    'Sức khỏe & Sinh học - Điều dưỡng',
    'Sức khỏe & Sinh học - Vệ sinh Răng miệng',
    'Sức khỏe & Sinh học - Kỹ thuật Răng',
    'Sức khỏe & Sinh học - Trị liệu Hồi phục',
    'Sức khỏe & Sinh học - Cấp cứu Y tế',
    'Sức khỏe & Sinh học - Quản trị Y tế',
    'Sức khỏe & Sinh học - Phục hồi Thể thao',
    'Sức khỏe & Sinh học - Dinh dưỡng',
    'Sức khỏe & Sinh học - Sức khỏe Động vật',
    'Sức khỏe & Sinh học - Công nghiệp Thú cưng',
    'Du lịch & Ẩm thực - Dịch vụ Hàng không',
    'Du lịch & Ẩm thực - Tiếng Anh Du lịch',
    'Du lịch & Ẩm thực - Khách sạn & Du lịch',
    'Du lịch & Ẩm thực - Ẩm thực Khách sạn',
    'Du lịch & Ẩm thực - Cà phê & Bánh',
    'Khoa Tự chọn',
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
      console.log(`  ⏭️  ${name} (${slug}) — Bỏ qua`);
      continue;
    }

    try {
      const oldCount = (school.majors || []).length;
      const newCount = majors.length;
      console.log(`  📝 ${name} (${slug}): ${oldCount} → ${newCount} majors...`);
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
  console.log(`❌ Thất bại: ${failed}`);
}

main().catch(console.error);
