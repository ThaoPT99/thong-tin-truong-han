const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Trung Han Education';
workbook.created = new Date();

// ============================================
// SHEET 1: Danh sách trường Hàn
// ============================================
const sheet1 = workbook.addWorksheet("1. Danh sách trường Hàn");

// Title
sheet1.mergeCells('A1:F1');
sheet1.getCell('A1').value = 'DANH SÁCH TRƯỜNG ĐẠI HỌC & CAO ĐẲNG HÀN QUỐC TUYỂN SINH D2-6 THÁNG 3/2027';
sheet1.getCell('A1').font = { bold: true, size: 14 };
sheet1.getCell('A1').alignment = { horizontal: 'center' };

// Policy Section
sheet1.mergeCells('A3:F3');
sheet1.getCell('A3').value = 'THÔNG TIN CHÍNH SÁCH CHUNG';
sheet1.getCell('A3').font = { bold: true, size: 14 };
sheet1.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet1.getCell('A3').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };

const policyData = [
  ['Tổng thu', '260 triệu'],
  ['Gói tiêu chuẩn', '60 triệu (tuyển sinh)'],
  ['Gói chuyên nghiệp', '80 triệu (tuyển sinh + hồ sơ)'],
  ['Hoàn tiền trượt Visa', '25 triệu'],
  ['Ngày cuối nộp hồ sơ', '08/11/2026'],
  ['Ngày khai giảng', '15/09/2027'],
  ['Chỉ tiêu', '3.000 hồ sơ'],
  ['', ''],
  ['Thanh toán', ''],
  ['Lần 1', '30 triệu'],
  ['Lần 2', '100 triệu'],
  ['Lần 3', 'Phần còn lại'],
];

policyData.forEach((row, idx) => {
  sheet1.getCell(`A${idx + 4}`).value = row[0];
  sheet1.getCell(`B${idx + 4}`).value = row[1];
  sheet1.getCell(`A${idx + 4}`).font = { size: 11 };
  sheet1.getCell(`B${idx + 4}`).font = { size: 11 };
});

// Schools Table Header
sheet1.mergeCells('A17:F17');
sheet1.getCell('A17').value = 'DANH SÁCH 15 TRƯỜNG TUYỂN SINH D2-6';
sheet1.getCell('A17').font = { bold: true, size: 14 };
sheet1.getCell('A17').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet1.getCell('A17').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };

