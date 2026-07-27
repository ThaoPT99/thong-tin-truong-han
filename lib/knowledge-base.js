// lib/knowledge-base.js
// Knowledge Base — phiên bản 2.0: CHẤT LƯỢNG 10/10
// Dùng cho: AI prompts, Knowledge Base page, FAQ, search
//
// ═══════ QUY ƯỚC ĐỊNH DẠNG ═══════
// 📌 **MẸO**: ... → Tip box (xanh)
// ⚠️ **LƯU Ý**: ... → Warning box (vàng)
// 🚫 **SAI LẦM THƯỜNG GẶP**: ... → Error box (đỏ)
// 📊 **THỐNG KÊ**: ... → Stats box
// 📝 **VÍ DỤ**: ... → Example box (tím)
// 💡 **CASE STUDY**: ... → Case study (xanh lá)
// | H1 | H2 | → Bảng (sẽ được render dưới dạng HTML table)

// ═══════════════════════════════════════════════════════════
// KB_ARTICLES — 28 bài viết chuyên sâu
// ═══════════════════════════════════════════════════════════

const KB_ARTICLES = [
  // ═══════════════════════════════════════════
  // VISA CATEGORY (7 articles)
  // ═══════════════════════════════════════════

  {
    id: 'visa-d4-1-overview',
    category: 'visa',
    title: 'Tổng quan visa D-4-1 (Học tiếng Hàn) — Toàn tập từ A đến Z',
    summary: 'Visa D-4-1 dành cho học sinh đăng ký khóa học tiếng Hàn tại Hàn Quốc. Thời hạn 6 tháng - 2 năm.',
    tags: ['D-4-1', 'visa', 'học tiếng', 'tổng quan', 'hướng dẫn'],
    content: `Visa D-4-1 là visa du học phổ biến nhất dành cho học sinh quốc tế đăng ký các khóa học tiếng Hàn tại các trường đại học Hàn Quốc. Đây là bước đệm quan trọng để bạn tiến lên visa D-2 (đại học chính quy).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐẶC ĐIỂM CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Tiêu chí | Chi tiết |
|----------|----------|
| Thời hạn visa | 6 tháng/lần, gia hạn tối đa 2 năm |
| Làm thêm | Được phép sau 6 tháng (cần xin phép) |
| Giờ làm thêm | 10-25h/tuần tuỳ TOPIK |
| Yêu cầu TOPIK | KHÔNG bắt buộc (có là lợi thế lớn) |
| Tài chính tối thiểu | $10,000+ (~250 triệu VND) |
| Chuyển đổi visa | Có thể lên D-2 sau khi đạt TOPIK 3+ |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH 5 BƯỚC XIN VISA D-4-1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Bước 1: Chọn trường & nhận Admission Letter (2-4 tuần)**
• Chọn trường có chương trình tiếng Hàn phù hợp
• Nộp đơn + học phí → nhận Admission Letter + Invoice
• Một số trường yêu cầu phỏng vấn online

**Bước 2: Chuẩn bị hồ sơ (4-8 tuần)**
• Gom giấy tờ hành chính, học vấn
• Mở sổ tiết kiệm $10,000+ (tối thiểu 3-6 tháng trước)
• Dịch thuật + công chứng + hợp pháp hoá

**Bước 3: Khám lao phổi (1 ngày)**
• Đặt lịch tại bệnh viện được chỉ định
• Kiểm tra danh sách mới nhất trên website KVAC

**Bước 4: Nộp hồ sơ tại KVAC**
• Hà Nội: Đến trực tiếp (đã dừng đặt lịch online từ 06/04/2026)
• TP.HCM: Đặt lịch online qua visaforkorea-hc.com
• Đóng lệ phí: $60 (visa) + 390,000 VND (phí KVAC)

**Bước 5: Chờ kết quả (13-20 ngày làm việc)**
• Theo dõi kết quả online qua website KVAC
• Nếu đậu: nhận visa, kiểm tra thông tin
• Nếu trượt: xem bài "Xử lý khi trượt visa"

📌 **MẸO**: Nên nộp hồ sơ trước kỳ nhập học ít nhất 3-4 tháng. Mùa cao điểm (tháng 2-3 và 8-9) thời gian xử lý có thể kéo dài hơn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI NÊN CHỌN D-4-1?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

D-4-1 phù hợp với:
• Người chưa có TOPIK hoặc TOPIK dưới 3
• Người muốn học tiếng trước khi vào đại học
• Hồ sơ tài chính trung bình ($10,000 là đủ)
• Người muốn tỉ lệ đậu visa cao hơn

📊 **THỐNG KÊ**: Theo kinh nghiệm thực tế, D-4-1 có tỉ lệ đậu cao hơn D-2 khoảng 15-20% nhờ yêu cầu thấp hơn. Hồ sơ có Study Plan tốt + tài chính rõ ràng có tỉ lệ đậu trên 85%.

⚠️ **LƯU Ý**: D-4-1 KHÔNG cho phép ở lại làm việc sau tốt nghiệp. Bạn phải chuyển lên D-2 hoặc E7 nếu muốn ở lại làm việc.
`
  },
  {
    id: 'visa-d2-overview',
    category: 'visa',
    title: 'Tổng quan visa D-2 (Đại học chính quy) — Điều kiện & Lộ trình',
    summary: 'Visa D-2 dành cho sinh viên theo học chương trình đại học/cao đẳng chính quy tại Hàn Quốc. Yêu cầu cao hơn D-4-1.',
    tags: ['D-2', 'visa', 'đại học', 'tổng quan', 'chính quy'],
    content: `Visa D-2 là visa dành cho sinh viên quốc tế theo học các chương trình đại học, cao đẳng chính quy tại Hàn Quốc. Đây là visa có giá trị nhất vì cho phép ở lại làm việc (E7) sau tốt nghiệp.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐẶC ĐIỂM CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Tiêu chí | D-2 (Đại học) | D-2 (Cao học) |
|----------|---------------|---------------|
| Thời hạn visa | 1-2 năm/lần | 1-2 năm/lần |
| TOPIK yêu cầu | 3+ hoặc IELTS 5.5+ | 4+ hoặc IELTS 6.0+ |
| Tài chính | $10,000-$20,000 | $15,000-$25,000 |
| Làm thêm tối đa | 25h/tuần | 30h/tuần |
| Ở lại E7 | ✅ Có thể | ✅ Có thể |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHÂN LOẠI VISA D-2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vis D-2 có nhiều phân loại nhỏ (theo quy định mới nhất của Bộ Tư pháp Hàn Quốc):
• **D-2-1**: Chương trình cao đẳng (Associate Degree)
• **D-2-2**: Chương trình cử nhân đại học (Bachelor's Degree)
• **D-2-3**: Chương trình thạc sĩ (Master's Degree)
• **D-2-4**: Chương trình tiến sĩ (Doctoral Degree)
• **D-2-5**: Chương trình nghiên cứu (Research Program)
• **D-2-6**: Chương trình trao đổi sinh viên (Exchange Student)
• **D-2-7**: Chương trình học kết hợp làm việc (Work-Learning Linked Study)

📌 **MẸO**: D-2-2 (cử nhân) và D-2-6 (trao đổi sinh viên) là hai loại phổ biến nhất với học sinh Việt Nam. D-2-6 thường dễ xin hơn vì là chương trình hợp tác giữa các trường đối tác.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YÊU CẦU ĐẦU VÀO THƯỜNG GẶP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Học lực**: GPA THPT >= 6.0 (hoặc tương đương)
2. **Tiếng Hàn**: TOPIK 3+ (một số trường chấp nhận TOPIK 2)
3. **Tiếng Anh**: IELTS 5.5+ (nếu học chương trình tiếng Anh)
4. **Tài chính**: Sổ tiết kiệm $10,000-$20,000
5. **Sức khoẻ**: Giấy khám lao phổi (TB test) tại bệnh viện chỉ định

⚠️ **LƯU Ý**: Một số trường top đầu (SKY: Seoul National, Korea, Yonsei) yêu cầu TOPIK 4-5 và GPA >= 7.0. Hãy kiểm tra kỹ điều kiện trước khi nộp.

📝 **VÍ DỤ**: Học sinh Nguyễn Văn A, GPA 7.2, TOPIK 4, sổ tiết kiệm $15,000 → đậu visa D-2 vào trường Đại học Quốc gia Seoul. Trong khi học sinh Trần Thị B, GPA 5.5, TOPIK 2, sổ TK $10,000 → được khuyên nên chọn D-4-1 trước.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KHÁC BIỆT D-4-1 VS D-2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Yếu tố | D-4-1 | D-2 |
|--------|-------|-----|
| Độ khó xin visa | Dễ hơn | Khó hơn |
| TOPIK đầu vào | Không cần | Cần 3+ |
| Chi phí ban đầu | Thấp hơn | Cao hơn |
| Làm thêm | 10-25h/tuần | 25-30h/tuần |
| Ở lại E7 | ❌ Phải chuyển đổi | ✅ Trực tiếp |
| Thời gian xử lý | 13-20 ngày | 13-20 ngày |
`
  },
  {
    id: 'visa-d4-to-d2',
    category: 'visa',
    title: 'Chuyển đổi visa D-4-1 sang D-2 — Hướng dẫn chi tiết từ A đến Z',
    summary: 'Hướng dẫn chuyển từ visa học tiếng D-4-1 lên visa đại học D-2 ngay tại Hàn Quốc mà không cần về nước.',
    tags: ['D-4-1', 'D-2', 'chuyển đổi', 'visa', 'hướng dẫn'],
    content: `Sau khi hoàn thành khóa học tiếng Hàn với visa D-4-1, bạn có thể chuyển lên visa D-2 để học đại học chính quy ngay tại Hàn Quốc. Đây là lộ trình phổ biến và được khuyến khích vì bạn không cần về nước làm lại hồ sơ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐIỀU KIỆN CHUYỂN ĐỔI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Điều kiện | Yêu cầu |
|-----------|---------|
| TOPIK | 3+ (một số trường yêu cầu 4+) |
| Điểm chuyên cần | Trên 90% (theo quy định Immigration) |
| Tài chính | ~20,000,000-25,000,000 KRW (~$18,000-20,000) |
| Thời hạn visa còn | Ít nhất 1 tháng trước khi hết hạn |
| Admission Letter | Từ trường đại học |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH TỪNG BƯỚC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Bước 1: Chuẩn bị (2-3 tháng trước khi hết hạn D-4-1)**
• Xin Admission Letter từ trường đại học
• Mở sổ tiết kiệm tại ngân hàng Hàn Quốc (duy trì 28 ngày)
• Chuẩn bị bảng điểm khóa tiếng + chứng chỉ hoàn thành

**Bước 2: Nộp hồ sơ tại Immigration (1 ngày)**
• Đến Văn phòng Xuất nhập cảnh hoặc nộp qua trường
• Hồ sơ gồm: hộ chiếu, ARC, đơn xin chuyển đổi, admission letter, xác nhận số dư, TOPIK, bảng điểm
• Phí: ~100,000-135,000 KRW

**Bước 3: Chờ kết quả (2-4 tuần)**
• Check online qua website Hi Korea
• Nếu đậu: nhận sticker visa mới trên hộ chiếu
• Nếu trượt: có thể kháng cáo hoặc nộp lại

📌 **MẸO**: Nên nộp qua văn phòng quốc tế của trường (Office of International Affairs) — họ quen quy trình và giúp bạn rất nhiều.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ CẦN CHUẨN BỊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Nhóm 1 — Giấy tờ cá nhân:**
• Hộ chiếu (bản gốc)
• Thẻ ngoại kiều (ARC) (bản gốc)
• Ảnh thẻ 3.5x4.5cm nền trắng (2 ảnh)

**Nhóm 2 — Giấy tờ học tập:**
• Giấy chứng nhận hoàn thành khóa tiếng + bảng điểm
• Admission Letter từ trường đại học
• Chứng chỉ TOPIK (hoặc ngoại ngữ khác)
• Bảng điểm + bằng tốt nghiệp cao nhất

**Nhóm 3 — Giấy tờ tài chính:**
• Xác nhận số dư tài khoản ngân hàng (cấp trong 30 ngày gần nhất)
• Sổ tiết kiệm Hàn Quốc (nếu có)

⚠️ **LƯU Ý**: KHÔNG để visa D-4-1 hết hạn mới nộp — bạn sẽ bị quá hạn (illegal stay) và bị phạt. Nộp ít nhất 1 tháng trước khi hết hạn!

💡 **CASE STUDY**: Học sinh Lê Văn C học tiếng 1 năm tại Đại học Kyung Hee, đạt TOPIK 4, điểm chuyên cần 95%. Nộp chuyển lên D-2 ngành Kinh tế. Kết quả: đậu sau 3 tuần. Bài học: chuyên cần cao + TOPIK 4 là chìa khóa thành công.
`
  },
  {
    id: 'visa-rejection',
    category: 'visa',
    title: 'Xử lý khi trượt visa Hàn Quốc — Cẩm nang khắc phục toàn diện',
    summary: 'Nguyên nhân thường gặp và cách khắc phục khi bị từ chối visa du học Hàn Quốc. 5 bước xử lý chuyên nghiệp.',
    tags: ['visa', 'trượt', 'từ chối', 'xử lý', 'khắc phục'],
    content: `Bị từ chối visa KHÔNG phải là dấu chấm hết. Hàng ngàn học sinh đã đậu visa sau lần trượt đầu tiên nhờ biết cách khắc phục đúng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 NGUYÊN NHÂN TRƯỢT PHỔ BIẾN NHẤT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Nguyên nhân | Tỉ lệ | Cách nhận biết |
|-------------|-------|----------------|
| 1. Tài chính chưa rõ ràng | ~40% | Nạp tiền "sốc", sao kê bất thường |
| 2. Study Plan chung chung | ~30% | Không có mốc thời gian, sao chép mẫu |
| 3. Quan hệ bảo lãnh không rõ | ~15% | Thiếu giấy tờ quan hệ |
| 4. Học lực không đáp ứng | ~10% | GPA thấp, gap year dài |
| 5. Các lý do khác | ~5% | Tuổi cao, lịch sử visa xấu |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 BƯỚC XỬ LÝ KHI BỊ TRƯỢT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Bước 1: Xác định chính xác nguyên nhân**
• Đọc kỹ thông báo từ ĐSQ hoặc KVAC
• Nếu không rõ, có thể yêu cầu giải thích lý do
• Phân tích hồ sơ để tìm điểm yếu

**Bước 2: Khắc phục triệt để**
• Tài chính: Mở sổ mới + duy trì sao kê ổn định 3-6 tháng
• Study Plan: Viết lại hoàn toàn, có mốc thời gian cụ thể
• Quan hệ: Bổ sung giấy tờ chứng minh rõ ràng

**Bước 3: Đợi ít nhất 3 tháng**
• Không nộp lại ngay — cần thời gian để cải thiện
• Tận dụng thời gian để thi TOPIK, cải thiện hồ sơ

**Bước 4: Chuẩn bị hồ sơ mới**
• KHÔNG nộp lại hồ sơ giống hệt
• Viết giải trình: phân tích lý do trượt + cách khắc phục

**Bước 5: Nộp lại với tâm thế mới**
• Hồ sơ lần 2 cần thể hiện sự cải thiện rõ ràng
• Tự tin hơn vì đã biết điểm yếu và khắc phục

🚫 **SAI LẦM THƯỜNG GẶP**: 
• Nộp lại ngay sau 1-2 tháng — ĐSQ sẽ nghi ngờ và dễ trượt tiếp
• Nộp lại với hồ sơ y hệt — lãng phí thời gian và tiền bạc
• Không viết giải trình — bỏ lỡ cơ hội thuyết phục

💡 **CASE STUDY**: Học sinh Hoàng Thị D trượt visa D-4-1 vì Study Plan chung chung (chỉ 200 từ, không có mốc thời gian). Sau 4 tháng, em viết lại Study Plan 800 từ, chi tiết từng giai đoạn, thêm chứng chỉ TOPIK 2. Kết quả: ĐẬU lần 2.
`
  },
  {
    id: 'visa-interview',
    category: 'visa',
    title: 'Phỏng vấn visa Hàn Quốc — 15 câu hỏi & cách trả lời đậu 100%',
    summary: 'Những câu hỏi thường gặp khi phỏng vấn visa du học Hàn Quốc và cách trả lời hiệu quả, thuyết phục.',
    tags: ['visa', 'phỏng vấn', 'câu hỏi', 'mẹo', 'kinh nghiệm'],
    content: `Không phải ai nộp visa cũng bị gọi phỏng vấn. Tuy nhiên, nếu bạn được gọi, hãy chuẩn bị kỹ — đây là cơ hội để thuyết phục trực tiếp nhân viên xét duyệt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỚC KHI PHỎNG VẤN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **LƯU Ý**: Từ 13/04/2025, ĐƠN XIN VISA CHỈ ĐƯỢC ĐIỀN BẰNG TIẾNG HÀN HOẶC TIẾNG ANH. Điền bằng tiếng Việt sẽ không được chấp nhận và phải điền lại.

📌 **MẸO CHUẨN BỊ**:
• Học thuộc các số liệu trong hồ sơ (số tiền, tên trường, ngành học)
• Chuẩn bị câu trả lời bằng tiếng Hàn hoặc Anh (không dùng tiếng Việt)
• Mặc lịch sự, đến đúng giờ, mang đủ giấy tờ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
15 CÂU HỎI THƯỜNG GẶP & CÁCH TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**NHÓM 1 — MỤC ĐÍCH DU HỌC**

1. "Tại sao bạn chọn Hàn Quốc?"
✅ Nên: "Tôi yêu thích văn hoá Hàn Quốc, chất lượng giáo dục tốt, gần Việt Nam, chi phí hợp lý hơn các nước khác."
❌ Tránh: "Vì tôi thích K-pop và phim Hàn."

2. "Tại sao chọn trường này?"
✅ Nên: "Trường có chương trình đào tạo tiếng Hàn uy tín, học phí phải chăng, vị trí thuận lợi."
❌ Tránh: "Bạn bè tôi cũng học trường này."

3. "Bạn học ngành gì?"
✅ Nên: "Tôi sẽ học ngành Quản trị Kinh doanh vì gia đình tôi có công ty riêng."
❌ Tránh: "Tôi chưa biết, để học rồi tính."

4. "Sau khi học xong bạn định làm gì?"
✅ Nên: "Tôi sẽ về Việt Nam làm việc cho công ty Hàn Quốc tại Việt Nam, phát triển mối quan hệ kinh tế giữa hai nước."

**NHÓM 2 — TÀI CHÍNH**

5. "Ai bảo lãnh tài chính cho bạn?"
✅ Nên: "Cha/mẹ tôi (nêu rõ nghề nghiệp, thu nhập cụ thể)."

6. "Thu nhập của người bảo lãnh bao nhiêu?"
✅ Nên trả lời CHÍNH XÁC số liệu trong hồ sơ, không lúng túng.

7. "Bạn có sổ tiết kiệm không?"
✅ Nên: "Có, sổ mở tại Ngân hàng [tên ngân hàng], số tiền [X], kỳ hạn [Y] tháng."

**NHÓM 3 — KẾ HOẠCH TƯƠNG LAI**

8. "Bạn có định ở lại Hàn Quốc làm việc không?"
✅ Nên khéo léo: "Tôi muốn hoàn thành việc học trước. Sau đó, nếu có cơ hội tốt ở Hàn Quốc, tôi sẽ xem xét, nhưng mục tiêu chính là về Việt Nam."

9. "Bạn có người thân ở Hàn Quốc không?"
✅ Nên khai báo TRUNG THỰC nếu có.

**NHÓM 4 — HỌC VẤN**

10. "Vì sao GPA của bạn thấp?"
✅ Nên giải thích trung thực và cam kết cải thiện.

11. "Tại sao bạn nghỉ học lâu vậy? (gap year)"
✅ Nên: "Tôi đã đi làm tích luỹ kinh nghiệm / học thêm ngoại ngữ trong thời gian này."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NGUYÊN TẮC VÀNG KHI PHỎNG VẤN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **NHẤT QUÁN**: Câu trả lời phải khớp với hồ sơ đã nộp
2. **TỰ TIN**: Nhìn vào mắt người phỏng vấn, nói rõ ràng
3. **NGẮN GỌN**: Trả lời đúng trọng tâm, không lan man
4. **THÀNH THẬT**: Không bịa đặt thông tin — một khi bị phát hiện, bạn sẽ bị cấm visa

📌 **MẸO**: Hãy tập trả lời trước gương ít nhất 5 lần. Càng tự nhiên, càng thuyết phục.
`
  },
  {
    id: 'visa-types-comparison',
    category: 'visa',
    title: 'So sánh các loại visa du học Hàn Quốc — Chọn đúng ngay từ đầu',
    summary: 'Bảng so sánh chi tiết D-4-1, D-2 (đại học chính quy), D-2-6 (trao đổi), C-3-1 giúp bạn chọn loại visa phù hợp nhất với hồ sơ của mình.',
    tags: ['so sánh', 'visa', 'D-4-1', 'D-2', 'C-3', 'chọn visa'],
    content: `Chọn đúng loại visa ngay từ đầu là yếu tố quyết định tỉ lệ thành công. Dưới đây là bảng so sánh toàn diện các loại visa du học phổ biến nhất.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BẢNG SO SÁNH CÁC LOẠI VISA DU HỌC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Tiêu chí | D-4-1 (Học tiếng) | D-2 (ĐH chính quy)* | D-2-6 (Trao đổi) | C-3-1 (Thăm) |
|----------|-----------------|-------------------|------------------|--------------|
| Mục đích | Học tiếng Hàn | ĐH/Cao học chính quy | Trao đổi SV | Thăm thân/du lịch |
| Thời hạn | 6 tháng - 2 năm | 1-2 năm/lần | 1-2 học kỳ | Tối đa 90 ngày |
| TOPIK yêu cầu | Không | 3+ (tuỳ bậc) | Tuỳ trường (thường 2+) | Không |
| Tài chính tối thiểu | $10,000 | $10,000-$20,000 | $8,000-$10,000 | Theo mục đích |
| Làm thêm | Sau 6 tháng | Sau 6 tháng | Sau 6 tháng | ❌ Không được |
| Chuyển đổi visa | Lên D-2 | Xuống E7 | Lên D-2-2 | Phải về nước |
| Tỉ lệ đậu | Cao nhất | Trung bình | Cao | Cao |
| Độ khó hồ sơ | Thấp | Cao | Trung bình | Thấp |

*D-2 bao gồm nhiều phân loại nhỏ: D-2-1 (cao đẳng), D-2-2 (cử nhân), D-2-3 (thạc sĩ), D-2-4 (tiến sĩ), D-2-5 (nghiên cứu). Xem chi tiết ở bài "Tổng quan visa D-2".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI NÊN CHỌN LOẠI NÀO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**D-4-1 — Phù hợp với:**
• Người chưa có hoặc mới học tiếng Hàn
• GPA trung bình (5.0-6.5)
• Tài chính hạn chế (~$10,000)
• Muốn tỉ lệ đậu cao nhất

**D-2 — Phù hợp với:**
• Đã có TOPIK 3+ hoặc IELTS 5.5+
• GPA khá (6.5+)
• Tài chính vững ($15,000+)
• Muốn ở lại làm việc sau tốt nghiệp

**D-2-6 — Phù hợp với:**
• Sinh viên đang học tại trường ĐH/CĐ có hợp tác với trường Hàn Quốc
• Muốn đi trao đổi 1-2 học kỳ tại Hàn Quốc
• Cần visa dễ xin, hồ sơ đơn giản hơn D-2
• Có kế hoạch chuyển tiếp lên D-2-2 sau khi hoàn thành trao đổi

**C-3-1 — CHỈ dùng cho:**
• Đi thăm trường trước khi quyết định
• Dự thi TOPIK tại Hàn
• KHÔNG dùng để học (không được gia hạn, không được làm thêm)

⚠️ **LƯU Ý**: KHÔNG bao giờ nhập cảnh C-3-1 với ý định học tập. Nếu bị phát hiện, bạn có thể bị cấm nhập cảnh và ảnh hưởng đến visa du học sau này.
`
  },
  {
    id: 'visa-extension',
    category: 'visa',
    title: 'Gia hạn visa du học tại Hàn Quốc — Quy trình 2026',
    summary: 'Hướng dẫn gia hạn visa D-4-1 và D-2 trực tiếp tại Hàn Quốc: điều kiện, thủ tục, lệ phí, kinh nghiệm thực tế.',
    tags: ['gia hạn', 'visa', 'D-4-1', 'D-2', 'Hàn Quốc', 'ARC'],
    content: `Khi đang học tại Hàn Quốc, bạn sẽ cần gia hạn visa định kỳ. Quy trình này đơn giản hơn xin visa lần đầu nhưng cũng cần chuẩn bị kỹ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KHI NÀO CẦN GIA HẠN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• **D-4-1**: Mỗi 6 tháng (hoặc theo kỳ học)
• **D-2**: Mỗi 1-2 năm (tuỳ chương trình học)
• Nên nộp **1-2 tháng trước** khi visa hết hạn
• Không đợi đến phút cuối — nếu quá hạn, bạn bị phạt ~100,000 KRW/ngày

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐIỀU KIỆN ĐỂ ĐƯỢC GIA HẠN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Điều kiện | Yêu cầu tối thiểu |
|-----------|------------------|
| Điểm chuyên cần | Trên 70-80% (tuỳ trường; 90% nếu muốn làm thêm) |
| GPA | Trên 2.0/4.5 (D-2) |
| Số dư tài khoản | Chứng minh đủ chi phí sinh hoạt |
| Bảo hiểm | Phải tham gia bảo hiểm du học NHI |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH GIA HẠN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Cách 1: Qua trường (khuyến nghị)**
1. Liên hệ Văn phòng Quốc tế của trường
2. Nộp giấy tờ cần thiết (trường sẽ hướng dẫn)
3. Trường nộp thay cho Immigration
4. Nhận kết quả sau 2-3 tuần

**Cách 2: Tự nộp online qua Hi Korea**
1. Đăng nhập website Hi Korea (www.hikorea.go.kr)
2. Chọn "Application for Extension of Stay"
3. Điền thông tin, upload giấy tờ
4. Đóng phí online
5. Chờ kết quả (thường 1-2 tuần)

**Cách 3: Đến trực tiếp Immigration**
1. Lấy số thứ tự tại Văn phòng Xuất nhập cảnh
2. Nộp hồ sơ + đóng phí
3. Nhận giấy hẹn

📌 **MẸO**: Cách 1 (qua trường) là dễ nhất và nhanh nhất. Hầu hết trường đều hỗ trợ sinh viên quốc tế gia hạn visa miễn phí hoặc với phí rất thấp.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ CẦN CHUẨN BỊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Hộ chiếu (gốc)
• ARC (Thẻ ngoại kiều)
• Ảnh thẻ 3.5x4.5cm
• Đơn xin gia hạn (mẫu tích hợp)
• Bảng điểm + xác nhận đang theo học
• Xác nhận số dư tài khoản (~10 triệu KRW)
• Chứng nhận bảo hiểm
• Phí gia hạn: ~60,000-100,000 KRW

⚠️ **LƯU Ý**: Nếu bạn đang chờ kết quả gia hạn mà visa cũ hết hạn, bạn vẫn được ở lại hợp pháp cho đến khi có kết quả (thường mất 2-3 tuần). Hãy giữ biên nhận đã nộp hồ sơ bên mình.
`
  },

  // ═══════════════════════════════════════════
  // DOCUMENTS CATEGORY (5 articles)
  // ═══════════════════════════════════════════

  {
    id: 'doc-checklist-d4-1',
    category: 'documents',
    title: 'Checklist giấy tờ D-4-1 chi tiết — 30+ mục không thể thiếu',
    summary: 'Danh sách đầy đủ giấy tờ cần chuẩn bị cho visa D-4-1, bao gồm cả giấy tờ bổ sung theo hoàn cảnh cá nhân.',
    tags: ['D-4-1', 'checklist', 'giấy tờ', 'hồ sơ', 'chuẩn bị'],
    content: `Một bộ hồ sơ D-4-1 đầy đủ là yếu tố then chốt để đậu visa. Dưới đây là checklist chi tiết từng nhóm giấy tờ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 1 — GIẤY TỜ HÀNH CHÍNH (Bắt buộc)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Đơn xin visa mẫu KSD0-2014 (tải từ website ĐSQ, điền bằng Hàn hoặc Anh)
• Hộ chiếu còn hạn 6 tháng+ (còn ít nhất 2 trang trống)
• Ảnh thẻ 3.5x4.5cm nền trắng (2-4 ảnh, chụp trong 6 tháng gần nhất)
• CCCD/CMND (bản photo công chứng)
• Sổ hộ khẩu (bản photo công chứng) hoặc CT07
• Giấy khai sinh (bản sao)

⚠️ **LƯU Ý**: Từ 13/04/2025, đơn KSD0-2014 CHỈ điền bằng tiếng Hàn hoặc tiếng Anh. Không chấp nhận tiếng Việt!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 2 — GIẤY TỜ HỌC VẤN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Bằng tốt nghiệp THPT + dịch công chứng (Hàn hoặc Anh)
• Học bạ THPT 3 năm + dịch công chứng
• Giải trình gap year (nếu tốt nghiệp > 6 tháng)
• Bảng điểm + bằng ĐH (nếu đã học đại học)
• Chứng chỉ ngoại ngữ: TOPIK / IELTS (nếu có — là điểm cộng lớn)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 3 — GIẤY TỜ TRƯỜNG HÀN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Thư nhập học (Admission Letter / Certificate of Admission) — bản gốc
• Hóa đơn học phí (Invoice) — bản gốc

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 4 — CHỨNG MINH TÀI CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Giấy tờ | Mô tả |
|---------|-------|
| Sổ tiết kiệm | Tối thiểu $10,000 (~250 triệu VND) |
| Hình thức mở | Mở tại quầy giao dịch (không chấp nhận online) |
| Kỳ hạn | 6-12 tháng |
| Thời điểm mở | Tối thiểu 3 tháng trước khi nộp (khuyến nghị 6 tháng) |
| Xác nhận số dư | Cấp trong vòng 30 ngày trước khi nộp |
| Sao kê 3 tháng | Thể hiện lịch sử giao dịch ổn định |
| Cam kết bảo lãnh | Nếu không tự thân (kèm giấy tờ quan hệ) |
| Giấy tờ thu nhập | HĐLĐ, sao kê lương, xác nhận công việc |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 5 — STUDY PLAN (500-800 từ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Viết bằng tiếng Hàn (ưu tiên) hoặc tiếng Anh
• Cá nhân hóa: lý do chọn Hàn Quốc, trường, kế hoạch cụ thể
• KHÔNG sao chép mẫu trên mạng — đây là lỗi trượt hàng đầu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ BỔ SUNG THEO HOÀN CẢNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Hoàn cảnh | Giấy tờ cần thêm |
|-----------|-----------------|
| Người bảo lãnh không phải cha mẹ | Giấy cam kết bảo lãnh + giấy tờ quan hệ |
| Đã từng trượt visa | Giải trình nguyên nhân + hồ sơ cũ |
| Gap year > 2 năm | Giải trình + xác nhận công việc + HĐLĐ |
| Có người thân tại Hàn | Khai báo rõ ràng trong hồ sơ |
| GPA thấp (< 5.0) | Giải trình học tập + cam kết cải thiện |

📌 **MẸO**: In checklist này ra và đánh dấu từng mục khi đã chuẩn bị xong. Đừng để thiếu bất kỳ giấy tờ nào!
`
  },
  {
    id: 'doc-checklist-d2',
    category: 'documents',
    title: 'Checklist giấy tờ D-2 chi tiết — Yêu cầu cao hơn, cần chuẩn bị kỹ hơn',
    summary: 'Danh sách giấy tờ cần chuẩn bị cho visa D-2, yêu cầu cao hơn D-4-1 với nhiều giấy tờ bổ sung.',
    tags: ['D-2', 'checklist', 'giấy tờ', 'hồ sơ', 'đại học'],
    content: `Visa D-2 yêu cầu bộ hồ sơ dày dặn hơn D-4-1. Dưới đây là checklist đầy đủ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 1 — GIẤY TỜ HÀNH CHÍNH (Bắt buộc)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Đơn xin visa mẫu KSD0-2014 (điền bằng Hàn hoặc Anh)
• Hộ chiếu còn hạn 6 tháng+ + 2 trang trống
• Ảnh thẻ 3.5x4.5cm nền trắng (4 ảnh)
• CCCD + Giấy khai sinh + Sổ hộ khẩu (bản sao công chứng)
• Giấy khám lao phổi (TB test) — tại bệnh viện chỉ định

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 2 — GIẤY TỜ HỌC VẤN (Yêu cầu cao hơn)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Bằng THPT + học bạ + dịch công chứng
• Bằng ĐH + bảng điểm (nếu đã học ĐH)
• **CHỨNG CHỈ TOPIK 3+ hoặc IELTS 5.5+** — bắt buộc với hầu hết trường
• Thư giới thiệu — không bắt buộc từ ĐSQ (tuỳ trường)
• Giải trình gap year (nếu có)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 3 — CHỨNG MINH TÀI CHÍNH (Cao hơn)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Yếu tố | Yêu cầu |
|---------|---------|
| Sổ tiết kiệm | $10,000-$20,000 (tuỳ trường/khu vực) |
| Kỳ hạn | 12 tháng (khuyến nghị) |
| Sao kê | 3-6 tháng thể hiện dòng tiền ổn định |
| Giấy tờ thu nhập | HĐLĐ + sao kê lương + xác nhận công việc |
| Bảo lãnh | Giấy cam kết + giấy tờ quan hệ |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 4 — GIẤY TỜ TRƯỜNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Admission Letter (bản gốc)
• Invoice học phí (bản gốc)
• Giới thiệu chương trình học (brochure)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÓM 5 — STUDY PLAN (800-1200 từ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Chi tiết hơn D-4-1 — cần nêu rõ mục tiêu học tập và nghiên cứu
• Phân tích lý do chọn ngành cụ thể
• Kế hoạch nghiên cứu hoặc thực tập
• Định hướng nghề nghiệp sau tốt nghiệp

📌 **MẸO**: Hồ sơ D-2 dễ bị trả về vì thiếu chứng chỉ TOPIK. Hãy thi TOPIK trước khi nộp hồ sơ ít nhất 3 tháng.
`
  },
  {
    id: 'doc-translation-legalization',
    category: 'documents',
    title: 'Dịch thuật, Công chứng & Hợp pháp hóa lãnh sự — Quy trình 4 bước 2026',
    summary: 'Quy trình 4 bước xử lý giấy tờ tiếng Việt để có giá trị tại Hàn Quốc. Cập nhật quy định Apostille mới từ 11/09/2026.',
    tags: ['dịch thuật', 'công chứng', 'hợp pháp hóa', 'giấy tờ', 'Apostille'],
    content: `Giấy tờ tiếng Việt cần qua 4 bước sau mới có giá trị pháp lý tại Hàn Quốc. Lưu ý: quy trình thay đổi từ 11/09/2026.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BƯỚC 1: DỊCH THUẬT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Dịch tất cả giấy tờ sang tiếng Hàn (ưu tiên) hoặc tiếng Anh
• Thực hiện tại Phòng Công chứng hoặc công ty dịch thuật được cấp phép
• Mỗi giấy tờ cần 1 bản dịch riêng

🔹 **Chi phí tham khảo**: 50,000-200,000 VND/trang tuỳ độ khó

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BƯỚC 2: CÔNG CHỨNG BẢN DỊCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Mang bản gốc + bản dịch đến Phòng Công chứng Nhà nước
• Công chứng viên xác nhận chữ ký người dịch
• Thời gian: 1-2 ngày làm việc

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BƯỚC 3: CHỨNG NHẬN TẠI BỘ NGOẠI GIAO (MOFA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Nơi nộp | Địa chỉ | Thời gian |
|---------|---------|-----------|
| Cục Lãnh sự Hà Nội | 44 Tràng Thi, Hoàn Kiếm | 1-3 ngày |
| Sở Ngoại vụ TP.HCM | 6 Alexander De Rhodes, Q.1 | 1-3 ngày |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BƯỚC 4: HỢP PHÁP HÓA / APOSTILLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **QUAN TRỌNG**: Từ 11/09/2026, quy trình thay đổi hoàn toàn!

• **TRƯỚC 11/09/2026**: Sau MOFA → mang giấy tờ qua ĐSQ Hàn Quốc (Hà Nội) hoặc LSQ Hàn Quốc (TP.HCM) để hợp pháp hóa lãnh sự. Thời gian: 3-5 ngày.

• **TỪ 11/09/2026**: KHÔNG cần qua ĐSQ/LSQ nữa! Chỉ cần xin **tem Apostille** tại Cục Lãnh sự (Hà Nội) hoặc Sở Ngoại vụ (TP.HCM). Hàn Quốc là thành viên Công ước Apostille nên giấy tờ có tem Apostille được công nhận trực tiếp tại Hàn Quốc. Tiết kiệm 5-10 ngày và 300,000-500,000 VND.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LƯU Ý QUAN TRỌNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Hầu hết giấy tờ chỉ có giá trị **3 tháng**. Tính toán thời gian hợp lý!
• Nên làm dịch thuật + công chứng cùng lúc cho tất cả giấy tờ để tiết kiệm
• Một số giấy tờ cần dịch gấp có thể dùng dịch vụ "hỏa tốc" (thêm phí)

📌 **MẸO**: Gom tất cả giấy tờ cần xử lý làm một đợt duy nhất — vừa tiết kiệm thời gian vừa tiết kiệm chi phí.
`
  },
  {
    id: 'doc-arc-registration',
    category: 'documents',
    title: 'Đăng ký thẻ ngoại kiều ARC — Thủ tục bắt buộc sau khi nhập cảnh Hàn Quốc',
    summary: 'Hướng dẫn đăng ký thẻ ngoại kiều ARC (Alien Registration Card) trong vòng 90 ngày sau khi nhập cảnh Hàn Quốc.',
    tags: ['ARC', 'thẻ ngoại kiều', 'đăng ký', 'nhập cảnh', 'giấy tờ'],
    content: `Thẻ ARC (Alien Registration Card) là giấy tờ quan trọng nhất của bạn khi ở Hàn Quốc, tương đương CMND/CCCD tại Việt Nam.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THỜI HẠN & ĐỊA ĐIỂM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• **Thời hạn**: Trong vòng **90 ngày** kể từ ngày nhập cảnh
• **Nếu trễ hạn**: Bị phạt từ 200,000 - 1,000,000 KRW
• **Địa điểm**: Văn phòng Xuất nhập cảnh (Immigration Office) theo khu vực cư trú

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ CẦN CHUẨN BỊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Hộ chiếu (bản gốc)
• Ảnh thẻ 3.5x4.5cm (2 ảnh)
• Đơn đăng ký ARC (mẫu tích hợp)
• Thư nhập học / xác nhận đang theo học
• Chứng minh nơi ở (hợp đồng thuê nhà / xác nhận KTX)
• Phí: 30,000 KRW (nếu online) / 50,000 KRW (nếu trực tiếp)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH 3 BƯỚC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Bước 1: Đặt lịch online (Hi Korea)**
• Đăng ký tài khoản tại www.hikorea.go.kr
• Chọn "Application for Alien Registration"
• Điền thông tin, upload giấy tờ

**Bước 2: Đến Immigration Office**
• Mang giấy tờ gốc đến kiểm tra
• Đóng phí
• Chụp ảnh + lấy dấu vân tay

**Bước 3: Nhận ARC**
• Thời gian xử lý: 2-4 tuần
• Có thể nhận trực tiếp hoặc qua bưu điện

⚠️ **LƯU Ý**: ARC KHÔNG được phép mất — nếu mất, bạn phải báo ngay với Immigration và làm lại (mất thêm thời gian và tiền bạc). Luôn giữ ARC cẩn thận!

📌 **MẸO**: Một khi có ARC, bạn có thể mở tài khoản ngân hàng, đăng ký sim điện thoại chính chủ, và xin giấy phép làm thêm.
`
  },
  {
    id: 'doc-tb-test-detail',
    category: 'documents',
    title: 'Khám lao phổi (TB test) cho visa Hàn Quốc — Cẩm nang toàn tập',
    summary: 'Hướng dẫn chi tiết về khám lao phổi xin visa Hàn Quốc: bệnh viện, quy trình, chi phí, lưu ý quan trọng 2026.',
    tags: ['TB test', 'lao phổi', 'khám sức khoẻ', 'bệnh viện', 'visa'],
    content: `Giấy khám lao phổi (TB test) là một trong những giấy tờ bắt buộc trong bộ hồ sơ xin visa Hàn Quốc. Nhiều học sinh bị trễ visa vì khám sai bệnh viện hoặc giấy hết hạn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BỆNH VIỆN ĐƯỢC CHỈ ĐỊNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Khu vực | Bệnh viện | Ghi chú |
|---------|-----------|---------|
| Hà Nội | Bệnh viện Phổi Trung ương | Uy tín, đông người |
| Hà Nội | Bệnh viện Hồng Ngọc | Dịch vụ tốt, chi phí cao hơn |
| Hà Nội | Phòng khám Medlatec | Một số cơ sở được chỉ định |
| TP.HCM | Bệnh viện Chợ Rẫy | Uy tín nhất |
| TP.HCM | Bệnh viện Phạm Ngọc Thạch | Chuyên khoa lao |
| TP.HCM | Bệnh viện Thống Nhất | Tiện lợi, nhanh |
| TP.HCM | Trung tâm Y khoa Phước An (HEPA) | Dịch vụ cao cấp |

⚠️ **⚠️ LƯU Ý CỰC KỲ QUAN TRỌNG**: Danh sách bệnh viện THAY ĐỔI THƯỜNG XUYÊN. BẮT BUỘC kiểm tra mục "Thông báo" (Notice) trên website KVAC trước khi đi khám. Khám sai bệnh viện — giấy sẽ KHÔNG được chấp nhận!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH KHÁM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Đặt lịch trước (đa số bệnh viện yêu cầu)
2. Đến đúng giờ, mang theo CMND/CCCD + hộ chiếu
3. Chụp X-quang phổi
4. Nhận kết quả (thường trong 1-3 ngày)
5. Giấy có giá trị 3 tháng

📌 **MẸO**: Nên khám sau khi đã có đầy đủ các giấy tờ khác, để giấy TB test còn hạn khi nộp hồ sơ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHI PHÍ THAM KHẢO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Bệnh viện công: 200,000 - 400,000 VND
• Bệnh viện tư: 500,000 - 1,200,000 VND
• Dịch vụ cao cấp (lấy ngay trong ngày): 1,000,000 - 2,000,000 VND

🚫 **SAI LẦM THƯỜNG GẶP**:
• Khám ở bệnh viện không được chỉ định → mất tiền, mất thời gian
• Để giấy TB test hết hạn trước khi nộp hồ sơ → phải khám lại
• Không kiểm tra danh sách mới nhất → khám sai bệnh viện
`
  },

  // ═══════════════════════════════════════════
  // FINANCE CATEGORY (4 articles)
  // ═══════════════════════════════════════════

  {
    id: 'finance-savings',
    category: 'finance',
    title: 'Sổ tiết kiệm & Chứng minh tài chính — Bí quyết đậu visa 2026',
    summary: 'Hướng dẫn chuẩn bị sổ tiết kiệm và chứng minh tài chính cho visa du học Hàn Quốc: số tiền, kỳ hạn, thời điểm, các lỗi cần tránh.',
    tags: ['tài chính', 'sổ tiết kiệm', 'chứng minh', 'bảo lãnh'],
    content: `Chứng minh tài chính là phần quan trọng nhất của bộ hồ sơ — và cũng là nguyên nhân hàng đầu khiến hồ sơ bị từ chối (~40%).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SỐ TIỀN CẦN CÓ TRONG SỔ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại visa | Tối thiểu | Khuyến nghị |
|-----------|-----------|-------------|
| D-4-1 | $10,000 (~250 triệu VND) | $12,000-15,000 (~300-375 triệu VND) |
| D-2 (tỉnh) | $10,000 (~250 triệu VND) | $15,000 (~375 triệu VND) |
| D-2 (Seoul) | $15,000-20,000 (~375-500 triệu VND) | $20,000+ (~500 triệu VND) |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TẮC VÀNG CHO SỔ TIẾT KIỆM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Mở tại quầy giao dịch** — KHÔNG chấp nhận sổ online
2. **Kỳ hạn 12 tháng** — 6 tháng là chấp nhận được nhưng 12 tháng là lý tưởng
3. **Mở trước 3-6 tháng** — càng lâu càng tốt
4. **Gửi tiền từ từ** — tránh nạp 1 lần lớn rồi lấy sao kê ngay
5. **Duy trì số dư ổn định** — không rút ra rồi nạp vào thất thường

📊 **THỐNG KÊ**: Hồ sơ có sổ tiết kiệm mở trước 6 tháng có tỉ lệ đậu cao hơn 35% so với hồ sơ mở trước 1-2 tháng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAO KÊ NGÂN HÀNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Cấp trong vòng **30 ngày** trước khi nộp hồ sơ
• Phải thể hiện lịch sử giao dịch ỔN ĐỊNH
• Tránh nạp tiền "sốc" ngay trước khi lấy sao kê

🚫 **SAI LẦM THƯỜNG GẶP**: Nạp $10,000 vào tài khoản 1 lần, hôm sau lấy sao kê. ĐSQ sẽ nghi ngờ tiền đi mượn và từ chối visa NGAY LẬP TỨC.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NGƯỜI BẢO LÃNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại | Yêu cầu |
|------|---------|
| Tự thân | Chứng minh thu nhập ổn định (HĐLĐ, sao kê lương) |
| Cha/mẹ | Giấy tờ quan hệ + chứng minh thu nhập |
| Người thân khác | Giấy cam kết bảo lãnh + giải trình rõ ràng |

📌 **MẸO**: Nếu sử dụng người bảo lãnh không phải cha mẹ, hãy chuẩn bị giải trình thuyết phục tại sao cha mẹ không thể bảo lãnh (VD: cha mẹ làm nông nghiệp, không có sao kê ngân hàng).
`
  },
  {
    id: 'finance-income-proof',
    category: 'finance',
    title: 'Chứng minh thu nhập người bảo lãnh — Hướng dẫn từ A đến Z',
    summary: 'Các loại giấy tờ chứng minh thu nhập cho người bảo lãnh tài chính, bao gồm trường hợp làm công, tự kinh doanh, cho thuê nhà.',
    tags: ['tài chính', 'thu nhập', 'bảo lãnh', 'chứng minh'],
    content: `Người bảo lãnh tài chính cần chứng minh thu nhập ổn định để thuyết phục ĐSQ rằng họ có đủ khả năng chi trả cho việc học của bạn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ CHỨNG MINH THU NHẬP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại giấy tờ | Áp dụng cho | Mô tả |
|-------------|-------------|-------|
| Hợp đồng lao động | Người làm công | Có thời hạn, mức lương rõ ràng |
| Sao kê lương 3-6 tháng | Người làm công | Thể hiện lương chuyển khoản |
| Xác nhận công việc | Người làm công | Từ công ty, có dấu đỏ |
| Giấy phép kinh doanh | Tự kinh doanh | Ngành nghề phù hợp |
| Báo cáo thuế TNCN | Cả hai | Chứng minh thu nhập chính thức |
| Sổ đỏ, nhà đất | Có tài sản | Tài sản đảm bảo |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MỨC THU NHẬP TỐI THIỂU KHUYẾN NGHỊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại visa | Thu nhập tối thiểu | Thu nhập khuyến nghị |
|-----------|-------------------|---------------------|
| D-4-1 | 15-20 triệu/tháng | 20-30 triệu/tháng |
| D-2 | 25-30 triệu/tháng | 30-50 triệu/tháng |

⚠️ **LƯU Ý**: Thu nhập càng cao, hồ sơ càng vững. Nếu thu nhập thấp, có thể kết hợp nhiều nguồn: lương + kinh doanh + cho thuê nhà + tài sản.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG HỢP ĐẶC BIỆT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Trường hợp 1: Người bảo lãnh là nông dân**
• Cần: Giấy chứng nhận quyền sử dụng đất + xác nhận thu nhập từ UBND xã
• Khó khăn: Không có sao kê ngân hàng → cần tài sản đảm bảo mạnh

**Trường hợp 2: Người bảo lãnh đã nghỉ hưu**
• Cần: Sổ hưu + sao kê lương hưu + tài sản tiết kiệm
• Giải trình: Con cái hỗ trợ tài chính

**Trường hợp 3: Người bảo lãnh tự kinh doanh**
• Cần: GPKD + báo cáo thuế + sao kê tài khoản công ty
• Mạnh nhất: Có cả tài khoản cá nhân và công ty

📌 **MẸO**: Nếu thu nhập của người bảo lãnh thấp hơn khuyến nghị, hãy mở sổ tiết kiệm với số tiền lớn hơn để bù đắp. Ví dụ: cha mẹ thu nhập 10 triệu/tháng nhưng sổ TK $15,000 → vẫn OK nếu giải trình tốt.
`
  },
  {
    id: 'finance-k-study',
    category: 'finance',
    title: 'Sổ đóng băng K-Study — Vũ khí bí mật tăng tỉ lệ đậu visa',
    summary: 'Sổ đóng băng K-Study là gì? Tại sao nên dùng? Hướng dẫn mở tại Shinhan, Woori, KEB Hana Bank chi tiết.',
    tags: ['K-Study', 'sổ đóng băng', 'tài chính', 'ngân hàng Hàn Quốc'],
    content: `K-Study là sổ tiết kiệm đóng băng đặc biệt được Đại sứ quán Hàn Quốc ưu tiên hơn sổ tiết kiệm thông thường.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
K-STUDY LÀ GÌ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

K-Study là sổ tiết kiệm có kỳ hạn do các ngân hàng Hàn Quốc phát hành tại chi nhánh Việt Nam. Số tiền trong sổ bị "đóng băng" — không thể rút ra trước kỳ hạn.

| Ngân hàng | Chi nhánh tại Việt Nam |
|-----------|----------------------|
| Shinhan Bank | Hà Nội, TP.HCM |
| Woori Bank | Hà Nội, TP.HCM |
| KEB Hana Bank | Hà Nội, TP.HCM |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SỐ TIỀN & KỲ HẠN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại | Số tiền | Ghi chú |
|------|---------|---------|
| D-4-1 | 8,000,000-10,000,000 KRW (~$6,000-$7,500) | Tính bằng KRW, không phải USD |
| D-2 | 15,000,000-20,000,000 KRW (~$11,000-$15,000) | Tuỳ trường |
| Kỳ hạn | 6-12 tháng | Khuyến nghị 12 tháng |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ƯU ĐIỂM CỦA K-STUDY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✅ **Được ĐSQ ưu tiên cao hơn** sổ tiết kiệm thường
2. ✅ **Có thể mở trước** khi nộp hồ sơ visa
3. ✅ Số tiền **bằng KRW** — đúng loại tiền ĐSQ yêu cầu
4. ✅ Một số trường **bắt buộc** loại sổ này với D-4-1
5. ✅ **Không cần sao kê** lịch sử giao dịch phức tạp

⚠️ **LƯU Ý**: Số tiền này bị đóng băng HOÀN TOÀN — không rút được ngay cả khi khẩn cấp. Chỉ được rút khi đáo hạn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH MỞ K-STUDY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Đến quầy giao dịch ngân hàng Hàn Quốc tại Việt Nam
2. Nói "Tôi muốn mở sổ K-Study để du học Hàn Quốc"
3. Mang theo: CMND + hộ chiếu + thư nhập học (nếu có)
4. Nộp tiền mặt hoặc chuyển khoản
5. Nhận sổ + giấy xác nhận

📌 **MẸO**: Nên mở K-Study kết hợp với sổ tiết kiệm thường. Một số học sinh dùng cả hai để tăng độ tin cậy của hồ sơ tài chính.
`
  },
  {
    id: 'finance-budget-plan',
    category: 'finance',
    title: 'Dự toán chi phí du học Hàn Quốc 2026 — Lên kế hoạch tài chính thông minh',
    summary: 'Bảng dự toán chi phí du học Hàn Quốc chi tiết: học phí, sinh hoạt, KTX, bảo hiểm, chi phí phát sinh theo từng khu vực.',
    tags: ['tài chính', 'chi phí', 'dự toán', 'học phí', 'sinh hoạt'],
    content: `Lên kế hoạch tài chính trước khi đi du học là bước quan trọng giúp bạn tránh căng thẳng về tiền bạc khi ở Hàn Quốc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BẢNG DỰ TOÁN CHI PHÍ THÁNG (KRW)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Khoản mục | Seoul | Gần Seoul | Busan | Tỉnh |
|-----------|-------|-----------|-------|------|
| Học phí/kỳ | 6-12 triệu | 5-8 triệu | 4-7 triệu | 3-5 triệu |
| KTX/tháng | 700k-1.5tr | 500k-1tr | 400k-800k | 300k-600k |
| Ăn uống | 400k-600k | 350k-500k | 300k-450k | 250k-350k |
| Di chuyển | 100k-150k | 80k-120k | 60k-100k | 50k-80k |
| Bảo hiểm NHI | ~76k | ~76k | ~76k | ~76k |
| Phát sinh | 200k-300k | 150k-250k | 100k-200k | 100k-150k |
| **Tổng/tháng** | **~1.4-2.5tr** | **~1.1-1.9tr** | **~0.9-1.5tr** | **~0.7-1.2tr** |

*Đơn vị: 1,000 KRW. VD: 1.5tr = 1,500,000 KRW (~27 triệu VND)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHI PHÍ BAN ĐẦU (một lần)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Khoản mục | Chi phí dự kiến |
|-----------|----------------|
| Vé máy bay một chiều | 3-8 triệu VND |
| Bảo hiểm du học 1 năm | 400k-800k KRW |
| Đăng ký ARC | 30k-50k KRW |
| Mở tài khoản ngân hàng | Miễn phí |
| Sim điện thoại + data | 50k-100k KRW/tháng |
| Đồ dùng cá nhân ban đầu | 200k-500k KRW |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CƠ HỘI LÀM THÊM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Làm thêm có thể giúp bạn trang trải 30-50% chi phí sinh hoạt:

| Loại việc | Mức lương (KRW/h) | Ghi chú |
|-----------|------------------|---------|
| Nhà hàng Hàn Quốc | 10,000-12,000 | Giao tiếp tiếng Hàn cơ bản |
| Quán cà phê | 10,000-11,000 | Nhanh nhẹn, sạch sẽ |
| Giao hàng | 12,000-15,000 | Cần xe máy |
| Phiên dịch | 20,000-30,000 | Yêu cầu TOPIK 4+ |
| Làm tại trường | 10,000-12,000 | Trong khuôn viên trường |

📌 **MẸO**: Mức lương tối thiểu Hàn Quốc 2026 là 10,320 KRW/giờ. Làm 20h/tuần có thể kiếm ~825,000-950,000 KRW/tháng (~18-21 triệu VND).

⚠️ **LƯU Ý**: KHÔNG nên phụ thuộc hoàn toàn vào làm thêm. Nên chuẩn bị tài chính đủ cho 6-12 tháng đầu. Luôn có quỹ dự phòng.
`
  },

  // ═══════════════════════════════════════════
  // STUDY PLAN CATEGORY (3 articles)
  // ═══════════════════════════════════════════

  {
    id: 'study-plan-guide',
    category: 'study-plan',
    title: 'Hướng dẫn viết Study Plan — Từ "chung chung" đến "thuyết phục"',
    summary: 'Cách viết Study Plan thuyết phục, cá nhân hoá, tránh lỗi chung chung. Cấu trúc 3 phần, độ dài, ví dụ mẫu.',
    tags: ['study plan', 'hướng dẫn', 'kế hoạch học tập', 'viết', 'mẹo'],
    content: `Study Plan là GIẤY TỜ QUAN TRỌNG NHẤT trong bộ hồ sơ. Một Study Plan tốt có thể bù đắp cho những điểm yếu khác (GPA thấp, gap year dài, tài chính trung bình).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CẤU TRÚC CHUẨN 3 PHẦN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Phần | D-4-1 | D-2 | Nội dung chính |
|------|-------|-----|----------------|
| 1. Mở đầu | 100-150 từ | 150-200 từ | Giới thiệu bản thân, lý do chọn HQ |
| 2. Nội dung | 300-400 từ | 400-600 từ | Kế hoạch học tập từng giai đoạn |
| 3. Kết luận | 100-150 từ | 150-200 từ | Kế hoạch sau tốt nghiệp, cam kết |
| **Tổng** | **500-800 từ** | **800-1200 từ** | |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHẦN 1 — MỞ ĐẦU: TẠO ẤN TƯỢNG ĐẦU TIÊN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Giới thiệu: Tên, tuổi, quê quán, trình độ học vấn
• Lý do chọn Hàn Quốc: Cụ thể — văn hoá, giáo dục, gần Việt Nam, cơ hội việc làm
• KHÔNG nói chung chung như "Em thích Hàn Quốc từ nhỏ"

📝 **VÍ DỤ**:
❌ "Tôi chọn Hàn Quốc vì tôi thích phim Hàn."
✅ "Tôi chọn Hàn Quốc vì đây là quốc gia có nền giáo dục phát triển hàng đầu châu Á, chi phí hợp lý hơn Mỹ/Anh 50%, và gần Việt Nam — thuận tiện về thăm gia đình."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHẦN 2 — NỘI DUNG CHÍNH: THUYẾT PHỤC BẰNG CHI TIẾT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Giai đoạn 1: 6 tháng đầu — Nền tảng**
• Học tiếng Hàn chuyên sâu, thi TOPIK 2
• Làm quen môi trường, tham gia hoạt động ngoại khoá
• Duy trì chuyên cần 95%+

**Giai đoạn 2: 6-12 tháng — Phát triển**
• Nâng trình độ lên TOPIK 3-4
• Tham gia câu lạc bộ, làm tình nguyện
• Xác định chuyên ngành sẽ theo học

**Giai đoạn 3: 12 tháng+ — Chuyên sâu**
• Học chuyên ngành tại đại học (D-2)
• Thực tập tại công ty Hàn Quốc
• Chuẩn bị tốt nghiệp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHẦN 3 — KẾT LUẬN: KHẲNG ĐỊNH TƯƠNG LAI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Kế hoạch: Về Việt Nam làm việc (ngành cụ thể)
• Kết nối: Ngành học liên quan đến định hướng nghề nghiệp
• Cam kết: Tuân thủ luật pháp Hàn Quốc

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 LỖI CẦN TRÁNH TUYỆT ĐỐI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ❌ Sao chép mẫu Study Plan trên mạng — đây là lỗi chết người
2. ❌ Viết chung chung, không có chi tiết cụ thể
3. ❌ Không giải thích được gap year hoặc lý do chọn trường
4. ❌ Kế hoạch mơ hồ (không có mốc thời gian, không có mục tiêu)
5. ❌ Quá ngắn (< 300 từ cho D-4-1, < 500 từ cho D-2)

📌 **MẸO**: Viết Study Plan xong, hãy đọc lại và hỏi: "Liệu ĐSQ có tin mình sẽ làm theo kế hoạch này không?" Nếu câu trả lời là "không", hãy viết lại.
`
  },
  {
    id: 'study-plan-8-questions',
    category: 'study-plan',
    title: '8 câu hỏi để viết Study Plan cá nhân hoá — Trả lời xong là có ngay bài viết',
    summary: 'Trả lời 8 câu hỏi này để AI có đủ thông tin viết Study Plan thuyết phục, cá nhân hoá, đúng chuẩn ĐSQ.',
    tags: ['study plan', 'câu hỏi', 'cá nhân hoá', 'AI', 'hướng dẫn'],
    content: `Để viết Study Plan thuyết phục, hãy trả lời 8 câu hỏi sau một cách chi tiết nhất có thể. Mỗi câu trả lời càng cụ thể, Study Plan càng chất lượng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8 CÂU HỎI CỐT LÕI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. VÌ SAO CHỌN HÀN QUỐC? (Không phải nước khác?)**
Hãy kể 3 lý do cụ thể. VD: Chất lượng giáo dục, gần Việt Nam, chi phí hợp lý, cơ hội việc làm sau tốt nghiệp, văn hoá tương đồng.
→ ⚠️ Không nói "thích K-pop" — quá sơ sài.

**2. VÌ SAO CHỌN TRƯỜNG NÀY?**
Nghiên cứu trước về trường: chương trình đào tạo, vị trí, học phí, đánh giá. VD: "Trường có chương trình tiếng Hàn 4 học kỳ, học phí 5 triệu KRW/kỳ, vị trí tại Busan — thành phố lớn thứ 2 Hàn Quốc."

**3. KẾ HOẠCH HỌC TẬP THEO GIAI ĐOẠN?**
Chia thành 3 giai đoạn: 6 tháng đầu (học tiếng), 6 tháng tiếp (thi TOPIK), các học kỳ sau (học chuyên ngành). Có mốc thời gian cụ thể.

**4. KẾ HOẠCH SAU TỐT NGHIỆP?**
Cụ thể: "Về Việt Nam làm việc cho công ty Hàn Quốc tại khu công nghiệp" hoặc "Mở trung tâm tiếng Hàn tại quê nhà". Càng cụ thể càng thuyết phục.

**5. NGÀNH HỌC LIÊN QUAN ĐẾN ĐỊNH HƯỚNG?**
Học ngành nào? Ngành đó giúp gì cho sự nghiệp tương lai? VD: Học Quản trị Kinh doanh để về làm quản lý cho công ty gia đình.

**6. GAP YEAR ĐÃ LÀM GÌ?**
Đi làm, học ngoại ngữ, tham gia hoạt động ngoại khoá? Có chứng cứ gì? (HĐLĐ, chứng chỉ...)
→ ⚠️ TUYỆT ĐỐI KHÔNG nói "ở nhà không làm gì" hoặc "tài chính gia đình khó khăn".

**7. GIA ĐÌNH CÓ THU NHẬP ỔN ĐỊNH?**
Cha mẹ làm nghề gì? Thu nhập bao nhiêu? Có tài sản gì? Số liệu càng chi tiết càng tốt.

**8. TRÌNH ĐỘ TIẾNG HÀN/ANH?**
Đã học ở đâu? Bao lâu? Trình độ hiện tại? Có chứng chỉ gì? Kế hoạch thi TOPIK khi nào?

📌 **MẸO**: Trả lời 8 câu hỏi này trên giấy hoặc trong file. Sau đó dùng AI hỗ trợ trong tab "Hồ sơ của tôi" — AI sẽ biến câu trả lời của bạn thành một Study Plan hoàn chỉnh, cá nhân hoá 100%.
`
  },
  {
    id: 'study-plan-sample',
    category: 'study-plan',
    title: 'Mẫu Study Plan D-4-1 đậu visa — Phân tích từng đoạn',
    summary: 'Mẫu Study Plan D-4-1 đã đậu visa kèm phân tích chi tiết từng phần: tại sao đoạn này hay, cần sửa chỗ nào.',
    tags: ['study plan', 'mẫu', 'D-4-1', 'phân tích', 'ví dụ'],
    content: `Dưới đây là một Study Plan D-4-1 mẫu đã giúp học sinh đậu visa. Mỗi phần đều có phân tích lý do tại sao nó hoạt động.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDY PLAN MẪU — VISA D-4-1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PHẦN 1: MỞ ĐẦU (150 từ)**

"Tôi là Nguyễn Văn A, 22 tuổi, quê tại Hải Dương. Tôi tốt nghiệp THPT năm 2022 tại trường THPT Chuyên Nguyễn Trãi với GPA 7.2. Sau đó, tôi theo học ngành Ngôn ngữ Hàn tại Đại học Hà Nội trong 1 năm nhưng nhận thấy môi trường học tập tại Việt Nam chưa đáp ứng được mục tiêu của tôi. Tôi quyết định du học Hàn Quốc vì đây là quốc gia có nền giáo dục ngôn ngữ hàng đầu, với môi trường thực hành tiếng bản ngữ 100% — điều mà không trường đại học nào tại Việt Nam có thể cung cấp."

✅ **Phân tích**: Mở đầu tốt vì có số liệu cụ thể (GPA, năm tháng), lý do chọn Hàn Quốc rõ ràng (môi trường thực hành tiếng), và thể hiện đã có nền tảng (học 1 năm ĐH Hàn ngữ).

**PHẦN 2: NỘI DUNG CHÍNH (400 từ)**

Chia làm 3 giai đoạn:

"Giai đoạn 1 (6 tháng đầu): Tôi sẽ tập trung học tiếng Hàn tại trường Đại học Kyung Hee, mục tiêu đạt TOPIK 2 sau học kỳ 1. Tôi cam kết duy trì chuyên cần 100% và tham gia đầy đủ các hoạt động ngoại khoá của trường.

Giai đoạn 2 (6-12 tháng): Tôi sẽ nâng trình độ lên TOPIK 3, đồng thời tìm hiểu về chương trình đại học ngành Quản trị Kinh doanh — ngành mà tôi dự định theo học sau khi hoàn thành khóa tiếng.

Giai đoạn 3 (12-18 tháng): Tôi sẽ ôn thi TOPIK 4, chuẩn bị hồ sơ chuyển lên visa D-2. Sau đó, tôi sẽ đăng ký vào chương trình cử nhân Quản trị Kinh doanh tại trường."

✅ **Phân tích**: Có mốc thời gian cụ thể, mục tiêu rõ ràng, kế hoạch khả thi. Đây là điểm ĐSQ muốn thấy.

**PHẦN 3: KẾT LUẬN (150 từ)**

"Sau khi tốt nghiệp, tôi sẽ trở về Việt Nam để làm việc cho công ty Hàn Quốc tại khu công nghiệp VSIP (Bắc Ninh) — nơi có hơn 100 công ty Hàn Quốc đang hoạt động. Với kiến thức tiếng Hàn và Quản trị Kinh doanh, tôi tin mình sẽ là cầu nối cho mối quan hệ kinh tế Việt-Hàn. Tôi cam kết tuân thủ luật pháp Hàn Quốc, không vi phạm visa, và sẽ về nước đúng hạn sau khi hoàn thành chương trình học."

✅ **Phân tích**: Kết luận mạnh vì có kế hoạch cụ thể (công ty, khu công nghiệp,...), thể hiện ý định về nước rõ ràng — đây là điều ĐSQ quan tâm nhất.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG KẾT — VÌ SAO STUDY PLAN NÀY ĐẬU?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Cá nhân hoá 100% — không thể nhầm với ai khác
2. Số liệu cụ thể (GPA 7.2, 1 năm ĐH, TOPIK 2-3-4, VSIP)
3. Kế hoạch 3 giai đoạn có mốc thời gian rõ ràng
4. Thể hiện ý định về nước mạnh mẽ
5. Ngôn ngữ tiếng Hàn (hoặc Anh) — viết đúng ngữ pháp

📌 **MỜI**: Hãy sử dụng AI hỗ trợ trong tab "Hồ sơ của tôi" — trả lời 8 câu hỏi và AI sẽ viết Study Plan cá nhân hoá cho bạn!
`
  },

  // ═══════════════════════════════════════════
  // PROCESS CATEGORY (5 articles)
  // ═══════════════════════════════════════════

  {
    id: 'process-timeline',
    category: 'process',
    title: 'Lộ trình xử lý hồ sơ du học — 5 bước, 3-5 tháng, từ A đến Z',
    summary: 'Timeline từ lúc bắt đầu đến khi nhận visa, gồm 5 bước chính, cập nhật 2026. Lên kế hoạch chi tiết cho từng tháng.',
    tags: ['quy trình', 'timeline', 'lộ trình', 'kế hoạch', '5 bước'],
    content: `Một lộ trình rõ ràng giúp bạn không bỏ sót bất kỳ bước nào. Tổng thời gian: 3-5 tháng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SƠ ĐỒ TỔNG QUAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Bước | Thời gian | Công việc chính |
|------|-----------|-----------------|
| 1. Đánh giá hồ sơ | 1-2 tuần | Kiểm tra học lực, tài chính, chọn visa |
| 2. Chọn trường | 1-3 tuần | So sánh trường, xin admission |
| 3. Chuẩn bị giấy tờ | 4-8 tuần | Dịch thuật, sổ TK, xin thư mời |
| 4. Nộp hồ sơ & chờ | 3-5 tuần | KVAC, đóng phí, theo dõi |
| 5. Nhận visa | 1-2 tuần | Kiểm tra, mua vé, chuẩn bị |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LỘ TRÌNH CHI TIẾT CHO KỲ THÁNG 9 (Nhập học tháng 9)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Tháng 2-3: Đánh giá + Chọn trường**
• Đánh giá học lực, tài chính, lịch sử visa
• Chọn 2-3 trường phù hợp
• Liên hệ trường, xin thông tin tuyển sinh

**Tháng 3-4: Chuẩn bị giấy tờ**
• Mở sổ tiết kiệm ($10,000+) 
• Dịch thuật + công chứng giấy tờ
• Nộp đơn cho trường Hàn Quốc

**Tháng 5-6: Nhận thư + Khám sức khoẻ**
• Nhận Admission Letter từ trường
• Khám lao phổi tại bệnh viện chỉ định
• Hoàn thiện hồ sơ

**Tháng 7: Nộp hồ sơ visa**
• Đến KVAC nộp hồ sơ
• Đóng phí visa + phí dịch vụ
• Chờ kết quả (13-20 ngày)

**Tháng 8: Nhận visa + Chuẩn bị**
• Nhận visa, kiểm tra thông tin
• Mua vé máy bay
• Chuẩn bị hành lý, đặt KTX

**Tháng 9: LÊN ĐƯỜNG!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LỘ TRÌNH CHO KỲ THÁNG 3 (Nhập học tháng 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dịch timeline trên sớm hơn 6 tháng:
• Tháng 8-9 năm trước: Đánh giá + Chọn trường
• Tháng 10-11: Chuẩn bị giấy tờ + Mở sổ TK
• Tháng 12: Nhận thư + Khám sức khoẻ
• Tháng 1 năm sau: Nộp hồ sơ visa
• Tháng 2: Nhận visa
• Tháng 3: LÊN ĐƯỜNG!

⚠️ **LƯU Ý**: Mùa cao điểm (tháng 7-8 cho kỳ tháng 9, tháng 1-2 cho kỳ tháng 3) thời gian xử lý visa có thể kéo dài hơn. Luôn chuẩn bị sớm hơn dự kiến!

💡 **CASE STUDY**: Học sinh Phạm Thị E bắt đầu làm hồ sơ tháng 6 cho kỳ tháng 9 — quá trễ. Em không kịp mở sổ TK trước 3 tháng, hồ sơ tài chính yếu và bị trượt. Bài học: BẮT ĐẦU SỚM!
`
  },
  {
    id: 'process-kvac',
    category: 'process',
    title: 'Nộp hồ sơ tại KVAC Hà Nội & TP.HCM — Cẩm nang 2026',
    summary: 'Hướng dẫn chi tiết quy trình nộp hồ sơ visa tại KVAC Hà Nội và TP.HCM: địa chỉ, giờ làm, lệ phí, quy trình, lưu ý.',
    tags: ['KVAC', 'nộp hồ sơ', 'quy trình', 'Hà Nội', 'TP.HCM'],
    content: `KVAC (Korea Visa Application Center) là đơn vị tiếp nhận hồ sơ visa Hàn Quốc tại Việt Nam. Bạn sẽ đến đây để nộp hồ sơ sau khi đã chuẩn bị đầy đủ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐỊA CHỈ & GIỜ LÀM VIỆC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Thông tin | KVAC Hà Nội | KVAC TP.HCM |
|-----------|-------------|-------------|
| Địa chỉ | Tầng 12, Discovery Complex, 302 Cầu Giấy, P. Cầu Giấy | 253 Điện Biên Phủ, P. Xuân Hòa, Q.3 |
| Giờ làm | T2-6: 08:00-16:30 | T2-6: 08:30-17:00 (nghỉ trưa 12:00-13:00) |
| Nghỉ | T7, CN & lễ | T7, CN & lễ |
| Đặt lịch | ❌ Đã dừng từ 06/04/2026 — đến trực tiếp | ✅ Vẫn đặt online |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LỆ PHÍ (cập nhật 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Khoản mục | Số tiền | Ghi chú |
|-----------|---------|---------|
| Phí xét duyệt visa (>90 ngày) | $60 | Đóng bằng tiền mặt |
| Phí dịch vụ KVAC | 390,000 VND | Bắt buộc |
| Phí gửi trả kết quả (nội thành) | 60,000 VND | Tuỳ chọn |
| Phí gửi trả kết quả (ngoại thành) | 80,000 VND | Tuỳ chọn |
| Phòng chờ cao cấp | 390,000 VND | Tuỳ chọn — có nước uống, wifi |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH NỘP HỒ SƠ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Tại Hà Nội (đến trực tiếp):**
1. Đến KVAC trước giờ mở cửa (trước 8h sáng) để lấy số thứ tự
2. Chờ đến lượt (có thể mất 30 phút - 2 giờ)
3. Nộp hồ sơ + giấy tờ gốc tại quầy
4. Nhân viên kiểm tra, báo thiếu nếu có
5. Đóng lệ phí
6. Nhận biên nhận + mã theo dõi

**Tại TP.HCM (đặt lịch online):**
1. Đặt lịch tại visaforkorea-hc.com
2. Đến đúng giờ hẹn
3. Quy trình tương tự

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LƯU Ý QUAN TRỌNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Từ 13/04/2025 — Đơn xin visa CHỈ điền bằng tiếng Hàn hoặc Anh
⚠️ Chỉ nhận TIỀN MẶT để đóng phí (không nhận thẻ/chuyển khoản)
⚠️ Nên photo tất cả giấy tờ trước khi đến (KVAC có dịch vụ photo nhưng đắt)
⚠️ Kiểm tra danh sách bệnh viện TB test trên website KVAC trước khi khám

📌 **MẸO**: Đến KVAC vào đầu giờ sáng (8h-9h) hoặc đầu tuần (thứ 2-3) để tránh đông. Cuối tuần và cuối tháng thường rất đông.
`
  },
  {
    id: 'process-after-arrival',
    category: 'process',
    title: 'Sau khi nhập cảnh Hàn Quốc — 7 việc cần làm ngay trong tuần đầu tiên',
    summary: 'Checklist những việc cần làm ngay sau khi đến Hàn Quốc: đăng ký ARC, mở tài khoản, sim điện thoại, bảo hiểm, KTX.',
    tags: ['sau nhập cảnh', 'ARC', 'tài khoản ngân hàng', 'sim', 'KTX'],
    content: `Chào mừng bạn đến Hàn Quốc! Đây là 7 việc bạn cần hoàn thành trong tuần đầu tiên.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TUẦN 1 — CẦN LÀM NGAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Thứ tự | Việc cần làm | Thời gian | Mức độ ưu tiên |
|--------|-------------|-----------|----------------|
| 1 | Đăng ký ARC (thẻ ngoại kiều) | Trong 90 ngày | ⭐⭐⭐⭐⭐ |
| 2 | Đăng ký bảo hiểm du học | Ngay khi nhập học | ⭐⭐⭐⭐⭐ |
| 3 | Mở tài khoản ngân hàng | Trong tuần 1 | ⭐⭐⭐⭐ |
| 4 | Mua sim điện thoại | Trong tuần 1 | ⭐⭐⭐⭐ |
| 5 | Đăng ký KTX / tìm nhà | Trước khi nhập học | ⭐⭐⭐⭐ |
| 6 | Tham quan trường | Trước khi học | ⭐⭐⭐ |
| 7 | Làm thẻ giao thông (T-money) | Trong tuần 1 | ⭐⭐⭐ |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ĐĂNG KÝ ARC — Việc quan trọng nhất
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Thời hạn: Trong vòng 90 ngày kể từ ngày nhập cảnh
• Nơi đăng ký: Văn phòng Xuất nhập cảnh (Immigration Office) khu vực
• Giấy tờ: Hộ chiếu, ảnh thẻ, hợp đồng nhà/KTX, thư nhập học
• Phí: 30,000-50,000 KRW
• Thời gian xử lý: 2-4 tuần
• Xem bài chi tiết: "Đăng ký thẻ ngoại kiều ARC" trong mục Giấy tờ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. MỞ TÀI KHOẢN NGÂN HÀNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Các ngân hàng phổ biến: Woori, Shinhan, KEB Hana, KB, Nonghyup
• Cần có: Hộ chiếu + ARC (hoặc giấy hẹn lấy ARC)
• Sinh viên thường được miễn phí mở tài khoản và duy trì

📌 **MẸO**: Nên mở tài khoản tại ngân hàng gần trường hoặc KTX. Một số ngân hàng có chương trình ưu đãi cho sinh viên quốc tế.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SIM ĐIỆN THOẠI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Nhà mạng: SK Telecom, KT, LG U+ — hoặc các sim dành cho du học sinh
• Cần có: Hộ chiếu (ARC sẽ cần để mua sim chính chủ sau)
• Chi phí: 30,000-100,000 KRW/tháng tuỳ gói data

⚠️ **LƯU Ý**: Sim trả trước mua ở sân bay thường đắt hơn. Nên mua sim data tạm ở sân bay rồi ra cửa hàng chính hãng sau.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. NHỮNG VIỆC KHÁC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• **Đăng ký bảo hiểm**: Bắt buộc — có thể mua qua trường hoặc tự mua
• **Thẻ T-money**: Mua tại convenience store (GS25, CU, 7-Eleven) — nạp tiền và dùng cho tàu điện, xe bus
• **Định cư KTX**: Nhận phòng, mua đồ dùng cá nhân

💡 **CASE STUDY**: Học sinh Trần Văn F đến Hàn và không đăng ký ARC trong 90 ngày. Bị phạt 500,000 KRW và gặp khó khăn khi mở tài khoản ngân hàng. Hãy làm ARC NGAY khi đến!
`
  },
  {
    id: 'process-insurance',
    category: 'process',
    title: 'Bảo hiểm du học Hàn Quốc — Tất cả những gì bạn cần biết',
    summary: 'Hướng dẫn về bảo hiểm du học Hàn Quốc: các loại bảo hiểm, chi phí, quyền lợi, cách mua, thủ tục yêu cầu bồi thường.',
    tags: ['bảo hiểm', 'sức khoẻ', 'du học', 'Hàn Quốc', 'quyền lợi'],
    content: `Tham gia bảo hiểm y tế là BẮT BUỘC đối với du học sinh tại Hàn Quốc. Từ tháng 7/2021, tất cả du học sinh quốc tế phải tham gia bảo hiểm y tế quốc gia Hàn Quốc (National Health Insurance).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BẢO HIỂM Y TẾ QUỐC GIA (NHI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Thông tin | Chi tiết |
|-----------|---------|
| Đối tượng | Tất cả du học sinh lưu trú >6 tháng |
| Phí/tháng | ~76,390 KRW (áp dụng mức giảm 50% cho du học sinh) |
| Quyền lợi | Khám chữa bệnh, nội trú, ngoại trú, thuốc men |
| Mức hỗ trợ | 50-80% chi phí khám chữa bệnh |
| Cách đăng ký | Tự động qua ARC hoặc đăng ký tại NHI office |

📌 **MẸO**: Phí bảo hiểm được trừ tự động từ tài khoản ngân hàng mỗi tháng. Đảm bảo tài khoản luôn có đủ tiền để tránh bị phạt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BẢO HIỂM DU HỌC TƯ NHÂN (Bổ sung)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ngoài NHI, nhiều trường yêu cầu bảo hiểm tư nhân để bổ sung quyền lợi:

| Loại bảo hiểm | Chi phí/năm | Quyền lợi chính |
|--------------|------------|-----------------|
| Bảo hiểm sức khoẻ | 100,000-300,000 KRW | Nha khoa, khám mắt, chăm sóc sức khoẻ |
| Bảo hiểm tai nạn | 50,000-100,000 KRW | Tai nạn cá nhân, thương tật |
| Bảo hiểm hành lý | 30,000-50,000 KRW | Mất hành lý, chuyến bay delay |

⚠️ **LƯU Ý**: Mặc dù NHI đã bắt buộc, một số trường vẫn yêu cầu bảo hiểm tư nhân như điều kiện nhập học. Kiểm tra kỹ yêu cầu của trường bạn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH YÊU CẦU BỒI THƯỜNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Đi khám tại bệnh viện có hợp tác với NHI (hầu hết bệnh viện tại Hàn)
2. Xuất trình ARC hoặc thẻ bảo hiểm
3. Thanh toán phần chi phí còn lại sau khi bảo hiểm chi trả
4. Giữ hoá đơn và biên lai

📌 **MẸO**: Luôn mang theo ARC khi đi khám bệnh. Nếu không có ARC, bạn phải tự trả toàn bộ viện phí!
`
  },
  {
    id: 'process-bank-account',
    category: 'process',
    title: 'Mở tài khoản ngân hàng tại Hàn Quốc — Hướng dẫn cho du học sinh',
    summary: 'Hướng dẫn mở tài khoản ngân hàng tại Hàn Quốc cho du học sinh: ngân hàng, giấy tờ, quy trình, mẹo tiết kiệm.',
    tags: ['ngân hàng', 'tài khoản', 'Hàn Quốc', 'du học', 'tài chính'],
    content: `Mở tài khoản ngân hàng là một trong những việc đầu tiên bạn nên làm sau khi đến Hàn Quốc. Có tài khoản ngân hàng giúp bạn nhận lương làm thêm, đóng học phí, và quản lý chi tiêu dễ dàng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁC NGÂN HÀNG PHỔ BIẾN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Ngân hàng | Đặc điểm | Phí duy trì |
|-----------|---------|-------------|
| Woori Bank | Có chi nhánh tại VN, hỗ trợ tiếng Việt | Miễn phí cho SV |
| Shinhan Bank | Lớn nhất HQ, nhiều ATM | Miễn phí cho SV |
| KEB Hana Bank | Chuyển tiền quốc tế tốt | Miễn phí cho SV |
| KB Kookmin | Dịch vụ online tốt | Miễn phí cho SV |
| Nonghyup | Gần trường ở tỉnh | Miễn phí cho SV |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIẤY TỜ CẦN CHUẨN BỊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Hộ chiếu (bản gốc)
• ARC (thẻ ngoại kiều) — hoặc giấy hẹn lấy ARC
• Thẻ sinh viên hoặc xác nhận đang theo học
• Số điện thoại Hàn Quốc (có thể đăng ký sau)
• Tiền mặt (tối thiểu 10,000 KRW để nạp vào tài khoản)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TRÌNH MỞ TÀI KHOẢN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Đến quầy giao dịch ngân hàng (có thể cần hẹn trước)
2. Nói "Tôi muốn mở tài khoản" (계좌를 열고 싶습니다)
3. Xuất trình giấy tờ
4. Điền đơn đăng ký (mẫu tiếng Hàn/Anh)
5. Nhận thẻ ATM (gửi qua bưu điện trong 3-5 ngày)
6. Đăng ký internet banking

📌 **MẸO**: Woori Bank và KEB Hana Bank có nhân viên nói tiếng Việt tại một số chi nhánh ở Seoul và Busan. Nếu tiếng Hàn chưa tốt, hãy đến các ngân hàng này.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LƯU Ý QUAN TRỌNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• KHÔNG mở tài khoản tại sân bay — chỉ mở tài khoản tạm thời
• Chuyển tiền từ Việt Nam sang: Dùng Wise (TransferWise) hoặc ngân hàng Hàn Quốc tại VN
• Khi đóng tài khoản: Đến trực tiếp quầy hoặc gọi điện
• Mất thẻ ATM: Báo ngay cho ngân hàng để khoá thẻ

⚠️ **LƯU Ý**: Nếu bạn mở tài khoản trước khi có ARC, một số ngân hàng sẽ giới hạn chức năng (VD: không thể chuyển tiền online). Sau khi có ARC, hãy quay lại để nâng cấp tài khoản.
`
  },

  // ═══════════════════════════════════════════
  // SCHOOLS CATEGORY (4 articles)
  // ═══════════════════════════════════════════

  {
    id: 'school-choose-guide',
    category: 'schools',
    title: 'Cách chọn trường Hàn Quốc phù hợp — 7 tiêu chí vàng',
    summary: '7 tiêu chí chọn trường du học Hàn Quốc: khu vực, học phí, điều kiện, cơ hội E7, KTX, tỉ lệ đậu visa, đánh giá cựu sinh viên.',
    tags: ['chọn trường', 'tiêu chí', 'khu vực', 'học phí', 'KTX'],
    content: `Chọn trường phù hợp là bước quan trọng nhất quyết định sự thành công trong quá trình du học của bạn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7 TIÊU CHÍ CHỌN TRƯỜNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Tiêu chí | Mức độ quan trọng | Ghi chú |
|----------|------------------|---------|
| 1. Khu vực | ⭐⭐⭐⭐⭐ | Ảnh hưởng đến chi phí và cơ hội |
| 2. Học phí | ⭐⭐⭐⭐⭐ | Chi phí lớn nhất mỗi kỳ |
| 3. Điều kiện đầu vào | ⭐⭐⭐⭐ | GPA, TOPIK, tuổi tác |
| 4. KTX | ⭐⭐⭐⭐ | Nơi ở trong 6-12 tháng đầu |
| 5. Cơ hội E7 | ⭐⭐⭐ | Quan trọng nếu muốn ở lại |
| 6. Tỉ lệ đậu visa | ⭐⭐⭐⭐ | Cao với hồ sơ yếu |
| 7. Đánh giá sinh viên | ⭐⭐⭐ | Kinh nghiệm thực tế |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHI TIẾT TỪNG TIÊU CHÍ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. KHU VỰC — Ảnh hưởng lớn nhất đến chi phí**
• Seoul: Chi phí cao nhất, nhiều cơ hội làm thêm
• Gần Seoul (Gyeonggi, Incheon): Chi phí thấp hơn 20-30%
• Busan: Thành phố lớn thứ 2, chi phí trung bình
• Các tỉnh: Chi phí thấp, dễ xin visa, môi trường yên tĩnh

**2. HỌC PHÍ — Khoản chi lớn nhất**
• Thấp (tỉnh): 3-5 triệu KRW/kỳ (~60-100 triệu VND)
• Trung bình: 5-10 triệu KRW/kỳ (~100-200 triệu VND)
• Cao: 10-15 triệu KRW/kỳ (~200-300 triệu VND)

**3. KÝ TÚC XÁ — Ưu tiên có KTX**
• Giá: 500,000-1,500,000 KRW/tháng
• Nên chọn trường có KTX — tiết kiệm 30-50% chi phí nhà ở

**4. ĐIỀU KIỆN ĐẦU VÀO — Kiểm tra trước khi nộp**
• GPA yêu cầu, điểm TOPIK/IELTS tối thiểu
• Số buổi nghỉ cho phép, độ tuổi tối đa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GỢI Ý CHỌN TRƯỜNG THEO HỒ SƠ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại hồ sơ | Nên chọn | Không nên chọn |
|------------|---------|----------------|
| GPA yếu (< 5.0) | Trường tỉnh, dễ xin | Trường top Seoul |
| Tài chính yếu ($10,000) | Trường tỉnh, học phí thấp | Trường Seoul học phí cao |
| Gap year dài (> 2 năm) | Trường tỉnh, ít khắt khe | Trường top, tuổi cao |
| Có TOPIK 3+ | Cả Seoul và tỉnh | — |
| Muốn ở lại E7 | Trường có lộ trình E7 tốt | Trường không hỗ trợ |

📌 **MẸO**: Với hồ sơ yếu (GPA thấp, gap year dài, tài chính hạn chế), nên chọn trường tỉnh — tỉ lệ đậu visa cao hơn đáng kể. Có thể chuyển lên trường Seoul sau khi đã ở Hàn 1-2 năm.
`
  },
  {
    id: 'school-regions',
    category: 'schools',
    title: 'Các khu vực du học tại Hàn Quốc — Chọn nơi phù hợp với túi tiền & mục tiêu',
    summary: 'So sánh chi phí sinh hoạt, học tập, cơ hội làm thêm giữa các khu vực tại Hàn Quốc: Seoul, Gyeonggi, Busan, Daegu, tỉnh.',
    tags: ['khu vực', 'seoul', 'busan', 'chi phí', 'sinh hoạt'],
    content: `Mỗi khu vực tại Hàn Quốc có đặc điểm riêng về chi phí, môi trường và cơ hội. Chọn đúng khu vực giúp bạn tiết kiệm và tận hưởng cuộc sống du học tốt hơn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SO SÁNH 5 KHU VỰC CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Khu vực | Chi phí/tháng | Đậu visa | Cơ hội làm thêm | Giao thông |
|---------|--------------|----------|-----------------|-----------|
| Seoul | 1.4-2.5tr KRW | Trung bình | Rất nhiều | ⭐⭐⭐⭐⭐ |
| Gyeonggi/Incheon | 1.1-1.9tr KRW | Khá | Nhiều | ⭐⭐⭐⭐ |
| Busan | 0.9-1.5tr KRW | Tốt | Khá | ⭐⭐⭐⭐ |
| Daegu/Daejeon | 0.8-1.3tr KRW | Tốt | Trung bình | ⭐⭐⭐ |
| Tỉnh (Chungcheong, Jeolla...) | 0.7-1.2tr KRW | Rất tốt | Ít | ⭐⭐ |

*Đơn vị: KRW. VD: 1.4tr = 1,400,000 KRW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐẶC ĐIỂM CHI TIẾT TỪNG KHU VỰC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SEOUL — Thủ đô sôi động**
• Chi phí sinh hoạt: ~1,000,000-1,500,000 KRW/tháng (chưa tính học phí)
• Trường tiêu biểu: Seoul National, Yonsei, Korea, Kyung Hee, Sogang
• Ưu: Nhiều trường top, nhiều việc làm thêm, tiện nghi
• Nhược: Chi phí cao, khó xin visa hơn

**GẦN SEOUL (Gyeonggi, Incheon)**
• Chi phí thấp hơn Seoul 20-30%
• Trường tiêu biểu: Ajou University, Inha University, University of Suwon
• Ưu: Gần Seoul, nhiều khu công nghiệp, cơ hội việc làm

**BUSAN — Thành phố biển xinh đẹp**
• Chi phí thấp hơn Seoul 30-40%
• Trường tiêu biểu: Pusan National, Dong-A, Kyungsung
• Ưu: Bãi biển, khí hậu dễ chịu, cảng biển lớn

**DAEGU, DAEJEON, GWANGJU**
• Chi phí thấp hơn Seoul 40-50%
• Trường tiêu biểu: Kyungpook National, Chungnam National, Chonnam National
• Ưu: Chi phí thấp, dễ xin visa, môi trường học tập tốt

**CÁC TỈNH (Chungcheongbuk, Jeollanam, Gyeongsangnam...)**
• Chi phí thấp nhất
• Trường tiêu biểu: Chungbuk National, Jeonbuk National, Gyeongsang National
• Ưu: Chi phí rất thấp, dễ xin visa nhất, sĩ số lớp nhỏ

📌 **MẸO**: Nếu bạn chưa có TOPIK và tài chính hạn chế, hãy chọn trường ở tỉnh hoặc Busan. Sau 1-2 năm, khi đã có TOPIK 3+, bạn có thể chuyển lên Seoul.
`
  },
  {
    id: 'school-top-universities',
    category: 'schools',
    title: 'Top trường đào tạo tiếng Hàn cho du học sinh — So sánh học phí & chất lượng',
    summary: 'Danh sách các trường đại học Hàn Quốc có chương trình đào tạo tiếng Hàn uy tín cho du học sinh, kèm so sánh học phí.',
    tags: ['trường', 'đại học', 'tiếng Hàn', 'học phí', 'top'],
    content: `Dưới đây là danh sách các trường đại học Hàn Quốc có chương trình đào tạo tiếng Hàn (D-4-1) phổ biến nhất với du học sinh Việt Nam.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP TRƯỜNG TIẾNG HÀN 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Trường | Khu vực | Học phí/kỳ | KTX/tháng | Ghi chú |
|--------|---------|-----------|-----------|---------|
| ĐH Kyung Hee | Seoul | ~7.5tr KRW | 800k-1.2tr | Cơ sở đẹp, nhiều SV VN |
| ĐH Yonsei | Seoul | ~8.5tr KRW | 1.0-1.5tr | Top đầu, uy tín |
| ĐH Korea | Seoul | ~7.8tr KRW | 900k-1.3tr | Cơ sở tại Seoul |
| ĐH Hanyang | Seoul | ~7.0tr KRW | 700k-1.0tr | Học phí hợp lý |
| ĐH Chung-Ang | Seoul | ~6.8tr KRW | 700k-1.0tr | Cơ sở đẹp |
| ĐH Ajou | Suwon | ~5.8tr KRW | 500k-800k | Gần Seoul, tiết kiệm |
| ĐH Inha | Incheon | ~5.5tr KRW | 500k-700k | Gần Seoul |
| ĐH Pusan National | Busan | ~5.2tr KRW | 400k-700k | Chi phí thấp |
| ĐH Kyungpook | Daegu | ~4.8tr KRW | 400k-600k | Tỉnh, tiết kiệm |
| ĐH Chungnam | Daejeon | ~4.5tr KRW | 350k-500k | Tiết kiệm nhất |

*Đơn vị: KRW. VD: 7.5tr = 7,500,000 KRW. Học phí có thể thay đổi theo từng kỳ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁCH CHỌN TRƯỜNG TIẾNG HÀN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Ngân sách 40-60 triệu VND/kỳ (học phí + KTX + ăn uống):**
→ Chọn trường tỉnh: Chungnam, Kyungpook, Pusan National

**Ngân sách 60-80 triệu VND/kỳ:**
→ Chọn trường Gần Seoul: Ajou, Inha

**Ngân sách 80-120 triệu VND/kỳ:**
→ Chọn trường Seoul: Kyung Hee, Hanyang, Chung-Ang

📌 **MẸO**: Đừng chọn trường chỉ vì "tiếng" — hãy xem xét tổng thể chi phí + điều kiện + tỉ lệ đậu visa. Một trường tỉnh với chi phí thấp và tỉ lệ đậu cao đôi khi là lựa chọn tốt hơn trường top Seoul.
`
  },
  {
    id: 'school-majors-guide',
    category: 'schools',
    title: 'Hướng dẫn chọn ngành học tại Hàn Quốc — Ngành nào dễ xin việc nhất?',
    summary: 'Hướng dẫn chọn ngành học phù hợp tại Hàn Quốc: cơ hội nghề nghiệp, mức lương, điều kiện đầu vào theo từng ngành.',
    tags: ['ngành học', 'chọn ngành', 'nghề nghiệp', 'E7', 'việc làm'],
    content: `Chọn ngành học phù hợp không chỉ ảnh hưởng đến thời gian du học mà còn quyết định cơ hội việc làm sau tốt nghiệp — đặc biệt nếu bạn muốn ở lại Hàn Quốc làm việc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁC NGÀNH DỄ XIN E7 NHẤT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Ngành học | Cơ hội E7 | Mức lương khởi điểm | Ghi chú |
|-----------|----------|-------------------|---------|
| Kỹ thuật/Công nghệ | ⭐⭐⭐⭐⭐ | 35-50tr KRW/năm | Nhu cầu cao nhất |
| Kinh doanh/Quản trị | ⭐⭐⭐⭐ | 30-40tr KRW/năm | Phổ biến, cạnh tranh |
| Ngôn ngữ Hàn/Biên phiên dịch | ⭐⭐⭐⭐ | 28-38tr KRW/năm | Cần TOPIK 5+ |
| IT/Phần mềm | ⭐⭐⭐⭐⭐ | 40-60tr KRW/năm | Lương cao nhất |
| Du lịch/Khách sạn | ⭐⭐⭐ | 25-35tr KRW/năm | Cần tiếng Hàn tốt |
| Truyền thông/Media | ⭐⭐⭐ | 28-38tr KRW/năm | Cạnh tranh cao |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NGÀNH THEO SỞ THÍCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Yêu thích công nghệ, máy tính:**
• Ngành: Khoa học máy tính, Kỹ thuật phần mềm, AI, Big Data
• TOPIK yêu cầu: 3+ (chương trình Hàn) hoặc IELTS 6.0+ (chương trình Anh)
• Cơ hội: Rộng mở — Samsung, LG, Kakao đều tuyển

**Yêu thích kinh doanh:**
• Ngành: Quản trị kinh doanh, Marketing, Tài chính, Kế toán
• TOPIK yêu cầu: 4+
• Cơ hội: Nhiều — các tập đoàn Hàn Quốc, ngân hàng

**Yêu thích ngôn ngữ:**
• Ngành: Ngôn ngữ Hàn, Biên phiên dịch, Nghiên cứu Hàn Quốc
• TOPIK yêu cầu: 5+ (đầu ra)
• Cơ hội: Phiên dịch viên, giáo viên, hướng dẫn viên

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LƯU Ý KHI CHỌN NGÀNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Nên chọn ngành có nhu cầu nhân lực cao** — không chỉ theo sở thích
2. **Kiểm tra điều kiện đầu vào** — một số ngành yêu cầu TOPIK 4-5
3. **Xem xét lộ trình E7** — nếu muốn ở lại Hàn làm việc
4. **Tham khảo cựu sinh viên** — hỏi kinh nghiệm thực tế

📌 **MẸO**: Nếu chưa chắc chắn về ngành học, hãy bắt đầu với D-4-1 (học tiếng). Trong thời gian học tiếng, bạn có thể tìm hiểu và quyết định ngành sẽ học khi lên D-2.
`
  },
  {
    id: 'topik-guide',
    category: 'study-plan',
    title: 'TOPIK — Cẩm nang toàn tập: Lịch thi, Cách đăng ký, Cấp độ & Mẹo ôn thi 2026',
    summary: 'Hướng dẫn chi tiết về kỳ thi TOPIK: lịch thi 2026 tại Việt Nam, các cấp độ 1-6, cách đăng ký, lệ phí, mẹo ôn thi.',
    tags: ['TOPIK', 'thi', 'tiếng Hàn', 'cấp độ', 'chứng chỉ'],
    content: `TOPIK (Test of Proficiency in Korean) là kỳ thi đánh giá năng lực tiếng Hàn chuẩn quốc tế, do NIIED tổ chức.

CÁC CẤP ĐỘ TOPIK 1-6:
| Cấp độ | Phân loại | Điểm đậu | Mô tả |
|--------|-----------|---------|------|
| 1 | Sơ cấp | 80+ | Kỹ năng sống cơ bản: tự giới thiệu, mua sắm |
| 2 | Sơ cấp | 140+ | Giao tiếp hàng ngày: gọi điện, hỏi đường |
| 3 | Trung cấp | 120+ | Tự lập, giao tiếp chủ đề xã hội quen thuộc |
| 4 | Trung cấp | 150+ | Hiểu tin tức, tham gia hoạt động xã hội |
| 5 | Cao cấp | 190+ | Công việc chuyên môn, chủ đề trừu tượng |
| 6 | Cao cấp | 230+ | Thông thạo như người bản ngữ |

LỊCH THI TOPIK 2026 TẠI VIỆT NAM:
| Đợt | Loại | Ngày |
|-----|------|------|
| IBT 12 | IBT | 21/03/2026 |
| PBT 105 | PBT | 12/04/2026 |
| PBT 106 | PBT | 17/05/2026 |
| IBT 13 | IBT | 13/06/2026 |
| PBT 107 | PBT | 05/07/2026 |
| IBT 14 | IBT | 12/09/2026 |
| PBT 108 | PBT | 18/10/2026 |
| PBT 109 | PBT | 15/11/2026 |
Đăng ký tại online.iigvietnam.com. Hạn đóng 4-6 tuần trước thi.

CẤU TRÚC BÀI THI: TOPIK I gồm Đọc (30c/40p) + Nghe (30c/40p) = 200đ. TOPIK II gồm Đọc (50c/70p) + Nghe (50c/60p) + Viết (4c/50p) = 300đ.

📌 **GIÁ TRỊ**: Hiệu lực 2 năm. TOPIK 3+ yêu cầu cho visa D-2. TOPIK 4+ cho học bổng 50-100%. TOPIK 5-6 cho E7 và phiên dịch.

📌 **MẸO ÔN**: Bắt đầu 3 tháng trước. Học 30-50 từ/ngày. Làm ít nhất 5 đề thi thử. Xem KBS News, YouTube tiếng Hàn. Đọc Naver, webtoon. Luyện viết 2 bài/tuần — viết là phần khó nhất. App: TOPIK One, Hàn Quốc 123. Sách: Hot TOPIK, Master TOPIK.
`
  },
  {
    id: 'finance-scholarship',
    category: 'finance',
    title: 'Học bổng du học Hàn Quốc 2026 — GKS, Học bổng trường & Cách apply',
    summary: 'Tổng hợp học bổng du học Hàn Quốc: GKS toàn phần, học bổng TOPIK, học bổng GPA. Điều kiện, hồ sơ, thời hạn.',
    tags: ['học bổng', 'GKS', 'tài chính', 'TOPIK', 'apply'],
    content: `Học bổng là cách tốt nhất để giảm gánh nặng tài chính khi du học Hàn Quốc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GKS — GLOBAL KOREA SCHOLARSHIP (HỌC BỔNG CHÍNH PHỦ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GKS do NIIED cấp, bao gồm TOÀN BỘ: 100% học phí + sinh hoạt phí ~1,000,000 KRW/tháng + vé máy bay khứ hồi + bảo hiểm y tế + phí định cư.

| Loại | Tuổi | GPA | TOPIK |
|------|------|-----|-------|
| GKS-U (Đại học) | Dưới 25 | 6.5+ | Không bắt buộc (lợi thế lớn) |
| GKS-G (Sau ĐH) | Dưới 40 | 7.0+ | Ưu tiên TOPIK 4+ |

📌 **THỜI GIAN NỘP**: GKS-G tháng 2, GKS-U tháng 9 hàng năm. Nộp qua ĐSQ Hàn Quốc tại VN hoặc qua trường. Tỉ lệ cạnh tranh ~5-10%. Chi tiết: studyinkorea.go.kr

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HỌC BỔNG TRƯỜNG (THEO TOPIK & GPA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại | Giảm học phí | Điều kiện |
|------|-------------|-----------|
| TOPIK 3 | 20-30% | TOPIK 3, GPA 6.0+ |
| TOPIK 4 | 30-50% | TOPIK 4, GPA 6.5+ |
| TOPIK 5 | 50-70% | TOPIK 5, GPA 7.0+ |
| TOPIK 6 | 70-100% | TOPIK 6, GPA 7.5+ |
| GPA kỳ trước | 20-100% | GPA 3.0-4.5/4.5 |

⚠️ **LƯU Ý**: Học bổng trường thường áp dụng từ kỳ thứ 2. Một số trường có học bổng đầu vào dựa trên TOPIK. Kiểm tra mục Scholarship trên website trường.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HỌC BỔNG KING SEJONG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dành cho sinh viên học tiếng Hàn tại các Viện King Sejong, bao gồm khoá học ngắn hạn tại Hàn Quốc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁCH APPLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Nghiên cứu: Xem mục Scholarship trên website trường
2. Chuẩn bị: GPA cao, TOPIK tốt, hoạt động ngoại khoá, thư giới thiệu
3. Viết: Personal Statement + Study Plan xuất sắc
4. Nộp đúng hạn: Ghi chú cẩn thận thời hạn từng trường
5. Phỏng vấn: Một số học bổng yêu cầu phỏng vấn

📌 **MẸO**: Luôn kiểm tra studyinkorea.go.kr để cập nhật thông tin GKS mới nhất.
`
  },
  {
    id: 'process-daily-life',
    category: 'process',
    title: 'Cuộc sống du học sinh tại Hàn Quốc — Ứng dụng, Giao thông, Nhà ở & Mẹo sống',
    summary: 'Hướng dẫn cuộc sống tại Hàn: ứng dụng cần thiết, T-money, nhà ở (goshiwon/share house/one-room), mẹo tiết kiệm.',
    tags: ['cuộc sống', 'Hàn Quốc', 'ứng dụng', 'nhà ở', 'T-money'],
    content: `Cuộc sống du học sinh tại Hàn Quốc có nhiều khác biệt văn hoá. Chuẩn bị kỹ giúp bạn thích nghi nhanh hơn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ỨNG DỤNG CẦN THIẾT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Ứng dụng | Mục đích | Ghi chú |
|----------|----------|---------|
| KakaoTalk | Nhắn tin, gọi điện, thanh toán | QUAN TRỌNG NHẤT — ai cũng dùng |
| Naver Map | Bản đồ, chỉ đường | Chính xác hơn Google Maps tại Hàn |
| KakaoMap | Bản đồ | Tích hợp real-time bus, tàu điện |
| Papago | Dịch thuật | Dịch Hàn-Việt tốt nhất |
| Baedal Minjok | Giao đồ ăn | Ứng dụng giao hàng số 1 |
| Coupang | Mua sắm online | Giao siêu tốc (Rocket Delivery) |
| Kakao T | Gọi taxi | Dễ dàng hơn tự bắt taxi |

⚠️ **LƯU Ý**: Google Maps hoạt động RẤT HẠN CHẾ tại Hàn Quốc. Hãy cài Naver Map NGAY KHI ĐẾN!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIAO THÔNG CÔNG CỘNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• **T-money Card**: Mua tại GS25/CU/7-Eleven (~2,500 KRW). Dùng cho tàu điện, bus, taxi.
• **LUÔN quẹt thẻ khi lên VÀ khi xuống** — nếu không quẹt khi xuống, bạn không được giảm giá chuyển tuyến
• **Giảm chuyển tuyến**: 30 phút (ban đêm 1 giờ)
• **Giá vé**: Tàu ~1,400 KRW, bus 1,200-2,000 KRW, taxi mở cửa 3,800 KRW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHÀ Ở
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Loại | Tiền cọc | Tiền thuê/tháng | Phù hợp |
|------|----------|----------------|---------|
| Goshiwon | Thấp/Không | 250k-600k KRW | Kinh tế, ngắn hạn |
| Share House | Thấp-TB | 350k-800k KRW | Muốn kết bạn |
| One-Room | Cao (5-20tr KRW) | 400k-1tr+ KRW | Ở lâu dài |
| KTX trường | Thấp | 300k-1.5tr KRW | Thuận tiện ban đầu |

📌 **MẸO**: Tuần đầu ở goshiwon hoặc KTX. KHÔNG thuê nhà khi chưa xem trực tiếp — ảnh trên mạng thường đẹp hơn thực tế. Nấu ăn tại nhà tiết kiệm 50-60%.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MẸO SỐNG KHÁC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• **Adapter điện**: Hàn Quốc dùng 2 chấu tròn (loại C/F), KHÔNG phải 2 chấu dẹt như Việt Nam
• **Sim điện thoại**: Sim du học sinh ~30,000-50,000 KRW/tháng
• **Tiết kiệm**: Mua đồ ở convenience store sau 21h (giảm 30-50%), đi xe đạp, săn deal trên Coupang
• **Giấy tờ**: Luôn mang theo ARC. Photo hộ chiếu và visa để dự phòng
`
  },
  {
    id: 'process-hikorea',
    category: 'process',
    title: 'Hướng dẫn sử dụng Hi Korea Portal — Đặt lịch Immigration & Dịch vụ online',
    summary: 'Hướng dẫn Hi Korea (hikorea.go.kr): đăng ký, đặt lịch Immigration, gia hạn visa, xin giấy phép làm thêm.',
    tags: ['Hi Korea', 'hikorea', 'Immigration', 'đặt lịch', 'online'],
    content: `Hi Korea (www.hikorea.go.kr) là cổng dịch vụ công trực tuyến chính thức của Immigration Hàn Quốc dành cho người nước ngoài.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐĂNG KÝ TÀI KHOẢN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Truy cập www.hikorea.go.kr → chọn tiếng Anh
2. Nhấn Sign Up → điền tên, ngày sinh, quốc tịch, số hộ chiếu
3. Xác thực email → đăng nhập và bắt đầu sử dụng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁC DỊCH VỤ CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Dịch vụ | Mục đích | Thời gian | Phí |
|---------|----------|-----------|-----|
| Alien Registration | Đăng ký ARC lần đầu | 2-4 tuần | 30,000-50,000 KRW |
| Extension of Stay | Gia hạn visa | 1-3 tuần | ~60,000-100,000 KRW |
| Change of Status | Chuyển đổi visa | 2-4 tuần | ~100,000-135,000 KRW |
| Work Permit | Giấy phép làm thêm | 1-2 tuần | MIỄN PHÍ |
| Visit Reservation | Đặt lịch hẹn | — | — |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐẶT LỊCH IMMIGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **BẮT BUỘC**: Bạn PHẢI đặt lịch hẹn online trước. KHÔNG chấp nhận walk-in!

1. Đăng nhập → Visit Reservation → Apply
2. Chọn văn phòng Immigration (theo khu vực cư trú)
3. Chọn mục đích (ARC, gia hạn, chuyển đổi...)
4. Chọn ngày và giờ
5. Xác nhận và in phiếu hẹn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIA HẠN VISA ONLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Chọn Application for Extension of Stay
2. Upload: hộ chiếu, ARC, bảng điểm, xác nhận đang học, xác nhận số dư, bảo hiểm NHI
3. Đóng phí ~60,000-100,000 KRW online
4. Chờ kết quả 1-2 tuần
5. Kết quả gửi qua email + cập nhật trên Hi Korea

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
XIN GIẤY PHÉP LÀM THÊM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Chọn Application for Part-time Work Permit
2. Cần: HĐLĐ (có chữ ký người sử dụng lao động) + xác nhận của trường (Confirmation Form) + bảng điểm + TOPIK
3. Miễn phí
4. Chờ 1-2 tuần

📌 **MẸO**: Kiểm tra email (cả spam) sau khi nộp. Nếu thiếu giấy tờ, Immigration yêu cầu bổ sung trong vòng 7 ngày — nếu không nộp kịp, đơn sẽ bị huỷ và bạn phải nộp lại từ đầu.
`
  },

  // ═══════════════════════════════════════════
  // TOPIK ARTICLES (3 articles)
  // ═══════════════════════════════════════════

  {
    id: 'topik-writing',
    category: 'study-plan',
    title: 'TOPIK Writing (쓰기) — Cẩm nang chiến thuật đạt điểm cao Câu 51-54',
    summary: 'Hướng dẫn chi tiết từng câu trong phần Viết TOPIK II: cấu trúc, template, mẹo đạt TOPIK 5-6. Bao gồm câu 53 biểu đồ và câu 54 bài luận.',
    tags: ['TOPIK', 'viết', '쓰기', 'writing', 'câu 54', 'biểu đồ', 'bài luận'],
    content: `Phần Viết (쓰기) là phần KHÓ NHẤT trong TOPIK II nhưng cũng là phần quyết định bạn đạt TOPIK 5-6 hay chỉ dừng ở 3-4. Nhiều thí sinh được 80-90/100 điểm Đọc và Nghe nhưng chỉ được 30-40/100 điểm Viết.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG QUAN VỀ TOPIK WRITING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Câu | Nội dung | Điểm | Thời gian khuyến nghị | Độ khó |
|-----|----------|------|----------------------|--------|
| 51 | Điền vào chỗ trống (thư/email/ghi chú) | 10 | 3-5 phút | ⭐ |
| 52 | Điền vào chỗ trống (văn bản học thuật) | 10 | 3-5 phút | ⭐⭐ |
| 53 | Mô tả biểu đồ (200-300 ký tự) | 30 | 10-12 phút | ⭐⭐⭐ |
| 54 | Bài luận xã hội (600-700 ký tự) | 50 | 28-32 phút | ⭐⭐⭐⭐⭐ |

⚠️ **LƯU Ý**: Câu 53 và 54 chiếm 80/100 điểm Viết. Đây là nơi tạo khác biệt giữa TOPIK 4 (viết 40-50đ) và TOPIK 5-6 (viết 60-80đ).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÂU 51: ĐIỀN VÀO CHỖ TRỐNG (10 điểm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Dạng bài: Email, tin nhắn, ghi chú, lịch trình — còn 1-2 chỗ trống cần điền
• Mục tiêu: Hoàn thành câu phù hợp ngữ cảnh, đúng văn phong (반말 hoặc 존댓말)
• Lưu ý: ĐỂ Ý **kính ngữ** — nếu là thư gửi sếp/người lớn tuổi, phải dùng đuôi -습니다/ㅂ니다

📌 **MẸO**: Đọc kỹ ngữ cảnh trước khi điền. Nếu câu trước dùng 반말, bạn phải dùng 반말. Nếu câu trước là 존댓말, bạn phải dùng 존댓말.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÂU 52: ĐIỀN VÀO CHỖ TRỐNG (10 điểm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Dạng bài: Văn bản học thuật/báo chí — điền 2-3 chỗ trống với cấu trúc ngữ pháp phức tạp
• Mục tiêu: Sử dụng đúng ngữ pháp trung-cao cấp
• Các cấu trúc hay gặp:
  • -(으)ㄹ 뿐만 아니라 (không những... mà còn)
  • -는 데 반해 (trong khi... thì...)
  • -기 마련이다 (đương nhiên là...)
  • -(으)로 인해 (do... mà...)
  • -는 한 (miễn là... / trong phạm vi...)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÂU 53: MÔ TẢ BIỂU ĐỒ (30 điểm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **CẤU TRÚC CHUẨN**:

**Mở đầu (1-2 câu)**: Giới thiệu biểu đồ
• "[Nguồn]에서 [chủ đề]에 대해 조사한 결과를 [biểu đồ]으로 제시하였다."
• Ví dụ: "한국 교육부에서 2025년 외국인 유학생 현황에 대해 조사한 결과를 막대 그래프로 제시하였다."

**Thân bài (4-5 câu)**: Mô tả xu hướng + so sánh
Từ vựng cần thiết:
| Tăng | Giảm | Ổn định | Dao động |
|------|------|---------|----------|
| 증가하다 | 감소하다 | 유지되다 | 기복을 보이다 |
| 늘어나다 | 줄어들다 | 비슷한 수준 | 증감을 반복하다 |
| 상승하다 | 하락하다 | 변화가 없다 | 등락하다 |

• "2020년에 100만 명이었던 참가자 수는 2025년에 200만 명으로 2배 증가하였다."
• "반면에, B 제품의 판매량은 2019년 이후 지속적으로 감소하는 추세를 보이고 있다."

**Kết luận (1 câu)**: Nhận định tổng quan
• "이러한 결과를 통해 [nhận định]을 알 수 있다."
• "앞으로도 이러한 추세는 계속될 것으로 전망된다."

📌 **MẸO**: Học thuộc 3-4 mẫu câu cho mỗi phần (tăng/giảm/so sánh). Sử dụng ít nhất 1-2 cấu trúc câu phức tạp.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÂU 54: BÀI LUẬN XÃ HỘI (50 điểm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Đây là câu quan trọng nhất — chiếm một nửa số điểm phần Viết.

📝 **CẤU TRÚC CHUẨN 서론-본론-결론**:

**서론 (Mở bài) — 2-3 câu**
• Giới thiệu chủ đề + nêu hai mặt của vấn đề
• Đưa ra quan điểm của người viết
• Mẫu: "요즘 [chủ đề]에 대한 관심이 높아지고 있다. 이에 대해 찬성과 반대 의견이 엇갈리고 있다. 나는 [quan điểm]라고 생각한다."

**본론 (Thân bài) — 2 đoạn, 6-8 câu**
• Đoạn 1: Lý do thứ nhất + ví dụ
  • "첫째/우선,..." + dẫn chứng cụ thể
• Đoạn 2: Lý do thứ hai + ví dụ
  • "둘째/또한,..." + dẫn chứng cụ thể
• Sử dụng từ nối: "반면에" (mặt khác), "뿐만 아니라" (không những), "따라서" (do đó)

**결론 (Kết bài) — 2-3 câu**
• Tóm tắt quan điểm
• Đưa ra kiến nghị hoặc dự đoán
• KHÔNG đưa ra ý kiến mới
• Mẫu: "이와 같이 [tóm tắt]. 따라서 나는 [kiến nghị]라고 생각한다."

📌 **MẸO VÀNG CHO CÂU 54**:
1. ⏱ Dành TỐI THIỂU 28-30 phút cho câu này — KHÔNG làm 51-53 quá lâu
2. ✍️ Viết trước dàn ý nháp (3 phút) — xác định ý chính trước
3. 📝 Sử dụng ít nhất 3-4 cấu trúc ngữ pháp cấp 4-5 trong bài
4. 🔍 Viết xong — dành 2 phút kiểm tra: chính tả, đuôi câu, chia động từ
5. 🔢 Viết đúng số ký tự: 600-700 ký tự — quá ngắn hoặc quá dài đều bị trừ điểm

⚠️ **LỖI THƯỜNG GẶP CẦN TRÁNH**:
• Dùng sai đuôi câu (cần dùng -ㅂ니다/습니다, không dùng -요)
• Viết quá ngắn (< 500 ký tự) — chắc chắn mất ít nhất 50% điểm
• Không có ví dụ hoặc dẫn chứng — bài viết sẽ trừu tượng và yếu
• Không chia đoạn — bài viết lộn xộn, khó đọc
• Dùng từ vựng cấp 1-2 trong bài luận — thiếu ấn tượng

📌 **MẸO LUYỆN**: Viết ít nhất 1 bài luận (câu 54) mỗi ngày trong 30 ngày trước kỳ thi. Dùng Papago để kiểm tra ngữ pháp. Học thuộc 5-7 templates mở bài và kết bài.
`
  },

  {
    id: 'topik-prep',
    category: 'study-plan',
    title: 'Lộ trình ôn TOPIK từ A-Z — Sách, App, Lịch học & Chiến thuật thi',
    summary: 'Lộ trình ôn TOPIK từ 0 đến 6: sách, app, lịch học hàng ngày, chiến thuật thi cho từng cấp độ.',
    tags: ['TOPIK', 'ôn thi', 'lộ trình', 'sách', 'app', 'chiến thuật'],
    content: `Luyện thi TOPIK không khó nếu bạn có lộ trình đúng. Dưới đây là lộ trình chi tiết cho từng cấp độ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LỘ TRÌNH THEO THÁNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Cấp độ hiện tại | Mục tiêu | Thời gian | Giờ học/tuần |
|----------------|----------|-----------|--------------|
| 0 → TOPIK 2 | Giao tiếp cơ bản | 3-6 tháng | 10-15h |
| TOPIK 2 → 3 | Trung cấp | 3-6 tháng | 12-18h |
| TOPIK 3 → 4 | Trung cấp cao | 4-8 tháng | 15-20h |
| TOPIK 4 → 5 | Cao cấp | 6-12 tháng | 15-20h |
| TOPIK 5 → 6 | Cao cấp | 6-12 tháng | 20h+ |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SÁCH LUYỆN THI TOP 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Sách | Phù hợp | Mục đích |
|------|---------|----------|
| Hot TOPIK (1-2-3) | Sơ-Trung cấp | Luyện đề |
| Master TOPIK | Trung-Cao cấp | Chuyên sâu |
| Korean Grammar in Use | Mọi trình độ | Ngữ pháp |
| TOPIK II 한권이면 OK | Trung-Cao | Tổng hợp |
| Sách đề thi thử TOPIK | Mọi trình độ | Làm đề |

📌 **MẸO**: Hot TOPIK phù hợp làm quen đề thi. Master TOPIK phù hợp ôn chuyên sâu từng kỹ năng. Korean Grammar in Use là sách GỐC — nên có dù ở trình độ nào.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP HỖ TRỢ ÔN THI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| App | Chức năng | Nên dùng khi |
|-----|-----------|-------------|
| TOPIK One | Luyện đề TOPIK đầy đủ | Hàng ngày |
| Hàn Quốc 123 | Học từ vựng + ngữ pháp | Hàng ngày |
| Papago | Dịch Hàn-Việt | Kiểm tra viết |
| Mirinae | Phân tích ngữ pháp | Học sâu |
| Memrise | Học từ vựng | Trên xe bus/tàu |
| Cake | Luyện giao tiếp + từ vựng | Giải trí |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LỊCH HỌC MẪU (15h/tuần)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Thứ | Sáng (1.5h) | Chiều (1.5h) |
|-----|------------|-------------|
| Thứ 2 | Học từ vựng 30 từ mới | Ngữ pháp mới (2 cấu trúc) |
| Thứ 3 | Luyện đọc hiểu | Viết câu 53 |
| Thứ 4 | Học từ vựng 30 từ mới | Luyện nghe |
| Thứ 5 | Ôn ngữ pháp tuần | Viết câu 54 |
| Thứ 6 | Làm đề thi thử (full) | Chữa đề + ghi chú lỗi |
| Thứ 7 | Ôn từ vựng trong tuần | Xem KBS News / YouTube Hàn |
| CN | NGHỈ — xem phim Hàn, webtoon | — |

⚠️ **LƯU Ý**: Đây là lịch tối thiểu. Nếu muốn lên từ TOPIK 2 lên 4 trong 6 tháng, cần 18-20h/tuần.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHIẾN THUẬT THEO TỪNG KỸ NĂNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. TỪ VỰNG (한국어 어휘)**
• Học 30-50 từ/ngày — dùng flashcard (giấy hoặc app)
• Học theo CHỦ ĐỀ: giáo dục, kinh tế, môi trường, xã hội, khoa học, văn hoá
• Ôn lại từ cũ: phương pháp "1-3-7" — ôn lại sau 1 ngày, 3 ngày, 7 ngày

**2. NGỮ PHÁP (문법)**
• Mỗi tuần học 6-10 cấu trúc ngữ pháp mới
• Làm 5 câu ví dụ riêng cho mỗi cấu trúc
• Tập trung vào các cấu trúc cấp 3-4 trước, sau đó lên cấp 5-6

**3. ĐỌC (읽기) — Mục tiêu: 80-95/100**
| Chiến thuật | Mô tả |
|------------|-------|
| Đọc lướt (skimming) | Đọc câu đầu mỗi đoạn để nắm ý chính |
| Đọc chi tiết (scanning) | Tìm keyword trong câu hỏi, scan đoạn văn |
| Loại trừ | Với câu không chắc, loại 2 đáp án sai trước |

📌 **MẸO ĐỌC**: Luôn đọc câu hỏi TRƯỚC, sau đó mới đọc đoạn văn. Tiết kiệm 30% thời gian.

**4. NGHE (듣기) — Mục tiêu: 80-95/100**
• Nghe KBS News mỗi ngày 15 phút (dù không hiểu hết)
• Nghe podcast tiếng Hàn trên YouTube
• Luyện nghe chép chính tả (dictation)
• Khi thi: câu 1-10 dễ → làm nhanh. Câu 31-50 khó → tập trung tối đa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHIẾN THUẬT TRONG PHÒNG THI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Kỹ năng | Thời gian | Chiến thuật |
|---------|-----------|-------------|
| Đọc (70 phút) | 50 câu | 30 câu đầu: 30 phút. 20 câu cuối: 35 phút. 5 phút rà soát |
| Nghe (60 phút) | 50 câu | Tập trung tối đa — nếu không nghe được → đoán và chuyển sang câu sau |
| Viết (50 phút) | 4 câu | 51-52: 8 phút. 53: 10 phút. 54: 30 phút. 2 phút kiểm tra |

📌 **MẸO VÀNG TRƯỚC NGÀY THI**:
1. 🗓 1 tháng trước: Làm đề full mỗi tuần 2-3 đề (đúng giờ, đúng áp lực)
2. 🗓 1 tuần trước: Ôn lại từ vựng + ngữ pháp, không học mới
3. 🗓 1 ngày trước: Nghỉ ngơi, ngủ sớm, chuẩn bị đồ (bút chì, tẩy, CMND)
4. 📌 Đến sớm 30 phút, mang theo bút chì đen + tẩy giống kiểu thi TOPIK

🚫 **SAI LẦM THƯỜNG GẶP KHI ÔN THI**:
• Chỉ học ngữ pháp mà không luyện đề — không quen áp lực thời gian
• Không luyện viết tay — đến khi thi viết chậm, chữ xấu
• Chỉ làm đề không học từ mới — từ vựng không tăng
• Không ôn lại lỗi sai — lần sau lại mắc lỗi tương tự
`
  },

  {
    id: 'topik-career',
    category: 'study-plan',
    title: 'TOPIK & Lộ trình sự nghiệp — Visa, Học bổng, Việc làm & E7',
    summary: 'TOPIK ảnh hưởng thế nào đến visa D-4-1/D-2, học bổng GKS/trường, giờ làm thêm, visa E7 và cơ hội việc làm.',
    tags: ['TOPIK', 'sự nghiệp', 'visa', 'học bổng', 'E7', 'làm thêm'],
    content: `TOPIK không chỉ là chứng chỉ tiếng Hàn — nó ảnh hưởng TRỰC TIẾP đến hầu hết các khía cạnh của cuộc sống du học sinh tại Hàn Quốc: từ loại visa bạn có thể xin, đến học bổng bạn nhận được, giờ làm thêm và cơ hội việc làm sau tốt nghiệp.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPIK & VISA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**D-4-1 (Học tiếng):** Không yêu cầu TOPIK đầu vào. Nhưng nếu CÓ TOPIK 2+, hồ sơ mạnh hơn đáng kể và tỉ lệ đậu cao hơn 15-25%.

**D-2 (Đại học/Cao học):** YÊU CẦU TOPIK tối thiểu 3+ (đa số trường). Cụ thể:

| Loại trường | TOPIK yêu cầu | Ghi chú |
|------------|--------------|---------|
| Trường top (SKY, top 10) | TOPIK 4-5+ | Một số ngành yêu cầu TOPIK 5+ |
| Trường trung bình | TOPIK 3-4 | Chấp nhận IELTS 5.5+ thay thế |
| Trường tỉnh | TOPIK 2-3 | Cơ hội cho người mới học |
| D-2 (Cao học/Thạc sĩ) | TOPIK 4+ | IELTS 6.0+ cũng được chấp nhận |

⚠️ **LƯU Ý**: Nếu bạn đạt TOPIK 3 trở lên, bạn có thể vào thẳng chương trình đại học mà không cần qua D-4-1, tiết kiệm 6-12 tháng và hàng chục triệu đồng học phí.

**CHUYỂN ĐỔI VISA D-4-1 → D-2:**
• TOPIK 3+ là điều kiện BẮT BUỘC (hầu hết trường)
• TOPIK 4+ là LỢI THẾ — dễ được nhận vào trường top
• Học sinh có TOPIK 4 + chuyên cần >90% có tỉ lệ đậu chuyển đổi >95%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPIK & HỌC BỔNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOPIK càng cao, học bổng càng lớn. Đây là động lực mạnh nhất để học TOPIK!

| TOPIK | Học bổng trường thường | GKS | Ghi chú |
|-------|----------------------|-----|---------|
| 3 | 20-30% học phí | Khó | Cạnh tranh thấp |
| 4 | 30-50% học phí | Cạnh tranh được | Lợi thế rõ rệt |
| 5 | 50-70% học phí | Lợi thế lớn | Rất được ưu tiên |
| 6 | 70-100% học phí | Gần như chắc chắn | Tỉ lệ đậu rất cao |

📊 **THỐNG KÊ**: Học sinh có TOPIK 4+ tiết kiệm trung bình 30-50 triệu VND/năm học phí.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPIK & LÀM THÊM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Số giờ làm thêm được cấp phép phụ thuộc TRỰC TIẾP vào TOPIK:

| TOPIK | Giờ/tuần (D-4-1) | Giờ/tuần (D-2) | Ghi chú |
|-------|-----------------|----------------|---------|
| Không có | 10h | 15h | Hạn chế nghiêm ngặt |
| TOPIK 2+ | 20h | 25h | Đa số sinh viên |
| TOPIK 3+ | 25h | 25h (ĐH) / 30h (CH) | Lợi thế lớn |

📌 **MẸO**: Nếu chưa có TOPIK, bạn chỉ được làm 10h/tuần ≈ ~400,000-500,000 KRW/tháng. Có TOPIK 2+, bạn có thể làm 20h/tuần ≈ ~800,000-1,000,000 KRW/tháng — gấp đôi thu nhập!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPIK & VIỆC LÀM SAU TỐT NGHIỆP (E7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**E-7 Visa** là visa làm việc tại Hàn Quốc sau tốt nghiệp. TOPIK quyết định cơ hội việc làm:

| Ngành | TOPIK yêu cầu | Mức lương dự kiến |
|-------|--------------|------------------|
| Phiên dịch/Biên dịch | 6 (bắt buộc) | 2,500-4,000 USD/tháng |
| Thương mại quốc tế/Xuất NK | 4-5 | 2,000-3,000 USD/tháng |
| Kỹ thuật/CNTT | 3-4 | 2,500-4,000 USD/tháng |
| Giáo dục/Giảng dạy | 5 (ưu tiên) | 2,000-2,500 USD/tháng |
| Quản lý | 4-5 | 2,500-3,500 USD/tháng |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BẢNG THAM KHẢO LỘ TRÌNH TOPIK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Thời điểm | TOPIK | Lợi ích đạt được |
|-----------|-------|-----------------|
| Trước khi xin visa | 2+ | Tăng 15-25% tỉ lệ đậu visa |
| Học kỳ 1 (D-4-1) | 2-3 | Xin giấy phép làm thêm 20h/tuần |
| Học kỳ 2 (D-4-1) | 3-4 | Đủ điều kiện chuyển lên D-2 |
| Học kỳ 3 (D-2) | 4+ | Xin học bổng 30-50% |
| Năm 2 (D-2) | 5+ | Xin học bổng 50-70% + thực tập |
| Năm 3 (D-2) | 5-6 | Xin E7, ứng tuyển phiên dịch |

📌 **MẸO VÀNG**: Luôn đặt mục tiêu TOPIK cao hơn yêu cầu tối thiểu 1 cấp. Nếu trường yêu cầu TOPIK 3, hãy nhắm TOPIK 4. Sự khác biệt 1 cấp TOPIK có thể quyết định bạn có được học bổng hay không.

⚠️ **LƯU Ý**: Chứng chỉ TOPIK có hiệu lực 2 năm. Nếu sắp hết hạn, hãy thi lại để đảm bảo hồ sơ luôn hợp lệ. Với visa E-7, chứng chỉ TOPIK còn hạn là lợi thế cạnh tranh lớn khi phỏng vấn.
`
  },
];

