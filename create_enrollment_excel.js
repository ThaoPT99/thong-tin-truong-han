const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

// Helper function to apply header style
function applyHeaderStyle(ws, cell) {
  cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
  cell.alignment = { horizontal: "center", vertical: "center", wrapText: true };
}

// Helper function to apply border style
function applyBorder(ws, row, startCol, endCol) {
  for (let col = startCol; col <= endCol; col++) {
    const cell = ws.getCell(row, col);
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }
}

// ============= SHEET 1: TỔNG QUAN CHÍNH SÁCH =============
const sheet1 = workbook.addWorksheet("1. Tong quan chinh sach");

// Title
sheet1.mergeCells("A1:L1");
sheet1.getCell("A1").value = "CHƯƠNG TRÌNH TUYỂN SINH D2-6 THÁNG 3/2027 - TỔNG QUAN CHÍNH SÁCH";
sheet1.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
sheet1.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet1.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
sheet1.getRow(1).height = 30;

// General Info Section
sheet1.mergeCells("A3:B3");
sheet1.getCell("A3").value = "THÔNG TIN CHUNG";
sheet1.getCell("A3").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
sheet1.getCell("A3").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
sheet1.getCell("A3").alignment = { horizontal: "center", vertical: "center" };

const generalInfo = [
  ["Ngày cuối nộp hồ sơ", "08/11/2026"],
  ["Ngày khai giảng", "15/09/2026"],
  ["Chỉ tiêu toàn quốc", "3.000 hồ sơ"],
  ["Chỉ tiêu mỗi trường", "200 hồ sơ"],
  ["Lần 1 (Invoice trường VN)", "30 triệu VND"],
  ["Lần 2 (Invoice trường Hàn)", "100 triệu VND"],
  ["Lần 3 (Bảo lãnh cư trú)", "Phần còn lại"],
  ["Tổng thu", "260 triệu VND"],
  ["Gói Tiêu chuẩn", "60 triệu (tuyển sinh)"],
  ["Gói Chuyên nghiệp", "80 triệu (tuyển sinh + hồ sơ)"],
  ["Hoàn tiền trượt Visa", "25 triệu VND"]
];

generalInfo.forEach((item, index) => {
  const row = 4 + index;
  sheet1.getCell(`A${row}`).value = item[0];
  sheet1.getCell(`B${row}`).value = item[1];
  sheet1.getCell(`A${row}`).font = { size: 11 };
  sheet1.getCell(`B${row}`).font = { size: 11 };
  sheet1.getCell(`A${row}`).alignment = { vertical: "center" };
  sheet1.getCell(`B${row}`).alignment = { vertical: "center" };
});

// Refund Policy
sheet1.mergeCells("A16:B16");
sheet1.getCell("A16").value = "CHÍNH SÁCH HOÀN TIỀN";
sheet1.getCell("A16").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
sheet1.getCell("A16").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
sheet1.getCell("A16").alignment = { horizontal: "center", vertical: "center" };

sheet1.getCell("A17").value = "Điều kiện hoàn tiền";
sheet1.getCell("B17").value = "Sinh năm 2k5, 2k6, 2k7, 2k8; tối đa 1 lần trượt Visa";
sheet1.getCell("A17").font = { size: 11 };
sheet1.getCell("B17").font = { size: 11 };

// Minimum Requirements
sheet1.mergeCells("A19:B19");
sheet1.getCell("A19").value = "ĐIỀU KIỆN MỞ LỚP";
sheet1.getCell("A19").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
sheet1.getCell("A19").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
sheet1.getCell("A19").alignment = { horizontal: "center", vertical: "center" };

sheet1.getCell("A20").value = "Tối thiểu sinh viên tại Việt Nam";
sheet1.getCell("B20").value = "20 sinh viên";
sheet1.getCell("A21").value = "Tối thiểu hồ sơ đăng ký trường Hàn";
sheet1.getCell("B21").value = "30 hồ sơ";

// Table 15 Schools
sheet1.mergeCells("D3:L3");
sheet1.getCell("D3").value = "DANH SÁCH 15 TRƯỜNG TUYỂN SINH D2-6 THÁNG 3/2027";
sheet1.getCell("D3").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
sheet1.getCell("D3").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet1.getCell("D3").alignment = { horizontal: "center", vertical: "center" };

const schoolHeaders = ["STT", "Tên trường", "Tên tiếng Hàn", "Địa chỉ", "Loại trường", "Hệ Visa", "Chỉ tiêu", "Website", "Học phí/6tháng"];
schoolHeaders.forEach((header, index) => {
  const cell = sheet1.getCell(4, 4 + index);
  cell.value = header;
  applyHeaderStyle(sheet1, cell);
});

const schools = [
  [1, "ĐH OSAN", "오산대학교", "Gyeonggi-do (cách Seoul 35km)", "Tư thục", "D2-6>D2-1", 200, "www.osan.ac.kr", "1.659.500 - 1.907.000 KRW"],
  [2, "ĐH INDUK", "인덕대학교", "Seoul - Nowon-gu", "Tư thục", "D2-6>D2-1", 200, "www.induk.ac.kr", "1.400.000 - 1.543.500 KRW"],
  [3, "ĐH YEONSUNG", "연성대학교", "Anyang-si, Gyeonggi-do", "Cao đẳng tư thục", "D2-6>D2-2", 200, "www.yeonsung.ac.kr", "1.700.000 KRW"],
  [4, "ĐH SANGMYUNG", "상명대학교", "Seoul (Jongno-gu)", "Tư thục", "D2-6>D2-1/D2-2", 200, "www.smu.ac.kr", "2.500.000 - 3.000.000 KRW"],
  [5, "ĐH KYUNGIN", "경인여자대학교", "Incheon", "Tư thục (Nữ)", "D2-6>D2-2", 200, "www.kiwu.ac.kr", "2.000.000 - 2.500.000 KRW"],
  [6, "ĐH DONGNAM", "동남보건대학교", "Suwon-si, Gyeonggi-do", "Tư thục chuyên đào tạo", "D2-6>D2-2", 200, "www.dongnamak.kg.kr", "1.594.300 - 1.800.000 KRW"],
  [7, "ĐH DONGEUI", "동의대학교", "Busan", "Tư thục", "D2-6>D2-1", 200, "www.deu.ac.kr", "1.387.000 - 1.896.000 KRW"],
  [8, "CĐ SUNCHEON JEIL", "순천제일대학교", "Jeollanam-do", "Cao đẳng tư thục", "D2-6>D2-2", 200, "www.suncheon.ac.kr", "1.600.000 KRW"],
  [9, "ĐH BUSAN NỮ", "부산여자대학교", "Busan", "Tư thục (Nữ)", "D2-6>D2-2", 200, "www.bwc.ac.kr", "1.438.000 - 2.013.200 KRW"],
  [10, "ĐH BUSAN CATHOLIC", "부경대학교", "Busan", "Công lập", "D2-6>D2-1", 200, "www.catholic.ac.kr", "2.500.000 - 3.000.000 KRW"],
  [11, "ĐH GIMHAE", "김해대학교", "Gyeongsangnam-do", "Cao đẳng tư thục", "D2-6>D2-2", 200, "www.gimhae.ac.kr", "2.711.150 KRW/năm"],
  [12, "ĐH GWANGJU", "광주대학교", "Gwangju", "Tư thục", "D2-6>D2-1/D2-2", 200, "www.gwangju.ac.kr", "1.500.000 - 1.800.000 KRW"],
  [13, "ĐH NAMBU", "남부대학교", "Gwangju", "Tư thục", "D2-6>D2-2", 200, "www.nambu.ac.kr", "2.000.000 KRW (sau HP 50%)"],
  [14, "ĐH DONGEON", "대원대학교", "Jecheon-si, Chungcheongbuk-do", "Cao đẳng tư thục", "D2-6>D2-2", 200, "www.daewon.ac.kr", "1.317.250 KRW (thấp nhất)"],
  [15, "ĐH SENGMYUNG", "성명대학교", "Busan", "Cao đẳng tư thục", "D2-6>D2-2", 200, "www.sungmyung.ac.kr", "1.500.000 - 1.700.000 KRW"]
];

