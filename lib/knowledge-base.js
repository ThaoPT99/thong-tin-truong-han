// lib/knowledge-base.js
// Knowledge Base — extracted from Tự làm hồ sơ/ markdown files
// Dùng cho: AI prompts, Knowledge Base page, FAQ, search

// ═══════════════════════════════════════════════════════════
// STRUCTURED ARTICLES — cho Knowledge Base page + search
// ═══════════════════════════════════════════════════════════

const KB_ARTICLES = [
  // ─── Visa Category ───
  {
    id: 'visa-d4-1-overview',
    category: 'visa',
    title: 'Tổng quan visa D-4-1 (Học tiếng Hàn)',
    summary: 'Visa D-4-1 dành cho học sinh đăng ký khóa học tiếng Hàn tại Hàn Quốc. Thời hạn 6 tháng - 2 năm.',
    tags: ['D-4-1', 'visa', 'học tiếng', 'tổng quan'],
    content: `Visa D-4-1 là visa du học dành cho học sinh quốc tế đăng ký các khóa học tiếng Hàn tại các trường đại học Hàn Quốc.

Đặc điểm chính:
• Thời hạn: 6 tháng, có thể gia hạn tối đa 2 năm
• Cho phép làm thêm sau 6 tháng (tối đa 20h/tuần)
• Yêu cầu: học lực GPA >= 5.0, chứng minh tài chính $10,000+
• Không yêu cầu TOPIK đầu vào (nhưng có là lợi thế)
• Có thể chuyển lên visa D-2 sau khi hoàn thành khóa tiếng

Quy trình xin visa:
1. Nhận admission letter từ trường Hàn Quốc
2. Chuẩn bị đầy đủ hồ sơ theo checklist
3. Đặt lịch hẹn KVAC (Hà Nội hoặc TP.HCM)
4. Nộp hồ sơ tại KVAC đúng hẹn
5. Chờ kết quả 5-20 ngày làm việc

Lưu ý: Tỉ lệ đậu D-4-1 thường cao hơn D-2 nếu hồ sơ tài chính tốt và Study Plan rõ ràng.`
  },
  {
    id: 'visa-d2-overview',
    category: 'visa',
    title: 'Tổng quan visa D-2 (Đại học chính quy)',
    summary: 'Visa D-2 dành cho sinh viên theo học chương trình đại học/cao đẳng chính quy tại Hàn Quốc.',
    tags: ['D-2', 'visa', 'đại học', 'tổng quan'],
    content: `Visa D-2 là visa du học dành cho sinh viên theo học các chương trình đại học, cao đẳng chính quy tại Hàn Quốc.

Đặc điểm chính:
• Thời hạn: 1 năm, gia hạn hàng năm theo học kỳ
• Cho phép làm thêm sau 6 tháng
• Yêu cầu: GPA >= 5.0, TOPIK 3+ hoặc IELTS 5.5+, tài chính $18,000-$20,000
• Bắt buộc có thư giới thiệu giáo viên
• Có thể chuyển đổi sang visa E7 sau tốt nghiệp

Yêu cầu đầu vào thường gặp:
• TOPIK 3+ hoặc hoàn thành khóa tiếng tại trường
• GPA THPT >= 6.0 (hoặc tương đương)
• Thư mời nhập học từ trường
• Chứng minh tài chính đủ mạnh

Khác biệt với D-4-1: D-2 yêu cầu cao hơn về tài chính, học lực và tiếng Hàn, nhưng cho phép ở lại làm việc (E7) sau tốt nghiệp.`
  },
  {
    id: 'visa-d4-to-d2',
    category: 'visa',
    title: 'Chuyển đổi visa D-4-1 sang D-2',
    summary: 'Hướng dẫn chuyển từ visa học tiếng D-4-1 lên visa đại học D-2 ngay tại Hàn Quốc.',
    tags: ['D-4-1', 'D-2', 'chuyển đổi', 'visa'],
    content: `Sau khi hoàn thành khóa học tiếng Hàn với visa D-4-1, bạn có thể chuyển lên visa D-2 để học đại học chính quy ngay tại Hàn Quốc.

Quy trình chuyển đổi:
1. Hoàn thành khóa tiếng Hàn với kết quả tốt
2. Xin admission letter từ trường đại học
3. Chuẩn bị hồ sơ: bảng điểm, chứng nhận hoàn thành khóa tiếng
4. Nộp đơn xin chuyển đổi tại Immigration Hàn Quốc
5. Đóng phí chuyển đổi visa

Giấy tờ cần chuẩn bị:
• Hộ chiếu + Thẻ ngoại kiều (ARC)
• Giấy chứng nhận hoàn thành khóa tiếng
• Bảng điểm khóa tiếng Hàn
• Admission Letter từ trường ĐH
• Đơn xin chuyển đổi visa (mẫu Hàn)
• Giấy tờ tài chính chứng minh đủ điều kiện

Lưu ý: Nên chuyển đổi trước khi visa D-4-1 hết hạn ít nhất 1 tháng.`
  },
  {
    id: 'visa-rejection',
    category: 'visa',
    title: 'Xử lý khi trượt visa Hàn Quốc',
    summary: 'Nguyên nhân thường gặp và cách khắc phục khi bị từ chối visa du học Hàn Quốc.',
    tags: ['visa', 'trượt', 'từ chối', 'xử lý'],
    content: `Bị từ chối visa không phải là kết thúc. Dưới đây là các bước xử lý:

Nguyên nhân thường gặp:
1. Thiếu giấy tờ tài chính — chiếm ~40% các trường hợp
2. Study Plan chung chung, không thuyết phục — ~30%
3. Không chứng minh được quan hệ với người bảo lãnh — ~15%
4. Học lực không đáp ứng yêu cầu — ~10%
5. Lý do khác (tuổi cao, gap year dài, lịch sử visa xấu) — ~5%

Các bước xử lý:
1. Xác định nguyên nhân trượt từ thông báo của ĐSQ
2. Khắc phục triệt để nguyên nhân đó
3. Đợi tối thiểu 3 tháng trước khi nộp lại
4. Chuẩn bị hồ sơ mới đầy đủ hơn
5. Viết giải trình: phân tích lý do trượt và cách đã khắc phục

Lưu ý quan trọng: Không nộp lại hồ sơ giống hệt lần đã trượt. Cần có thay đổi rõ ràng để thuyết phục nhân viên xét duyệt.`
  },
  {
    id: 'visa-interview',
    category: 'visa',
    title: 'Phỏng vấn visa Hàn Quốc',
    summary: 'Những câu hỏi thường gặp khi phỏng vấn visa du học và cách trả lời hiệu quả.',
    tags: ['visa', 'phỏng vấn', 'câu hỏi'],
    content: `Một số học sinh sẽ được gọi phỏng vấn khi nộp visa. Dưới đây là các câu hỏi thường gặp:

Câu hỏi về mục đích du học:
• Tại sao bạn chọn Hàn Quốc? — Cần câu trả lời cụ thể về văn hóa, giáo dục, cơ hội
• Tại sao chọn trường này? — Nghiên cứu trước về trường, chương trình học
• Bạn học ngành gì? — Giải thích rõ ràng, gắn với định hướng nghề nghiệp

Câu hỏi về tài chính:
• Ai bảo lãnh tài chính cho bạn? — Cha/mẹ hay tự thân
• Thu nhập của người bảo lãnh là bao nhiêu? — Cần thuộc số liệu
• Bạn có sổ tiết kiệm không? — Số tiền, ngân hàng, kỳ hạn

Câu hỏi về kế hoạch tương lai:
• Sau khi học xong bạn định làm gì? — Cần kế hoạch về Việt Nam rõ ràng
• Bạn có định ở lại Hàn Quốc làm việc không? — Trả lời khéo léo

Mẹo: Trả lời tự tin, nhất quán với hồ sơ đã nộp. Study Plan càng chi tiết, càng dễ qua phỏng vấn.`
  },

  // ─── Documents Category ───
  {
    id: 'doc-checklist-d4-1',
    category: 'documents',
    title: 'Checklist giấy tờ D-4-1 chi tiết',
    summary: 'Danh sách đầy đủ giấy tờ cần chuẩn bị cho visa D-4-1, bao gồm cả giấy tờ bổ sung theo hoàn cảnh.',
    tags: ['D-4-1', 'checklist', 'giấy tờ'],
    content: `Bộ hồ sơ visa D-4-1 gồm các nhóm giấy tờ sau:

1. GIẤY TỜ HÀNH CHÍNH (Bắt buộc)
• Đơn xin visa mẫu KSD0-2014 — tải từ website ĐSQ
• Hộ chiếu còn hạn 6 tháng+
• Ảnh thẻ 3.5x4.5cm nền trắng (2-4 ảnh)
• CCCD/CMND (bản photo)
• Sổ hộ khẩu hoặc CT07 (bản photo)
• Giấy khai sinh (bản sao)
• Giấy khám lao phổi (TB test) — tại bệnh viện chỉ định

2. GIẤY TỜ HỌC VẤN
• Bằng tốt nghiệp THPT + dịch công chứng
• Học bạ THPT 3 năm + dịch công chứng
• Giải trình gap year (nếu tốt nghiệp > 6 tháng)

3. GIẤY TỜ TRƯỜNG HÀN
• Thư nhập học (Admission Letter)
• Hóa đơn học phí (Invoice)

4. CHỨNG MINH TÀI CHÍNH
• Sổ tiết kiệm $10,000+ (mở tại quầy, 3-6 tháng trước)
• Xác nhận số dư + sao kê 3 tháng
• Giấy cam kết bảo lãnh (nếu không tự thân)
• Giấy tờ quan hệ với người bảo lãnh

5. STUDY PLAN + PERSONAL STATEMENT
• Kế hoạch học tập (500-800 từ, tiếng Hàn/Anh)

Xem checklist cá nhân hoá tại tab "📋 Hồ sơ của tôi" để biết chính xác giấy tờ bạn cần.`
  },
  {
    id: 'doc-checklist-d2',
    category: 'documents',
    title: 'Checklist giấy tờ D-2 chi tiết',
    summary: 'Danh sách giấy tờ cần chuẩn bị cho visa D-2, yêu cầu cao hơn D-4-1.',
    tags: ['D-2', 'checklist', 'giấy tờ'],
    content: `Bộ hồ sơ visa D-2 yêu cầu nhiều giấy tờ hơn D-4-1:

1. GIẤY TỜ HÀNH CHÍNH
• Đơn xin visa mẫu KSD0-2014
• Hộ chiếu còn hạn 6 tháng+
• Ảnh thẻ 3.5x4.5cm
• CCCD + Giấy khai sinh + Sổ hộ khẩu
• Giấy khám lao phổi (TB test)

2. GIẤY TỜ HỌC VẤN
• Bằng THPT + học bạ + dịch công chứng
• Bằng ĐH/bảng điểm (nếu đã học ĐH)
• Thư giới thiệu giáo viên (2 thư)
• Chứng chỉ TOPIK 3+ hoặc IELTS 5.5+
• Giải trình gap year (nếu có)

3. CHỨNG MINH TÀI CHÍNH
• Sổ tiết kiệm $18,000-$20,000 (cao hơn D-4-1)
• Xác nhận số dư + sao kê 3 tháng
• Giấy bảo lãnh + quan hệ + thu nhập

4. GIẤY TỜ TRƯỜNG
• Admission Letter
• Invoice học phí
• Giới thiệu chương trình học

5. STUDY PLAN (800-1200 từ)
• Chi tiết hơn D-4-1, cần nêu rõ mục tiêu học tập và nghiên cứu`
  },
  {
    id: 'doc-translation-legalization',
    category: 'documents',
    title: 'Dịch thuật, Công chứng & Hợp pháp hóa lãnh sự',
    summary: 'Quy trình 4 bước xử lý giấy tờ tiếng Việt để có giá trị tại Hàn Quốc.',
    tags: ['dịch thuật', 'công chứng', 'hợp pháp hóa', 'giấy tờ'],
    content: `Giấy tờ tiếng Việt cần qua 4 bước sau mới có giá trị tại Hàn Quốc:

Bước 1: DỊCH THUẬT
• Dịch tất cả giấy tờ sang tiếng Hàn (ưu tiên) hoặc tiếng Anh
• Thực hiện tại Phòng Công chứng hoặc công ty dịch thuật được cấp phép

Bước 2: CÔNG CHỨNG BẢN DỊCH
• Mang bản gốc + bản dịch đến Phòng Công chứng Nhà nước
• Công chứng xác nhận chữ ký người dịch và bản dịch đúng với bản gốc

Bước 3: CHỨNG NHẬN TẠI BỘ NGOẠI GIAO (MOFA)
• Mang đến Sở Tư pháp (Hà Nội/TP.HCM) hoặc Cục Lãnh sự
• Thời gian: 1-3 ngày làm việc
• Xác nhận con dấu của Phòng Công chứng

Bước 4: HỢP PHÁP HÓA TẠI ĐSQ HÀN QUỐC
• Bước cuối cùng sau khi có dấu MOFA
• Thời gian: 3-5 ngày làm việc
• Từ 11/09/2026: có thể thay thế bằng Apostille (đơn giản hơn)

Lưu ý: Hầu hết giấy tờ chỉ có giá trị 3 tháng. Tính toán thời gian hợp lý!`
  },

  // ─── Finance Category ───
  {
    id: 'finance-savings',
    category: 'finance',
    title: 'Sổ tiết kiệm & Chứng minh tài chính',
    summary: 'Hướng dẫn chuẩn bị sổ tiết kiệm và chứng minh tài chính cho visa du học Hàn Quốc.',
    tags: ['tài chính', 'sổ tiết kiệm', 'chứng minh'],
    content: `Chứng minh tài chính là phần quan trọng nhất và cũng là nguyên nhân hàng đầu bị từ chối visa.

SỔ TIẾT KIỆM:
• D-4-1: Tối thiểu $10,000 (~250 triệu VND)
• D-2: Tối thiểu $18,000-$20,000 (~450-500 triệu VND)
• Mở tại quầy giao dịch (KHÔNG chấp nhận sổ online)
• Gửi kỳ hạn 12 tháng
• Mở trước 3-6 tháng (khuyến nghị: 6 tháng)

SAO KÊ NGÂN HÀNG:
• Cấp trong vòng 30 ngày trước khi nộp hồ sơ
• Phải thể hiện lịch sử giao dịch ỔN ĐỊNH
• Tránh nạp tiền "sốc" ngay trước khi lấy sao kê
• Duy trì số dư ổn định ít nhất 3-6 tháng

NGƯỜI BẢO LÃNH:
• Tự thân: cần chứng minh thu nhập ổn định
• Cha/mẹ: cần giấy tờ quan hệ + chứng minh thu nhập
• Người thân khác: cần giải trình rõ ràng

Lưu ý: Tuyệt đối tránh nạp 1 lần lớn vào tài khoản rồi lấy sao kê ngay. ĐSQ sẽ nghi ngờ tiền đi mượn!`
  },
  {
    id: 'finance-income-proof',
    category: 'finance',
    title: 'Chứng minh thu nhập người bảo lãnh',
    summary: 'Các loại giấy tờ chứng minh thu nhập cho người bảo lãnh tài chính.',
    tags: ['tài chính', 'thu nhập', 'bảo lãnh'],
    content: `Người bảo lãnh tài chính cần chứng minh thu nhập ổn định để thuyết phục ĐSQ.

Giấy tờ chứng minh thu nhập:
• Hợp đồng lao động (có thời hạn, mức lương rõ ràng)
• Sao kê lương 3-6 tháng gần nhất
• Xác nhận công việc từ công ty
• Giấy phép kinh doanh (nếu tự kinh doanh)
• Báo cáo thuế thu nhập cá nhân
• Sổ đỏ, giấy tờ nhà đất (tài sản đảm bảo)

Thu nhập nên đạt mức:
• Tối thiểu 15-20 triệu/tháng nếu bảo lãnh D-4-1
• Tối thiểu 25-30 triệu/tháng nếu bảo lãnh D-2
• Thu nhập càng cao, hồ sơ càng vững

Lưu ý: Nếu thu nhập thấp, có thể kết hợp nhiều nguồn: lương + kinh doanh + cho thuê nhà + tài sản.`
  },

  // ─── Study Plan Category ───
  {
    id: 'study-plan-guide',
    category: 'study-plan',
    title: 'Hướng dẫn viết Study Plan',
    summary: 'Cách viết Study Plan thuyết phục, cá nhân hoá, tránh lỗi chung chung.',
    tags: ['study plan', 'hướng dẫn', 'kế hoạch học tập'],
    content: `Study Plan là giấy tờ quan trọng nhất trong bộ hồ sơ. Một Study Plan tốt có thể bù đắp cho những điểm yếu khác.

CẤU TRÚC STUDY PLAN (500-800 từ):

1. MỞ ĐẦU (100-150 từ)
• Giới thiệu bản thân: tên, tuổi, quê quán
• Trình độ học vấn hiện tại
• Lý do chọn du học Hàn Quốc (cụ thể: văn hoá, giáo dục, cơ hội)

2. NỘI DUNG CHÍNH (300-400 từ)
• Tại sao chọn trường này — nghiên cứu kỹ về trường
• Kế hoạch học tập theo từng giai đoạn (6 tháng, 1 năm...)
  - Giai đoạn 1: Học tiếng Hàn, đạt TOPIK 2
  - Giai đoạn 2: Học chuyên ngành, tham gia hoạt động
  - Giai đoạn 3: Chuẩn bị tốt nghiệp, định hướng nghề nghiệp
• Mục tiêu cụ thể cho từng kỳ học

3. KẾT LUẬN (100-150 từ)
• Kế hoạch sau khi tốt nghiệp: về Việt Nam làm việc
• Ngành học liên quan đến định hướng nghề nghiệp
• Cam kết tuân thủ luật pháp Hàn Quốc

LỖI CẦN TRÁNH:
• Sao chép mẫu Study Plan trên mạng
• Viết chung chung, không có chi tiết cụ thể
• Không giải thích được gap year hoặc lý do chọn trường
• Kế hoạch mơ hồ, thiếu mốc thời gian

Study Plan chung chung là lý do trượt visa HÀNG ĐẦU!`
  },
  {
    id: 'study-plan-8-questions',
    category: 'study-plan',
    title: '8 câu hỏi để viết Study Plan cá nhân hoá',
    summary: 'Trả lời 8 câu hỏi này để AI có đủ thông tin viết Study Plan thuyết phục.',
    tags: ['study plan', 'câu hỏi', 'cá nhân hoá', 'AI'],
    content: `Để viết Study Plan thuyết phục, hãy trả lời 8 câu hỏi sau:

1. VÌ SAO CHỌN HÀN QUỐC?
Không phải nước khác? VD: Văn hoá Hàn Quốc, chất lượng giáo dục, gần Việt Nam, cơ hội việc làm

2. VÌ SAO CHỌN TRƯỜNG NÀY?
Chương trình đào tạo phù hợp, vị trí thuận lợi, học phí hợp lý

3. KẾ HOẠCH HỌC TẬP THEO GIAI ĐOẠN?
6 tháng đầu: học tiếng đạt TOPIK 2
6 tháng sau: thi TOPIK 3
Các học kỳ tiếp theo: học chuyên ngành

4. KẾ HOẠCH SAU TỐT NGHIỆP?
Về Việt Nam làm việc cho công ty Hàn Quốc, mở trung tâm tiếng Hàn

5. NGÀNH HỌC LIÊN QUAN ĐẾN ĐỊNH HƯỚNG NGHỀ NGHIỆP?
Học tiếng Hàn để làm biên dịch, hướng dẫn viên, làm việc tại công ty Hàn

6. GAP YEAR ĐÃ LÀM GÌ?
Đi làm, học thêm ngoại ngữ, tham gia hoạt động ngoại khoá

7. GIA ĐÌNH CÓ THU NHẬP ỔN ĐỊNH?
Cha mẹ làm kinh doanh/công chức, thu nhập ổn định

8. TRÌNH ĐỘ TIẾNG HÀN/ANH?
Đã học Sejong 2B, có TOPIK 2 hoặc đang ôn thi

Trả lời càng chi tiết, Study Plan càng thuyết phục! Sử dụng AI hỗ trợ trong tab "📋 Hồ sơ của tôi" để được giúp đỡ.`
  },

  // ─── Process Category ───
  {
    id: 'process-timeline',
    category: 'process',
    title: 'Lộ trình xử lý hồ sơ du học',
    summary: 'Timeline từ lúc bắt đầu đến khi nhận visa, gồm 5 bước chính.',
    tags: ['quy trình', 'timeline', 'lộ trình'],
    content: `Quy trình xử lý hồ sơ du học Hàn Quốc gồm 5 bước:

BƯỚC 1: ĐÁNH GIÁ HỒ SƠ (1-2 tuần)
• Kiểm tra học lực, GPA, số buổi nghỉ
• Đánh giá trình độ tiếng Hàn
• Xác định khả năng tài chính
• Kiểm tra lịch sử visa
• Chọn loại visa phù hợp (D-4-1 / D-2)

BƯỚC 2: CHỌN TRƯỜNG (1-3 tuần)
• Xem danh sách trường tuyển sinh
• So sánh học phí, KTX, điều kiện
• Chọn 2-3 trường phù hợp
• Liên hệ trường xác nhận chỉ tiêu

BƯỚC 3: CHUẨN BỊ GIẤY TỜ (4-8 tuần)
• Gom giấy tờ học tập
• Mở sổ tiết kiệm (cần 3-6 tháng trước)
• Dịch thuật + công chứng
• Xin thư mời từ trường Hàn

BƯỚC 4: NỘP HỒ SƠ & CHỜ KẾT QUẢ (2-4 tuần)
• Đặt lịch hẹn KVAC
• Nộp hồ sơ tại KVAC
• Theo dõi kết quả (5-20 ngày)

BƯỚC 5: NHẬN VISA & CHUẨN BỊ (1-2 tuần)
• Nhận visa, kiểm tra thông tin
• Mua vé máy bay, bảo hiểm
• Chuẩn bị hành lý
• Đặt chỗ ở tại Hàn

Tổng thời gian: 3-5 tháng. Nên bắt đầu trước kỳ nhập học ít nhất 4-6 tháng.`
  },
  {
    id: 'process-kvac',
    category: 'process',
    title: 'Nộp hồ sơ tại KVAC',
    summary: 'Hướng dẫn chi tiết quy trình nộp hồ sơ visa tại KVAC Hà Nội và TP.HCM.',
    tags: ['KVAC', 'nộp hồ sơ', 'quy trình'],
    content: `KVAC (Korea Visa Application Center) là đơn vị tiếp nhận hồ sơ visa Hàn Quốc tại Việt Nam.

Địa chỉ KVAC:
• Hà Nội: Tầng 7, Tòa nhà Viglacera, 112 Vũ Trọng Phụng, Thanh Xuân
• TP.HCM: Tầng 10, Tòa nhà BRR Tower, 12 Nguyễn Huệ, Quận 1

Quy trình nộp hồ sơ:
1. Đặt lịch hẹn online qua website KVAC
2. Chuẩn bị đầy đủ hồ sơ gốc + bản dịch
3. Đến KVAC đúng giờ hẹn
4. Nộp hồ sơ + đóng lệ phí
5. Nhận biên nhận + theo dõi kết quả online

Lưu phí:
• Phí xét duyệt visa: ~$40-80 (tuỳ loại)
• Phí dịch vụ KVAC: ~$20-30

Thời gian xử lý: 5-20 ngày làm việc

Lưu ý quan trọng: Lịch hẹn KVAC thường đầy nhanh, cần đặt sớm. Website: https://visaforkorea-vt.com/`
  },

  // ─── Schools Category ───
  {
    id: 'school-choose-guide',
    category: 'schools',
    title: 'Cách chọn trường Hàn Quốc phù hợp',
    summary: 'Tiêu chí chọn trường: khu vực, học phí, điều kiện, cơ hội việc làm sau tốt nghiệp.',
    tags: ['chọn trường', 'tiêu chí', 'khu vực'],
    content: `Chọn trường phù hợp là bước quan trọng nhất. Dưới đây là các tiêu chí cần xem xét:

1. KHU VỰC
• Seoul: Chi phí cao nhất, nhiều cơ hội làm thêm, giao thông thuận tiện
• Gần Seoul (Gyeonggi, Incheon): Chi phí thấp hơn, vẫn gần Seoul
• Busan: Thành phố lớn thứ 2, chi phí trung bình
• Các tỉnh khác: Chi phí thấp, môi trường học tập yên tĩnh

2. HỌC PHÍ
• Trung bình: 5-10 triệu KRW/kỳ (~100-200 triệu VND)
• Cao: 10-15 triệu KRW/kỳ
• Thấp (tỉnh): 3-5 triệu KRW/kỳ

3. KÝ TÚC XÁ
• Nên chọn trường có KTX để tiết kiệm chi phí
• Giá KTX: 500,000-1,500,000 KRW/tháng

4. ĐIỀU KIỆN ĐẦU VÀO
• GPA yêu cầu, TOPIK/IELTS
• Số buổi nghỉ cho phép
• Độ tuổi tối đa

5. CƠ HỘI E7
• Một số trường có lộ trình E7 tốt
• Ngành học dễ xin việc sau tốt nghiệp

Sử dụng công cụ "Tư vấn" trên website để được gợi ý trường phù hợp với hồ sơ của bạn!`
  },
  {
    id: 'school-regions',
    category: 'schools',
    title: 'Các khu vực du học tại Hàn Quốc',
    summary: 'So sánh chi phí sinh hoạt và học tập giữa các khu vực tại Hàn Quốc.',
    tags: ['khu vực', 'seoul', 'busan', 'chi phí'],
    content: `Hàn Quốc có nhiều khu vực du học với chi phí và đặc điểm khác nhau:

📍 SEOUL
• Chi phí sinh hoạt cao nhất: ~1,000,000-1,500,000 KRW/tháng
• Nhiều trường hàng đầu, nhiều lựa chọn
• Giao thông công cộng thuận tiện nhất
• Nhiều cơ hội làm thêm và việc làm sau tốt nghiệp

📍 GẦN SEOUL (Gyeonggi, Incheon)
• Chi phí thấp hơn Seoul 20-30%
• Vẫn dễ dàng đi lại vào Seoul
• Nhiều khu công nghiệp, cơ hội việc làm

📍 BUSAN
• Thành phố lớn thứ 2 Hàn Quốc
• Chi phí thấp hơn Seoul 30-40%
• Bãi biển, khí hậu dễ chịu
• Cảng biển lớn, nhiều ngành logistic

📍 DAEGU, DAEJEON, GWANGJU
• Chi phí thấp hơn 40-50% so với Seoul
• Môi trường học tập tập trung
• Dễ xin visa hơn

📍 CÁC TỈNH (Chungcheongbuk, Jeollanam, Gyeongsangnam)
• Chi phí thấp nhất
• Sĩ số lớp nhỏ, được quan tâm nhiều hơn
• Cần phương tiện cá nhân để di chuyển`
  },
];