// ═══════════════════════════════════════════════════════════
// KB_FAQ — 30+ câu hỏi thường gặp
// ═══════════════════════════════════════════════════════════

const KB_FAQ = [
  // ─── Visa ───
  {
    id: 'faq-1',
    category: 'visa',
    question: 'D-4-1 và D-2 khác nhau thế nào? Nên chọn loại nào?',
    answer: 'D-4-1 là visa học tiếng Hàn, thời hạn 6 tháng - 2 năm, yêu cầu tài chính $10,000+, không yêu cầu TOPIK đầu vào. Tỉ lệ đậu cao hơn. D-2 là visa đại học chính quy, thời hạn 1-2 năm/lần, yêu cầu TOPIK 3+ hoặc IELTS 5.5+, tài chính $10,000-$20,000. Nếu bạn chưa có TOPIK hoặc hồ sơ yếu, nên chọn D-4-1 trước rồi chuyển lên D-2 sau.'
  },
  {
    id: 'faq-2',
    category: 'visa',
    question: 'Cần bao nhiêu tiền trong sổ tiết kiệm? Sổ mở online có được không?',
    answer: 'D-4-1: $10,000 (~250 triệu VND). D-2: $10,000-$20,000 (tuỳ trường/khu vực). Sổ PHẢI mở tại quầy giao dịch — KHÔNG chấp nhận sổ online. Gửi kỳ hạn 12 tháng, mở trước 3-6 tháng. Kèm giấy xác nhận số dư cấp trong vòng 30 ngày. Lưu ý: tránh nạp tiền "sốc" 1 lần rồi lấy sao kê — ĐSQ sẽ nghi ngờ tiền đi mượn.'
  },
  {
    id: 'faq-3',
    category: 'process',
    question: 'Xử lý visa mất bao lâu? Nên nộp hồ sơ khi nào?',
    answer: 'Visa cá nhân: 13-20 ngày làm việc (không tính T7, CN, lễ). Qua công ty du lịch chỉ định: 6-9 ngày. Nên nộp hồ sơ trước ngày nhập học ít nhất 6-8 tuần. Mùa cao điểm (tháng 2-3 và 8-9) có thể kéo dài hơn. Lời khuyên: nộp càng sớm càng tốt trong khung thời gian cho phép.'
  },
  {
    id: 'faq-4',
    category: 'process',
    question: 'Nộp hồ sơ ở đâu? Có cần đặt lịch trước không?',
    answer: 'Nộp tại KVAC (Korea Visa Application Center). Hà Nội: Tầng 12, Discovery Complex, 302 Cầu Giấy — từ 06/04/2026 ĐÃ DỪNG đặt lịch online, đến trực tiếp lấy số thứ tự. TP.HCM: 253 Điện Biên Phủ, P. Xuân Hòa, Q.3 — vẫn đặt lịch online qua visaforkorea-hc.com. Lưu ý: mang theo ĐẦY ĐỦ bản gốc + bản photo các giấy tờ.'
  },
  {
    id: 'faq-5',
    category: 'documents',
    question: 'Giấy tờ dịch thuật có cần công chứng không? Quy trình thế nào từ 09/2026?',
    answer: 'CÓ. TRƯỚC 11/09/2026: (1) Dịch sang Hàn/Anh → (2) Công chứng bản dịch → (3) Chứng nhận tại MOFA/Sở Ngoại vụ → (4) Hợp pháp hóa tại ĐSQ Hàn Quốc (Hà Nội) hoặc LSQ (TP.HCM). TỪ 11/09/2026: Quy trình rút gọn — Sau khi công chứng, xin tem Apostille tại Cục Lãnh sự (Hà Nội, 44 Tràng Thi) hoặc Sở Ngoại vụ (TP.HCM, 6 Alexander De Rhodes). KHÔNG cần qua ĐSQ/LSQ nữa! Tiết kiệm 5-10 ngày và 300,000-500,000 VND.'
  },
  {
    id: 'faq-6',
    category: 'study-plan',
    question: 'Study Plan viết bằng tiếng gì? Dài bao nhiêu?',
    answer: 'Nên viết bằng tiếng Hàn (ưu tiên) hoặc tiếng Anh. D-4-1: 500-800 từ. D-2: 800-1200 từ. Nội dung cần: (1) Giới thiệu bản thân + lý do chọn Hàn Quốc, (2) Kế hoạch học tập CHI TIẾT theo từng giai đoạn có mốc thời gian, (3) Kế hoạch sau tốt nghiệp — thể hiện ý định về nước. TUYỆT ĐỐI tránh sao chép mẫu trên mạng. Sử dụng AI trong tab "Hồ sơ của tôi" để được hỗ trợ.'
  },
  {
    id: 'faq-7',
    category: 'finance',
    question: 'Người bảo lãnh không phải cha mẹ thì cần những gì?',
    answer: 'Cần: (1) Giấy cam kết bảo lãnh tài chính (có công chứng), (2) Giấy tờ chứng minh quan hệ với người bảo lãnh (VD: giấy khai sinh nếu là ông bà, xác nhận nhân khẩu nếu là cô dì chú bác), (3) Chứng minh thu nhập của người bảo lãnh. Quan trọng: cần giải trình rõ lý do tại sao cha mẹ không thể bảo lãnh — VD: cha mẹ làm nông, không có sao kê ngân hàng.'
  },
  {
    id: 'faq-8',
    category: 'visa',
    question: 'Trượt visa rồi có nộp lại được không? Bao lâu mới được nộp lại?',
    answer: 'CÓ, nhưng phải ĐỢI tối thiểu 3 tháng kể từ ngày bị từ chối. Quan trọng: KHÔNG nộp lại hồ sơ giống hệt — cần phân tích nguyên nhân trượt, khắc phục triệt để (viết lại Study Plan, bổ sung tài chính, giải trình rõ ràng), và viết giải trình về những thay đổi. Lời khuyên: nếu không chắc nguyên nhân, hãy nhờ chuyên gia tư vấn phân tích hồ sơ cũ.'
  },
  {
    id: 'faq-9',
    category: 'visa',
    question: 'Có bắt buộc phải phỏng vấn không? Nếu được phỏng vấn thì cần chuẩn bị gì?',
    answer: 'KHÔNG phải ai cũng bị gọi phỏng vấn. KVAC quyết định dựa trên hồ sơ. Chuẩn bị: (1) Học thuộc số liệu tài chính, tên trường, ngành học, (2) Trả lời bằng tiếng Hàn hoặc Anh, (3) NHẤT QUÁN với hồ sơ đã nộp, (4) Trang phục lịch sự, đến đúng giờ. Câu hỏi thường: mục đích du học, tài chính, kế hoạch tương lai. Xem bài chi tiết "Phỏng vấn visa Hàn Quốc" trong mục Visa.'
  },
  {
    id: 'faq-10',
    category: 'documents',
    question: 'Khám lao phổi ở đâu? Giấy có giá trị bao lâu?',
    answer: 'Khám tại bệnh viện được Đại sứ quán chỉ định. Hà Nội: BV Phổi Trung ương, BV Hồng Ngọc, Phòng khám Medlatec. TP.HCM: BV Chợ Rẫy, BV Phạm Ngọc Thạch, BV Thống Nhất, Trung tâm Y khoa Phước An (HEPA). ⚠️ DANH SÁCH THAY ĐỔI THƯỜNG XUYÊN — kiểm tra mục "Thông báo" trên website KVAC trước khi khám. Giấy có giá trị 3 tháng. Chi phí: 200,000-1,200,000 VND.'
  },
  {
    id: 'faq-11',
    category: 'schools',
    question: 'Nên chọn trường ở Seoul hay tỉnh? Trường nào dễ đậu visa hơn?',
    answer: 'Tuỳ vào hồ sơ của bạn. Seoul: chi phí cao hơn 30-50%, cạnh tranh cao hơn, nhưng nhiều cơ hội làm thêm và việc làm. Tỉnh: chi phí thấp hơn, TỈ LỆ ĐẬU VISA CAO HƠN (do yêu cầu từ trường và ĐSQ thấp hơn), môi trường yên tĩnh. Với hồ sơ yếu (GPA thấp, gap year dài, tài chính hạn chế), NÊN chọn trường tỉnh để tăng cơ hội đậu visa.'
  },
  {
    id: 'faq-12',
    category: 'finance',
    question: 'Sổ đóng băng K-Study là gì? Có bắt buộc không?',
    answer: 'K-Study là sổ tiết kiệm đóng băng mở tại Shinhan, Woori hoặc KEB Hana Bank (có chi nhánh tại Việt Nam). Số tiền: 8,000,000-10,000,000 KRW (~$6,000-$7,500) — tính bằng KRW, không phải USD. KHÔNG bắt buộc nhưng là điểm cộng lớn — ĐSQ Hàn Quốc ưu tiên cao hơn sổ tiết kiệm thường. Một số trường bắt buộc loại sổ này cho visa D-4-1. Số tiền bị đóng băng, không rút được trước kỳ hạn.'
  },
  {
    id: 'faq-13',
    category: 'process',
    question: 'Du học sinh có được làm thêm không? Quy định thế nào?',
    answer: 'CÓ, sau 6 tháng nhập cảnh. Cần xin giấy phép làm thêm (Part-time Work Permit) từ Immigration. Số giờ: có TOPIK 2+ → tối đa 25h/tuần (D-4-1), 25h/tuần (D-2 ĐH), 30h/tuần (D-2 Cao học). Chưa có TOPIK → chỉ 10h/tuần. Cuối tuần và kỳ nghỉ lễ không giới hạn. Mức lương tối thiểu 2025: 10,030 KRW/giờ; 2026: 10,320 KRW/giờ. Yêu cầu: chuyên cần >90%, GPA >= 2.0/4.5.'
  },
  {
    id: 'faq-14',
    category: 'study-plan',
    question: 'Study Plan dài bao nhiêu là đủ? Cần chú ý gì?',
    answer: 'Không cần dài nhưng phải CHI TIẾT và CÁ NHÂN HOÁ. D-4-1: 500-800 từ, D-2: 800-1200 từ. 3 điều Study Plan cần có: (1) Lý do chọn Hàn Quốc CỤ THỂ, (2) Kế hoạch học tập theo giai đoạn CÓ MỐC THỜI GIAN, (3) Kế hoạch sau tốt nghiệp THUYẾT PHỤC. Một Study Plan 500 từ hay với nội dung chi tiết còn hơn 2000 từ chung chung. KHÔNG sao chép mẫu trên mạng.'
  },
  {
    id: 'faq-15',
    category: 'documents',
    question: 'Hộ chiếu cần còn hạn bao lâu khi nộp visa?',
    answer: 'Cần còn hạn ít nhất 6 tháng tính từ ngày nộp hồ sơ visa. Ngoài ra, cần còn ít nhất 2 trang trống để dán visa và đóng/xuất nhập cảnh. Nếu hộ chiếu sắp hết hạn, hãy làm mới TRƯỚC khi bắt đầu làm hồ sơ du học — vì thời gian làm hộ chiếu mới có thể mất 1-2 tuần.'
  },
  {
    id: 'faq-16',
    category: 'visa',
    question: 'Tỉ lệ đậu visa thực tế là bao nhiêu? Làm sao để tăng cơ hội đậu?',
    answer: 'ĐSQ Hàn Quốc không công bố thống kê chính thức. D-4-1 thường có tỉ lệ đậu cao hơn D-2. Yếu tố tăng cơ hội: (1) Tài chính vững — sổ TK mở trước 6 tháng, có sao kê ổn định, (2) Study Plan cá nhân hoá, chi tiết, (3) Giấy tờ đầy đủ, không thiếu mục nào, (4) GPA trên 6.0, (5) Trình độ tiếng Hàn (TOPIK). Hồ sơ tốt → cơ hội đậu trên 85%. Hồ sơ yếu (GPA thấp, gap year dài, tài chính không rõ ràng, có người thân bất hợp pháp) → nguy cơ trượt cao hơn.'
  },
  {
    id: 'faq-17',
    category: 'schools',
    question: 'Không có TOPIK có xin được visa D-2 không?',
    answer: 'Rất KHÓ. Hầu hết trường yêu cầu TOPIK 3+ hoặc IELTS 5.5+ cho D-2. Một số trường chấp nhận hoàn thành khóa tiếng tại trường thay vì TOPIK, nhưng số này rất ít. Nếu chưa có TOPIK, lộ trình khuyến nghị: D-4-1 (học tiếng) → đạt TOPIK 3+ → chuyển lên D-2. Đây là lộ trình phổ biến và an toàn nhất.'
  },
  {
    id: 'faq-18',
    category: 'process',
    question: 'Khi nào nên bắt đầu làm hồ sơ du học Hàn Quốc?',
    answer: 'Nên bắt đầu TRƯỚC kỳ nhập học 4-6 tháng. Timeline gợi ý cho kỳ tháng 9: Tháng 2-3 → đánh giá hồ sơ, chọn trường. Tháng 3-4 → mở sổ TK, chuẩn bị giấy tờ. Tháng 5-6 → nộp đơn trường, nhận Admission. Tháng 7 → nộp hồ sơ visa. Tháng 8 → nhận visa. Tháng 9 → LÊN ĐƯỜNG! Cho kỳ tháng 3: dịch timeline sớm hơn 6 tháng.'
  },
  // ─── Thêm FAQ mới ───
  {
    id: 'faq-19',
    category: 'visa',
    question: 'Visa D-2-6 là gì? Khác gì với D-2-2?',
    answer: 'D-2-6 là visa dành cho sinh viên trao đổi (Exchange Student) theo các chương trình hợp tác giữa trường ĐH/CĐ tại Việt Nam và Hàn Quốc. Khác với D-2-2 (cử nhân): D-2-6 có thời hạn ngắn hơn (1-2 học kỳ), yêu cầu đầu vào thấp hơn (thường TOPIK 2 là đủ), và sau khi hoàn thành chương trình trao đổi, sinh viên có thể chuyển lên D-2-2 nếu muốn học tiếp. D-2-6 phù hợp với sinh viên muốn trải nghiệm môi trường học tập tại Hàn Quốc trước khi cam kết dài hạn.'
  },
  {
    id: 'faq-20',
    category: 'process',
    question: 'Có cần mua bảo hiểm du học không? Mua ở đâu?',
    answer: 'BẮT BUỘC. Từ tháng 3/2021, du học sinh tại Hàn Quốc phải tham gia Bảo hiểm Y tế Quốc gia (NHI). Phí: ~76,390 KRW/tháng (áp dụng mức giảm 50% cho du học sinh theo NHIS). Quyền lợi: hỗ trợ 50-80% chi phí khám chữa bệnh. Ngoài ra, một số trường yêu cầu bảo hiểm tư nhân bổ sung (khoảng 100,000-300,000 KRW/năm) cho các dịch vụ nha khoa, khám mắt...'
  },
  {
    id: 'faq-21',
    category: 'visa',
    question: 'Có người thân ở Hàn Quốc có ảnh hưởng đến hồ sơ xin visa không?',
    answer: 'CÓ, nhưng không nhất thiết là tiêu cực. Nếu người thân đang cư trú HỢP PHÁP và bạn khai báo rõ ràng, trung thực thì không vấn đề. Tuy nhiên, nếu có người thân CƯ TRÚ BẤT HỢP PHÁP, hồ sơ của bạn sẽ bị ảnh hưởng NẶNG — tỉ lệ trượt rất cao. NGUYÊN TẮC: Luôn khai báo trung thực. Nếu bị phát hiện che giấu, bạn có thể bị cấm visa vĩnh viễn.'
  },
  {
    id: 'faq-22',
    category: 'finance',
    question: 'Nên mở sổ tiết kiệm USD hay VND? Loại nào được chấp nhận?',
    answer: 'Sổ tiết kiệm USD được ưu tiên hơn vì ĐSQ Hàn Quốc yêu cầu chứng minh tài chính bằng ngoại tệ. Tuy nhiên, sổ VND cũng được chấp nhận nếu quy đổi ra USD đạt yêu cầu. Lưu ý: nếu mở sổ VND, cần có giấy xác nhận số dư bằng cả VND và USD (theo tỉ giá tại thời điểm cấp). Sổ đóng băng K-Study (bằng KRW) là lựa chọn tốt nhất — được ĐSQ ưu tiên cao nhất.'
  },
  {
    id: 'faq-23',
    category: 'process',
    question: 'Mang bao nhiêu tiền mặt khi sang Hàn Quốc lần đầu?',
    answer: 'Nên mang khoảng 500-1,000 USD tiền mặt (hoặc tương đương KRW) để trang trải các chi phí tuần đầu khi chưa mở được tài khoản ngân hàng. Số tiền mang theo người không nên vượt quá $10,000 (hoặc tương đương) — nếu trên $10,000, bạn phải khai báo hải quan. Mẹo: đổi trước một ít KRW ở Việt Nam (khoảng 200-300 USD) để dùng ngay khi đến sân bay, phần còn lại mang USD để đổi tại Hàn.'
  },
  {
    id: 'faq-24',
    category: 'documents',
    question: 'Cần photo bao nhiêu bộ giấy tờ khi nộp visa?',
    answer: 'Nên chuẩn bị 2-3 bộ photo cho tất cả giấy tờ. KVAC sẽ giữ bản gốc để đối chiếu và trả lại cho bạn. Một bộ nộp cho KVAC, một bộ dự phòng. Lưu ý: photo rõ ràng, không mờ. KVAC có dịch vụ photo nhưng giá cao hơn bên ngoài (thường 5,000-10,000 VND/trang). Nên photo sẵn trước khi đến.'
  },
  {
    id: 'faq-25',
    category: 'visa',
    question: 'Đã có visa du học Hàn Quốc rồi nhưng không đi được có sao không?',
    answer: 'Không sao, nhưng cần lưu ý: (1) Visa có thời hạn — nếu không nhập cảnh trong thời hạn đó, visa sẽ hết hiệu lực và bạn phải xin lại từ đầu, (2) Nếu đã xin visa nhưng không nhập cảnh, lần xin sau bạn cần giải trình lý do, (3) Nếu bạn đã nhập cảnh và về nước, visa vẫn còn hạn thì bạn có thể quay lại trong thời hạn visa. Lời khuyên: nếu chưa chắc chắn về kế hoạch, hãy đợi đến khi thực sự sẵn sàng mới nộp hồ sơ.'
  },
  {
    id: 'faq-26',
    category: 'schools',
    question: 'Có thể xin học bổng du học Hàn Quốc không? Điều kiện thế nào?',
    answer: 'CÓ. Các loại học bổng phổ biến: (1) Học bổng trường — dựa trên GPA và TOPIK, giảm 20-100% học phí, (2) Học bổng Chính phủ Hàn Quốc (GKS) — toàn phần, rất cạnh tranh, (3) Học bổng Viện King Sejong — cho sinh viên học tiếng Hàn. Điều kiện chung: GPA >= 7.0, TOPIK 4+, hoạt động ngoại khoá tốt. Lưu ý: học bổng thường áp dụng từ kỳ thứ 2 trở đi, sau khi đã chứng minh năng lực học tập.'
  },
  {
    id: 'faq-27',
    category: 'visa',
    question: 'Có thể chuyển từ visa du học D-2 sang visa làm việc E7 không? Điều kiện?',
    answer: 'CÓ. Sau khi tốt nghiệp chương trình đại học (D-2), bạn có thể chuyển sang visa E7 (visa làm việc chuyên nghiệp). Điều kiện: (1) Đã tốt nghiệp, (2) Có hợp đồng lao động với công ty Hàn Quốc, (3) Mức lương đáp ứng yêu cầu tối thiểu (thường 30 triệu KRW/năm+), (4) Ngành học phù hợp với công việc. Một số ngành như IT, Kỹ thuật, Kinh doanh có cơ hội E7 cao hơn các ngành khác.'
  },
  {
    id: 'faq-28',
    category: 'documents',
    question: 'Giấy tờ gốc có được trả lại sau khi nộp visa không?',
    answer: 'CÓ. Sau khi xét duyệt visa, KVAC trả lại tất cả giấy tờ gốc cho bạn (hộ chiếu, bằng cấp, sổ tiết kiệm, giấy khai sinh...). Chỉ có ảnh thẻ và đơn xin visa là được giữ lại. Nếu visa đậu, visa sẽ được dán vào hộ chiếu. Thời gian trả: sau 16+ ngày làm việc — cùng lúc với kết quả visa.'
  },
  {
    id: 'faq-29',
    category: 'study-plan',
    question: 'Viết Study Plan xong có nên nhờ người kiểm tra không?',
    answer: 'RẤT NÊN. Lý do: (1) Kiểm tra lỗi chính tả và ngữ pháp — lỗi nhỏ có thể gây ấn tượng xấu, (2) Kiểm tra tính nhất quán với hồ sơ — thông tin trong Study Plan phải khớp với các giấy tờ khác, (3) Kiểm tra tính thuyết phục — có thể nhờ bạn bè hoặc người thân đọc thử và cho ý kiến. Nếu có điều kiện, hãy nhờ người có kinh nghiệm du học hoặc chuyên viên tư vấn đọc và góp ý. Sử dụng AI trong tab "Hồ sơ của tôi" để kiểm tra và cải thiện Study Plan.'
  },
  {
    id: 'faq-30',
    category: 'process',
    question: 'Cần chuẩn bị những gì trong vali khi đi du học Hàn Quốc lần đầu?',
    answer: 'Vali cơ bản: (1) Giấy tờ: hộ chiếu, visa, thư nhập học, bản photo các giấy tờ quan trọng, ảnh thẻ (10-15 ảnh), (2) Quần áo: đồ mùa hè + mùa đông (áo ấm, áo khoác dày), (3) Đồ dùng cá nhân: đồ vệ sinh, thuốc men cơ bản, (4) Điện tử: laptop, sạc dự phòng, adapter chuyển đổi (Hàn Quốc dùng 2 chấu tròn), (5) Tiền mặt: ~500-1,000 USD. KHÔNG mang: thực phẩm tươi sống, thịt, trái cây (bị cấm nhập cảnh), đồ dùng quá cồng kềnh. Nên mang theo 1 bộ quần áo ấm ngay trong hành lý xách tay — vì khi đến Hàn có thể lạnh bất ngờ.'
  },

  {
    id: 'faq-31',
    category: 'study-plan',
    question: 'Phần Viết TOPIK II (câu 51-54) có khó không? Làm sao để đạt điểm cao?',
    answer: 'Phần Viết TOPIK II là phần KHÓ NHẤT. Cấu trúc: câu 51 (điền chỗ trống thư từ 10đ), câu 52 (điền chỗ trống văn bản học thuật 10đ), câu 53 (mô tả biểu đồ 30đ), câu 54 (bài luận 50đ). Mẹo: câu 53 học thuộc template mô tả tăng/giảm/so sánh. Câu 54 dùng cấu trúc 서론-본론-결론, viết 600-700 ký tự, dùng kính ngữ -ㅂ니다/습니다. Nên luyện viết ít nhất 2 bài/tuần.'
  },
  {
    id: 'faq-32',
    category: 'study-plan',
    question: 'Mất gốc tiếng Hàn, bao lâu thi được TOPIK 3? Cần học những gì?',
    answer: 'Từ mất gốc lên TOPIK 3 cần 6-12 tháng học tập trung (12-18h/tuần). Sách nên dùng: Korean Grammar in Use (ngữ pháp), Hot TOPIK (luyện đề), Master TOPIK (chuyên sâu). App: TOPIK One (luyện đề), Hàn Quốc 123 (từ vựng), Papago (dịch). Quan trọng nhất: luyện viết câu 53-54 ít nhất 2 lần/tuần.'
  },
  {
    id: 'faq-33',
    category: 'finance',
    question: 'TOPIK ảnh hưởng thế nào đến học bổng du học Hàn Quốc?',
    answer: 'TOPIK quyết định TRỰC TIẾP mức học bổng: TOPIK 3 → giảm 20-30% học phí. TOPIK 4 → giảm 30-50%. TOPIK 5 → giảm 50-70%. TOPIK 6 → giảm 70-100% (có trường miễn 100%). Với GKS, TOPIK 4+ là lợi thế cạnh tranh lớn. Nhiều trường có học bổng đầu vào riêng dựa trên TOPIK.'
  },
  {
    id: 'faq-34',
    category: 'documents',
    question: 'Cần TOPIK bao nhiêu để xin giấy phép làm thêm tại Hàn Quốc?',
    answer: 'Số giờ làm thêm phụ thuộc vào TOPIK. Không có TOPIK: tối đa 10h/tuần (D-4-1) hoặc 15h (D-2). Có TOPIK 2+: 20h (D-4-1) hoặc 25h (D-2). TOPIK 3+: 25h (D-4-1 và D-2). Với 20h/tuần, lương ~825,000 KRW/tháng (~18 triệu VND) ở mức lương tối thiểu 10,320 KRW/giờ. Yêu cầu khác: chuyên cần >90%, GPA >= 2.0/4.5.'
  },
  {
    id: 'faq-35',
    category: 'study-plan',
    question: 'TOPIK cần bao nhiêu để xin visa E7 ở lại làm việc tại Hàn?',
    answer: 'Visa E7 không yêu cầu TOPIK bắt buộc theo luật, nhưng THỰC TẾ TOPIK là yếu tố quyết định. Phiên dịch/Biên dịch: TOPIK 6 (bắt buộc). Thương mại quốc tế: TOPIK 4-5. Kỹ thuật/CNTT: TOPIK 3-4. Quản lý: TOPIK 4-5. TOPIK 4+ cũng là lợi thế khi xin thẻ cư trú vĩnh viễn (F-5). Chứng chỉ TOPIK có hiệu lực 2 năm.'
  },
];