schools.forEach((school, rowIndex) => {
  const row = 5 + rowIndex;
  school.forEach((value, colIndex) => {
    const cell = sheet1.getCell(row, 4 + colIndex);
    cell.value = value;
    cell.font = { size: 10 };
    cell.alignment = { vertical: "center", wrapText: true };
    if (rowIndex % 2 === 0) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEEFF" } };
    }
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  });
  sheet1.getRow(row).height = 25;
});

// Vietnamese Partner Schools
sheet1.mergeCells("D23:L23");
sheet1.getCell("D23").value = "DANH SÁCH 16 TRƯỜNG ĐẠI HỌC & CAO ĐẲNG TẠI VIỆT NAM MOU";
sheet1.getCell("D23").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
sheet1.getCell("D23").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet1.getCell("D23").alignment = { horizontal: "center", vertical: "center" };

const vietSchoolHeaders = ["STT", "Tên trường", "Địa chỉ", "Website", "Ghi chú"];
vietSchoolHeaders.forEach((header, index) => {
  const cell = sheet1.getCell(24, 4 + index);
  cell.value = header;
  applyHeaderStyle(sheet1, cell);
});

const vietSchools = [
  [1, "Cao đẳng Hà Nội (HNC)", "Số 8 Tôn Thất Thuyết, Cầu Giấy, HN", "", ""],
  [2, "Cao đẳng Hữu Nghị (HNC)", "Đống Đa, HN", "", ""],
  [3, "Cao đẳng Thương mại và Du lịch (TMDT)", "Hà Nội", "", ""],
  [4, "Cao đẳng Truyền hình Việt Nam (VTV)", "Hà Nội", "", ""],
  [5, "Cao đẳng Công nghiệp Bắc Giang (HNC)", "Bắc Giang", "", ""],
  [6, "Cao đẳng Y tế Hải Phòng (HPC)", "Hải Phòng", "", ""],
  [7, "Cao đẳng CN Y Dược Việt Nam (YDVN)", "Hà Nội", "", ""],
  [8, "ĐH Trưng Vương (TVU)", "TP.HCM", "", ""],
  [9, "ĐH Quản lý và KD Hữu Nghị (HNC)", "HN", "", ""],
  [10, "Cao đẳng KTKT Thương mại (HCCT)", "HN", "", ""],
  [11, "Cao đẳng Công nghệ Sài gòn (SGT)", "TP.HCM", "", ""],
  [12, "Cao đẳng Công nghệ i-space (iSpace)", "TP.HCM", "", ""],
  [13, "Cao đẳng Đồng An (DA)", "Bình Dương", "", ""],
  [14, "ĐH Sao Đỏ (SĐ)", "Hải Dương", "", ""],
  [15, "Cao đẳng Duyên hải (DH)", "Hải Phòng", "", ""],
  [16, "Cao đẳng KTKT Trung ương (BCIT)", "HN", "", ""]
];

vietSchools.forEach((school, rowIndex) => {
  const row = 25 + rowIndex;
  school.forEach((value, colIndex) => {
    const cell = sheet1.getCell(row, 4 + colIndex);
    cell.value = value;
    cell.font = { size: 10 };
    cell.alignment = { vertical: "center", wrapText: true };
    if (rowIndex % 2 === 0) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
    }
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  });
  sheet1.getRow(row).height = 20;
});

// Set column widths for sheet 1
sheet1.getColumn(1).width = 30;
sheet1.getColumn(2).width = 45;
for (let i = 3; i <= 12; i++) {
  sheet1.getColumn(i).width = 18;
}

