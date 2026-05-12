const ExcelJS = require('exceljs');

async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Danh sách trường Hàn
  const sheet1 = workbook.addWorksheet("Danh sách trường Hàn");

  // Header rows with red background (rows 1-3)
  for (let row = 1; row <= 3; row++) {
    const range = sheet1.getRow(row);
    range.getCell(1).value = "";
    for (let col = 1; col <= 7; col++) {
      const cell = range.getCell(col);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'center' };
    }
  }

  // Row 1
  sheet1.mergeCells('A1:G1');
  sheet1.getRow(1).getCell(1).value = "CHÍNH SÁCH BÁN HÀNG VISA D2-6 KỲ THÁNG 3 NĂM 2027";
  sheet1.getRow(1).getCell(1).font = { size: 14, bold: true };
  sheet1.getRow(1).getCell(1).alignment = { horizontal: 'center', vertical: 'center' };
  sheet1.getRow(1).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };

  // Row 2
  sheet1.mergeCells('A2:G2');
  sheet1.getRow(2).getCell(1).value = "VĂN BẢN LƯU HÀNH NỘI BỘ";
  sheet1.getRow(2).getCell(1).font = { size: 12, bold: true };
  sheet1.getRow(2).getCell(1).alignment = { horizontal: 'center', vertical: 'center' };
  sheet1.getRow(2).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };

  // Row 3
  sheet1.mergeCells('A3:G3');
  sheet1.getRow(3).getCell(1).value = "NGHIÊM CẤM CÔNG BỐ VĂN BẢN NÀY RA NGOÀI";
  sheet1.getRow(3).getCell(1).font = { size: 11, bold: true };
  sheet1.getRow(3).getCell(1).alignment = { horizontal: 'center', vertical: 'center' };
  sheet1.getRow(3).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };

  // Row 5
  sheet1.getRow(5).getCell(1).value = "Tổng quan chính sách:";
  sheet1.getRow(5).getCell(1).font = { bold: true, size: 12 };

  // Rows 6-12: Two-column key-value pairs
  const overviewData = [
    ["1. Tổng thu:", "260 triệu"],
    ["2. Gói tiêu chuẩn (Tuyển sinh):", "60 triệu"],
    ["3. Gói chuyên nghiệp (Tuyển sinh + Hồ sơ):", "80 triệu"],
    ["4. Hoàn tiền nếu trượt Visa:", "25 triệu"],
    ["5. Ngày cuối cùng nhận hồ sơ:", "08/11/2026"],
    ["6. Ngày khai giảng:", "15/09/2026"],
    ["7. Chỉ tiêu:", "3.000 hồ sơ"]
  ];

  for (let i = 0; i < overviewData.length; i++) {
    const row = 6 + i;
    sheet1.getRow(row).getCell(1).value = overviewData[i][0];
    sheet1.getRow(row).getCell(2).value = overviewData[i][1];
  }

  // Row 14
  sheet1.getRow(14).getCell(1).value = "Lộ trình đóng tiền:";
  sheet1.getRow(14).getCell(1).font = { bold: true, size: 12 };

  // Rows 15-17
  const paymentData = [
    ["- Lần 1:", "30 triệu (bao gồm invoice trường Việt Nam)"],
    ["- Lần 2:", "100 triệu (bao gồm invoice Hàn Quốc)"],
    ["- Lần 3:", "Phần còn lại + Bảo lãnh cư trú hợp pháp"]
  ];

  for (let i = 0; i < paymentData.length; i++) {
    const row = 15 + i;
    sheet1.getRow(row).getCell(1).value = paymentData[i][0];
    sheet1.getRow(row).getCell(2).value = paymentData[i][1];
  }

  // Row 19
  sheet1.getRow(19).getCell(1).value = "Điều kiện hoàn tiền (25 triệu khi trượt Visa):";
  sheet1.getRow(19).getCell(1).font = { bold: true, size: 12 };

  // Rows 20-23
  const refundConditions = [
    "- Sinh năm: 2k5, 2k6, 2k7, 2k8",
    "- Tối đa trượt 01 lần các loại Visa khác nhau",
    "- Không có người thân bất hợp pháp tại Hàn Quốc",
    "- Hồ sơ không phải phỏng vấn ĐSQ hoặc LSQ"
  ];

  for (let i = 0; i < refundConditions.length; i++) {
    sheet1.getRow(20 + i).getCell(1).value = refundConditions[i];
  }

  // Row 25
  sheet1.getRow(25).getCell(1).value = "Điều kiện mở lớp:";
  sheet1.getRow(25).getCell(1).font = { bold: true, size: 12 };

  // Rows 26-27
  const classConditions = [
    "- Tối thiểu 20 sinh viên tại Việt Nam",
    "- Tối thiểu 30 hồ sơ đăng ký trường Hàn"
  ];

  for (let i = 0; i < classConditions.length; i++) {
    sheet1.getRow(26 + i).getCell(1).value = classConditions[i];
  }

  // Row 30
  sheet1.getRow(30).getCell(1).value = "DANH SÁCH TRƯỜNG HÀN QUỐC (14 trường):";
  sheet1.getRow(30).getCell(1).font = { bold: true, size: 12 };

  // Row 31: Headers
  sheet1.getRow(31).getCell(1).value = "STT";
  sheet1.getRow(31).getCell(1).font = { bold: true };
  sheet1.getRow(31).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  sheet1.getRow(31).getCell(2).value = "Tên trường";
  sheet1.getRow(31).getCell(2).font = { bold: true };
  sheet1.getRow(31).getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  sheet1.getRow(31).getCell(3).value = "Ghi chú";
  sheet1.getRow(31).getCell(3).font = { bold: true };
  sheet1.getRow(31).getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  // Rows 32-46: Korean schools (15 schools)
  const koreanSchools = [
    ["ĐH Osan", ""],
    ["ĐH Induk", ""],
    ["ĐH Yeonsung", ""],
    ["ĐH Sangmyung", ""],
    ["ĐH Nữ sinh Kyungin", "Nữ"],
    ["ĐH Y Tế Dongnam", ""],
    ["ĐH Dongeui", ""],
    ["CĐ Suncheon Jeil", ""],
    ["ĐH Nữ sinh Busan", "Nữ"],
    ["ĐH Busan Catholic", ""],
    ["ĐH Gimhae", ""],
    ["ĐH Gwangju", ""],
    ["ĐH Nambu", ""],
    ["ĐH Daewon", ""],
    ["ĐH Sengmyung", ""]
  ];

  for (let i = 0; i < koreanSchools.length; i++) {
    const row = 32 + i;
    const bgColor = i % 2 === 0 ? 'FFF0F0F0' : 'FFFFFFFF';
    sheet1.getRow(row).getCell(1).value = i + 1;
    sheet1.getRow(row).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    sheet1.getRow(row).getCell(2).value = koreanSchools[i][0];
    sheet1.getRow(row).getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    sheet1.getRow(row).getCell(3).value = koreanSchools[i][1];
    sheet1.getRow(row).getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  }

  // Row 48
  sheet1.getRow(48).getCell(1).value = "DANH SÁCH TRƯỜNG VIỆT NAM (16 trường):";
  sheet1.getRow(48).getCell(1).font = { bold: true, size: 12 };

  // Row 49: Headers
  sheet1.getRow(49).getCell(1).value = "STT";
  sheet1.getRow(49).getCell(1).font = { bold: true };
  sheet1.getRow(49).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };

  sheet1.getRow(49).getCell(2).value = "Tên trường";
  sheet1.getRow(49).getCell(2).font = { bold: true };
  sheet1.getRow(49).getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };

  sheet1.getRow(49).getCell(3).value = "Ghi chú";
  sheet1.getRow(49).getCell(3).font = { bold: true };
  sheet1.getRow(49).getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };

  // Rows 50-65: Vietnamese schools (16 schools)
  const vietnameseSchools = [
    "Cao đẳng Hà Nội",
    "Cao đẳng Hữu Nghị",
    "Cao đẳng Thương mại và Du lịch",
    "Cao đẳng truyền hình Việt Nam",
    "Cao đẳng công nghiệp Bắc Giang",
    "Cao đẳng Y tế Hải Phòng",
    "Cao đẳng công nghệ Y Dược Việt Nam",
    "Đại học Trưng Vương",
    "Đại học Quản lý và Kinh doanh Hữu Nghị",
    "Cao đẳng Kinh tế kỹ thuật thương mại",
    "Cao đẳng công nghệ Sài gòn",
    "Cao đẳng công nghệ i-space",
    "Cao đẳng Đồng An",
    "Đại học Sao Đỏ",
    "Cao đẳng Duyên hải",
    "Cao đẳng Kinh tế kỹ thuật trung ương"
  ];

  for (let i = 0; i < vietnameseSchools.length; i++) {
    const row = 50 + i;
    const bgColor = i % 2 === 0 ? 'FFF0F0F0' : 'FFFFFFFF';
    sheet1.getRow(row).getCell(1).value = i + 1;
    sheet1.getRow(row).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    sheet1.getRow(row).getCell(2).value = vietnameseSchools[i];
    sheet1.getRow(row).getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    sheet1.getRow(row).getCell(3).value = "";
    sheet1.getRow(row).getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  }

  // Set column widths for Sheet 1
  sheet1.getColumn(1).width = 25;
  sheet1.getColumn(2).width = 45;
  sheet1.getColumn(3).width = 15;
  sheet1.getColumn(4).width = 12;
  sheet1.getColumn(5).width = 12;
  sheet1.getColumn(6).width = 12;
  sheet1.getColumn(7).width = 12;

  // Korean Schools Data
  const koreanSchoolsData = [
    { name: "ĐH Osan", english: "Osan University" },
    { name: "ĐH Induk", english: "Induk University" },
    { name: "ĐH Yeonsung", english: "Yeonsung University" },
    { name: "ĐH Sangmyung", english: "Sangmyung University" },
    { name: "ĐH Nữ sinh Kyungin", english: "Kyungin Women's University" },
    { name: "ĐH Y Tế Dongnam", english: "Dongnam Health University" },
    { name: "ĐH Dongeui", english: "Dong-Eui University" },
    { name: "CĐ Suncheon Jeil", english: "Suncheon Jeil College" },
    { name: "ĐH Nữ sinh Busan", english: "Busan Women's College" },
    { name: "ĐH Busan Catholic", english: "Busan Catholic University" },
    { name: "ĐH Gimhae", english: "Gimhae University" },
    { name: "ĐH Gwangju", english: "Gwangju University" },
    { name: "ĐH Nambu", english: "Nambu University" },
    { name: "ĐH Daewon", english: "Daewon College" },
    { name: "ĐH Sengmyung", english: "Sengmyung University" }
  ];

  // Create individual sheets for each Korean school (Sheets 2-16)
  koreanSchoolsData.forEach((school) => {
    const sheet = workbook.addWorksheet(school.name);

    // Row 1: School name
    sheet.getRow(1).getCell(1).value = `TRƯỜNG ${school.name}`;
    sheet.getRow(1).getCell(1).font = { size: 16, bold: true };

    // Row 2: English name
    sheet.getRow(2).getCell(1).value = `English: ${school.english}`;
    sheet.getRow(2).getCell(1).font = { size: 12 };

    // Row 3
    sheet.getRow(3).getCell(1).value = "Chương trình: D2-6 > D2-1 hoặc D2-2";
    sheet.getRow(3).getCell(1).font = { size: 11 };

    // Row 4
    sheet.getRow(4).getCell(1).value = "Đối tượng: Học sinh đã tốt nghiệp Cao đẳng/Đại học tại Việt Nam";
    sheet.getRow(4).getCell(1).font = { size: 11 };

    // Row 5
    sheet.getRow(5).getCell(1).value = "Điều kiện:";
    sheet.getRow(5).getCell(1).font = { bold: true, size: 11 };

    // Rows 6-11: Conditions
    const conditions = [
      "- Tuổi: Dưới 25 tuổi",
      "- GPA: Theo yêu cầu từng trường",
      "- Đã trượt Visa: D4-1, D2-1, D2-2, D2-3, E9",
      "- Không yêu cầu phỏng vấn ĐSQ",
      "- Không yêu cầu bằng chứng tài chính (không cần Kstudy, không cần freeze)",
      "- Được đi làm thêm ngay khi có chứng minh thư"
    ];

    for (let i = 0; i < conditions.length; i++) {
      sheet.getRow(6 + i).getCell(1).value = conditions[i];
      sheet.getRow(6 + i).getCell(1).font = { size: 11 };
    }

    // Row 12
    sheet.getRow(12).getCell(1).value = "Quyền lợi:";
    sheet.getRow(12).getCell(1).font = { bold: true, size: 11 };

    // Rows 13-16: Benefits
    const benefits = [
      "- Chuyển nghĩa vụ quân sự vào trường CĐ/ĐH",
      "- Lịch học vừa sức tại Hàn Quốc",
      "- Hỗ trợ lên chuyên ngành (Topik 2 hoặc hoàn thành lớp tiếng Hàn)",
      "- Điều kiện đi làm thêm sớm"
    ];

    for (let i = 0; i < benefits.length; i++) {
      sheet.getRow(13 + i).getCell(1).value = benefits[i];
      sheet.getRow(13 + i).getCell(1).font = { size: 11 };
    }

    // Row 17
    sheet.getRow(17).getCell(1).value = "Học phí: Theo invoice trường Hàn Quốc (khoảng 1.5-2 triệu KRW/6 tháng)";
    sheet.getRow(17).getCell(1).font = { size: 11 };

    // Row 18
    sheet.getRow(18).getCell(1).value = "Ký túc xá: Theo invoice trường Hàn Quốc";
    sheet.getRow(18).getCell(1).font = { size: 11 };

    // Row 19
    sheet.getRow(19).getCell(1).value = "Ghi chú: Thông tin chi tiết sẽ được cập nhật sau";
    sheet.getRow(19).getCell(1).font = { size: 11 };

    // Set column width
    sheet.getColumn(1).width = 80;
  });

  // Sheet 17: Check list HS xin Visa D2-6
  const sheet17 = workbook.addWorksheet("Check list HS xin Visa D2-6");

  sheet17.mergeCells('A1:L1');
  sheet17.getRow(1).getCell(1).value = "CHECK LIST HỌC SINH XIN VISA D2-6 KỲ THÁNG 3/2027";
  sheet17.getRow(1).getCell(1).font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sheet17.getRow(1).getCell(1).alignment = { horizontal: 'center' };
  sheet17.getRow(1).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

  const checklistHeaders = ["STT", "Họ và tên", "Ngày sinh", "Số Passport", "Trường VN", "Trường Hàn", "Ngày nộp hồ sơ", "Đóng tiền Lần 1", "Đóng tiền Lần 2", "Đóng tiền Lần 3", "Kết quả Visa", "Ghi chú"];
  for (let col = 0; col < checklistHeaders.length; col++) {
    const cell = sheet17.getRow(3).getCell(col + 1);
    cell.value = checklistHeaders[col];
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };
    cell.alignment = { horizontal: 'center' };
  }

  // Pre-fill STT column (1-50)
  for (let i = 1; i <= 50; i++) {
    sheet17.getRow(3 + i).getCell(1).value = i;
  }

  // Set column widths for sheet 17
  const colWidths17 = [6, 20, 12, 15, 25, 15, 15, 15, 15, 15, 15, 20];
  for (let i = 0; i < colWidths17.length; i++) {
    sheet17.getColumn(i + 1).width = colWidths17[i];
  }

  // Sheet 18: Tài liệu ôn phỏng vấn
  const sheet18 = workbook.addWorksheet("Tài liệu ôn phỏng vấn");

  sheet18.getRow(1).getCell(1).value = "TÀI LIỆU ÔN PHỎNG VẤN VISA D2-6 KỲ THÁNG 3/2027";
  sheet18.getRow(1).getCell(1).font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sheet18.getRow(1).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

  sheet18.getRow(3).getCell(1).value = "Lưu ý: Hồ sơ D2-6 thường không phỏng vấn ĐSQ hoặc LSQ";
  sheet18.getRow(4).getCell(1).value = "Tuy nhiên, nếu có phỏng vấn, học sinh cần chuẩn bị:";

  const prepItems = [
    "1. Lý do chọn trường và ngành học",
    "2. Kế hoạch học tập sau khi tốt nghiệp",
    "3. Kinh nghiệm học tiếng Hàn",
    "4. Lý do trượt visa lần trước (nếu có)"
  ];
  for (let i = 0; i < prepItems.length; i++) {
    sheet18.getRow(5 + i).getCell(1).value = prepItems[i];
  }

  sheet18.getRow(10).getCell(1).value = "Câu hỏi thường gặp khi phỏng vấn:";
  sheet18.getRow(10).getCell(1).font = { bold: true };

  const interviewQuestions = [
    "1. Bạn biết gì về trường này?",
    "2. Tại sao bạn chọn Hàn Quốc để học?",
    "3. Bạn định làm gì sau khi tốt nghiệp?",
    "4. Bạn có kế hoạch ở lại Hàn Quốc sau khi học xong không?",
    "5. Nguồn tài chính của bạn từ đâu?"
  ];
  for (let i = 0; i < interviewQuestions.length; i++) {
    sheet18.getRow(11 + i).getCell(1).value = interviewQuestions[i];
  }

  sheet18.getRow(17).getCell(1).value = "Mẫu câu trả lời:";
  sheet18.getRow(17).getCell(1).font = { bold: true };

  const sampleAnswers = [
    "- Giới thiệu bản thân",
    "- Lý do chọn ngành học",
    "- Kế hoạch học tập",
    "- Mục tiêu nghề nghiệp"
  ];
  for (let i = 0; i < sampleAnswers.length; i++) {
    sheet18.getRow(18 + i).getCell(1).value = sampleAnswers[i];
  }

  sheet18.getColumn(1).width = 60;

  // Sheet 19: Application trường Hàn
  const sheet19 = workbook.addWorksheet("Application trường Hàn");

  sheet19.getRow(1).getCell(1).value = "APPLICATION CÁC TRƯỜNG HÀN QUỐC - KỲ THÁNG 3/2027";
  sheet19.getRow(1).getCell(1).font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sheet19.getRow(1).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

  sheet19.getRow(3).getCell(1).value = "Ghi chú: File application sẽ được chuẩn bị riêng cho từng trường";
  sheet19.getRow(4).getCell(1).value = "Danh sách các trường cần chuẩn bị application:";
  sheet19.getRow(4).getCell(1).font = { bold: true };

  // Headers
  sheet19.getRow(5).getCell(1).value = "STT";
  sheet19.getRow(5).getCell(1).font = { bold: true };
  sheet19.getRow(5).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  sheet19.getRow(5).getCell(2).value = "Tên trường Hàn";
  sheet19.getRow(5).getCell(2).font = { bold: true };
  sheet19.getRow(5).getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  sheet19.getRow(5).getCell(3).value = "Status";
  sheet19.getRow(5).getCell(3).font = { bold: true };
  sheet19.getRow(5).getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

  // List all 15 Korean schools
  for (let i = 0; i < koreanSchoolsData.length; i++) {
    const row = 6 + i;
    sheet19.getRow(row).getCell(1).value = i + 1;
    sheet19.getRow(row).getCell(2).value = koreanSchoolsData[i].name;
    sheet19.getRow(row).getCell(3).value = "";
  }

  sheet19.getColumn(1).width = 6;
  sheet19.getColumn(2).width = 25;
  sheet19.getColumn(3).width = 15;

  // Sheet 20: Thông tin làm tem các trường
  const sheet20 = workbook.addWorksheet("Thông tin làm tem các trường");

  sheet20.mergeCells('A1:F1');
  sheet20.getRow(1).getCell(1).value = "THÔNG TIN LÀM TEM (STAMP) CÁC TRƯỜNG HÀN - KỲ THÁNG 3/2027";
  sheet20.getRow(1).getCell(1).font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sheet20.getRow(1).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

  // Headers
  const stampHeaders = ["STT", "Tên trường Hàn", "Tên trường Việt Nam", "Ngày làm tem", "Người phụ trách", "Ghi chú"];
  for (let col = 0; col < stampHeaders.length; col++) {
    const cell = sheet20.getRow(3).getCell(col + 1);
    cell.value = stampHeaders[col];
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };
  }

  // List all 15 Korean schools
  for (let i = 0; i < koreanSchoolsData.length; i++) {
    const row = 4 + i;
    sheet20.getRow(row).getCell(1).value = i + 1;
    sheet20.getRow(row).getCell(2).value = koreanSchoolsData[i].name;
  }

  // Set column widths for sheet 20
  const colWidths20 = [6, 25, 30, 15, 20, 25];
  for (let i = 0; i < colWidths20.length; i++) {
    sheet20.getColumn(i + 1).width = colWidths20[i];
  }

  // Save the workbook
  const outputPath = "C:\\Users\\phant\\thong-tin-truong-han\\Thong tin truong Han ky thang 3_2027.xlsx";
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Excel file created successfully at ${outputPath}`);
  console.log(`Total sheets: ${workbook.worksheets.length}`);
}

createWorkbook().catch(err => {
  console.error("Error creating workbook:", err);
  process.exit(1);
});