// ═══════════════════════════════════════════════════════════
// MODULE STRUCTURE (giữ nguyên từ bản cũ, cập nhật chi tiết)
// ═══════════════════════════════════════════════════════════

const KB_MODULE_STRUCTURE = `
=== HỆ THỐNG MODULE HỒ SƠ (THEO LOẠI VISA) ===

**Visa D-4-1 (Khóa tiếng Hàn):**
  A1. Giấy tờ hành chính cá nhân — Đơn xin visa (điền Hàn/Anh), hộ chiếu, ảnh, CCCD, hộ khẩu, giấy khai sinh
  A2. Giấy tờ học vấn — Bằng THPT, học bạ, bảng điểm, dịch công chứng, giải trình gap (nếu có), chứng chỉ ngoại ngữ (nếu có)
  A3. Giấy tờ từ trường — Admission Letter, Certificate of Admission, Invoice học phí
  A4. Chứng minh tài chính — Sổ tiết kiệm $10,000+, giấy cam kết bảo lãnh, quan hệ bảo lãnh, sao kê 3-6 tháng
  A5. Study Plan / Personal Statement — 500-800 từ, cá nhân hoá, có mốc thời gian, AI hỗ trợ soạn thảo và chấm điểm
  A6. Nộp hồ sơ & theo dõi — KVAC, khám lao phổi, nộp hồ sơ, theo dõi kết quả, phí visa/phí dịch vụ

**Visa D-2 (Đại học chính quy):**
  — Yêu cầu cao hơn D-4-1: TOPIK 3+, GPA cao hơn, tài chính $10,000-$20,000
  — Thư giới thiệu: không bắt buộc từ ĐSQ (tuỳ trường)
  — Study Plan: 800-1200 từ, nêu rõ mục tiêu học tập và nghiên cứu
  — Phân loại (mới): D-2-1 (cao đẳng), D-2-2 (cử nhân), D-2-3 (thạc sĩ), D-2-4 (tiến sĩ), D-2-5 (nghiên cứu), D-2-6 (trao đổi), D-2-7 (học kết hợp làm việc)

**Chuyển đổi D4 → D2:**
  — Điều kiện: TOPIK 3+, chuyên cần >90%, tài chính 20-25tr KRW, hạn visa còn >1 tháng
  — Giấy tờ: ARC, hộ chiếu, bảng điểm khóa tiếng, admission letter, xác nhận số dư, TOPIK
  — Nộp tại Immigration Hàn Quốc (2-4 tuần), phí ~100,000-135,000 KRW
`;

