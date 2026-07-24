# Đánh giá Website Thông Tin Trường Hàn (thongtintruonghan.vercel.app)

> Ngày đánh giá: 24/07/2026
> Mục đích: Đánh giá tổng quan website và đề xuất cải tiến nghiệp vụ

---

## 🏆 Đánh giá tổng quan

**Web rất tốt cho một dự án tự xây!** Dưới đây là các điểm mạnh:

| Mặt | Điểm |
|-----|------|
| ✅ Hệ thống tính năng | Rất đầy đủ: AI advisor, checklist, so sánh, study plan, phỏng vấn, knowledge base, personalization, chatbot |
| ✅ Kỹ thuật | Dùng DeepSeek AI làm lõi, có A/B testing, analytics, Supabase, service worker, Telegram bot, auth |
| ✅ UX | Có skeleton loading, responsive mobile, sidebar, popup Zalo, landing page riêng |
| ✅ Data | Có học từ case lịch sử (learning agent), similar cases matching |
| ✅ Business model | Định vị "tự làm hồ sơ" + AI miễn phí là hướng đi đúng |

### Danh sách tính năng hiện có

| # | Tính năng | Mô tả |
|---|-----------|-------|
| 1 | Danh sách trường D2-6 | Tra cứu trường Hàn Quốc diện visa trao đổi sinh viên |
| 2 | Danh sách trường D4-1 | Tra cứu trường học tiếng Hàn |
| 3 | AI Advisor | Tư vấn chọn trường dựa trên hồ sơ cá nhân |
| 4 | So sánh trường | So sánh 2-3 trường side-by-side |
| 5 | Hồ sơ của tôi | Checklist cá nhân hoá theo visa type và hồ sơ |
| 6 | Kiến thức | Knowledge base về du học Hàn Quốc |
| 7 | Bản đồ | Map vị trí các trường Hàn Quốc |
| 8 | Tài liệu | Tài liệu tham khảo chung |
| 9 | Cẩm nang D2-6 | Ebook hướng dẫn chi tiết visa D2-6 |
| 10 | Chi phí | Cost calculator ước tính chi phí du học |
| 11 | Soạn Study Plan | AI generator study plan qua 8 câu hỏi |
| 12 | Luyện phỏng vấn | Mô phỏng phỏng vấn visa KVAC với AI |
| 13 | AI Chat | Chat widget hỏi đáp về trường, visa, điều kiện |
| 14 | Student Agent | AI agent hiểu profile học sinh, tương tác tự nhiên |
| 15 | Phân tích hồ sơ | Rule-based + AI phân tích 6 nhóm điểm yếu/điểm mạnh |
| 16 | Personalization | Cá nhân hoá lộ trình, so sánh case tương tự |
| 17 | Popup Zalo + FAB | Kết nối group Zalo hỗ trợ |
| 18 | Đăng nhập/Đăng ký | Auth cho học sinh, lưu tiến độ |
| 19 | Telegram Bot | Bot quản lý admin: tra cứu, báo cáo, thêm học sinh |
| 20 | Admin Panel | Quản lý schools, students, semesters, cases, analytics |
| 21 | A/B Testing | Test biến thể Zalo, advisor button, CTA... |
| 22 | Analytics | Track page view, event, session, IP |
| 23 | Service Worker | Cache API + static assets |
| 24 | Landing Page | `tu-lam-ho-so.html` — quảng bá "tự làm hồ sơ với AI" |

---

## 🔴 Vấn đề nghiệp vụ cần sửa GẤP

### 1. ❌ Thiếu phân biệt rõ D2-6 vs D4-1

**Hiện tại**: Web gộp 2 visa type trong cùng 1 giao diện, chỉ khác nhau ở tab. Dữ liệu trường D2-6 và D4-1 không có khác biệt nào trong cách hiển thị.

**Vấn đề**: Đây là 2 diện visa **hoàn toàn khác nhau**:
- **D2-6**: Trao đổi sinh viên — cần MOU giữa trường VN và Hàn, học chuyên ngành
- **D4-1**: Học tiếng Hàn — không cần MOU, linh hoạt hơn, thường là bước đệm

**Nên**:
- Tách hẳn giao diện, checklist riêng cho từng loại
- Guide riêng "Bạn hợp với D2-6 hay D4-1?" dạng flow chart
- Cảnh báo rủi ro khác nhau cho từng diện

### 2. ❌ Không có "Vùng lãnh sự" (Consular Jurisdiction)

**Đây là thiếu sót lớn nhất về nghiệp vụ!** 
- Học sinh miền Bắc nộp tại **KVAC Hà Nội**
- Học sinh miền Nam nộp tại **Lãnh sự quán TPHCM**
- Mỗi nơi có yêu cầu hồ sơ khác nhau, thời gian xử lý khác nhau, tỉ lệ đậu khác nhau

**Nên thêm**:
- Chọn khu vực lãnh sự khi đăng ký
- Checklist tự động điều chỉnh theo khu vực
- Lịch hẹn KVAC/LSQ
- Thống kê tỉ lệ đậu theo khu vực

### 3. ❌ Không có quản lý "Dòng tiền" (Financial Flow)

Đây là lý do #1 bị trượt visa D2-6. Hiện tại web chỉ có "sổ tiết kiệm" nhưng thiếu:
- Giải trình nguồn tiền (thu nhập gia đình từ đâu?)
- Sao kê ngân hàng 3-6 tháng gần nhất
- Tương quan thu nhập vs sổ tiết kiệm (thu nhập 10tr/tháng mà sổ 500 triệu là vô lý)
- Hướng dẫn "cách làm đẹp sổ tiết kiệm" (kỹ thuật built-up)

