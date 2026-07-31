#!/usr/bin/env python3
# Add 4 new articles and 6 new FAQs to knowledge base
import sys

with open('lib/knowledge-base.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ── Add 4 new articles before KB_FAQ ──
articles_marker = 'hãy bắt đầu với D-4-1 (học tiếng). Trong thời gian học tiếng, bạn có thể tìm hiểu và quyết định ngành sẽ học khi lên D-2.'
articles_idx = content.find(articles_marker)
if articles_idx == -1:
    print("ERROR: Could not find articles marker")
    sys.exit(1)

# Find the closing ]; of KB_ARTICLES after this marker
closing = content.find('];', articles_idx)
if closing == -1:
    print("ERROR: Could not find closing ];")
    sys.exit(1)

# Add position 1 after the content ends, right before ];
# The pattern before ]; is:   `\n  },\n];
# So we insert after the last `\n  },\n and before ];
insert_pos = closing  # insert before ];

new_articles = ''',
  {
    id: 'topik-guide',
    category: 'study-plan',
    title: 'TOPIK — Cẩm nang toàn tập: Lịch thi, Cách đăng ký, Cấp độ & Mẹo ôn thi 2026',
    summary: 'Hướng dẫn chi tiết về kỳ thi TOPIK: lịch thi 2026 tại Việt Nam, các cấp độ 1-6, cách đăng ký, lệ phí, mẹo ôn thi.',
    tags: ['TOPIK', 'thi', 'tiếng Hàn', 'cấp độ', 'chứng chỉ'],
    content: `TOPIK (Test of Proficiency in Korean) là kỳ thi đánh giá năng lực tiếng Hàn chuẩn quốc tế, do Viện Giáo dục Quốc tế Quốc gia Hàn Quốc (NIIED) tổ chức.

CÁC CẤP ĐỘ TOPIK 1-6
| Cấp độ | Phân loại | Mô tả năng lực |
|--------|-----------|----------------|
| 1 | TOPIK I (Sơ cấp) | Kỹ năng sống cơ bản: tự giới thiệu, mua sắm, gọi món |
| 2 | TOPIK I (Sơ cấp) | Giao tiếp hàng ngày: gọi điện, hỏi đường, sử dụng tiện ích công cộng |
| 3 | TOPIK II (Trung cấp) | Tự lập trong sinh hoạt, giao tiếp chủ đề xã hội quen thuộc |
| 4 | TOPIK II (Trung cấp) | Sử dụng tiện ích công cộng, hiểu tin tức, tham gia hoạt động xã hội |
| 5 | TOPIK II (Cao cấp) | Công việc chuyên môn, hiểu chủ đề trừu tượng |
| 6 | TOPIK II (Cao cấp) | Thông thạo như người bản ngữ, giao tiếp chuyên nghiệp |

LỊCH THI TOPIK 2026 TẠI VIỆT NAM (theo IIG Vietnam)
| Đợt | Loại | Ngày thi | Địa điểm |
|-----|------|----------|----------|
| IBT 12 | IBT | 21/03/2026 | Hà Nội, TP.HCM |
| PBT 105 | PBT | 12/04/2026 | Hà Nội, TP.HCM |
| PBT 106 | PBT | 17/05/2026 | Hà Nội, TP.HCM |
| IBT 13 | IBT | 13/06/2026 | Hà Nội, TP.HCM |
| PBT 107 | PBT | 05/07/2026 | Hà Nội, TP.HCM |
| IBT 14 | IBT | 12/09/2026 | Hà Nội, TP.HCM |
| PBT 108 | PBT | 18/10/2026 | Hà Nội, TP.HCM |
| PBT 109 | PBT | 15/11/2026 | Hà Nội, TP.HCM |
PBT = Paper-Based Test. IBT = Internet-Based Test. Đăng ký tại online.iigvietnam.com, hạn đóng 4-6 tuần trước thi.

CẤU TRÚC BÀI THI & ĐIỂM ĐẬU
| Phần | TOPIK I | TOPIK II |
|------|---------|----------|
| Đọc | 30 câu, 40 phút | 50 câu, 70 phút |
| Nghe | 30 câu, 40 phút | 50 câu, 60 phút |
| Viết | — | 4 câu (2 điền + 2 luận), 50 phút |
| Điểm tối đa | 200 | 300 |
| Đậu TOPIK 1/2 | 80/140+ | — |
| Đậu TOPIK 3/4/5/6 | — | 120/150/190/230+ |

HIỆU LỰC: 2 năm từ ngày công bố. TOPIK 3+ cho visa D-2, 4+ cho học bổng 50-100%, 5-6 cho E7 và phiên dịch.

MẸO ÔN: Bắt đầu 3 tháng trước. Mỗi ngày 30-50 từ vựng. Làm 5+ đề thi thử. Xem KBS News, YouTube Hàn. Đọc Naver, webtoon. Luyện viết 2 bài/tuần (phần khó nhất). App TOPIK One, Han Quoc 123. Sách Hot TOPIK, Master TOPIK.
`
  },
  {
    id: 'finance-scholarship',
    category: 'finance',
    title: 'Học bổng du học Hàn Quốc 2026 — GKS, Học bổng trường & Cách apply',
    summary: 'Tổng hợp học bổng du học Hàn Quốc: GKS toàn phần, học bổng TOPIK, học bổng GPA. Điều kiện, hồ sơ, thời hạn.',
    tags: ['học bổng', 'GKS', 'tài chính', 'TOPIK', 'apply'],
    content: `Học bổng giúp giảm gánh nặng tài chính khi du học Hàn Quốc.

GKS (GLOBAL KOREA SCHOLARSHIP) — HỌC BỔNG CHÍNH PHỦ TOÀN PHẦN
Do NIIED cấp, gồm: 100% học phí + sinh hoạt phí ~1,000,000 KRW/tháng + vé máy bay + bảo hiểm + phí định cư.
GKS-U (ĐH): dưới 25 tuổi, GPA 6.5+. GKS-G (Sau ĐH): dưới 40 tuổi, GPA 7.0+, ưu tiên TOPIK 4+.
Nộp: GKS-G tháng 2, GKS-U tháng 9. Tỉ lệ cạnh tranh ~5-10%. Chi tiết: studyinkorea.go.kr.

HỌC BỔNG TRƯỜNG THEO TOPIK & GPA
| Loại | Giảm | Điều kiện |
|------|------|-----------|
| TOPIK 3 | 20-30% | TOPIK 3, GPA 6.0+ |
| TOPIK 4 | 30-50% | TOPIK 4, GPA 6.5+ |
| TOPIK 5 | 50-70% | TOPIK 5, GPA 7.0+ |
| TOPIK 6 | 70-100% | TOPIK 6, GPA 7.5+ |
| GPA kỳ trước | 20-100% | GPA 3.0-4.5/4.5 |
Áp dụng từ kỳ thứ 2. Một số trường có học bổng đầu vào theo TOPIK.

HỌC BỔNG KING SEJONG: khoá học tiếng Hàn ngắn hạn tại Hàn Quốc.

CÁCH APPLY: Xem Scholarship trên website trường. Chuẩn bị GPA, TOPIK, hoạt động ngoại khoá, thư giới thiệu. Viết Personal Statement + Study Plan xuất sắc. Nộp đúng hạn.
`
  },
  {
    id: 'process-daily-life',
    category: 'process',
    title: 'Cuộc sống du học sinh tại Hàn Quốc — Ứng dụng, Giao thông, Nhà ở & Mẹo sống',
    summary: 'Hướng dẫn cuộc sống tại Hàn Quốc: ứng dụng cần thiết, T-money, nhà ở (goshiwon/share house/one-room), mẹo tiết kiệm.',
    tags: ['cuộc sống', 'Hàn Quốc', 'ứng dụng', 'nhà ở', 'T-money'],
    content: `Cuộc sống du học sinh tại Hàn Quốc có nhiều khác biệt văn hoá.

ỨNG DỤNG CẦN THIẾT
- KakaoTalk: QUAN TRỌNG NHẤT, ai cũng dùng để nhắn tin, gọi điện, thanh toán
- Naver Map / KakaoMap: chính xác hơn Google Maps tại Hàn Quốc
- Papago: dịch Hàn-Việt tốt nhất
- Baedal Minjok (Baemin): giao đồ ăn số 1
- Coupang: mua sắm online giao siêu tốc (Rocket Delivery)
- Kakao T: gọi taxi dễ dàng
Google Maps hoạt động rất hạn chế tại Hàn. Cài Naver Map NGAY KHI ĐẾN!

GIAO THÔNG
T-money: mua tại GS25/CU/7-Eleven (~2,500 KRW). Dùng cho tàu điện, bus, taxi.
LUÔN quẹt thẻ khi lên VÀ khi xuống để được giảm giá chuyển tuyến (30 phút, ban đêm 1 giờ).
Giá: tàu ~1,400 KRW, bus 1,200-2,000 KRW, taxi mở cửa 3,800 KRW.

NHÀ Ở
| Loại | Cọc | Thuê/tháng | Phù hợp |
|------|-----|-----------|---------|
| Goshiwon | Thấp | 250k-600k KRW | Kinh tế, ngắn hạn |
| Share House | TB | 350k-800k KRW | Kết bạn |
| One-Room | Cao (5-20tr) | 400k-1tr+ KRW | Dài hạn |
| KTX trường | Thấp | 300k-1.5tr KRW | Ban đầu |
MẸO: Tuần đầu ở goshiwon/KTX. KHÔNG thuê khi chưa xem trực tiếp. Nấu ăn tại nhà tiết kiệm 50-60%.

MẸO KHÁC: Adapter chuyển đổi 2 chấu tròn (loại C/F). Sim du học ~30,000-50,000 KRW/tháng.
`
  },
  {
    id: 'process-hikorea',
    category: 'process',
    title: 'Hướng dẫn sử dụng Hi Korea Portal — Đặt lịch Immigration & Dịch vụ online',
    summary: 'Hướng dẫn Hi Korea (www.hikorea.go.kr): đăng ký, đặt lịch Immigration, gia hạn visa, xin giấy phép làm thêm.',
    tags: ['Hi Korea', 'hikorea', 'Immigration', 'đặt lịch', 'online'],
    content: `Hi Korea (www.hikorea.go.kr) là cổng dịch vụ công trực tuyến của Immigration Hàn Quốc.

ĐĂNG KÝ: Truy cập hikorea.go.kr, chọn tiếng Anh, Sign Up, điền thông tin cá nhân, xác thực email.

DỊCH VỤ CHÍNH
- Alien Registration: đăng ký ARC lần đầu (2-4 tuần)
- Extension of Stay: gia hạn visa (1-3 tuần)
- Change of Status: chuyển đổi visa (2-4 tuần)
- Work Permit: giấy phép làm thêm (1-2 tuần, miễn phí)
- Visit Reservation: đặt lịch hẹn Immigration (BẮT BUỘC, không walk-in)

ĐẶT LỊCH IMMIGRATION
Đăng nhập > Visit Reservation > Apply > Chọn văn phòng > Chọn mục đích > Chọn ngày giờ > In phiếu hẹn.

GIA HẠN VISA ONLINE
Application for Extension of Stay > Upload hộ chiếu, ARC, bảng điểm, xác nhận đang học, xác nhận số dư, NHI > Đóng phí 60,000 KRW > Chờ 1-2 tuần.

LÀM THÊM: Application for Part-time Work Permit. Cần HĐLĐ + xác nhận trường + bảng điểm + TOPIK. Miễn phí.

MẸO: Kiểm tra email (cả spam). Nếu thiếu giấy tờ, phải bổ sung trong 7 ngày — nếu không, đơn bị huỷ.
`
  },
]

content = content[:insert_pos] + new_articles + content[insert_pos:]

# ── Add 5 new FAQs before KB_MODULE_STRUCTURE ──
faq_marker = "NVAC trả lại tất cả giấy tờ gốc cho bạn"
faq_idx = content.find(faq_marker, insert_pos)
if faq_idx == -1:
    print("ERROR: Could not find FAQ marker")
    sys.exit(1)

# Find the closing ]; of KB_FAQ after this marker
faq_closing = content.find('];', faq_idx)
if faq_closing == -1:
    print("ERROR: Could not find FAQ closing")
    sys.exit(1)

new_faqs = ''',
  {
    id: 'faq-31',
    category: 'study-plan',
    question: 'Lệ phí thi TOPIK tại Việt Nam là bao nhiêu?',
    answer: 'Lệ phí thi TOPIK do IIG Vietnam công bố theo từng đợt. Tham khảo: TOPIK I ~500,000-700,000 VND, TOPIK II ~600,000-900,000 VND. Đăng ký và thanh toán online tại online.iigvietnam.com.'
  },
  {
    id: 'faq-32',
    category: 'study-plan',
    question: 'Bằng TOPIK có giá trị trong bao lâu? Thi lại có được không?',
    answer: 'Chứng chỉ TOPIK có giá trị 2 năm kể từ ngày công bố kết quả. Bạn có thể thi lại không giới hạn số lần để nâng cấp độ. Điểm số cao nhất sẽ được sử dụng.'
  },
  {
    id: 'faq-33',
    category: 'finance',
    question: 'GKS Scholarship có yêu cầu TOPIK không? Tỉ lệ đậu là bao nhiêu?',
    answer: 'GKS không bắt buộc TOPIK đầu vào (đặc biệt với GKS-U), nhưng có TOPIK 4+ là lợi thế lớn. Tỉ lệ cạnh tranh ~5-10%. Hồ sơ cần GPA cao, hoạt động ngoại khoá tốt, Study Plan xuất sắc.'
  },
  {
    id: 'faq-34',
    category: 'process',
    question: 'Cần cài những app gì trước khi sang Hàn Quốc?',
    answer: 'Cài ngay: KakaoTalk (nhắn tin), Naver Map (bản đồ), Papago (dịch), Kakao T (taxi). Google Maps hoạt động rất hạn chế tại Hàn Quốc — đừng phụ thuộc vào nó! Mua T-money tại cửa hàng tiện lợi sau khi đến.'
  },
  {
    id: 'faq-35',
    category: 'process',
    question: 'Immigration Hàn Quốc có nhận walk-in không?',
    answer: 'KHÔNG. Bạn PHẢI đặt lịch hẹn online trước qua Hi Korea (Visit Reservation). Walk-in sẽ không được tiếp nhận. Đặt lịch sớm vì các khung giờ thường đầy nhanh, đặc biệt đầu mùa.'
  }
]

content = content[:faq_closing] + new_faqs + content[faq_closing:]

with open('lib/knowledge-base.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Added 4 new articles and 5 new FAQs")
print(f"File size: {len(content)} chars")