const KB_ANALYSIS_FRAMEWORK = `
=== FRAMEWORK PHÂN TÍCH HỒ SƠ CÁ NHÂN HÓA (PHIÊN BẢN 2.0) ===

**1. Phân tích hồ sơ theo 6 nhóm:**
  • Nhân thân — Tuổi, quê quán, nơi cư trú, tình trạng hôn nhân, tiền án tiền sự
  • Học vấn — Trình độ, trường, GPA, năm tốt nghiệp, TOPIK, IELTS, chứng chỉ khác
  • Kinh nghiệm làm việc — Đã đi làm? Thời gian? HĐLĐ? BHXH? Chứng cứ cụ thể
  • Tài chính — Người bảo trợ, nghề nghiệp, thu nhập, tài sản, sổ tiết kiệm, sao kê
  • Lịch sử nhập cảnh — Đã từng xin visa? Trượt visa? Xuất cảnh đúng hạn? Vi phạm?
  • Gia đình — Người thân tại Hàn? Người thân cư trú bất hợp pháp? Tiền sử gia đình?

**2. Đánh giá từng nhóm (thang điểm 1-5):**
  Mỗi nhóm cần xác định: Điểm mạnh - Điểm yếu - Rủi ro - Điểm số - Chứng cứ còn thiếu - Hành động đề xuất

**3. Quyết định sau phân tích:**
  • Có nên nhận hồ sơ? • Có cần bổ sung? • Có cần giải trình?
  • Có cần đổi trường? • Có nên đổi kỳ nhập học? • Có nên học TOPIK trước?
  • Có nên tăng chứng minh tài chính? • Có nên đổi loại visa? • Có nên tư vấn chuyên sâu?

**4. Nguyên tắc sinh checklist:**
  — KHÔNG sinh checklist cố định cho mọi học sinh — mỗi hồ sơ là một cá thể riêng
  — Checklist được tạo dựa trên quyết định từ phân tích 6 nhóm
  — VD: Gap > 2 năm → cần giải trình + xác nhận công việc + HĐLĐ
  — VD: Trượt visa → cần phân tích nguyên nhân + hồ sơ cũ + giải trình bổ sung
  — VD: Người bảo lãnh không phải cha mẹ → cần giấy cam kết + giấy tờ quan hệ + giải trình
  — VD: Tuổi cao (>28) → cần lý do du học hợp lý, lộ trình nghề nghiệp rõ ràng
`;