// ============= SHEET 2-16: INDIVIDUAL SCHOOL SHEETS =============
const schoolDetails = [
  {
    name: "ĐH OSAN",
    koreanName: "오산대학교 - Osan University",
    visa: "D2-6 > D2-1",
    quota: 200,
    address: "45 Cheonghak-ro, Osan-si, Gyeonggi-do (Cách Seoul 35km về phía Nam)",
    website: "www.osan.ac.kr",
    established: 1978,
    type: "Đại học tư thục",
    intro: "Trường Đại học Osan được thành lập năm 1978, là một trong những trường đại học tư thục hàng đầu tại tỉnh Gyeonggi. Trường nằm cách Seoul 35km về phía Nam, thuận tiện cho việc đi lại và làm việc tại Seoul. Top 3 trường Gyeonggi về chất lượng đào tạo.",
    requirements: [
      "• Dưới 25 tuổi (sinh năm 2001 trở đi)",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Số buổi nghỉ không quá 30 buổi",
      "• Đã trượt Visa: D4-1, D2-1, D2-2, D2-3, E9",
      "• Không yêu cầu chứng chỉ tiếng Hàn",
      "• Không yêu cầu phỏng vấn ĐSQ",
      "• Không yêu cầu đóng băng tài chính"
    ],
    majors: [
      "1. Kỹ thuật Cơ khí (기계과)",
      "2. Ô tô Tương lai (미래전기자동차과)",
      "3. Ô tô Điều chỉnh (자동차튜닝과)",
      "4. Thiết kế Nội dung Số (디지털콘텐츠디자인)",
      "5. An toàn Lao động (안전보건관리과)",
      "6. Khoa học Máy tính (컴퓨터정보)",
      "7. Kỹ thuật Điện (전기과)",
      "8. Thiết bị Bán dẫn (반도체장비과)",
      "9. AI Bán dẫn (AI반도체)",
      "10. Drone Quân sự (전투드론과)",
      "11. Pha chế Cafe & K-POP (카페바리스타과)",
      "12. Quản lý Thú y (반려동물관리과)",
      "13. Sức khỏe Phục hồi (건강재활과)",
      "14. K-Beauty (뷰티코스메틱)",
      "15. Quản lý Khách sạn (호텔관광경영과)"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1 sau khi hoàn thành thủ tục",
    documents: [
      "1. Hộ chiếu (bản scan)",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 - Xác nhận quan hệ gia đình (dịch công chứng)",
      "7. Chứng minh thư bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND hoặc 13 triệu KRW (sao kê 6 tháng)",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng (3 cái)"
    ],
    advantages: [
      "✓ Cách Seoul 35km - thuận tiện đi lại",
      "✓ Top 3 trường Gyeonggi",
      "✓ Học phí thấp sau học bổng 50%",
      "✓ Đi làm thêm ngay khi có ARC",
      "✓ Tỷ lệ đỗ Visa cao với Topik 2",
      "✓ Lịch học linh hoạt (1-3 buổi/tuần)",
      "✓ Hỗ trợ chuyển đổi E7 sau tốt nghiệp"
    ],
    tuition: [
      "★ Ngành Kỹ thuật (Cơ khí, Ô tô, Điện, AI, Bán dẫn...): 1.907.000 KRW/6 tháng",
      "★ Ngành Dịch vụ (Khách sạn, Hàng không, Ẩm thực...): 1.831.500 KRW/6 tháng",
      "★ Ngành Xã hội (Marketing, Thương mại, Thú y...): 1.659.500 KRW/6 tháng",
      "(Học phí sau khi áp dụng học bổng 50%)"
    ],
    ktx: [
      "• KTX ngoài khuôn viên: 1.500.000 - 2.000.000 KRW/6 tháng",
      "• Ở ngoài tự thuê: 300.000 - 500.000 KRW/tháng"
    ],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.osan.ac.kr"
  },
  {
    name: "ĐH INDUK",
    koreanName: "인덕대학교 - Induk University",
    visa: "D2-6 > D2-1",
    quota: 200,
    address: "12 Choansan-ro, Wolgye-dong, Nowon-gu, Seoul 01878",
    website: "www.induk.ac.kr",
    established: 1971,
    type: "Đại học tư thục",
    intro: "Trường Đại học Induk được thành lập năm 1971, tọa lạc ngay tại Seoul - Nowon-gu. Trường nằm gần ga tàu Wolgye (tuyến 1), thuận tiện cho việc đi lại và làm việc. Học phí cực rẻ, phù hợp với sinh viên có ngân sách hạn chế.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa: D4-1, D2-1, D2-2, D2-3, E9"
    ],
    majors: [
      "1. Quản trị Du lịch và Dịch vụ",
      "2. Kỹ thuật Ô tô",
      "3. Công nghệ Thông tin",
      "4. Thiết kế Đồ họa",
      "5. Kinh doanh Quốc tế",
      "6. Ngôn ngữ Hàn",
      "7. Du lịch Hàng không",
      "8. Pha chế Barista",
      "9. Kỹ thuật Điện",
      "10. Chăm sóc Sắc đẹp"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1 sau khi hoàn thành thủ tục",
    documents: [
      "1. Hộ chiếu (dịch công chứng)",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy chứng minh thu nhập bố mẹ",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng (3 cái)"
    ],
    advantages: [
      "✓ Ngay tại Seoul - Nowon-gu",
      "✓ Gần ga tàu Wolgye (tuyến 1)",
      "✓ Học phí cực rẻ sau học bổng 50%",
      "✓ Đi làm thêm dễ dàng ở Seoul"
    ],
    tuition: [
      "★ Khoa học/Kỹ thuật: 1.543.500 KRW/6 tháng (sau học bổng 50%)",
      "★ Nhân văn/Xã hội: 1.400.000 KRW/6 tháng (sau học bổng 50%)"
    ],
    ktx: [
      "• Nữ: 200.000 KRW/tháng (4 người/phòng, trong khuôn viên)",
      "• Nam: 250.000 KRW/tháng (4 người/phòng, cách trường 20 phút)"
    ],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.induk.ac.kr"
  },
  {
    name: "ĐH YEONSUNG",
    koreanName: "연성대학교 - Yeonsung University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "34 Yanghwa-ro, Manan-gu, Anyang-si, Gyeonggi-do",
    website: "www.yeonsung.ac.kr",
    established: 1977,
    type: "Cao đẳng tư thục",
    intro: "Trường Cao đẳng Yeonsung được thành lập năm 1977, có quan hệ đối tác với 43 trường tại 14 quốc gia. Trường có chương trình P-TECH gắn với doanh nghiệp, và shuttle bus từ ga Anyang.",
    requirements: [
      "• Dưới 24 tuổi",
      "• GPA cấp 3: 5.5 trở lên",
      "• Số buổi nghỉ không quá 30 buổi",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "Smart ICT: Khoa học Máy tính, AI, An ninh mạng, Kỹ thuật Phần mềm",
      "Smart City: Xây dựng, Kiến trúc, Cơ khí, Điện tự động",
      "Creative Design: Thiết kế Nội thất, Thiết kế Đồ họa, Kỹ thuật Số",
      "Broadcasting & Culture: Truyền thông, K-POP, Du lịch",
      "Global Business: Kinh doanh Quốc tế, Marketing, Logistics",
      "Physical Education: Giáo dục Thể chất, Kinesiology"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Đối tác với 43 trường tại 14 quốc gia",
      "✓ Chương trình P-TECH gắn với doanh nghiệp",
      "✓ Shuttle bus từ ga Anyang",
      "✓ Học phí 1.700.000 KRW/6 tháng sau học bổng 50%"
    ],
    tuition: ["★ Tất cả ngành: 1.700.000 KRW/6 tháng (sau học bổng 50%)"],
    ktx: ["• 1.650.000 KRW/6 tháng (ngoài khuôn viên)"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.yeonsung.ac.kr"
  },
  {
    name: "ĐH SANGMYUNG",
    koreanName: "상명대학교 - Sangmyung University",
    visa: "D2-6 > D2-1/D2-2",
    quota: 200,
    address: "Seoul Campus (Jongno-gu) & Cheonan Campus",
    website: "www.smu.ac.kr",
    established: 1961,
    type: "Đại học tư thục",
    intro: "Trường Đại học Sangmyung được thành lập năm 1961, có campus tại trung tâm Seoul (Jongno-gu). Trường hỗ trợ sinh viên quốc tế đa ngôn ngữ và có tài liệu tiếng Việt.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Quản trị Kinh doanh",
      "2. Ngôn ngữ và Văn hóa",
      "3. Thiết kế Công nghiệp",
      "4. Truyền thông Đại chúng",
      "5. Du lịch và Khách sạn",
      "6. Nghệ thuật Ẩm thực",
      "7. Kỹ thuật Số",
      "8. Sư phạm Tiếng Hàn"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1 hoặc D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Trung tâm Seoul - thuận tiện",
      "✓ Hỗ trợ sinh viên quốc tế đa ngôn ngữ",
      "✓ Có tài liệu tiếng Việt"
    ],
    tuition: [
      "★ Nhân văn/Xã hội: 2.500.000 KRW/học kỳ (sau học bổng)",
      "★ Kỹ thuật/Nghệ thuật: 3.000.000 KRW/học kỳ (sau học bổng)"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.smu.ac.kr"
  },
  {
    name: "ĐH KYUNGIN (Nữ)",
    koreanName: "경인여자대학교 - Kyungin Women's University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "Incheon",
    website: "www.kiwu.ac.kr",
    established: 1992,
    type: "Đại học tư thục (Nữ)",
    intro: "Trường Đại học Nữ sinh Kyungin được thành lập năm 1992, là trường đại học nữ sinh top đầu tại Incheon. Trường có học bổng 30-50% và tỷ lệ việc làm cao sau tốt nghiệp.",
    requirements: [
      "• Nữ giới",
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Điều dưỡng",
      "2. Sư phạm Mầm non",
      "3. Thư ký Hành chính",
      "4. Kế toán Thuế",
      "5. Quản trị Khách sạn",
      "6. Kinh doanh",
      "7. Thiết kế Thời trang",
      "8. Mỹ thuật"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Top đầu Incheon",
      "✓ Học bổng 30-50%",
      "✓ Tỷ lệ việc làm cao"
    ],
    tuition: [
      "★ Ngôn ngữ: 4.400.000 KRW/năm",
      "★ Chuyên ngành: 2.000.000 - 2.500.000 KRW/6 tháng"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.kiwu.ac.kr"
  },
  {
    name: "ĐH DONGNAM",
    koreanName: "동남보건대학교 - Dongnam Health University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "50 Cheoncheon-ro 74-gil, Jangan-gu, Suwon-si, Gyeonggi-do",
    website: "www.dongnamak.kg.kr",
    established: 1973,
    type: "Đại học chuyên đào tạo tư thục",
    intro: "Trường Đại học Dongnam được thành lập năm 1973, chuyên về đào tạo các ngành Y tế - Sức khỏe. Trường xếp hạng #240 tại Hàn Quốc và có tỷ lệ việc làm cao trong ngành y tế.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Điều dưỡng",
      "2. Khoa học Sức khỏe",
      "3. Y tá Thú y",
      "4. Vật lý trị liệu",
      "5. Chăm sóc Da và Spa",
      "6. Dinh dưỡng",
      "7. Y học Cổ truyền"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Chuyên về Y tế - Sức khỏe",
      "✓ Xếp hạng #240 tại Hàn Quốc",
      "✓ Tỷ lệ việc làm cao trong ngành y tế"
    ],
    tuition: [
      "★ Khoa học Sức khỏe: 1.594.300 - 1.738.800 KRW/6 tháng",
      "★ Điều dưỡng: 1.800.000 KRW/6 tháng"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.dongnamak.kg.kr"
  },
  {
    name: "ĐH DONGEUI",
    koreanName: "동의대학교 - Dong-Eui University",
    visa: "D2-6 > D2-1 (4 năm)",
    quota: 200,
    address: "Busan",
    website: "www.deu.ac.kr",
    established: 1976,
    type: "Đại học tư thục",
    intro: "Trường Đại học Dong-Eui được thành lập năm 1976, tọa lạc tại Busan - thành phố lớn thứ 2 của Hàn Quốc. Trường có chương trình chuyển đổi lên D2-1 (4 năm) và chi phí sinh hoạt thấp hơn Seoul.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Kỹ thuật Ô tô",
      "2. Kỹ thuật Cơ khí",
      "3. Điện tử",
      "4. Công nghệ Thông tin",
      "5. Quản trị Kinh doanh",
      "6. Du lịch",
      "7. Ngôn ngữ",
      "8. Kinesiology"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1 (4 năm)",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Busan - thành phố lớn thứ 2 Hàn Quốc",
      "✓ Chuyển đổi lên D2-1 (4 năm)",
      "✓ Chi phí sinh hoạt thấp hơn Seoul"
    ],
    tuition: [
      "★ Nhân văn: 2.774.000 KRW/6 tháng",
      "★ Kỹ thuật: 3.792.000 KRW/6 tháng",
      "★ Sau học bổng 50%: Giảm 50%"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.deu.ac.kr"
  },
  {
    name: "CĐ SUNCHEON JEIL",
    koreanName: "순천제일대학교 - Suncheon Jeil College",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "San 9-3, Dokwol-dong, Suncheon-si, Jeollanam-do",
    website: "www.suncheon.ac.kr",
    established: 1978,
    type: "Cao đẳng tư thục",
    intro: "Trường Cao đẳng Suncheon Jeil được thành lập năm 1978, có Top 3% visa approval rate và 85% sinh viên có việc làm sau 6 tháng. Chi phí sinh hoạt chỉ 60-70% so với Seoul và gần Busan (2 giờ xe buýt).",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Công nghệ Ô tô",
      "2. Kỹ thuật Điện",
      "3. Xây dựng",
      "4. Pha chế Cafe & Khoa học Ẩm thực",
      "5. Cơ khí Ô tô",
      "6. K-Beauty (Làm đẹp tổng hợp)",
      "7. Du lịch và Khách sạn",
      "8. Logistics"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Top 3% visa approval rate",
      "✓ 85% sinh viên có việc làm sau 6 tháng",
      "✓ Chi phí sinh hoạt 60-70% so với Seoul",
      "✓ Gần Busan (2 giờ xe buýt)"
    ],
    tuition: ["★ Tất cả ngành: 1.600.000 KRW/6 tháng (sau học bổng 50%)"],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.suncheon.ac.kr"
  },
  {
    name: "ĐH BUSAN NỮ",
    koreanName: "부산여자대학교 - Busan Women's University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "506 Jinnam-ro, Busanjin-gu, Busan",
    website: "www.bwc.ac.kr",
    established: 1969,
    type: "Đại học tư thục (Nữ)",
    intro: "Trường Đại học Nữ sinh Busan được thành lập năm 1969, tọa lạc tại Busan - thành phố lớn. Trường có nhiều chương trình học bổng hấp dẫn bao gồm học bổng 500.000 KRW/tiểu học kỳ và học bổng gia đình đa văn hóa 30%.",
    requirements: [
      "• Nữ giới",
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Công nghệ Thông tin",
      "2. Kinh doanh",
      "3. Du lịch",
      "4. Chăm sóc Sức khỏe",
      "5. Sư phạm",
      "6. Thiết kế",
      "7. Ngôn ngữ",
      "8. Logistics"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Học bổng 500.000 KRW/tiểu học kỳ",
      "✓ Học bổng gia đình đa văn hóa: 30%",
      "✓ Busan - thành phố lớn"
    ],
    tuition: [
      "★ Sau học bổng 30%: 2.013.200 KRW/học kỳ",
      "★ Sau học bổng 50%: 1.438.000 KRW/học kỳ"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.bwc.ac.kr"
  },
  {
    name: "ĐH BUSAN CATHOLIC",
    koreanName: "부경대학교 - Catholic University of Pusan",
    visa: "D2-6 > D2-1",
    quota: 200,
    address: "Busan",
    website: "www.catholic.ac.kr",
    established: 1964,
    type: "Đại học Công lập",
    intro: "Trường Đại học Công lập được thành lập năm 1964, có 673 sinh viên quốc tế. Là trường đại học công lập nên chi phí thấp và có nhiều học bổng theo Topik.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Khoa học Phòng thí nghiệm",
      "2. Quan hệ Quốc tế",
      "3. Kinh doanh Quốc tế",
      "4. Ngôn ngữ",
      "5. Du lịch"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Đại học Công lập - chi phí thấp",
      "✓ 673 sinh viên quốc tế",
      "✓ Học bổng theo Topik"
    ],
    tuition: [
      "★ Nhân văn: 2.500.000 KRW/học kỳ",
      "★ Kỹ thuật: 3.000.000 KRW/học kỳ"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.catholic.ac.kr"
  },
  {
    name: "ĐH GIMHAE",
    koreanName: "김해대학교 - Gimhae College",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "Gimhae, Gyeongsangnam-do",
    website: "www.gimhae.ac.kr",
    established: 2005,
    type: "Cao đẳng tư thục",
    intro: "Trường Cao đẳng Gimhae được thành lập năm 2005, có Top 3 visa approval rate và KTX bắt buộc đảm bảo an toàn cho sinh viên. Trường nằm gần Busan.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Kỹ thuật Ô tô",
      "2. Cơ khí",
      "3. Điện tử",
      "4. Công nghệ Thông tin",
      "5. Du lịch và Khách sạn",
      "6. Kinh doanh"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Top 3 visa approval rate",
      "✓ KTX bắt buộc - an toàn",
      "✓ Gần Busan"
    ],
    tuition: ["★ Sau học bổng 50%: 2.711.150 KRW/năm (5.422.300 KRW/2 kỳ)"],
    ktx: ["• Bắt buộc: 600.000 KRW/kỳ"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.gimhae.ac.kr"
  },
  {
    name: "ĐH GWANGJU",
    koreanName: "광주대학교 - Gwangju University",
    visa: "D2-6 > D2-1/D2-2",
    quota: 200,
    address: "Gwangju",
    website: "www.gwangju.ac.kr",
    established: 1960,
    type: "Đại học tư thục",
    intro: "Trường Đại học Gwangju được thành lập năm 1960, tọa lạc tại Gwangju - thành phố lớn với chi phí sinh hoạt thấp và nhiều cơ hội việc làm.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Kỹ thuật",
      "2. Công nghệ",
      "3. Kinh doanh",
      "4. Du lịch",
      "5. Nghệ thuật",
      "6. Khoa học Xã hội"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-1 hoặc D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Gwangju - thành phố lớn",
      "✓ Chi phí sinh hoạt thấp",
      "✓ Nhiều cơ hội việc làm"
    ],
    tuition: ["★ 1.500.000 - 1.800.000 KRW/6 tháng (sau học bổng 50%)"],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.gwangju.ac.kr"
  },
  {
    name: "ĐH NAMBU",
    koreanName: "남부대학교 - Nambu University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "Gwangju",
    website: "www.nambu.ac.kr",
    established: 1950,
    type: "Đại học tư thục",
    intro: "Trường Đại học Nambu được thành lập năm 1950, nổi tiếng về đào tạo thể thao (Taekwondo, Bơi lội). Khuôn viên xanh - môi trường học tập tốt. Yêu cầu GPA: 6.0 trở lên.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 6.0 trở lên (yêu cầu cao hơn)",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Võ thuật (Taekwondo)",
      "2. Bơi lội",
      "3. Kỹ thuật Ô tô",
      "4. Công nghệ Thông tin",
      "5. Du lịch",
      "6. Kinh doanh"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Top về thể thao (Taekwondo, Bơi lội)",
      "✓ Khuôn viên xanh - môi trường học tập tốt",
      "✓ Yêu cầu GPA: 6.0 trở lên"
    ],
    tuition: [
      "★ Ngôn ngữ: 4.000.000 KRW/năm",
      "★ Sau học bổng: Giảm 50%"
    ],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.nambu.ac.kr"
  },
  {
    name: "ĐH DONGEON",
    koreanName: "대원대학교 - Daewon College",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "316 Daehak-ro, Sinwol-dong, Jecheon-si, Chungcheongbuk-do",
    website: "www.daewon.ac.kr",
    established: 1995,
    type: "Cao đẳng tư thục",
    intro: "Trường Cao đẳng Daewon có học phí thấp nhất trong tất cả các trường (1.317.250 KRW/6 tháng). Học bổng 69.9% cho sinh viên mới, tỷ lệ có việc làm 76.4%, và lịch học linh hoạt 1-3 buổi/tuần.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Kỹ thuật & Công nghệ Ô tô",
      "2. Điện-Điện tử",
      "3. Xây dựng-Đường sắt",
      "4. Kiến trúc & Nội thất",
      "5. Quản lý Chất lượng Dược phẩm",
      "6. Phúc lợi Xã hội",
      "7. Giáo dục Mầm non",
      "8. Du lịch Hàng không",
      "9. Khách sạn-Ẩm thực",
      "10. Quản lý Casino"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Học phí thấp nhất (1.317.250 KRW/6 tháng)",
      "✓ Học bổng 69.9% cho sinh viên mới",
      "✓ Tỷ lệ có việc làm: 76.4%",
      "✓ Lịch học linh hoạt: 1-3 buổi/tuần"
    ],
    tuition: ["★ 1.317.250 KRW/6 tháng (học phí thấp nhất, sau học bổng 50%)"],
    ktx: ["• 750.000 KRW/6 tháng"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.daewon.ac.kr"
  },
  {
    name: "ĐH SENGMYUNG",
    koreanName: "성명대학교 - Sungmyung University",
    visa: "D2-6 > D2-2",
    quota: 200,
    address: "Busan",
    website: "www.sungmyung.ac.kr",
    established: 1965,
    type: "Cao đẳng tư thục",
    intro: "Trường Cao đẳng Sungmyung được thành lập năm 1965, tọa lạc tại Busan với lịch học linh hoạt và nhiều cơ hội việc làm.",
    requirements: [
      "• Dưới 25 tuổi",
      "• Tốt nghiệp THPT hoặc CĐ/ĐH",
      "• GPA cấp 3: 5.5 trở lên",
      "• Đã trượt Visa các hệ trước"
    ],
    majors: [
      "1. Kỹ thuật",
      "2. Công nghệ",
      "3. Dịch vụ",
      "4. Du lịch",
      "5. Thương mại"
    ],
    transferTime: "Chuyển đổi từ D2-6 sang D2-2",
    documents: [
      "1. Hộ chiếu",
      "2. Bằng tốt nghiệp THPT (dịch công chứng)",
      "3. Học bạ THPT (dịch công chứng)",
      "4. Giấy xác nhận sinh viên (dịch công chứng)",
      "5. Bảng điểm CĐ/ĐH (dịch công chứng)",
      "6. CT07 (dịch công chứng)",
      "7. CCCD bố mẹ (dịch công chứng)",
      "8. Sổ tiết kiệm 250 triệu VND",
      "9. Giấy bảo lãnh tài chính",
      "10. Application form",
      "11. Ảnh 3x4 nền trắng"
    ],
    advantages: [
      "✓ Lịch học linh hoạt",
      "✓ Gần Busan - nhiều cơ hội việc làm"
    ],
    tuition: ["★ 1.500.000 - 1.700.000 KRW/6 tháng (sau học bổng 50%)"],
    ktx: ["• Liên hệ trường để biết thông tin chi tiết"],
    invoice: "Invoice trường VN: 30 triệu VND | Invoice trường Hàn: 100 triệu VND",
    video: "https://www.sungmyung.ac.kr"
  }
];

// Create individual school sheets
for (let i = 0; i < schoolDetails.length; i++) {
  const school = schoolDetails[i];
  const sheet = workbook.addWorksheet(`${i + 2}. ${school.name}`);
  
  // Row 1: School Name
  sheet.mergeCells("A1:G1");
  sheet.getCell("A1").value = school.name;
  sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
  sheet.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
  sheet.getRow(1).height = 35;
  
  // Row 2: Korean/English Name
  sheet.mergeCells("A2:G2");
  sheet.getCell("A2").value = school.koreanName;
  sheet.getCell("A2").font = { bold: true, size: 12, color: { argb: "FF1F4E79" } };
  sheet.getCell("A2").alignment = { horizontal: "center", vertical: "center" };
  sheet.getRow(2).height = 25;
  
  const sections = [
    { row: 4, label: "Hệ giáo dục", value: school.visa },
    { row: 5, label: "Chỉ tiêu tuyển sinh", value: `${school.quota} hồ sơ` },
    { row: 6, label: "Trường Việt Nam ký MOU", value: "Tất cả 16 trường: Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng TMDT, Cao đẳng VTV, Cao đẳng CNBG, Cao đẳng Y tế HP, Cao đẳng YDVN, ĐH Trưng Vương, ĐH QLKD HN, Cao đẳng HCCT, Cao đẳng SGT, Cao đẳng iSpace, Cao đẳng Đồng An, ĐH Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng BCIT" },
    { row: 7, label: "Catalog", value: school.website },
    { row: 8, label: "Vị trí địa lý", value: school.address },
    { row: 9, label: "Giới thiệu về trường", value: school.intro },
    { row: 10, label: "Năm thành lập/Loại trường", value: `Thành lập: ${school.established} | ${school.type}` },
    { row: 11, label: "Điều kiện tuyển sinh", value: school.requirements.join("\n") },
    { row: 12, label: "Các chuyên ngành tuyển sinh diện D2-6", value: school.majors.join("\n") },
    { row: 13, label: "Thời gian chuyển đổi", value: school.transferTime },
    { row: 14, label: "Hồ sơ trường Hàn cần lưu ý", value: school.documents.join("\n") },
    { row: 15, label: "Ưu điểm", value: school.advantages.join("\n") },
    { row: 16, label: "Học phí (per 6 months)", value: school.tuition.join("\n") },
    { row: 17, label: "KTX", value: school.ktx.join("\n") },
    { row: 18, label: "Mẫu Invoice", value: school.invoice },
    { row: 19, label: "Clip về trường", value: school.video }
  ];
  
  for (const section of sections) {
    const { row, label, value } = section;
    
    sheet.getCell(`A${row}`).value = label;
    sheet.getCell(`A${row}`).font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    sheet.getCell(`A${row}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
    sheet.getCell(`A${row}`).alignment = { vertical: "top" };
    
    sheet.mergeCells(`B${row}:G${row}`);
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`B${row}`).font = { size: 11 };
    sheet.getCell(`B${row}`).alignment = { vertical: "top", wrapText: true };
    
    const lineCount = value.split("\n").length;
    sheet.getRow(row).height = Math.max(20, lineCount * 15);
    
    sheet.getCell(`A${row}`).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
    sheet.getCell(`B${row}`).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }
  
  // Vietnamese Partner Schools Section
  sheet.mergeCells("A21:G21");
  sheet.getCell("A21").value = "TRƯỜNG ĐẠI HỌC & CAO ĐẲNG TẠI VIỆT NAM MOU";
  sheet.getCell("A21").font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  sheet.getCell("A21").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
  sheet.getCell("A21").alignment = { horizontal: "center", vertical: "center" };
  sheet.getRow(21).height = 25;
  
  const vietSchoolList = [
    "1. Cao đẳng Hà Nội (HNC) - Số 8 Tôn Thất Thuyết, Cầu Giấy, HN",
    "2. Cao đẳng Hữu Nghị (HNC) - Đống Đa, HN",
    "3. Cao đẳng Thương mại và Du lịch (TMDT) - Hà Nội",
    "4. Cao đẳng Truyền hình Việt Nam (VTV) - Hà Nội",
    "5. Cao đẳng Công nghiệp Bắc Giang (HNC) - Bắc Giang",
    "6. Cao đẳng Y tế Hải Phòng (HPC) - Hải Phòng",
    "7. Cao đẳng CN Y Dược Việt Nam (YDVN) - Hà Nội",
    "8. ĐH Trưng Vương (TVU) - TP.HCM",
    "9. ĐH Quản lý và KD Hữu Nghị (HNC) - HN",
    "10. Cao đẳng KTKT Thương mại (HCCT) - HN",
    "11. Cao đẳng Công nghệ Sài gòn (SGT) - TP.HCM",
    "12. Cao đẳng Công nghệ i-space (iSpace) - TP.HCM",
    "13. Cao đẳng Đồng An (DA) - Bình Dương",
    "14. ĐH Sao Đỏ (SĐ) - Hải Dương",
    "15. Cao đẳng Duyên hải (DH) - Hải Phòng",
    "16. Cao đẳng KTKT Trung ương (BCIT) - HN"
  ];
  
  for (let j = 0; j < vietSchoolList.length; j++) {
    sheet.mergeCells(`A${22 + j}:G${22 + j}`);
    sheet.getCell(`A${22 + j}`).value = vietSchoolList[j];
    sheet.getCell(`A${22 + j}`).font = { size: 10 };
    sheet.getCell(`A${22 + j}`).alignment = { vertical: "center" };
    sheet.getRow(22 + j).height = 18;
    
    if (j % 2 === 0) {
      sheet.getCell(`A${22 + j}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
    }
    
    sheet.getCell(`A${22 + j}`).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }
  
  sheet.getColumn(1).width = 35;
  for (let c = 2; c <= 7; c++) {
    sheet.getColumn(c).width = 20;
  }
}

// ============= SHEET 17: CHECKLIST XIN VISA D2-6 =============
const sheet17 = workbook.addWorksheet("17. Checklist HS xin Visa D2-6");

sheet17.mergeCells("A1:E1");
sheet17.getCell("A1").value = "CHECK LIST HỒ SƠ XIN VISA D2-6";
sheet17.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
sheet17.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet17.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
sheet17.getRow(1).height = 30;

const checklistHeaders = ["STT", "NỘI DUNG HỒ SƠ", "CÓ/KHÔNG", "GHI CHÚ", "NGÀY HOÀN THÀNH"];
checklistHeaders.forEach((header, index) => {
  const cell = sheet17.getCell(2, 1 + index);
  cell.value = header;
  cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
  cell.alignment = { horizontal: "center", vertical: "center", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } }
  };
});