// ═══════════════════════════════════════════════════════════
// FAQ DATA — cho FAQ accordion + tư vấn nhanh
// ═══════════════════════════════════════════════════════════

const KB_FAQ = [
  {
    id: 'faq-1',
    category: 'visa',
    question: 'D-4-1 và D-2 khác nhau thế nào?',
    answer: 'D-4-1 là visa học tiếng Hàn, thời hạn 6 tháng - 2 năm, yêu cầu tài chính $10,000+. D-2 là visa đại học chính quy, thời hạn 1 năm (gia hạn hàng năm), yêu cầu cao hơn: tài chính $18,000-20,000, TOPIK 3+ hoặc IELTS 5.5+, thư giới thiệu giáo viên. D-2 cho phép chuyển đổi sang visa E7 sau tốt nghiệp.'
  },
  {
    id: 'faq-2',
    category: 'finance',
    question: 'Cần bao nhiêu tiền trong sổ tiết kiệm?',
    answer: 'D-4-1: tối thiểu $10,000 (~250 triệu VND). D-2: tối thiểu $18,000-$20,000 (~450-500 triệu VND). Sổ phải mở tại quầy giao dịch (không chấp nhận sổ online), gửi kỳ hạn 12 tháng, mở trước 3-6 tháng. Kèm giấy xác nhận số dư cấp trong vòng 30 ngày.'
  },
  {
    id: 'faq-3',
    category: 'process',
    question: 'Mất bao lâu để xử lý visa?',
    answer: 'Thời gian xử lý visa Hàn Quốc là 5-20 ngày làm việc, tuỳ vào thời điểm và loại visa. Nên nộp hồ sơ trước ngày nhập học ít nhất 4-6 tuần. Mùa cao điểm (tháng 2-3 và 8-9) có thể kéo dài hơn.'
  },
  {
    id: 'faq-4',
    category: 'process',
    question: 'Nộp hồ sơ ở đâu? Có cần đặt lịch không?',
    answer: 'Nộp hồ sơ tại KVAC (Korea Visa Application Center) ở Hà Nội hoặc TP.HCM. Bắt buộc phải đặt lịch hẹn trước qua website visaforkorea-vt.com. Lịch thường đầy nhanh, nên đặt sớm 2-3 tuần.'
  },
  {
    id: 'faq-5',
    category: 'documents',
    question: 'Giấy tờ dịch thuật cần công chứng không?',
    answer: 'Có. Tất cả giấy tờ tiếng Việt cần dịch sang tiếng Hàn hoặc Anh, sau đó công chứng tại Phòng Công chứng Nhà nước. Sau công chứng, cần chứng nhận tại Bộ Ngoại giao (MOFA) và hợp pháp hóa tại ĐSQ Hàn Quốc. Từ 11/09/2026, quy trình hợp pháp hóa sẽ được thay thế bằng Apostille (đơn giản hơn).'
  },
  {
    id: 'faq-6',
    category: 'study-plan',
    question: 'Study Plan viết bằng tiếng gì?',
    answer: 'Nên viết bằng tiếng Hàn (ưu tiên) hoặc tiếng Anh. Độ dài 500-800 từ cho D-4-1, 800-1200 từ cho D-2. Nội dung cần cá nhân hoá, có mốc thời gian cụ thể, tránh chung chung. Sử dụng AI hỗ trợ trong tab "📋 Hồ sơ của tôi" để được giúp đỡ.'
  },
  {
    id: 'faq-7',
    category: 'finance',
    question: 'Nếu người bảo lãnh không phải cha mẹ thì cần gì?',
    answer: 'Cần bổ sung: (1) Giấy cam kết bảo lãnh tài chính, (2) Giấy tờ chứng minh quan hệ với người bảo lãnh, (3) Chứng minh thu nhập của người bảo lãnh. Nếu người bảo lãnh là người thân khác, cần giải trình rõ lý do tại sao cha mẹ không thể bảo lãnh.'
  },
  {
    id: 'faq-8',
    category: 'visa',
    question: 'Trượt visa rồi có nộp lại được không?',
    answer: 'Có, nhưng phải đợi tối thiểu 3 tháng kể từ ngày bị từ chối. Cần phân tích kỹ nguyên nhân trượt, khắc phục triệt để trước khi nộp lại. Không nộp lại hồ sơ giống hệt lần trước. Nên viết giải trình rõ ràng về những thay đổi và cải thiện.'
  },
  {
    id: 'faq-9',
    category: 'visa',
    question: 'Có cần phỏng vấn khi nộp visa không?',
    answer: 'Không phải ai cũng bị gọi phỏng vấn. KVAC sẽ quyết định có phỏng vấn hay không dựa trên hồ sơ. Nếu được gọi phỏng vấn, hãy trả lời tự tin, nhất quán với hồ sơ đã nộp. Các câu hỏi thường xoay quanh: mục đích du học, tài chính, kế hoạch tương lai.'
  },
  {
    id: 'faq-10',
    category: 'documents',
    question: 'Giấy khám lao phổi (TB test) khám ở đâu?',
    answer: 'Khám tại bệnh viện được Đại sứ quán chỉ định. Hà Nội: Bệnh viện Phổi Trung ương. TP.HCM: Bệnh viện Chợ Rẫy, Bệnh viện Phạm Ngọc Thạch, Bệnh viện Thống Nhất. Giấy có giá trị 3 tháng. Khám sai bệnh viện sẽ không được chấp nhận!'
  },
  {
    id: 'faq-11',
    category: 'schools',
    question: 'Nên chọn trường ở Seoul hay tỉnh?',
    answer: 'Tuỳ vào điều kiện và mục tiêu. Seoul: chi phí cao hơn 30-50%, nhiều cơ hội làm thêm và việc làm. Tỉnh: chi phí thấp, tỉ lệ đậu visa cao hơn, môi trường học tập yên tĩnh. Với hồ sơ yếu (GPA thấp, gap year dài), nên chọn trường tỉnh để tăng cơ hội đậu visa.'
  },
  {
    id: 'faq-12',
    category: 'finance',
    question: 'Có cần sổ đóng băng K-Study không?',
    answer: 'Không bắt buộc nhưng là điểm cộng lớn. Sổ đóng băng K-Study mở tại Shinhan hoặc Woori Bank Việt Nam, số tiền 8,000-10,000 USD, giúp tăng tỉ lệ đậu visa đáng kể. Nhiều trường Hàn Quốc khuyến khích hoặc yêu cầu loại sổ này.'
  },
  {
    id: 'faq-13',
    category: 'process',
    question: 'Có thể vừa học vừa làm thêm không?',
    answer: 'Có, sau 6 tháng đầu tiên. Visa D-4-1 và D-2 đều cho phép làm thêm tối đa 20h/tuần trong học kỳ và 40h/tuần trong kỳ nghỉ. Cần xin giấy phép làm thêm từ trường và Immigration. Mức lương làm thêm trung bình: 8,000-10,000 KRW/giờ.'
  },
  {
    id: 'faq-14',
    category: 'study-plan',
    question: 'Study Plan có cần phải dài không?',
    answer: 'Không cần dài nhưng phải CHI TIẾT và CÁ NHÂN HOÁ. D-4-1: 500-800 từ. D-2: 800-1200 từ. Quan trọng là nội dung: lý do chọn Hàn Quốc cụ thể, kế hoạch học tập rõ ràng (có mốc thời gian), kế hoạch sau tốt nghiệp thuyết phục. Một Study Plan 500 từ hay còn hơn 2000 từ chung chung.'
  },
  {
    id: 'faq-15',
    category: 'documents',
    question: 'Hộ chiếu cần còn hạn bao lâu?',
    answer: 'Cần còn hạn ít nhất 6 tháng tính từ ngày nộp hồ sơ visa. Ngoài ra, hộ chiếu cần còn ít nhất 2 trang trống để dán visa và đóng/xuất nhập cảnh. Nếu hộ chiếu sắp hết hạn, nên làm mới trước khi bắt đầu làm hồ sơ du học.'
  },
  {
    id: 'faq-16',
    category: 'visa',
    question: 'Tỉ lệ đậu visa D-4-1 và D-2 là bao nhiêu?',
    answer: 'Tỉ lệ đậu phụ thuộc vào chất lượng hồ sơ, không có con số cố định. D-4-1 thường có tỉ lệ đậu cao hơn D-2 vì yêu cầu thấp hơn. Hồ sơ tốt (GPA 6+, tài chính vững, Study Plan rõ ràng) có thể đạt tỉ lệ đậu 80-90%. Hồ sơ yếu (GPA thấp, gap year, tài chính không rõ ràng) có thể chỉ 30-50%.'
  },
  {
    id: 'faq-17',
    category: 'schools',
    question: 'Có thể xin vào trường mà không có TOPIK không?',
    answer: 'Với D-4-1: hoàn toàn có thể, vì đây là visa học tiếng. Với D-2: hầu hết trường yêu cầu TOPIK 3+ hoặc IELTS 5.5+. Một số trường chấp nhận hoàn thành khóa tiếng tại trường thay vì TOPIK. Nếu chưa có TOPIK, nên bắt đầu với D-4-1 rồi chuyển lên D-2 sau.'
  },
  {
    id: 'faq-18',
    category: 'process',
    question: 'Khi nào nên bắt đầu làm hồ sơ?',
    answer: 'Nên bắt đầu trước kỳ nhập học 4-6 tháng. Timeline gợi ý: Tháng 1-2: đánh giá hồ sơ, chọn trường. Tháng 3-4: mở sổ TK, chuẩn bị giấy tờ. Tháng 5: nộp hồ sơ visa. Tháng 6-7: nhận visa, chuẩn bị bay (kỳ tháng 9). Đối với kỳ tháng 3: dịch chuyển timeline sớm hơn 6 tháng.'
  },
];