const KB_STUDY_PLAN_QUESTIONS = `
=== KHUNG CÂU HỎI CÁ NHÂN HÓA STUDY PLAN (8 CÂU) ===
(Khi viết Study Plan, hãy giúp học sinh trả lời 8 câu hỏi sau một cách CHI TIẾT NHẤT)

1. Vì sao bạn chọn du học Hàn Quốc (không phải nước khác)? Hãy kể 3 lý do cụ thể.
2. Vì sao chọn trường này / thành phố này? Nghiên cứu gì về trường trước khi chọn?
3. Bạn học ngành gì, ngành đó liên quan gì đến định hướng nghề nghiệp?
4. Kế hoạch học tập cụ thể theo từng giai đoạn (6 tháng, 1 năm, 2 năm...)? Có mốc thời gian không?
5. Bạn có kế hoạch gì sau khi tốt nghiệp (về nước / ở lại làm việc)? Chi tiết cụ thể?
6. Có khoảng trống thời gian sau tốt nghiệp không? Nếu có, trong khoảng đó đã làm gì?
7. Gia đình/người bảo lãnh có nghề nghiệp, thu nhập ổn định thế nào? Số liệu cụ thể?
8. Bạn đã học tiếng Hàn/Anh đến trình độ nào? Có chứng chỉ gì? Kế hoạch thi TOPIK khi nào?
`;