const checklist = [
  "Hộ chiếu còn hạn (còn ít nhất 6 tháng tính từ ngày dự kiến nhập cảnh)",
  "Hộ chiếu scan màu (trang thông tin và trang visa cũ)",
  "Ảnh 3x4 nền trắng (3 cái, chụp trong vòng 6 tháng)",
  "Bằng tốt nghiệp THPT (bản gốc hoặc bản sao công chứng)",
  "Bản dịch tiếng Hàn bằng tốt nghiệp THPT (công chứng)",
  "Học bạ THPT (bản gốc hoặc bản sao công chứng)",
  "Bản dịch tiếng Hàn học bạ THPT (công chứng)",
  "Giấy xác nhận sinh viên (nếu đang học CĐ/ĐH)",
  "Bản dịch tiếng Hàn giấy xác nhận sinh viên",
  "Bảng điểm CĐ/ĐH (nếu có, bản sao công chứng)",
  "Bản dịch tiếng Hàn bảng điểm CĐ/ĐH",
  "CT07 - Xác nhận quan hệ gia đình (công chứng)",
  "Bản dịch tiếng Hàn CT07",
  "Chứng minh thư bố mẹ (bản sao công chứng)",
  "Bản dịch tiếng Hàn chứng minh thư bố mẹ",
  "Sổ tiết kiệm 250 triệu VND hoặc 13 triệu KRW",
  "Sao kê sổ tiết kiệm 6 tháng gần nhất",
  "Giấy bảo lãnh tài chính của bố mẹ",
  "Giấy xác nhận thu nhập của bố mẹ",
  "Hợp đồng lao động hoặc giấy tờ chứng minh nghề nghiệp bố mẹ",
  "Application form của trường (điền đầy đủ thông tin)",
  "Giấy tiếp nhận của trường (Certificate of Admission)",
  "Invoice trường Việt Nam (30 triệu VND)",
  "Invoice trường Hàn Quốc (100 triệu VND)",
  "Biên lai thanh toán học phí",
  "Thư mời nhập học từ trường",
  "Bảo hiểm du lịch cho sinh viên",
  "Kế hoạch học tập (Study Plan) - bằng tiếng Hàn",
  "Bản giới thiệu bản thân (Self Introduction) - bằng tiếng Hàn",
  "Chứng chỉ tiếng Hàn Topik (nếu có)",
  "Hồ sơ phỏng vấn (nếu được yêu cầu)",
  "Đơn xin visa D2-6 (điền trực tuyến trên website)",
  "Phí xin visa (60 USD hoặc tương đương)",
  "Thư bảo lãnh từ trường (Letter of Guarantee)",
  "Hợp đồng đào tạo với trường",
  "Bảng điểm tiếng Hàn (nếu đã học)",
  "Chứng chỉ hoàn thành khóa học tiếng Hàn",
  "Thư giới thiệu (Letter of Recommendation)",
  "Bản cam kết về việc tuân thủ luật pháp Hàn Quốc",
  "Bản cam kết về việc không làm việc bất hợp pháp",
  "Hồ sơ chứng minh mục đích học tập rõ ràng",
  "Bản khai chi tiết về kế hoạch sau tốt nghiệp",
  "Hồ sơ kiểm tra sức khỏe (nếu yêu cầu)",
  "Giấy xác nhận tiêm chủng (nếu yêu cầu)",
  "Photo tất cả các tài liệu (2 bộ)",
  "Dịch tất cả tài liệu ra tiếng Hàn (2 bộ)",
  "Công chứng tất cả tài liệu",
  "Hồ sơ xin visa đã được kiểm tra lại",
  "Đặt lịch hẹn phỏng vấn (nếu cần)",
  "Chuẩn bị trang phục lịch sự cho phỏng vấn",
  "Chuẩn bị câu hỏi phỏng vấn tiếng Hàn",
  "Kiểm tra địa chỉ Lãnh sự quán/H Consulate",
  "Chuẩn bị phương tiện đi lại đến Lãnh sự quán",
  "Mang theo điện thoại (trong trường hợp cần liên lạc)",
  "Kiểm tra lại toàn bộ hồ sơ lần cuối",
  "Photo hộ chiếu bố mẹ (2 bản)",
  "Số điện thoại liên hệ khẩn cấp tại Hàn Quốc",
  "Địa chỉ trường tại Hàn Quốc (in sẵn)",
  "Số điện thoại trường tại Hàn Quốc",
  "Email liên hệ với trường"
];

