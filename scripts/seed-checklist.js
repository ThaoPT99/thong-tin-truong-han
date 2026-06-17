// Seed 39 items từ D26_SAMPLE_CHECKLIST vào database
const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: 'db.lzggxhunbnjrklbkywmb.supabase.co',
    port: 5432, database: 'postgres',
    user: 'postgres', password: process.env.DATABASE_PASSWORD || '',
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Add columns
  for (const col of ['group_name', 'level']) {
    try {
      await client.query('ALTER TABLE extra_visa_checklist ADD COLUMN IF NOT EXISTS ' + col + ' text');
      console.log('Added column:', col);
    } catch(e) {
      console.log('Column', col, 'error:', e.message.substring(0, 60));
    }
  }

  // Clear old data
  await client.query('DELETE FROM extra_visa_checklist');
  console.log('Cleared old data');

  // Insert data using a VALUES bulk insert
  const groups = [
    { g: 'Hồ sơ visa', items: [
      { n: 'Application form Đại sứ quán', l: 'Bắt buộc', d: 'Điền đúng mẫu hiện hành của ĐSQ/LSQ.' },
      { n: 'Đơn xác nhận lịch sử bị từ chối visa', l: 'Bắt buộc', d: 'Cần khai trung thực lịch sử visa trước đó.' },
      { n: 'Thư mời nhập học', l: 'Bắt buộc', d: 'Dùng bản do trường Hàn phát hành.' },
      { n: 'Đăng ký kinh doanh trường Hàn', l: 'Bắt buộc', d: 'Thường nộp bản photo hoặc file trường cung cấp.' },
      { n: 'MOU giữa trường Việt Nam và trường Hàn', l: 'Bắt buộc', d: 'Kiểm tra đúng cặp trường/hệ chương trình.' },
      { n: 'Quyết định trao đổi sinh viên', l: 'Bắt buộc', d: 'Thông tin học sinh và trường phải khớp hồ sơ.' },
      { n: 'Thư tiến cử', l: 'Bắt buộc', d: 'Thường do trường Việt Nam cấp theo mẫu.' },
      { n: 'Giấy khám sức khỏe', l: 'Bắt buộc', d: 'Lưu ý yêu cầu lao phổi và thời hạn giấy khám.' },
    ]},
    { g: 'Hồ sơ học tập', items: [
      { n: 'Kế hoạch học tập', l: 'Bắt buộc', d: 'Nội dung cần hợp lý với ngành, trường và lộ trình D2-6.' },
      { n: 'Giới thiệu bản thân', l: 'Bắt buộc', d: 'Tránh viết chung chung, cần khớp hoàn cảnh hồ sơ.' },
      { n: 'Giấy xác nhận sinh viên', l: 'Bắt buộc', d: 'Chuẩn bị cả bản dịch/công chứng nếu được yêu cầu.' },
      { n: 'Bảng điểm cao đẳng/đại học', l: 'Bắt buộc', d: 'Thông tin điểm, kỳ học, tên trường phải rõ ràng.' },
      { n: 'Học bạ THPT', l: 'Bắt buộc', d: 'Kiểm tra GPA và số buổi nghỉ trước khi chọn trường.' },
      { n: 'Bằng tốt nghiệp THPT', l: 'Bắt buộc', d: 'Cần đối chiếu bản gốc khi nộp hoặc phỏng vấn.' },
      { n: 'Tem tím bằng tốt nghiệp', l: 'Bắt buộc', d: 'Số lượng bản tùy yêu cầu trường/ĐSQ.' },
      { n: 'Tem tím học bạ', l: 'Bắt buộc', d: 'Nên chuẩn bị dư theo kế hoạch nộp trường và visa.' },
      { n: 'Tem tím bảng điểm', l: 'Bắt buộc', d: 'Áp dụng với hồ sơ đang học/đã học CĐ/ĐH.' },
      { n: 'Tem tím giấy xác nhận sinh viên', l: 'Bắt buộc', d: 'Thông tin phải khớp giấy xác nhận gốc.' },
    ]},
    { g: 'Hồ sơ tài chính', items: [
      { n: 'Sổ tiết kiệm học sinh', l: 'Bắt buộc', d: 'Ưu tiên đứng tên học sinh, kiểm tra số tiền và thời hạn.' },
      { n: 'Xác nhận số dư tài khoản', l: 'Bắt buộc', d: 'Phát hành gần thời điểm nộp theo yêu cầu hồ sơ.' },
      { n: 'Xác nhận thu nhập', l: 'Bắt buộc', d: 'Cần logic với nghề nghiệp và dòng tiền gia đình.' },
      { n: 'Hợp đồng lao động hoặc giấy xác nhận công việc', l: 'Nên có', d: 'Giúp làm rõ nguồn thu nhập của người bảo lãnh.' },
      { n: 'Sao kê tài khoản bố', l: 'Nên có', d: 'Cần khi chứng minh dòng tiền hoặc thu nhập gia đình.' },
      { n: 'Sao kê tài khoản mẹ', l: 'Nên có', d: 'Bổ sung nếu mẹ là người bảo lãnh hoặc có dòng tiền chính.' },
      { n: 'Sổ đỏ hoặc giấy tờ tài sản', l: 'Nên có', d: 'Tăng độ tin cậy tài chính nếu gia đình có tài sản.' },
      { n: 'Giải trình sao kê', l: 'Tùy trường hợp', d: 'Cần khi dòng tiền lớn, bất thường hoặc khó giải thích.' },
      { n: 'Giải trình đăng ký kinh doanh', l: 'Tùy trường hợp', d: 'Dùng khi gia đình kinh doanh hoặc nguồn thu từ hộ kinh doanh.' },
      { n: 'Cam kết bảo lãnh tài chính', l: 'Bắt buộc', d: 'Thông tin người bảo lãnh phải khớp giấy tờ nhân thân.' },
    ]},
    { g: 'Hồ sơ nhân thân', items: [
      { n: 'Giấy khai sinh', l: 'Bắt buộc', d: 'Dùng để chứng minh quan hệ gia đình.' },
      { n: 'CT07', l: 'Bắt buộc', d: 'Cần đúng mẫu và thông tin cư trú phải khớp.' },
      { n: 'Photo hộ chiếu', l: 'Bắt buộc', d: 'Hộ chiếu còn hạn và thông tin rõ nét.' },
      { n: 'CCCD học sinh', l: 'Bắt buộc', d: 'Thông tin phải khớp hộ chiếu và hồ sơ học tập.' },
      { n: 'CCCD bố', l: 'Bắt buộc', d: 'Cần nếu bố là người bảo lãnh hoặc chứng minh quan hệ.' },
      { n: 'CCCD mẹ', l: 'Bắt buộc', d: 'Cần nếu mẹ là người bảo lãnh hoặc chứng minh quan hệ.' },
    ]},
    { g: 'Hồ sơ bổ sung', items: [
      { n: 'Giải trình địa chỉ', l: 'Tùy trường hợp', d: 'Dùng khi địa chỉ trên các giấy tờ chưa thống nhất.' },
      { n: 'Bảo hiểm nhân thọ', l: 'Nên có', d: 'Có thể bổ sung như một bằng chứng tài sản nếu phù hợp.' },
      { n: 'Giấy tờ nghề nghiệp đặc thù của gia đình', l: 'Tùy trường hợp', d: 'Ví dụ giấy tờ tàu cá, nông nghiệp, kinh doanh, cho thuê tài sản.' },
      { n: 'Hồ sơ gốc mang theo khi nộp/đối chiếu', l: 'Bắt buộc', d: 'Bằng gốc, học bạ gốc, bảng điểm gốc, giấy xác nhận sinh viên gốc.' },
    ]},
  ];

  let order = 0;
  let total = 0;
  for (const g of groups) {
    for (const item of g.items) {
      total++;
      const stt = String(total);
      await client.query(
        'INSERT INTO extra_visa_checklist (group_name, stt, content, note, level, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
        [g.g, stt, item.n, item.d, item.l, order]
      );
      order++;
    }
  }
  console.log('Inserted', total, 'items');

  const check = await client.query(
    'SELECT group_name, count(*)::int as cnt FROM extra_visa_checklist GROUP BY group_name ORDER BY min(sort_order)'
  );
  console.log('Groups:');
  check.rows.forEach(function(r) {
    console.log('  ' + r.group_name + ': ' + r.cnt + ' items');
  });

  await client.end();
}

run().catch(function(e) {
  console.error('Error:', e.message);
  process.exit(1);
});