// ═══════════════════════════════════════════════════════════
// MODULE STRUCTURE (giữ nguyên từ bản cũ)
// ═══════════════════════════════════════════════════════════

const KB_MODULE_STRUCTURE = `\n=== HỆ THỐNG MODULE HỒ SƠ (THEO LOẠI VISA) ===\n\n**Visa D-4-1 (Khóa tiếng Hàn):**\n  A1. Giấy tờ hành chính cá nhân — Đơn xin visa, hộ chiếu, ảnh, CCCD, hộ khẩu, giấy khai sinh\n  A2. Giấy tờ học vấn — Bằng THPT, học bạ, bảng điểm, dịch công chứng, giải trình gap (nếu có)\n  A3. Giấy tờ từ trường — Admission Letter, Certificate of Admission, Invoice học phí\n  A4. Chứng minh tài chính — Sổ tiết kiệm (tối thiểu 10.000 USD), giấy cam kết bảo lãnh, quan hệ bảo lãnh\n  A5. Study Plan / Personal Statement — AI hỗ trợ soạn thảo, chấm điểm\n  A6. Nộp hồ sơ & theo dõi — Đặt lịch KVAC, khám lao phổi, nộp hồ sơ, theo dõi kết quả\n\n**Visa D-2 (Đại học chính quy):**\n  — Yêu cầu cao hơn D-4-1: cần chứng chỉ TOPIK, thư giới thiệu giáo viên, học lực cao hơn\n\n**Chuyển đổi D4 → D2:**\n  — Giấy chứng nhận nhập học/bảng điểm ĐH Hàn, Giấy hoàn thành khóa tiếng, nộp tại Sở Di trú\n`;