// Header Row
const headerRow = ['STT', 'Tên trường (Tiếng Việt)', 'Tên tiếng Anh', 'Chỉ tiêu', 'Học phí/6 tháng', 'Ghi chú'];
headerRow.forEach((val, idx) => {
  const cell = sheet1.getCell(`${String.fromCharCode(65 + idx)}18`);
  cell.value = val;
  cell.font = { bold: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// School data
const schoolsData = [
  [1, 'ĐH Osan', 'Osan University', 50, '1.700.000 KRW', 'Đã giảm 50%'],
  [2, 'ĐH Induk', 'Induk University', 60, '1.543.500 KRW', 'Đã giảm 50%'],
  [3, 'ĐH Yeonsung', 'Yeonsung University', 50, '1.700.000 KRW', 'Đã giảm 50%'],
  [4, 'ĐH Sangmyung', 'Sangmyung University', 50, 'Liên hệ', ''],
  [5, 'ĐH Nữ sinh Kyungin', "Kyungin Women's University", 40, 'Liên hệ', 'Nữ'],
  [6, 'ĐH Y Tế Dongnam', 'Dongnam Health University', 60, '1.594.300-1.738.800 KRW', ''],
  [7, 'ĐH Dongeui', 'Dong-Eui University', 60, '1.800.000 KRW', ''],
  [8, 'CĐ Suncheon Jeil', 'Suncheon Jeil College', 60, '1.600.000 KRW', 'Đã giảm 50%'],
  [9, 'ĐH Nữ sinh Busan', "Busan Women's University", 60, 'Liên hệ', 'Nữ, học bổng 500K/kỳ'],
  [10, 'ĐH Busan Catholic', 'Catholic University of Pusan', 50, 'Liên hệ', ''],
  [11, 'ĐH Gimhae', 'Gimhae College', 40, 'Liên hệ', ''],
  [12, 'ĐH Gwangju', 'Gwangju University', 50, 'Liên hệ', ''],
  [13, 'ĐH Nambu', 'Nambu University', 50, 'Liên hệ', ''],
  [14, 'ĐH Daewon', 'Daewon College', 60, '1.317.250 KRW', 'Đã giảm 50%'],
  [15, 'ĐH Sengmyung', 'Sengmyung College', 50, 'Liên hệ', ''],
];

schoolsData.forEach((row, rowIdx) => {
  row.forEach((val, colIdx) => {
    const cell = sheet1.getCell(`${String.fromCharCode(65 + colIdx)}${rowIdx + 19}`);
    cell.value = val;
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
});

// VN Schools Section
sheet1.mergeCells('A35:F35');
sheet1.getCell('A35').value = 'DANH SÁCH 16 TRƯỜNG ĐẠI HỌC & CAO ĐẲNG TẠI VIỆT NAM (MOU)';
sheet1.getCell('A35').font = { bold: true, size: 14 };
sheet1.getCell('A35').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet1.getCell('A35').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };

// VN Header Row
const vnHeaderRow = ['STT', 'Tên trường (Tiếng Việt)', 'Viết tắt', 'Loại', 'Địa chỉ', 'Ghi chú'];
vnHeaderRow.forEach((val, idx) => {
  const cell = sheet1.getCell(`${String.fromCharCode(65 + idx)}36`);
  cell.value = val;
  cell.font = { bold: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

const vnSchoolsData = [
  [1, 'Cao đẳng Hà Nội', 'HNC', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [2, 'Cao đẳng Hữu Nghị', 'HNC', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [3, 'Cao đẳng Thương mại và Du lịch', 'TMDT', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [4, 'Cao đẳng truyền hình Việt Nam', 'VTV', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [5, 'Cao đẳng công nghiệp Bắc Giang', 'HNC', 'Cao đẳng', 'Bắc Giang', 'MOU'],
  [6, 'Cao đẳng Y tế Hải Phòng', 'HPC', 'Cao đẳng', 'Hải Phòng', 'MOU'],
  [7, 'Cao đẳng Công nghệ Y Dược Việt Nam', 'YDVN', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [8, 'Đại học Trưng Vương', 'TVU', 'Đại học', 'TP.HCM', 'MOU'],
  [9, 'ĐH Quản lý và Kinh doanh Hữu Nghị', 'HNC', 'Đại học', 'Hà Nội', 'MOU'],
  [10, 'Cao đẳng Kinh tế kỹ thuật thương mại', 'HCCT', 'Cao đẳng', 'Hà Nội', 'MOU'],
  [11, 'Cao đẳng Công nghệ Sài gòn', 'SGT', 'Cao đẳng', 'TP.HCM', 'MOU'],
  [12, 'Cao đẳng Công nghệ i-space', 'iSpace', 'Cao đẳng', 'TP.HCM', 'MOU'],
  [13, 'Cao đẳng Đồng An', 'DA', 'Cao đẳng', 'Bình Dương', 'MOU'],
  [14, 'Đại học Sao Đỏ', 'SĐ', 'Đại học', 'Hải Dương', 'MOU'],
  [15, 'Cao đẳng Duyên hải', 'DH', 'Cao đẳng', 'Thanh Hóa', 'MOU'],
  [16, 'Cao đẳng Kinh tế kỹ thuật Trung ương', 'BCIT', 'Cao đẳng', 'Hà Nội', 'MOU'],
];

vnSchoolsData.forEach((row, rowIdx) => {
  row.forEach((val, colIdx) => {
    const cell = sheet1.getCell(`${String.fromCharCode(65 + colIdx)}${rowIdx + 37}`);
    cell.value = val;
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
});

// Column widths
sheet1.getColumn(1).width = 6;
sheet1.getColumn(2).width = 35;
sheet1.getColumn(3).width = 30;
sheet1.getColumn(4).width = 10;
sheet1.getColumn(5).width = 25;
sheet1.getColumn(6).width = 25;

// ============================================
// SCHOOL DATA ARRAY
// ============================================
const schoolDetails = [
  {
    name: 'ĐH Osan',
    englishName: 'Osan University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.uos.ac.kr',
    viTri: '45 Cheonghak-ro, Osan-si, Gyeonggi-do (cách Seoul 35km về phía Nam)',
    gioiThieu: 'Trường được thành lập năm 1978, là trường đại học tư thục hàng đầu tại Hàn Quốc. Đặc biệt mạnh về các ngành Kỹ thuật, Quản trị và Công nghệ. Trường có cơ sở vật chất hiện đại và liên kết chặt chẽ với các doanh nghiệp trong khu vực.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Kỹ thuật cơ khí, Quản trị tiếp thị truyền thông, Công nghệ công nghiệp, Cơ khí',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học phí giảm 50% (1.700.000 KRW/6 tháng)\n- Vị trí gần Seoul\n- Môi trường học tập chất lượng\n- Cơ hội việc làm cao sau tốt nghiệp\n- KTX tiện nghi với chi phí hợp lý (250.000-300.000 KRW/tháng)',
    hocPhi: '1.700.000 KRW/6 tháng (đã giảm 50%)\nHọc phí gốc: 3.400.000 KRW/6 tháng',
    ktx: '250.000-300.000 KRW/tháng (4-6 người/phòng)',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Induk',
    englishName: 'Induk University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.induk.ac.kr',
    viTri: '12 Choansan-ro, Wolgye-dong, Nowon-gu, Seoul',
    gioiThieu: 'Trường Đại học Induk là trường đại học tư thục nằm trong lòng Seoul, được biết đến với các chương trình đào tạo chất lượng cao. Trường đặc biệt mạnh về ngành Du lịch, Dịch vụ và Quản trị.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Quản trị dịch vụ du lịch, Du lịch và Khách sạn, Quản trị Kinh doanh',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học phí giảm 50% (1.543.500 KRW/6 tháng)\n- Vị trí ngay trung tâm Seoul\n- Chuyên ngành Du lịch - Dịch vụ hàng đầu\n- KTX với chi phí tiết kiệm (200.000-250.000 KRW/tháng, 4 người/phòng)\n- Cơ hội thực tập tại các doanh nghiệp lớn',
    hocPhi: '1.543.500 KRW/6 tháng (đã giảm 50%)\nHọc phí gốc: 3.087.000 KRW/6 tháng',
    ktx: '200.000-250.000 KRW/tháng (4 người/phòng)',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Yeonsung',
    englishName: 'Yeonsung University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.yu.ac.kr',
    viTri: '34 Yanghwa-ro, Manan-gu, Anyang-si, Gyeonggi-do',
    gioiThieu: 'Trường Đại học Yeonsung được thành lập năm 1977, là một trong những trường đại học tư thục hàng đầu tại Hàn Quốc. Trường nổi tiếng với đa dạng các chuyên ngành từ Kỹ thuật, ICT, Thiết kế đến Du lịch và Y tế.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Kỹ thuật và ICT, Thiết kế - Nghệ thuật, Kinh tế - quản trị - dịch vụ xã hội, Y tế - Phúc Lợi, Du lịch - ẩm thực - khách sạn',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học phí giảm 50% (1.700.000 KRW/6 tháng)\n- Đa dạng chuyên ngành đào tạo\n- Cơ sở vật chất hiện đại\n- Vị trí thuận tiện (Anyang, gần Seoul)\n- KTX với chi phí hợp lý',
    hocPhi: '1.700.000 KRW/6 tháng (đã giảm 50%)\nHọc phí gốc: 3.400.000 KRW/6 tháng',
    ktx: '1.650.000 KRW/6 tháng',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Sangmyung',
    englishName: 'Sangmyung University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.smu.ac.kr',
    viTri: 'Seoul Campus (Jongno-gu) và Cheonan Campus',
    gioiThieu: 'Trường Đại học Sangmyung là trường đại học tư thục hàng đầu tại Hàn Quốc với 2 campus chính. Trường có bề dày lịch sử và truyền thống đào tạo xuất sắc, đặc biệt trong các ngành Nghệ thuật, Truyền thông và Khoa học Xã hội.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Nghệ thuật, Truyền thông, Khoa học Xã hội, Quản trị Kinh doanh (chi tiết liên hệ)',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- 2 campus tại Seoul và Cheonan\n- Đa dạng chuyên ngành đào tạo\n- Môi trường học tập quốc tế\n- Cơ hội việc làm rộng mở\n- Liên kết với nhiều doanh nghiệp lớn',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Nữ sinh Kyungin',
    englishName: "Kyungin Women's University",
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 40,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.kiwu.ac.kr',
    viTri: "Kyungin Women's University, Seoul, Hàn Quốc",
    gioiThieu: 'Trường Đại học Nữ sinh Kyungin là trường đại học dành riêng cho nữ sinh với bề dày lịch sử đào tạo. Trường tập trung vào các ngành đào tạo phù hợp với phụ nữ như Sư phạm, Quản trị, và các ngành về Xã hội.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương (nữ sinh)\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Sư phạm, Quản trị Kinh doanh, Khoa học Xã hội, Ngôn ngữ (chi tiết liên hệ)',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Môi trường học tập dành cho nữ\n- An toàn và chất lượng\n- Chương trình đào tạo chuyên nghiệp\n- Cơ hội phát triển kỹ năng lãnh đạo',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Y Tế Dongnam',
    englishName: 'Dongnam Health University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.dongnam.ac.kr',
    viTri: '50 Cheoncheon-ro 74-gil, Jangan-gu, Suwon-si, Gyeonggi-do',
    gioiThieu: 'Trường Đại học Y Tế Dongnam được thành lập năm 1973, là một trong những trường đại học hàng đầu về đào tạo các ngành Y tế và Sức khỏe tại Hàn Quốc. Trường có cơ sở vật chất hiện đại với các phòng thí nghiệm và bệnh viện thực hành.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính\n- Có sức khỏe tốt',
    chuyenNganh: 'Khoa học sức khỏe, Điều Dưỡng, Khoa học kỹ thuật',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Chuyên ngành Y tế uy tín\n- Cơ sở vật chất hiện đại\n- Vị trí tại Suwon (gần Seoul)\n- Đào tạo thực hành tại bệnh viện\n- Cơ hội việc làm cao trong ngành Y tế',
    hocPhi: '1.594.300-1.738.800 KRW/6 tháng',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Dongeui',
    englishName: 'Dong-Eui University',
    heGiaoDuc: 'D2-6 > D2-2 (4 năm)',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.deu.ac.kr',
    viTri: 'Dong-Eui University, Busan, Hàn Quốc',
    gioiThieu: 'Trường Đại học Dongeui là trường đại học tư thục hàng đầu tại Busan với đa dạng các chuyên ngành đào tạo. Trường có liên kết chặt chẽ với các doanh nghiệp trong khu vực và cung cấp cơ hội thực tập cho sinh viên.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'D2-6 > D2-2 (4 năm) - Các chuyên ngành đại học 4 năm (chi tiết liên hệ)',
    thoiGian: '4 năm (chương trình D2-2)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Vị trí tại Busan - thành phố lớn thứ 2 Hàn Quốc\n- Chương trình 4 năm (D2-2)\n- Học phí hợp lý (1.800.000 KRW/6 tháng)\n- Cơ hội việc làm đa dạng\n- Môi trường sống chất lượng',
    hocPhi: '1.800.000 KRW/6 tháng',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'CĐ Suncheon Jeil',
    englishName: 'Suncheon Jeil College',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.suncheon.ac.kr',
    viTri: 'San 9-3, Dokwol-dong, Suncheon-si, Jeollanam-do',
    gioiThieu: 'Trường Cao đẳng Suncheon Jeil được thành lập năm 1978, là một trong những trường cao đẳng hàng đầu tại tỉnh Jeollanam-do. Trường nổi tiếng với các chương trình đào tạo nghề chất lượng cao, đặc biệt trong lĩnh vực Công nghệ, Ẩm thực và Làm đẹp.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Công nghệ - Công nghiệp, Pha chế cafe và khoa học ẩm thực, Cơ khí ô tô, Làm đẹp tổng hợp (K-Beauty)',
    thoiGian: '2-3 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học phí giảm 50% (1.600.000 KRW/6 tháng)\n- Chuyên ngành K-Beauty nổi tiếng\n- Đào tạo thực hành chuyên sâu\n- Cơ hội việc làm cao sau tốt nghiệp\n- Môi trường sống yên bình',
    hocPhi: '1.600.000 KRW/6 tháng (đã giảm 50%)\nHọc phí gốc: 3.200.000 KRW/6 tháng',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Nữ sinh Busan',
    englishName: "Busan Women's University",
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.bwu.ac.kr',
    viTri: 'Busanjin-gu, Busan, Hàn Quốc',
    gioiThieu: 'Trường Đại học Nữ sinh Busan được thành lập năm 1969, là trường đại học dành riêng cho nữ sinh với bề dày lịch sử và truyền thống đào tạo xuất sắc. Trường tọa lạc tại Busan - thành phố lớn thứ 2 của Hàn Quốc.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương (nữ sinh)\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Nursing (Điều dưỡng), Childcare (Chăm sóc trẻ), Tourism (Du lịch), Health/Welfare (Y tế - Phúc lợi)',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học bổng 500.000 KRW/tiểu học kỳ\n- Môi trường học tập dành cho nữ\n- Vị trí tại Busan - thành phố lớn\n- Đa dạng chuyên ngành đào tạo\n- Cơ hội việc làm cao',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Busan Catholic',
    englishName: 'Catholic University of Pusan',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.cup.ac.kr',
    viTri: 'Catholic University of Pusan, Busan, Hàn Quốc',
    gioiThieu: 'Trường Đại học Công giáo Busan là trường đại học tư thục gắn liền với Giáo hội Công giáo, mang đến môi trường giáo dục nhân bản và đạo đức. Trường có các chương trình đào tạo đa dạng và chất lượng cao.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Laboratory Science (Khoa học phòng thí nghiệm), International Relations (Quan hệ quốc tế), và các ngành khác (chi tiết liên hệ)',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Môi trường giáo dục nhân bản\n- Vị trí tại Busan\n- Chương trình đào tạo chất lượng\n- Cơ hội học tập quốc tế',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Gimhae',
    englishName: 'Gimhae College',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 40,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.gimhae.ac.kr',
    viTri: 'Gimhae, Gyeongsangnam-do, Hàn Quốc',
    gioiThieu: 'Trường Cao đẳng Gimhae được thành lập năm 2005, là trường cao đẳng công lập tại thành phố Gimhae, tỉnh Gyeongsangnam-do. Trường tập trung vào đào tạo các ngành kỹ thuật và công nghệ với chương trình thực hành chuyên sâu.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Các chương trình kỹ thuật và công nghệ (chi tiết liên hệ)',
    thoiGian: '2-3 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Trường công lập uy tín\n- Phí KTX bắt buộc hợp lý (600.000 KRW/kỳ)\n- Đào tạo thực hành chuyên sâu\n- Gần các khu công nghiệp - cơ hội việc làm',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: '600.000 KRW/kỳ (bắt buộc)',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Gwangju',
    englishName: 'Gwangju University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.gwangju.ac.kr',
    viTri: 'Gwangju University, Gwangju, Hàn Quốc',
    gioiThieu: 'Trường Đại học Gwangju là một trong những trường đại học hàng đầu tại thành phố Gwangju - trung tâm văn hóa và giáo dục của vùng Honam. Trường có đa dạng các chuyên ngành đào tạo từ nhân văn đến kỹ thuật.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Đa dạng các chuyên ngành (chi tiết liên hệ)',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Vị trí tại Gwangju - thành phố văn hóa lớn\n- Đa dạng chuyên ngành đào tạo\n- Môi trường học tập chất lượng\n- Chi phí sinh hoạt hợp lý',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Nambu',
    englishName: 'Nambu University',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.nambu.ac.kr',
    viTri: 'Gwangju, Hàn Quốc',
    gioiThieu: 'Trường Đại học Nambu được thành lập năm 1950, là một trong những trường đại học có bề dày lịch sử lâu đời tại Hàn Quốc. Trường nổi tiếng với các chương trình đào tạo về Thể dục - Thể thao, đặc biệt là Taekwondo và Bơi lội.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Sports (Thể thao) - Taekwondo, Swimming (Bơi lội), và các ngành khác',
    thoiGian: '4 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Bề dày lịch sử từ 1950\n- Chuyên ngành Thể thao nổi tiếng\n- Vị trí tại Gwangju\n- Cơ sở vật chất thể thao hiện đại',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Daewon',
    englishName: 'Daewon College',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 60,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.daewon.ac.kr',
    viTri: 'Jecheon-si, Chungcheongbuk-do, Hàn Quốc',
    gioiThieu: 'Trường Cao đẳng Daewon được thành lập năm 1995, là trường cao đẳng tư thục tại Jecheon-si, tỉnh Chungcheongbuk-do. Trường nổi tiếng với các chương trình đào tạo kỹ thuật chất lượng cao và có tỷ lệ việc làm sau tốt nghiệp cao.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Kỹ thuật & Công nghệ Ô tô, Điện-điện tử, Xây dựng, Dịch vụ & Quản trị',
    thoiGian: '2-3 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Học phí giảm 50% (1.317.250 KRW/6 tháng)\n- Tỷ lệ việc làm cao sau tốt nghiệp\n- KTX với chi phí tiết kiệm (750.000 KRW/6 tháng)\n- Đào tạo thực hành chuyên sâu\n- Liên kết doanh nghiệp mạnh',
    hocPhi: '1.317.250 KRW/6 tháng (đã giảm 50%)\nHọc phí gốc: 2.634.500 KRW/6 tháng',
    ktx: '750.000 KRW/6 tháng',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
  {
    name: 'ĐH Sengmyung',
    englishName: 'Sengmyung College',
    heGiaoDuc: 'D2-6 > D2-1 hoặc D2-2',
    chiTieu: 50,
    truongVN: 'Cao đẳng Hà Nội, Cao đẳng Hữu Nghị, Cao đẳng Thương mại và Du lịch, Cao đẳng truyền hình Việt Nam, Cao đẳng công nghiệp Bắc Giang, Cao đẳng Y tế Hải Phòng, Cao đẳng Công nghệ Y Dược Việt Nam, Đại học Trưng Vương, ĐH Quản lý và Kinh doanh Hữu Nghị, Cao đẳng Kinh tế kỹ thuật thương mại, Cao đẳng Công nghệ Sài gòn, Cao đẳng Công nghệ i-space, Cao đẳng Đồng An, Đại học Sao Đỏ, Cao đẳng Duyên hải, Cao đẳng Kinh tế kỹ thuật Trung ương',
    catalog: 'Link catalog: https://www.sengmyung.ac.kr',
    viTri: 'Sengmyung College, Hàn Quốc',
    gioiThieu: 'Trường Cao đẳng Sengmyung là trường cao đẳng tư thục với các chương trình đào tạo đa dạng. Trường tập trung vào đào tạo nghề chất lượng cao và có liên kết chặt chẽ với các doanh nghiệp trong và ngoài nước.',
    dieuKien: '- Tốt nghiệp THPT hoặc tương đương\n- Đạt yêu cầu tiếng Hàn/tiếng Anh\n- Đáp ứng điều kiện tài chính',
    chuyenNganh: 'Đa dạng các chương trình đào tạo (chi tiết liên hệ)',
    thoiGian: '2-3 năm (tùy chuyên ngành)',
    hoSo: '1. Hộ chiếu\n2. Bằng tốt nghiệp và bảng điểm\n3. Chứng minh nhân dân\n4. Ảnh 3x4\n5. Giấy khám sức khỏe\n6. Chứng nhận tiếng Hàn/ Anh (nếu có)\n7. Hồ sơ tài chính',
    uuDiem: '- Đa dạng chương trình đào tạo\n- Liên kết doanh nghiệp mạnh\n- Cơ hội việc làm cao\n- Môi trường học tập chuyên nghiệp',
    hocPhi: 'Liên hệ để biết thêm thông tin chi tiết',
    ktx: 'Liên hệ để biết thêm thông tin',
    invoice: 'Mẫu Invoice sẽ được cung cấp sau khi nhận được xác nhận từ trường',
    clip: 'Link video giới thiệu: https://www.youtube.com/watch?v=example',
  },
];

// ============================================
// CREATE SCHOOL INDIVIDUAL SHEETS (Sheets 2-16)
// ============================================
const vnList = [
  '1. Cao đẳng Hà Nội (HNC)',
  '2. Cao đẳng Hữu Nghị (HNC)',
  '3. Cao đẳng Thương mại và Du lịch (TMDT)',
  '4. Cao đẳng truyền hình Việt Nam (VTV)',
  '5. Cao đẳng công nghiệp Bắc Giang (HNC)',
  '6. Cao đẳng Y tế Hải Phòng (HPC)',
  '7. Cao đẳng Công nghệ Y Dược Việt Nam (YDVN)',
  '8. Đại học Trưng Vương (TVU)',
  '9. Đại học Quản lý và Kinh doanh Hữu Nghị (HNC)',
  '10. Cao đẳng Kinh tế kỹ thuật thương mại (HCCT)',
  '11. Cao đẳng Công nghệ Sài gòn (SGT)',
  '12. Cao đẳng Công nghệ i-space (iSpace)',
  '13. Cao đẳng Đồng An (DA)',
  '14. Đại học Sao Đỏ (SĐ)',
  '15. Cao đẳng Duyên hải (DH)',
  '16. Cao đẳng Kinh tế kỹ thuật Trung ương (BCIT)',
];

schoolDetails.forEach((school, index) => {
  const sheetNum = index + 2;
  const sheetName = `${sheetNum}. ${school.name}`;
  const schoolSheet = workbook.addWorksheet(sheetName);

  const rows = [
    { row: 1, label: school.name },
    { row: 2, label: `Tên tiếng Anh: ${school.englishName}` },
    { row: 3, label: `Hệ giáo dục: ${school.heGiaoDuc}` },
    { row: 4, label: `Chỉ tiêu tuyển sinh: ${school.chiTieu} hồ sơ` },
    { row: 5, label: `Trường Việt Nam ký MOU: ${school.truongVN}` },
    { row: 6, label: `Catalog: ${school.catalog}` },
    { row: 7, label: `Vị trí địa lý: ${school.viTri}` },
    { row: 8, label: `Giới thiệu về trường: ${school.gioiThieu}` },
    { row: 9, label: `Điều kiện tuyển sinh: ${school.dieuKien}` },
    { row: 10, label: `Các chuyên ngành tuyển sinh diện D2-6: ${school.chuyenNganh}` },
    { row: 11, label: `Thời gian chuyển đổi: ${school.thoiGian}` },
    { row: 12, label: `Hồ sơ trường Hàn cần lưu ý: ${school.hoSo}` },
    { row: 13, label: `Ưu điểm: ${school.uuDiem}` },
    { row: 14, label: `Học phí: ${school.hocPhi}` },
    { row: 15, label: `KTX: ${school.ktx}` },
    { row: 16, label: `Mẫu Invoice: ${school.invoice}` },
    { row: 17, label: `Clip về trường: ${school.clip}` },
  ];

  rows.forEach(r => {
    const cell = schoolSheet.getCell(`A${r.row}`);
    cell.value = r.label;
    cell.font = { size: 11 };
    cell.alignment = { wrapText: true };
  });

  // Row 27: Trường ĐH&TH Tại Việt Nam
  schoolSheet.getCell('A27').value = 'Trường ĐH&TH Tại Việt Nam';
  schoolSheet.getCell('A27').font = { bold: true, size: 12 };
  schoolSheet.getCell('A27').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  schoolSheet.getCell('A27').font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };

  // VN Schools List
  vnList.forEach((vn, idx) => {
    schoolSheet.getCell(`A${idx + 28}`).value = vn;
    schoolSheet.getCell(`A${idx + 28}`).font = { size: 11 };
  });

  schoolSheet.getColumn(1).width = 100;
});

// ============================================
// SHEET 17: Check list HS xin Visa D2-6
// ============================================
const sheet17 = workbook.addWorksheet('17. Check list Visa');

// Title
sheet17.mergeCells('A1:L1');
sheet17.getCell('A1').value = 'CHECK LIST HỒ SƠ XIN VISA D2-6 - THÁNG 3/2027';
sheet17.getCell('A1').font = { bold: true, size: 14 };
sheet17.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet17.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
sheet17.getCell('A1').alignment = { horizontal: 'center' };

// Headers
const checklistHeaders = ['STT', 'Họ và tên', 'Ngày sinh', 'Số Passport', 'Trường VN', 'Trường Hàn', 'Ngày nộp', 'Lần 1', 'Lần 2', 'Lần 3', 'Kết quả Visa', 'Ghi chú'];
checklistHeaders.forEach((val, idx) => {
  const cell = sheet17.getCell(`${String.fromCharCode(65 + idx)}3`);
  cell.value = val;
  cell.font = { bold: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Create 55 empty rows for data entry
for (let i = 1; i <= 55; i++) {
  const row = i + 3;
  sheet17.getCell(`A${row}`).value = i;
  for (let col = 0; col < 12; col++) {
    sheet17.getCell(`${String.fromCharCode(65 + col)}${row}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  }
}

// Column widths
sheet17.getColumn(1).width = 6;
sheet17.getColumn(2).width = 25;
sheet17.getColumn(3).width = 12;
sheet17.getColumn(4).width = 15;
sheet17.getColumn(5).width = 30;
sheet17.getColumn(6).width = 20;
sheet17.getColumn(7).width = 12;
sheet17.getColumn(8).width = 12;
sheet17.getColumn(9).width = 12;
sheet17.getColumn(10).width = 12;
sheet17.getColumn(11).width = 15;
sheet17.getColumn(12).width = 20;

// ============================================
// SHEET 18: Tài liệu ôn phỏng vấn
// ============================================
const sheet18 = workbook.addWorksheet('18. Ôn phỏng vấn');

// Title
sheet18.mergeCells('A1:E1');
sheet18.getCell('A1').value = 'TÀI LIỆU ÔN PHỎNG VẤN VISA HÀN QUỐC D2-6';
sheet18.getCell('A1').font = { bold: true, size: 14 };
sheet18.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet18.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
sheet18.getCell('A1').alignment = { horizontal: 'center' };

// Part 1
sheet18.mergeCells('A3:E3');
sheet18.getCell('A3').value = 'PHẦN 1: GIỚI THIỆU BẢN THÂN (1-2 phút)';
sheet18.getCell('A3').font = { bold: true, size: 12 };
sheet18.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const introContent = [
  '1. Xin chào, tên tôi là [Họ và tên]',
  '2. Tôi đến từ [Thành phố, Quốc gia]',
  '3. Hiện tại tôi đang là sinh viên/tốt nghiệp của [Trường VN]',
  '4. Tôi muốn du học tại [Tên trường Hàn] để học ngành [Tên ngành]',
  '',
  'MẪU GIỚI THIỆU:',
  '"Xin chào, tên tôi là Nguyễn Văn A. Tôi đến từ Hà Nội, Việt Nam. Hiện tại tôi đang là sinh viên năm 3 của Cao đẳng Hà Nội. Tôi rất muốn học tập tại Đại học Osan để theo học ngành Kỹ thuật cơ khí. Tôi đã tìm hiểu về trường và thấy rằng chương trình đào tạo rất phù hợp với mục tiêu nghề nghiệp của tôi."',
];

introContent.forEach((text, idx) => {
  sheet18.getCell(`A${idx + 4}`).value = text;
  sheet18.getCell(`A${idx + 4}`).font = { size: 11 };
});

// Part 2
sheet18.mergeCells('A13:E13');
sheet18.getCell('A13').value = 'PHẦN 2: CÂU HỎI VỀ MỤC ĐÍCH HỌC TẬP';
sheet18.getCell('A13').font = { bold: true, size: 12 };
sheet18.getCell('A13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const studyQuestions = [
  '1. Tại sao bạn chọn Hàn Quốc để du học?',
  '=> Trả lời: Hàn Quốc có nền giáo dục chất lượng cao, chi phí hợp lý, và có nhiều trường đại học uy tín. Ngoài ra, tôi cũng muốn trải nghiệm văn hóa Hàn Quốc.',
  '',
  '2. Tại sao bạn chọn trường [Tên trường]?',
  '=> Trả lời: [Tên trường] có chương trình đào tạo ngành [Tên ngành] rất chất lượng, giáo viên giàu kinh nghiệm, và có cơ sở vật chất hiện đại.',
  '',
  '3. Bạn biết gì về ngành học mà bạn đăng ký?',
  '=> Trả lời: Ngành [Tên ngành] là ngành [mô tả ngành], tập trung vào [nội dung học], và có triển vọng nghề nghiệp [mô tả].',
  '',
  '4. Kế hoạch sau khi tốt nghiệp?',
  '=> Trả lời: Sau khi tốt nghiệp, tôi dự định [kế hoạch: về Việt Nam làm việc/ở lại Hàn Quốc/tiếp tục học lên]. Lý do là [lý do].',
];

studyQuestions.forEach((text, idx) => {
  sheet18.getCell(`A${idx + 14}`).value = text;
  sheet18.getCell(`A${idx + 14}`).font = { size: 11 };
});

// Part 3
sheet18.mergeCells('A25:E25');
sheet18.getCell('A25').value = 'PHẦN 3: CÂU HỎI VỀ TÀI CHÍNH';
sheet18.getCell('A25').font = { bold: true, size: 12 };
sheet18.getCell('A25').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const financeQuestions = [
  '1. Ai sẽ chi trả chi phí học tập và sinh hoạt cho bạn?',
  '=> Trả lời: [Bố/Mẹ/Tự túc] sẽ chi trả chi phí học tập và sinh hoạt của tôi.',
  '',
  '2. Nguồn tài chính đến từ đâu?',
  '=> Trả lời: Nguồn tài chính đến từ [tiết kiệm của gia đình/thu nhập từ công việc của bố mẹ/tài sản]. Tổng chi phí dự kiến là [số tiền].',
  '',
  '3. Bạn có kế hoạch làm thêm không?',
  '=> Trả lời: Tôi dự định [có/không] làm thêm. Nếu có, tôi sẽ [loại công việc] với [số giờ/tuần].',
];

financeQuestions.forEach((text, idx) => {
  sheet18.getCell(`A${idx + 26}`).value = text;
  sheet18.getCell(`A${idx + 26}`).font = { size: 11 };
});

// Part 4
sheet18.mergeCells('A34:E34');
sheet18.getCell('A34').value = 'PHẦN 4: CÂU HỎI VỀ GIA ĐÌNH';
sheet18.getCell('A34').font = { bold: true, size: 12 };
sheet18.getCell('A34').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const familyQuestions = [
  '1. Gia đình bạn gồm những ai?',
  '=> Trả lời: Gia đình tôi gồm [số người]: [mô tả: bố, mẹ, anh/chị/em].',
  '',
  '2. Công việc của bố/mẹ bạn là gì?',
  '=> Trả lời: Bố tôi làm [nghề nghiệp] tại [nơi làm việc]. Mẹ tôi làm [nghề nghiệp] tại [nơi làm việc].',
  '',
  '3. Bạn có người thân ở Hàn Quốc không?',
  '=> Trả lời: [Có/Không]. Nếu có: [Mối quan hệ và thông tin].',
];

familyQuestions.forEach((text, idx) => {
  sheet18.getCell(`A${idx + 35}`).value = text;
  sheet18.getCell(`A${idx + 35}`).font = { size: 11 };
});

// Part 5 - Tips
sheet18.mergeCells('A43:E43');
sheet18.getCell('A43').value = 'PHẦN 5: MỘT SỐ LƯU Ý QUAN TRỌNG';
sheet18.getCell('A43').font = { bold: true, size: 12 };
sheet18.getCell('A43').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };

const tips = [
  '1. Trả lời ngắn gọn, rõ ràng, tự tin nhưng không kiêu ngạo.',
  '2. Nhìn thẳng vào mắt người phỏng vấn, không nhìn đi đâu.',
  '3. Mặc trang phục lịch sự, gọn gàng.',
  '4. Đến đúng giờ hoặc sớm 5-10 phút.',
  '5. Mang theo đầy đủ giấy tờ được yêu cầu.',
  '6. Chuẩn bị tinh thần thoải mái, không quá căng thẳng.',
  '7. Nếu không hiểu câu hỏi, xin phép hỏi lại.',
  '8. Trả lời trung thực, không bịa đặt thông tin.',
  '9. Thể hiện sự quyết tâm và nghiêm túc trong việc học tập.',
  '10. Có thể học trước một số từ tiếng Hàn cơ bản để gây ấn tượng.',
];

tips.forEach((text, idx) => {
  sheet18.getCell(`A${idx + 44}`).value = text;
  sheet18.getCell(`A${idx + 44}`).font = { size: 11 };
});

// Column width
sheet18.getColumn(1).width = 80;

// ============================================
// SHEET 19: Application trường Hàn
// ============================================
const sheet19 = workbook.addWorksheet('19. Application');

// Title
sheet19.mergeCells('A1:G1');
sheet19.getCell('A1').value = 'MẪU ĐƠN XIN NHẬP HỌC - APPLICATION FORM';
sheet19.getCell('A1').font = { bold: true, size: 14 };
sheet19.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet19.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
sheet19.getCell('A1').alignment = { horizontal: 'center' };

// Section 1
sheet19.mergeCells('A3:G3');
sheet19.getCell('A3').value = 'PHẦN 1: THÔNG TIN CÁ NHÂN / PERSONAL INFORMATION';
sheet19.getCell('A3').font = { bold: true };
sheet19.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const personalInfo = [
  ['Họ và tên (Full Name):', ''],
  ['Ngày sinh (Date of Birth):', '  /  /'],
  ['Giới tính (Gender):', '☐ Nam / Male    ☐ Nữ / Female'],
  ['Quốc tịch (Nationality):', ''],
  ['Số Passport (Passport No.):', ''],
  ['Ngày cấp Passport (Issue Date):', '  /  /'],
  ['Ngày hết hạn Passport (Expiry Date):', '  /  /'],
  ['Địa chỉ hiện tại (Current Address):', ''],
  ['Số điện thoại (Phone):', ''],
  ['Email:', ''],
];

personalInfo.forEach((row, idx) => {
  sheet19.getCell(`A${idx + 4}`).value = row[0];
  sheet19.getCell(`B${idx + 4}`).value = row[1];
  sheet19.getCell(`A${idx + 4}`).font = { size: 11 };
  sheet19.getCell(`B${idx + 4}`).font = { size: 11 };
});

// Section 2
sheet19.mergeCells('A15:G15');
sheet19.getCell('A15').value = 'PHẦN 2: THÔNG TIN TRƯỜNG VIỆT NAM / VIETNAMESE SCHOOL INFO';
sheet19.getCell('A15').font = { bold: true };
sheet19.getCell('A15').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const vnSchoolInfo = [
  ['Tên trường (School Name):', ''],
  ['Ngành đang học/Tốt nghiệp (Major):', ''],
  ['Năm tốt nghiệp (Graduation Year):', ''],
  ['Bằng tốt nghiệp (Degree):', '☐ Đã tốt nghiệp / ☐ Đang học'],
];

vnSchoolInfo.forEach((row, idx) => {
  sheet19.getCell(`A${idx + 16}`).value = row[0];
  sheet19.getCell(`B${idx + 16}`).value = row[1];
  sheet19.getCell(`A${idx + 16}`).font = { size: 11 };
  sheet19.getCell(`B${idx + 16}`).font = { size: 11 };
});

// Section 3
sheet19.mergeCells('A21:G21');
sheet19.getCell('A21').value = 'PHẦN 3: THÔNG TIN TRƯỜNG HÀN QUỐC / KOREAN SCHOOL INFO';
sheet19.getCell('A21').font = { bold: true };
sheet19.getCell('A21').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const krSchoolInfo = [
  ['Tên trường mong muốn (Desired School):', ''],
  ['Chuyên ngành mong muốn (Desired Major):', ''],
  ['Hệ đào tạo (Program):', '☐ D2-6 > D2-1    ☐ D2-6 > D2-2'],
  ['Ngày nhập học dự kiến (Expected Enrollment):', ''],
];

krSchoolInfo.forEach((row, idx) => {
  sheet19.getCell(`A${idx + 22}`).value = row[0];
  sheet19.getCell(`B${idx + 22}`).value = row[1];
  sheet19.getCell(`A${idx + 22}`).font = { size: 11 };
  sheet19.getCell(`B${idx + 22}`).font = { size: 11 };
});

// Section 4
sheet19.mergeCells('A27:G27');
sheet19.getCell('A27').value = 'PHẦN 4: THÔNG TIN TÀI CHÍNH / FINANCIAL INFO';
sheet19.getCell('A27').font = { bold: true };
sheet19.getCell('A27').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

const financialInfo = [
  ['Người bảo lãnh (Guarantor):', '☐ Bố / Father    ☐ Mẹ / Mother    ☐ Khác / Other'],
  ['Họ tên người bảo lãnh (Guarantor Name):', ''],
  ['Nghề nghiệp (Occupation):', ''],
  ['Công ty/Tổ chức (Company/Organization):', ''],
  ['Thu nhập hàng tháng (Monthly Income):', ''],
  ['Nguồn tài chính (Financial Source):', ''],
];

financialInfo.forEach((row, idx) => {
  sheet19.getCell(`A${idx + 28}`).value = row[0];
  sheet19.getCell(`B${idx + 28}`).value = row[1];
  sheet19.getCell(`A${idx + 28}`).font = { size: 11 };
  sheet19.getCell(`B${idx + 28}`).font = { size: 11 };
});

// Section 5
sheet19.mergeCells('A35:G35');
sheet19.getCell('A35').value = 'PHẦN 5: CAM KẾT / DECLARATION';
sheet19.getCell('A35').font = { bold: true };
sheet19.getCell('A35').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

sheet19.getCell('A36').value = 'Tôi xin cam kết:';
sheet19.getCell('A37').value = '1. Tất cả thông tin trong đơn này là đúng sự thật.';
sheet19.getCell('A38').value = '2. Tôi sẽ tuân thủ luật pháp và quy định của Hàn Quốc.';
sheet19.getCell('A39').value = '3. Tôi sẽ học tập nghiêm túc và duy trì thành tích tốt.';
sheet19.getCell('A40').value = '4. Tôi sẽ không làm việc bất hợp pháp trong thời gian học tập.';

// Signature
sheet19.mergeCells('A42:G42');
sheet19.getCell('A42').value = 'Ngày / Date:  /  /         Chữ ký / Signature: _______________________';

// Column widths
sheet19.getColumn(1).width = 45;
sheet19.getColumn(2).width = 50;

// ============================================
// SHEET 20: Thông tin làm tem các trường
// ============================================
const sheet20 = workbook.addWorksheet('20. Làm tem trường');

// Title
sheet20.mergeCells('A1:H1');
sheet20.getCell('A1').value = 'THEO DÕI TIẾN ĐỘ LÀM TEM VISA CÁC TRƯỜNG D2-6 THÁNG 3/2027';
sheet20.getCell('A1').font = { bold: true, size: 14 };
sheet20.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
sheet20.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
sheet20.getCell('A1').alignment = { horizontal: 'center' };

// Headers
const sealHeaders = ['STT', 'Tên trường', 'Số lượng HS', 'Ngày nộp hồ sơ', 'Ngày nhận COE', 'Ngày làm tem', 'Ngày phỏng vấn', 'Ghi chú'];
sealHeaders.forEach((val, idx) => {
  const cell = sheet20.getCell(`${String.fromCharCode(65 + idx)}3`);
  cell.value = val;
  cell.font = { bold: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Schools data
const sealSchools = [
  [1, 'ĐH Osan', 50, '', '', '', '', ''],
  [2, 'ĐH Induk', 60, '', '', '', '', ''],
  [3, 'ĐH Yeonsung', 50, '', '', '', '', ''],
  [4, 'ĐH Sangmyung', 50, '', '', '', '', ''],
  [5, 'ĐH Nữ sinh Kyungin', 40, '', '', '', '', ''],
  [6, 'ĐH Y Tế Dongnam', 60, '', '', '', '', ''],
  [7, 'ĐH Dongeui', 60, '', '', '', '', ''],
  [8, 'CĐ Suncheon Jeil', 60, '', '', '', '', ''],
  [9, 'ĐH Nữ sinh Busan', 60, '', '', '', '', ''],
  [10, 'ĐH Busan Catholic', 50, '', '', '', '', ''],
  [11, 'ĐH Gimhae', 40, '', '', '', '', ''],
  [12, 'ĐH Gwangju', 50, '', '', '', '', ''],
  [13, 'ĐH Nambu', 50, '', '', '', '', ''],
  [14, 'ĐH Daewon', 60, '', '', '', '', ''],
  [15, 'ĐH Sengmyung', 50, '', '', '', '', ''],
];

sealSchools.forEach((row, rowIdx) => {
  row.forEach((val, colIdx) => {
    const cell = sheet20.getCell(`${String.fromCharCode(65 + colIdx)}${rowIdx + 4}`);
    cell.value = val;
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
});

// Summary row
sheet20.getCell('A20').value = 'TỔNG CỘNG';
sheet20.getCell('C20').value = { formula: 'SUM(C4:C18)', result: 765 };
sheet20.getCell('A20').font = { bold: true };
sheet20.getCell('C20').font = { bold: true };
sheet20.getCell('A20').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
sheet20.getCell('C20').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
for (let col = 0; col < 8; col++) {
  sheet20.getCell(`${String.fromCharCode(65 + col)}20`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
}

// Legend
sheet20.getCell('A22').value = 'GHI CHÚ:';
sheet20.getCell('A22').font = { bold: true };
sheet20.getCell('A23').value = 'COE: Certificate of Eligibility (Giấy chứng nhận đủ điều kiện)';
sheet20.getCell('A24').value = 'Ngày nộp hồ sơ: Hạn chót 08/11/2026';
sheet20.getCell('A25').value = 'Ngày khai giảng dự kiến: 15/09/2027';

// Column widths
sheet20.getColumn(1).width = 6;
sheet20.getColumn(2).width = 25;
sheet20.getColumn(3).width = 12;
sheet20.getColumn(4).width = 18;
sheet20.getColumn(5).width = 18;
sheet20.getColumn(6).width = 15;
sheet20.getColumn(7).width = 18;
sheet20.getColumn(8).width = 20;

// ============================================
// EXPORT THE WORKBOOK
// ============================================
const outputPath = 'c:/Users/phant/thong-tin-truong-han/Thong tin truong Han ky thang 3_2027.xlsx';

workbook.xlsx.writeFile(outputPath).then(() => {
  console.log('Excel file created successfully!');
  console.log(`File saved to: ${outputPath}`);
}).catch(err => {
  console.error('Error creating Excel file:', err);
});