### 4. ❌ Không tracking được "Hành trình học sinh"

**Hiện tại**: Web chỉ lưu checklist + profile, không có:
- Giai đoạn hiện tại: đang chọn trường? đang làm hồ sơ? đã nộp visa?
- Lịch sử tương tác: đã xem trường nào? đã dùng advisor mấy lần?
- Cảnh báo deadline: "Còn 2 tuần nữa là hết hạn nộp hồ sơ kỳ tháng 9"

---

## 🟡 Cải tiến quan trọng (nên làm)

### 5. ⚠️ Study Plan Generator cần chuyên sâu hơn

Hiện tại AI viết Study Plan dựa trên 8 câu hỏi. **Problem**: Study Plan cho D2-6 cần có cấu trúc rất khác với D4-1.

**Nên**:
- D2-6 Study Plan: Nhấn mạnh MOU, chương trình liên kết, kế hoạch chuyển tiếp
- D4-1 Study Plan: Nhấn mạnh mục đích học tiếng, lộ trình lên D2-1
- Template song ngữ (Việt + Hàn) — KVAC thích hồ sơ có tiếng Hàn
- Check "câu chuyện du học có logic không?" bằng AI

### 6. ⚠️ Thiếu tính năng "Đối tác / Cộng tác viên"

Web đang có Telegram bot + admin panel, nhưng thiếu portal cho:
- **Cộng tác viên tuyển sinh**: Xem được học sinh mình giới thiệu, hoa hồng
- **Trung tâm đối tác**: Quản lý học sinh, upload hồ sơ, theo dõi tiến độ
- **Giáo viên tiếng Hàn**: Đánh giá năng lực, cấp chứng chỉ

### 7. ⚠️ Thiếu tính năng "Dịch thuật - Dịch vụ bổ trợ"

Học sinh cần:
- Dịch thuật công chứng (học bạ, bằng cấp, sổ tiết kiệm...)
- Công chứng giấy tờ
- Visa photo + dịch
- Đăng ký bảo hiểm du học

**Cơ hội**: Tích hợp với đối tác dịch thuật, tạo pipeline referral.

### 8. ⚠️ Không có "Cảnh báo sớm" cho hồ sơ yếu

Hiện tại profile-analysis.js phân tích weakness rồi, nhưng **không**:
- Cảnh báo "Hồ sơ của bạn có nguy cơ trượt vì... hãy chọn trường nhóm B"
- Gợi ý "Nên thi TOPIK trước khi nộp" nếu chưa có tiếng Hàn
- Tính điểm rủi ro tổng thể

### 9. 🟡 Thiếu chatbot Zalo tư vấn tự động

Hiện tại chỉ có link group Zalo. Nên có **Zalo OA chatbot** (Official Account) để:
- Học sinh chat Zalo → bot trả lời tự động (dùng AI giống chat web)
- Gửi thông báo khi có kỳ mới
- Tự động trả lời câu hỏi về trường, visa, chi phí

---

## 🟢 Cải tiến nhỏ / Nice-to-have

### 10. SEO cho từng trường
Hiện tại meta title/description chỉ có 1 cho toàn bộ web. Mỗi trường nên có URL riêng (ví dụ `/truong/osan`) với meta tag riêng để SEO.

### 11. KPI Dashboard cho Sale/Admin
Admin đã có analytics, nhưng thiếu:
- Conversion funnel: Lượt xem → Dùng advisor → Điền checklist → Nộp hồ sơ → Đỗ visa
- Báo cáo theo kỳ, theo vùng
- So sánh hiệu suất các đối tác

### 12. Mobile App / PWA tốt hơn
Đã có service worker, nên biến thành PWA installable với manifest.json + icon các size.

---

## 📊 So sánh với đối thủ

| Tiêu chí | Web này | Trung tâm truyền thống | Đối thủ số (applykorea...) |
|---------|---------|----------------------|--------------------------|
| Miễn phí | ✅ 100% | ❌ 10-30tr | ⚠️ Một phần |
| AI tư vấn | ✅ Mạnh | ❌ | ⚠️ Có nhưng yếu |
| Checklist cá nhân hóa | ✅ | ⚠️ Manual | ✅ |
| Study Plan AI | ✅ | ❌ | ❌ |
| Phỏng vấn AI | ✅ | ❌ | ❌ |
| Quản lý hồ sơ thực tế | ❌ | ✅ Qua nhân viên | ⚠️ |
| Dịch thuật | ❌ | ✅ | ⚠️ |
| Theo dõi hành trình | ❌ | ✅ | ✅ |
| Vùng lãnh sự | ❌ | ✅ | ⚠️ |

---

## 🎯 Ưu tiên đề xuất

```
TUẦN 1-2 (GẤP)
├── Thêm vùng lãnh sự (KVAC/LSQ HCM) vào profile + checklist
├── Thêm tracking "hành trình học sinh" (giai đoạn hiện tại)
└── Cảnh báo sớm rủi ro hồ sơ

TUẦN 3-4 (QUAN TRỌNG)
├── Tách giao diện D2-6 vs D4-1 rõ ràng hơn
├── Hướng dẫn dòng tiền (giải trình thu nhập, built-up)
└── Study Plan Generator nâng cấp (song ngữ, template riêng)

THÁNG 2 (PHÁT TRIỂN)
├── Zalo OA chatbot
├── Partner portal cho cộng tác viên
└── KPI Dashboard cho admin/sale
```