const KB_ANALYSIS_FRAMEWORK = `\n=== FRAMEWORK PHÂN TÍCH HỒ SƠ CÁ NHÂN HÓA ===\n\n**1. Phân tích hồ sơ theo 6 nhóm:**\n  • Nhân thân — Tuổi, quê quán, nơi cư trú, tình trạng hôn nhân\n  • Học vấn — Trình độ, trường, GPA, năm tốt nghiệp, TOPIK, IELTS\n  • Kinh nghiệm làm việc — Đã đi làm? Thời gian? HĐLĐ? BHXH?\n  • Tài chính — Người bảo trợ, nghề nghiệp, thu nhập, tài sản, sổ tiết kiệm\n  • Lịch sử nhập cảnh — Đã từng xin visa? Trượt visa? Xuất cảnh?\n  • Gia đình — Người thân tại Hàn? Người thân cư trú bất hợp pháp?\n\n**2. Đánh giá từng nhóm:**\n  Mỗi nhóm cần xác định: Điểm mạnh - Điểm yếu - Rủi ro - Chứng cứ còn thiếu - Hành động đề xuất\n\n**3. Quyết định sau phân tích:**\n  • Có nên nhận hồ sơ? • Có cần bổ sung? • Có cần giải trình?\n  • Có cần đổi trường? • Có nên đổi kỳ nhập học? • Có nên học TOPIK trước?\n  • Có nên tăng chứng minh tài chính?\n\n**4. Nguyên tắc sinh checklist:**\n  — Không sinh checklist cố định cho mọi học sinh\n  — Checklist được tạo dựa trên quyết định từ phân tích\n  — VD: Gap > 2 năm → cần giải trình + xác nhận công việc\n  — VD: Trượt visa → cần phân tích nguyên nhân + hồ sơ cũ + giải trình bổ sung\n`;

