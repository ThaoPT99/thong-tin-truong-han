#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Insert 3 new TOPIK articles and 5 FAQs into lib/knowledge-base.js"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

FILE = 'lib/knowledge-base.js'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Insert 3 new TOPIK articles before closing of KB_ARTICLES
# The marker: end of process-hikorea article, before the ]; of KB_ARTICLES
idx = content.find("nếu không nộp kịp, đơn sẽ bị huỷ và bạn phải nộp lại từ đầu.")
print(f"Found article marker at {idx}")

# Find the closing ]; of KB_ARTICLES after this
close_arr = content.find("];", idx)
print(f"KB_ARTICLES close at {close_arr}")

# Build new articles
SEP = "\u2501" * 46  # ━━━ string

ARTICLE_1 = f"""
  // ═══════════════════════════════════════════
  // TOPIK ARTICLES (3 articles)
  // ═══════════════════════════════════════════

  {{
    id: 'topik-writing',
    category: 'study-plan',
    title: 'TOPIK Writing (쓰기) — Cẩm nang chiến thuật đạt điểm cao Câu 51-54',
    summary: 'Hướng dẫn chi tiết từng câu trong phần Viết TOPIK II: cấu trúc, template, mẹo đạt TOPIK 5-6. Bao gồm câu 53 biểu đồ và câu 54 bài luận.',
    tags: ['TOPIK', 'viết', '쓰기', 'writing', 'câu 54', 'biểu đồ', 'bài luận'],
    content: `Phần Viết (쓰기) là phần KHÓ NHẤT trong TOPIK II nhưng cũng là phần quyết định bạn đạt TOPIK 5-6 hay chỉ dừng ở 3-4. Nhiều thí sinh được 80-90/100 điểm Đọc và Nghe nhưng chỉ được 30-40/100 điểm Viết.

{SEP}
TỔNG QUAN VỀ TOPIK WRITING
{SEP}

| Câu | Nội dung | Điểm | Thời gian khuyến nghị | Độ khó |
|-----|----------|------|----------------------|--------|
| 51 | Điền vào chỗ trống (thư/email/ghi chú) | 10 | 3-5 phút | ⭐ |
| 52 | Điền vào chỗ trống (văn bản học thuật) | 10 | 3-5 phút | ⭐⭐ |
| 53 | Mô tả biểu đồ (200-300 ký tự) | 30 | 10-12 phút | ⭐⭐⭐ |
| 54 | Bài luận xã hội (600-700 ký tự) | 50 | 28-32 phút | ⭐⭐⭐⭐⭐ |

⚠️ **LƯU Ý**: Câu 53 và 54 chiếm 80/100 điểm Viết. Đây là nơi tạo khác biệt giữa TOPIK 4 (viết 40-50đ) và TOPIK 5-6 (viết 60-80đ).

{SEP}
CÂU 51: ĐIỀN VÀO CHỖ TRỐNG (10 điểm)
{SEP}

• Dạng bài: Email, tin nhắn, ghi chú, lịch trình — còn 1-2 chỗ trống cần điền
• Mục tiêu: Hoàn thành câu phù hợp ngữ cảnh, đúng văn phong (반말 hoặc 존댓말)
• Lưu ý: ĐỂ Ý **kính ngữ** — nếu là thư gửi sếp/người lớn tuổi, phải dùng đuôi -습니다/ㅂ니다

📌 **MẸO**: Đọc kỹ ngữ cảnh trước khi điền. Nếu câu trước dùng 반말, bạn phải dùng 반말. Nếu câu trước là 존댓말, bạn phải dùng 존댓말.

{SEP}
CÂU 52: ĐIỀN VÀO CHỖ TRỐNG (10 điểm)
{SEP}

• Dạng bài: Văn bản học thuật/báo chí — điền 2-3 chỗ trống với cấu trúc ngữ pháp phức tạp
• Mục tiêu: Sử dụng đúng ngữ pháp trung-cao cấp
• Các cấu trúc hay gặp:
  • -(으)ㄹ 뿐만 아니라 (không những... mà còn)
  • -는 데 반해 (trong khi... thì...)
  • -기 마련이다 (đương nhiên là...)
  • -(으)로 인해 (do... mà...)
  • -는 한 (miễn là... / trong phạm vi...)

{SEP}
CÂU 53: MÔ TẢ BIỂU ĐỒ (30 điểm)
{SEP}

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

{SEP}
CÂU 54: BÀI LUẬN XÃ HỘI (50 điểm)
{SEP}

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
  }},
"""