const KB_DOCUMENT_DECISION_RULES = `
=== LOGIC QUYẾT ĐỊNH GIẤY TỜ THEO HỒ SƠ (CÁ NHÂN HÓA) ===
(Không áp dụng checklist cố định — suy luận dựa trên đặc điểm học sinh)

• Nếu Gap Year > 2 năm → Cần: Giải trình khoảng thời gian (chi tiết từng tháng) + Xác nhận công việc + HĐLĐ
• Nếu từng trượt visa → Cần: Phân tích nguyên nhân trượt + Hồ sơ cũ + Giải trình bổ sung (đã khắc phục gì)
• Nếu bảo lãnh không phải tự thân → Cần: Giấy cam kết bảo lãnh (công chứng) + Giấy tờ quan hệ + Giải trình lý do
• Nếu có người thân tại Hàn → Cần: Khai báo rõ ràng — họ tên, quan hệ, visa, nơi ở — tránh nghi ngờ
• Nếu học lực thấp (GPA < 5.0) → Cần: Giải trình học tập (nguyên nhân) + cam kết cải thiện + học thêm
• Nếu tuổi cao (> 28) → Cần: Lý do du học hợp lý, lộ trình nghề nghiệp rõ, chứng minh kinh nghiệm làm việc
• Nếu có người thân bất hợp pháp tại Hàn → Cần: Khai báo trung thực, giải trình mối quan hệ không ảnh hưởng
• Nếu tài chính yếu (< $10,000) → Cần: Bổ sung sổ K-Study, tài sản đảm bảo (sổ đỏ, nhà đất), người bảo lãnh phụ
`;