const KB_STUDY_PLAN_QUESTIONS = `\n=== KHUNG CÂU HỎI CÁ NHÂN HÓA STUDY PLAN ===\n(Khi viết Study Plan, hãy giúp học sinh trả lời 8 câu hỏi sau trong bài viết)\n\n1. Vì sao bạn chọn du học Hàn Quốc (không phải nước khác)?\n2. Vì sao chọn trường này / thành phố này?\n3. Bạn học ngành gì, ngành đó liên quan gì đến định hướng nghề nghiệp?\n4. Kế hoạch học tập cụ thể theo từng giai đoạn (6 tháng, 1 năm, 2 năm...)?\n5. Bạn có kế hoạch gì sau khi tốt nghiệp (về nước / ở lại làm việc)?\n6. Có khoảng trống thời gian sau tốt nghiệp không? Nếu có, lý do là gì?\n7. Gia đình/người bảo lãnh có nghề nghiệp, thu nhập ổn định thế nào?\n8. Bạn đã học tiếng Hàn/Anh đến trình độ nào, có chứng chỉ gì?\n`;

const KB_DOCUMENT_DECISION_RULES = `\n=== LOGIC QUYẾT ĐỊNH GIẤY TỜ THEO HỒ SƠ ===\n(Không áp dụng checklist cố định — suy luận dựa trên đặc điểm học sinh)\n\n• Nếu Gap Year > 2 năm → Cần: Giải trình khoảng thời gian + Xác nhận công việc + HĐLĐ\n• Nếu từng trượt visa → Cần: Phân tích nguyên nhân + Hồ sơ cũ + Giải trình bổ sung\n• Nếu bảo lãnh không phải tự thân → Cần: Giấy cam kết bảo lãnh + Giấy tờ quan hệ\n• Nếu có người thân tại Hàn → Cần: Khai báo rõ ràng, tránh nghi ngờ\n• Nếu học lực thấp (GPA < 5.0) → Cần: Giải trình học tập + cam kết cải thiện\n• Nếu tuổi cao (> 28) → Cần: Lý do du học hợp lý, lộ trình nghề nghiệp rõ\n`;