ARTICLE_2 = f"""
  {{
    id: 'topik-prep',
    category: 'study-plan',
    title: 'Lộ trình ôn TOPIK từ A-Z — Sách, App, Lịch học & Chiến thuật thi',
    summary: 'Lộ trình ôn TOPIK từ 0 đến 6: sách, app, lịch học hàng ngày, chiến thuật thi cho từng cấp độ.',
    tags: ['TOPIK', 'ôn thi', 'lộ trình', 'sách', 'app', 'chiến thuật'],
    content: `Luyện thi TOPIK không khó nếu bạn có lộ trình đúng. Dưới đây là lộ trình chi tiết cho từng cấp độ.

{SEP}
LỘ TRÌNH THEO THÁNG
{SEP}

| Cấp độ hiện tại | Mục tiêu | Thời gian | Giờ học/tuần |
|----------------|----------|-----------|--------------|
| 0 → TOPIK 2 | Giao tiếp cơ bản | 3-6 tháng | 10-15h |
| TOPIK 2 → 3 | Trung cấp | 3-6 tháng | 12-18h |
| TOPIK 3 → 4 | Trung cấp cao | 4-8 tháng | 15-20h |
| TOPIK 4 → 5 | Cao cấp | 6-12 tháng | 15-20h |
| TOPIK 5 → 6 | Cao cấp | 6-12 tháng | 20h+ |

{SEP}
SÁCH LUYỆN THI TOP 2026
{SEP}

| Sách | Phù hợp | Mục đích |
|------|---------|----------|
| Hot TOPIK (1-2-3) | Sơ-Trung cấp | Luyện đề |
| Master TOPIK | Trung-Cao cấp | Chuyên sâu |
| Korean Grammar in Use | Mọi trình độ | Ngữ pháp |
| TOPIK II 한권이면 OK | Trung-Cao | Tổng hợp |
| Sách đề thi thử TOPIK | Mọi trình độ | Làm đề |

📌 **MẸO**: Hot TOPIK phù hợp làm quen đề thi. Master TOPIK phù hợp ôn chuyên sâu từng kỹ năng. Korean Grammar in Use là sách GỐC — nên có dù ở trình độ nào.

{SEP}
APP HỖ TRỢ ÔN THI
{SEP}

| App | Chức năng | Nên dùng khi |
|-----|-----------|-------------|
| TOPIK One | Luyện đề TOPIK đầy đủ | Hàng ngày |
| Hàn Quốc 123 | Học từ vựng + ngữ pháp | Hàng ngày |
| Papago | Dịch Hàn-Việt | Kiểm tra viết |
| Mirinae | Phân tích ngữ pháp | Học sâu |
| Memrise | Học từ vựng | Trên xe bus/tàu |
| Cake | Luyện giao tiếp + từ vựng | Giải trí |

{SEP}
LỊCH HỌC MẪU (15h/tuần)
{SEP}

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

{SEP}
CHIẾN THUẬT THEO TỪNG KỸ NĂNG
{SEP}

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

{SEP}
CHIẾN THUẬT TRONG PHÒNG THI
{SEP}

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
  }},
"""