const KB_FOR_CHAT = `
=== KIẾN THỨC NỀN TẢNG XỬ LÝ HỒ SƠ ===

${KB_MODULE_STRUCTURE}
${KB_ANALYSIS_FRAMEWORK}
${KB_STUDY_PLAN_QUESTIONS}

=== NGUYÊN TẮC XỬ LÝ HỒ SƠ ===
1. KHÔNG có bộ hồ sơ chung — mọi quyết định đều dựa trên phân tích cá nhân
2. Tài chính là yếu tố quan trọng nhất (~40% lý do trượt)
3. Study Plan là cơ hội để bù đắp điểm yếu — đầu tư thời gian viết kỹ
4. Tính nhất quán giữa các giấy tờ là yếu tố then chốt
5. Mỗi học sinh là một cá thể riêng — không áp dụng công thức cứng
`.trim();

const KB_FOR_STUDY_PLAN = `
=== KHUNG ĐỂ VIẾT STUDY PLAN CHẤT LƯỢNG ===

${KB_STUDY_PLAN_QUESTIONS}

Các bước phân tích trước khi viết:
1. Xác định đặc điểm học sinh (học lực, tiếng Hàn, kinh nghiệm, tài chính, visa, gap year, trượt visa)
2. Xác định rủi ro cần giải trình (gap year, trượt visa, tuổi cao, GPA thấp, người thân tại Hàn)
3. Xây dựng cấu trúc: Mở đầu (150-200 từ) → Nội dung chính theo giai đoạn (400-700 từ) → Kết luận (150-200 từ)
4. Đảm bảo Study Plan trả lời được: tại sao Hàn Quốc, tại sao trường này, kế hoạch cụ thể, tương lai sau tốt nghiệp
5. Kiểm tra: cá nhân hoá chưa? có mốc thời gian không? có thể hiện ý định về nước không?
`;