const KB_FOR_CHAT = `\n=== KIẾN THỨC NỀN TẢNG XỬ LÝ HỒ SƠ ===\n\n${KB_MODULE_STRUCTURE}\n${KB_ANALYSIS_FRAMEWORK}\n${KB_STUDY_PLAN_QUESTIONS}\n`.trim();

const KB_FOR_STUDY_PLAN = `\n=== KHUNG ĐỂ VIẾT STUDY PLAN CHẤT LƯỢNG ===\n\n${KB_STUDY_PLAN_QUESTIONS}\n\nCác bước phân tích trước khi viết:\n1. Xác định đặc điểm học sinh (học lực, tiếng Hàn, kinh nghiệm, tài chính)\n2. Xác định rủi ro cần giải trình (gap year, trượt visa, tuổi cao, GPA thấp)\n3. Đảm bảo Study Plan trả lời được: tại sao Hàn Quốc, tại sao trường này, kế hoạch cụ thể, tương lai sau tốt nghiệp\n`;

const KB_FOR_GAP = `\n=== PHÂN TÍCH GAP YEAR ===\n\nKhi phân tích gap year, hãy xem xét:\n• Thời gian gap dài bao lâu?\n• Trong gap đã làm gì? (học ngoại ngữ, đi làm, chờ điều kiện, lý do sức khoẻ)\n• Có chứng cứ gì cho hoạt động trong gap? (HĐLĐ, chứng chỉ, giấy tờ)\n• Gap có ảnh hưởng đến động lực du học không?\n• Gap có hợp lý với hoàn cảnh gia đình/cá nhân không?\n\nTUYỆT ĐỐI KHÔNG dùng lý do tài chính gia đình khó khăn để giải thích gap.\n`;