checklist.forEach((item, index) => {
  const row = 3 + index;
  sheet17.getCell(row, 1).value = index + 1;
  sheet17.getCell(row, 1).alignment = { horizontal: "center", vertical: "center" };
  sheet17.getCell(row, 2).value = item;
  sheet17.getCell(row, 2).alignment = { vertical: "center", wrapText: true };
  sheet17.getCell(row, 3).value = "☐";
  sheet17.getCell(row, 3).alignment = { horizontal: "center", vertical: "center" };
  sheet17.getCell(row, 4).value = "";
  sheet17.getCell(row, 5).value = "";
  sheet17.getCell(row, 5).alignment = { horizontal: "center", vertical: "center" };
  
  sheet17.getCell(row, 1).font = { size: 10 };
  sheet17.getCell(row, 2).font = { size: 10 };
  sheet17.getCell(row, 3).font = { size: 14 };
  sheet17.getCell(row, 4).font = { size: 10 };
  sheet17.getCell(row, 5).font = { size: 10 };
  
  sheet17.getRow(row).height = 20;
  
  if (index % 2 === 0) {
    for (let c = 1; c <= 5; c++) {
      sheet17.getCell(row, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    }
  }
  
  for (let c = 1; c <= 5; c++) {
    sheet17.getCell(row, c).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }
});

sheet17.getColumn(1).width = 8;
sheet17.getColumn(2).width = 60;
sheet17.getColumn(3).width = 12;
sheet17.getColumn(4).width = 30;
sheet17.getColumn(5).width = 18;

// ============= SHEET 18: TÀI LIỆU ÔN PHỎNG VẤN =============
const sheet18 = workbook.addWorksheet("18. Tai lieu on phong van");

sheet18.mergeCells("A1:D1");
sheet18.getCell("A1").value = "TÀI LIỆU ÔN PHỎNG VẤN VISA D2-6";
sheet18.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
sheet18.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet18.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
sheet18.getRow(1).height = 30;

const interviewQuestions = [
  { category: "CÂU HỎI VỀ BẢN THÂN", questions: [
    "Giới thiệu về bản thân bạn?",
    "Bạn tên gì? Bao nhiêu tuổi?",
    "Bạn học trường nào ở Việt Nam?",
    "Bạn học ngành gì?",
    "Thành tích học tập của bạn như thế nào?",
    "Tại sao bạn muốn đi Hàn Quốc học?",
    "Tại sao bạn chọn trường này?",
    "Bạn biết gì về trường Đại học mà bạn đăng ký?",
    "Bạn đã học tiếng Hàn được bao lâu rồi?",
    "Trình độ tiếng Hàn của bạn hiện tại là gì?"
  ]},
  { category: "CÂU HỎI VỀ MỤC ĐÍCH HỌC TẬP", questions: [
    "Tại sao bạn chọn ngành này?",
    "Bạn dự định học gì tại Hàn Quốc?",
    "Mục tiêu học tập của bạn là gì?",
    "Sau khi tốt nghiệp, bạn có kế hoạch gì?",
    "Tại sao không tiếp tục học ở Việt Nam?",
    "Bạn có dự định chuyển tiếp lên bậc cao hơn không?",
    "Bạn đã tìm hiểu về chương trình đào tạo chưa?"
  ]},
  { category: "CÂU HỎI VỀ TÀI CHÍNH", questions: [
    "Ai sẽ chi trả học phí và sinh hoạt phí cho bạn?",
    "Nghề nghiệp của bố mẹ bạn là gì?",
    "Thu nhập hàng tháng của gia đình bạn là bao nhiêu?",
    "Gia đình bạn có khả năng chi trả chi phí học tập không?",
    "Bạn có kế hoạch làm thêm không?",
    "Bạn biết chi phí sinh hoạt ở Hàn Quốc là bao nhiêu không?",
    "Nguồn tiền đóng học phí đến từ đâu?"
  ]},
  { category: "CÂU HỎI VỀ KẾ HOẠCH SAU TỐT NGHIỆP", questions: [
    "Sau khi tốt nghiệp, bạn có ở lại Hàn Quốc làm việc không?",
    "Bạn có quay về Việt Nam không? Tại sao?",
    "Bạn dự định làm việc trong lĩnh vực gì?",
    "Bạn nghĩ kiến thức từ Hàn Quốc sẽ giúp gì cho bạn?",
    "Bạn có kế hoạch ở lại Hàn Quốc lâu dài không?"
  ]},
  { category: "CÂU HỎI VỀ TRƯỜNG VÀ CUỘC SỐNG", questions: [
    "Bạn đã bao giờ đến Hàn Quốc chưa?",
    "Bạn biết gì về văn hóa Hàn Quốc?",
    "Bạn sẽ ở đâu khi sang Hàn Quốc?",
    "Bạn có người quen ở Hàn Quốc không?",
    "Bạn có lo lắng về việc sống xa gia đình không?",
    "Bạn có sẵn sàng thích nghi với cuộc sống mới không?"
  ]},
  { category: "CÂU HỎI VỀ LÝ DO TRƯỢT VISA TRƯỚC ĐÓ", questions: [
    "Lần trước bạn trượt visa vì lý do gì?",
    "Bạn đã rút kinh nghiệm gì từ lần trượt trước?",
    "Lần này bạn có gì khác so với lần trước?",
    "Bạn có chứng chỉ tiếng Hàn Topik chưa?",
    "Bạn đã làm gì để cải thiện hồ sơ?"
  ]}
];

let currentRow = 3;
for (const section of interviewQuestions) {
  sheet18.mergeCells(`A${currentRow}:D${currentRow}`);
  sheet18.getCell(`A${currentRow}`).value = section.category;
  sheet18.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  sheet18.getCell(`A${currentRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
  sheet18.getCell(`A${currentRow}`).alignment = { horizontal: "center", vertical: "center" };
  sheet18.getRow(currentRow).height = 25;
  currentRow++;
  
  for (const q of section.questions) {
    sheet18.getCell(`B${currentRow}`).value = q;
    sheet18.getCell(`B${currentRow}`).font = { size: 11 };
    sheet18.getCell(`B${currentRow}`).alignment = { vertical: "center", wrapText: true };
    sheet18.getRow(currentRow).height = 25;
    
    if ((currentRow - 3) % 2 === 0) {
      sheet18.getCell(`A${currentRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
      sheet18.getCell(`B${currentRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
      sheet18.getCell(`C${currentRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
      sheet18.getCell(`D${currentRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } };
    }
    currentRow++;
  }
  currentRow++;
}

sheet18.getColumn(1).width = 5;
sheet18.getColumn(2).width = 70;
sheet18.getColumn(3).width = 30;
sheet18.getColumn(4).width = 30;

// ============= SHEET 19: APPLICATION TRƯỜNG HÀN =============
const sheet19 = workbook.addWorksheet("19. Application Han Quoc");

sheet19.mergeCells("A1:L1");
sheet19.getCell("A1").value = "APPLICATION FORM - TRƯỜNG ĐẠI HỌC HÀN QUỐC";
sheet19.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
sheet19.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet19.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
sheet19.getRow(1).height = 30;

const applicationFields = [
  { label: "1. THÔNG TIN CÁ NHÂN", fields: ["Họ và tên (tiếng Việt):", "Họ và tên (tiếng Hàn/English):", "Ngày sinh (YYYY/MM/DD):", "Nơi sinh:", "Giới tính:", "Quốc tịch:", "Số hộ chiếu:", "Ngày hết hạn hộ chiếu:", "Số điện thoại:", "Email:", "Địa chỉ hiện tại tại Việt Nam:"] },
  { label: "2. THÔNG TIN GIA ĐÌNH", fields: ["Họ tên bố:", "Nghề nghiệp bố:", "Số điện thoại bố:", "Họ tên mẹ:", "Nghề nghiệp mẹ:", "Số điện thoại mẹ:", "Địa chỉ gia đình:"] },
  { label: "3. THÔNG TIN HỌC VẤN", fields: ["Trường THPT đã tốt nghiệp:", "Năm tốt nghiệp:", "GPA THPT:", "Trường CĐ/ĐH (nếu có):", "Ngành học CĐ/ĐH:", "Năm tốt nghiệp CĐ/ĐH:"] },
  { label: "4. THÔNG TIN TRƯỜNG ĐĂNG KÝ", fields: ["Tên trường đăng ký:", "Ngành đăng ký:", "Hệ đào tạo (D2-1/D2-2):", "Kỳ nhập học:"] },
  { label: "5. THÔNG TIN TIẾNG HÀN", fields: ["Trình độ tiếng Hàn hiện tại:", "Chứng chỉ Topik:", "Đã học tiếng Hàn bao lâu?:", "Mục tiêu trình độ tiếng Hàn:"] },
  { label: "6. THÔNG TIN TÀI CHÍNH", fields: ["Người bảo lãnh tài chính:", "Quan hệ với người bảo lãnh:", "Nguồn tài chính:", "Số tiền cam kết:"] },
  { label: "7. KẾ HOẠCH HỌC TẬP", fields: ["Mục tiêu học tập:", "Kế hoạch sau tốt nghiệp:", "Lý do chọn ngành này:"] },
  { label: "8. LỊCH SỬ VISA", fields: ["Đã từng xin visa Hàn Quốc?:", "Loại visa đã xin:", "Kết quả:", "Nếu trượt, lý do:"] }
];

let appRow = 3;
for (const section of applicationFields) {
  sheet19.mergeCells(`A${appRow}:L${appRow}`);
  sheet19.getCell(`A${appRow}`).value = section.label;
  sheet19.getCell(`A${appRow}`).font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  sheet19.getCell(`A${appRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E75B6" } };
  sheet19.getCell(`A${appRow}`).alignment = { horizontal: "center", vertical: "center" };
  sheet19.getRow(appRow).height = 25;
  appRow++;
  
  for (const field of section.fields) {
    sheet19.getCell(`A${appRow}`).value = field;
    sheet19.getCell(`A${appRow}`).font = { size: 10, bold: true };
    sheet19.getCell(`A${appRow}`).alignment = { vertical: "center" };
    
    sheet19.mergeCells(`B${appRow}:L${appRow}`);
    sheet19.getCell(`B${appRow}`).value = "";
    sheet19.getCell(`B${appRow}`).font = { size: 10 };
    sheet19.getCell(`B${appRow}`).border = {
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } }
    };
    
    sheet19.getRow(appRow).height = 22;
    appRow++;
  }
  appRow++;
}

for (let c = 1; c <= 12; c++) {
  sheet19.getColumn(c).width = 15;
}

// ============= SHEET 20: THÔNG TIN LÀM TEM =============
const sheet20 = workbook.addWorksheet("20. Thong tin lam tem");

sheet20.mergeCells("A1:J1");
sheet20.getCell("A1").value = "BẢNG THEO DÕI TIẾN ĐỘ TUYỂN SINH D2-6 THÁNG 3/2027";
sheet20.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
sheet20.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
sheet20.getCell("A1").alignment = { horizontal: "center", vertical: "center" };
sheet20.getRow(1).height = 30;

const trackingHeaders = ["STT", "Họ tên", "Ngày sinh", "SĐT", "Trường đăng ký", "Ngành", "Ngày nộp hồ sơ", "Invoice VN", "Invoice Hàn", "Ghi chú"];
trackingHeaders.forEach((header, index) => {
  const cell = sheet20.getCell(2, 1 + index);
  cell.value = header;
  cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
  cell.alignment = { horizontal: "center", vertical: "center", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } }
  };
});

for (let i = 1; i <= 50; i++) {
  const row = 3 + i;
  sheet20.getCell(row, 1).value = i;
  sheet20.getCell(row, 1).alignment = { horizontal: "center", vertical: "center" };
  sheet20.getCell(row, 1).font = { size: 10 };
  
  for (let c = 2; c <= 10; c++) {
    sheet20.getCell(row, c).value = "";
    sheet20.getCell(row, c).font = { size: 10 };
    sheet20.getCell(row, c).alignment = { vertical: "center" };
  }
  
  sheet20.getRow(row).height = 20;
  
  if (i % 2 === 0) {
    for (let c = 1; c <= 10; c++) {
      sheet20.getCell(row, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEEFF" } };
    }
  }
  
  for (let c = 1; c <= 10; c++) {
    sheet20.getCell(row, c).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  }
}

sheet20.getColumn(1).width = 8;
sheet20.getColumn(2).width = 25;
sheet20.getColumn(3).width = 15;
sheet20.getColumn(4).width = 15;
sheet20.getColumn(5).width = 20;
sheet20.getColumn(6).width = 20;
sheet20.getColumn(7).width = 18;
sheet20.getColumn(8).width = 12;
sheet20.getColumn(9).width = 12;
sheet20.getColumn(10).width = 25;

// Save the workbook
const outputPath = "c:/Users/phant/thong-tin-truong-han/Thong tin truong Han ky thang 3_2027.xlsx";

workbook.xlsx.writeFile(outputPath)
  .then(() => {
    console.log("Excel file created successfully at: " + outputPath);
  })
  .catch(err => {
    console.error("Error creating Excel file:", err);
  });