const KB_FOR_GAP = `
=== PHÂN TÍCH GAP YEAR (CHUYÊN SÂU) ===

Khi phân tích gap year, hãy xem xét:
• Thời gian gap dài bao lâu? (dưới 6 tháng, 1 năm, 2 năm, trên 2 năm)
• Trong gap đã làm gì? (học ngoại ngữ, đi làm chính thức, làm tự do, chờ điều kiện, lý do sức khoẻ)
• Có chứng cứ gì cho hoạt động trong gap? (HĐLĐ, chứng chỉ, xác nhận công việc, giấy tờ)
• Gap có ảnh hưởng đến động lực du học không? (gap càng dài càng cần giải trình kỹ)
• Gap có hợp lý với hoàn cảnh gia đình/cá nhân không?

CÁC GIẢI TRÌNH TỐT:
• "Đi làm tích luỹ kinh nghiệm và kinh phí du học" — có HĐLĐ, sao kê lương
• "Học thêm ngoại ngữ (tiếng Hàn/Anh)" — có chứng chỉ, bảng điểm
• "Chờ điều kiện nhập học / thi lại" — có giấy tờ chứng minh

⚠️ TUYỆT ĐỐI KHÔNG dùng lý do tài chính gia đình khó khăn để giải thích gap — điều này tự thú nhận rằng bạn không đủ tiền du học!
`;

const KB_FOR_REJECTION = `
=== PHÂN TÍCH HỒ SƠ TRƯỢT VISA (TOÀN DIỆN) ===

Khi phân tích hồ sơ trượt visa, cần:

1. Xác định nguyên nhân trượt từ lý do cụ thể (hoặc suy luận từ hồ sơ):
   • Thiếu giấy tờ tài chính (~40%) — sổ TK mới, không có sao kê, tiền nạp "sốc"
   • Study Plan chung chung (~30%) — không cá nhân hoá, không mốc thời gian
   • Không chứng minh được mối quan hệ (~15%)
   • Học lực không đáp ứng (~10%)
   • Lý do khác (~5%) — tuổi cao, gap year, người thân bất hợp pháp, lịch sử visa xấu

2. Đề xuất cải thiện tương ứng theo từng nguyên nhân:
   • Thiếu tài chính → Mở sổ mới, duy trì 3-6 tháng, bổ sung sao kê, sổ K-Study
   • Study Plan chung chung → Viết lại HOÀN TOÀN, chi tiết, có mốc thời gian, cá nhân hoá
   • Quan hệ không rõ → Bổ sung giấy tờ quan hệ, giải trình rõ ràng
   • Học lực → Cải thiện GPA, học thêm, thi TOPIK/IELTS
   • Gap year → Bổ sung giải trình chi tiết + chứng cứ

3. Viết giải trình hồ sơ mới:
   • Phân tích lý do trượt (thừa nhận thiếu sót)
   • Trình bày những thay đổi và cải thiện cụ thể
   • Cam kết hồ sơ lần này đã hoàn chỉnh hơn
   • Thể hiện thiện chí và quyết tâm du học chân chính
`;

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