const KB_FOR_REJECTION = `\n=== PHÂN TÍCH HỒ SƠ TRƯỢT VISA ===\n\nKhi phân tích hồ sơ trượt visa, cần:\n1. Xác định nguyên nhân trượt từ lý do cụ thể\n2. Đề xuất cải thiện tương ứng:\n   • Thiếu giấy tờ tài chính → Bổ sung sổ tiết kiệm, sao kê, giấy tờ thu nhập\n   • Study Plan chung chung → Viết lại chi tiết, cá nhân hoá, có mốc thời gian\n   • Không chứng minh được mối quan hệ gia đình → Bổ sung giấy tờ quan hệ\n   • Học lực không đáp ứng → Cải thiện GPA, học thêm, thi TOPIK\n   • Lý do khác → Phân tích cụ thể theo hồ sơ\n3. Cam kết hồ sơ lần này đã hoàn chỉnh hơn, thể hiện thiện chí\n`;

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

module.exports = {
  // Structured data for KB page + search
  KB_ARTICLES,
  KB_FAQ,

  // Category labels
  KB_CATEGORIES: [
    { id: 'visa', label: 'Visa & Quy định', icon: '🛂' },
    { id: 'documents', label: 'Giấy tờ & Hồ sơ', icon: '📄' },
    { id: 'finance', label: 'Tài chính', icon: '💰' },
    { id: 'study-plan', label: 'Study Plan', icon: '✍️' },
    { id: 'process', label: 'Quy trình', icon: '📋' },
    { id: 'schools', label: 'Trường & Khu vực', icon: '🏫' },
  ],

  // Legacy prompt content (keep for backward compatibility)
  KB_MODULE_STRUCTURE,
  KB_ANALYSIS_FRAMEWORK,
  KB_STUDY_PLAN_QUESTIONS,
  KB_DOCUMENT_DECISION_RULES,
  KB_FOR_CHAT,
  KB_FOR_STUDY_PLAN,
  KB_FOR_GAP,
  KB_FOR_REJECTION,
};