ARTICLE_3 = f"""
  {{
    id: 'topik-career',
    category: 'study-plan',
    title: 'TOPIK & Lộ trình sự nghiệp — Visa, Học bổng, Việc làm & E7',
    summary: 'TOPIK ảnh hưởng thế nào đến visa D-4-1/D-2, học bổng GKS/trường, giờ làm thêm, visa E7 và cơ hội việc làm.',
    tags: ['TOPIK', 'sự nghiệp', 'visa', 'học bổng', 'E7', 'làm thêm'],
    content: `TOPIK không chỉ là chứng chỉ tiếng Hàn — nó ảnh hưởng TRỰC TIẾP đến hầu hết các khía cạnh của cuộc sống du học sinh tại Hàn Quốc: từ loại visa bạn có thể xin, đến học bổng bạn nhận được, giờ làm thêm và cơ hội việc làm sau tốt nghiệp.

{SEP}
TOPIK & VISA
{SEP}

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

{SEP}
TOPIK & HỌC BỔNG
{SEP}

TOPIK càng cao, học bổng càng lớn. Đây là động lực mạnh nhất để học TOPIK!

| TOPIK | Học bổng trường thường | GKS | Ghi chú |
|-------|----------------------|-----|---------|
| 3 | 20-30% học phí | Khó | Cạnh tranh thấp |
| 4 | 30-50% học phí | Cạnh tranh được | Lợi thế rõ rệt |
| 5 | 50-70% học phí | Lợi thế lớn | Rất được ưu tiên |
| 6 | 70-100% học phí | Gần như chắc chắn | Tỉ lệ đậu rất cao |

📊 **THỐNG KÊ**: Học sinh có TOPIK 4+ tiết kiệm trung bình 30-50 triệu VND/năm học phí.

{SEP}
TOPIK & LÀM THÊM
{SEP}

Số giờ làm thêm được cấp phép phụ thuộc TRỰC TIẾP vào TOPIK:

| Trình độ | D-4-1 (sau 6 tháng) | D-2 ĐH | D-2 Cao học |
|----------|---------------------|--------|-------------|
| Chưa đạt chuẩn TOPIK | 10h | 10h | 15h |
| TOPIK 2+ (D-4-1) | 20h (trường chuẩn: 25h) | — | — |
| TOPIK 3+ (D-2 ĐH) | — | 20h (trường chuẩn: 25h) | — |
| TOPIK 4+ (D-2 CH) | — | — | 30h |

📌 **MẸO**: Chưa đạt chuẩn TOPIK, bạn chỉ được làm 10h/tuần ≈ ~400,000-500,000 KRW/tháng. Đạt chuẩn (TOPIK 2+ với D-4-1, TOPIK 3+ với D-2), bạn có thể làm 20-25h/tuần ≈ ~800,000-1,000,000 KRW/tháng — gấp đôi thu nhập!

{SEP}
TOPIK & VIỆC LÀM SAU TỐT NGHIỆP (E7)
{SEP}

**E-7 Visa** là visa làm việc tại Hàn Quốc sau tốt nghiệp. TOPIK quyết định cơ hội việc làm:

| Ngành | TOPIK yêu cầu | Mức lương dự kiến |
|-------|--------------|------------------|
| Phiên dịch/Biên dịch | 6 (bắt buộc) | 2,500-4,000 USD/tháng |
| Thương mại quốc tế/Xuất NK | 4-5 | 2,000-3,000 USD/tháng |
| Kỹ thuật/CNTT | 3-4 | 2,500-4,000 USD/tháng |
| Giáo dục/Giảng dạy | 5 (ưu tiên) | 2,000-2,500 USD/tháng |
| Quản lý | 4-5 | 2,500-3,500 USD/tháng |

{SEP}
BẢNG THAM KHẢO LỘ TRÌNH TOPIK
{SEP}

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
  }},
"""

# Insert articles
new_content = content[:close_arr] + ARTICLE_1 + ARTICLE_2 + ARTICLE_3 + content[close_arr:]

# Step 2: Find FAQ section and add 5 new FAQs
faq_idx = new_content.find("// KB_FAQ")
faq_close = new_content.find("];", faq_idx)
print(f"FAQ close at {faq_close}")

NEW_FAQS = """
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
    answer: 'Số giờ làm thêm phụ thuộc vào TOPIK theo quy định Bộ Tư pháp: D-4-1 sau 6 tháng cần TOPIK 2 → 20h/tuần (trường đạt chuẩn 25h); D-2 ĐH cần TOPIK 3 → 20h (trường đạt chuẩn 25h); D-2 Cao học cần TOPIK 4 → 30h. Chưa đạt chuẩn → 10h/tuần (D-4-1, D-2) hoặc 15h (cao học). Với 20h/tuần, lương ~825,000 KRW/tháng (~18 triệu VND) ở mức lương tối thiểu 10,320 KRW/giờ. Yêu cầu khác: D-4-1 chuyên cần >90%; D-2 GPA >= 2.0/4.5.'
  },
  {
    id: 'faq-35',
    category: 'study-plan',
    question: 'TOPIK cần bao nhiêu để xin visa E7 ở lại làm việc tại Hàn?',
    answer: 'Visa E7 không yêu cầu TOPIK bắt buộc theo luật, nhưng THỰC TẾ TOPIK là yếu tố quyết định. Phiên dịch/Biên dịch: TOPIK 6 (bắt buộc). Thương mại quốc tế: TOPIK 4-5. Kỹ thuật/CNTT: TOPIK 3-4. Quản lý: TOPIK 4-5. TOPIK 4+ cũng là lợi thế khi xin thẻ cư trú vĩnh viễn (F-5). Chứng chỉ TOPIK có hiệu lực 2 năm.'
  },
"""

final_content = new_content[:faq_close] + NEW_FAQS + new_content[faq_close:]

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("SUCCESS!")
import os
print(f"File size: {os.path.getsize(FILE)} bytes")
