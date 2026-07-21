# 📋 Phase 1 & 2 — Tổng kết

> Cập nhật lần cuối: 20/07/2026
> 
> File này tổng hợp toàn bộ thay đổi đã thực hiện và các việc còn tồn đọng.

---

## 📦 PHASE 1 — Nền tảng

> Cập nhật: 19/07/2026

### ✅ ĐÃ HOÀN THÀNH

#### 1. 🧹 AI Refactor — Tách deepseek.js

| File | Thay đổi |
|---|---|
| `lib/ai/common.js` **MỚI** | Gom `getDeepSeekKey()`, `callDeepSeek()`, `getBotToken()`, `verifyTelegramWebhook()`, `escapeHtmlTelegram()` |
| `api/deepseek.js` | Import từ `lib/ai/common`, xoá ~70 dòng trùng |

#### 2. 📱 Mobile Sidebar

- **Hamburger button** `.sidebar-hamburger` trong `.app-topbar` (hiện trên mobile < 900px)
- **Backdrop overlay** `.sidebar-backdrop` z-index 9999
- **Slide-in drawer**: sidebar transform translateX, transition mượt
- **pre-render.js**: đồng bộ HTML + JS cho SEO pages

#### 3. 👤 Student Accounts

| File | Thay đổi |
|---|---|
| `api/auth/student.js` **MỚI** | register, login, verify, profile, refresh token, save/load checklist, save/load documents |
| `supabase/migration-student-auth.sql` **MỚI** | 3 bảng: `student_profiles`, `student_checklist_progress`, `student_documents` |
| `public/index.html` | Auth modal login/register tabs + inline JS + fetchWithAuth |
| `public/styles.css` | Auth modal CSS |
| `scripts/pre-render.js` | Auth button + modal + JS cho SEO pages |

#### 4. 🔄 Checklist Sync

- **API**: save-checklist (upsert), load-checklist, save-document, load-documents
- **Client**: `syncToServer()` sau mỗi `saveData()`, `loadFromServer()` khi `init()`
- **Merge**: server data merge vào localStorage khi login

#### 5. 🐛 Bug Fixes (Phase 1)

| Bug | Fix |
|---|---|
| **Token hết hạn sau ~1h** | `handleRefreshToken` API endpoint + `fetchWithAuth()` client wrapper + `_refreshPromise` in-flight guard |
| **Checklist sync chỉ profile step** | `fetchWithAuth` trong checklist.js + kiểm tra `res.ok` |

#### 6. 🚀 Vercel 12-function limit

| Trước (11 functions) | Sau (5 functions) |
|---|---|
| `api/deepseek.js` | `api/deepseek.js` |
| `api/schools/index.js` | `api/schools/index.js` |
| `api/auth/[action].js` | `api/auth/[action].js` |
| `api/auth/student.js` | `api/auth/student.js` |
| 7 admin APIs riêng lẻ | `api/admin/[...path].js` ✅ **catch-all** |

#### 7. 🗄️ Database Migration

- **File**: `supabase/migration-student-auth.sql`
- **Trạng thái**: ✅ Đã chạy trên Supabase SQL Editor

---

## 🚀 PHASE 2 — Core Features (CRUD hồ sơ, Document Tracking, AI)

> Cập nhật: 20/07/2026

### ✅ ĐÃ HOÀN THÀNH

#### 1. 📋 Checklist nâng cao — Deep Research KVAC

| Module | Items | Mô tả |
|--------|:-----:|-------|
| 🪪 Giấy tờ hành chính | 8 | Hộ chiếu, CCCD, ảnh thẻ, sổ hộ khẩu/CT07, giấy khám sức khỏe, TB test... |
| 🎓 Giấy tờ học vấn | 3-4 | Bằng THPT, học bạ, giải trình gap year... |
| 🏫 Giấy tờ trường Hàn | 2 | Thư nhập học, hóa đơn học phí |
| 💰 Chứng minh tài chính | 6 | Sổ TK $10K+, K-Study frozen account, sao kê, giấy bảo lãnh... |
| ✍️ Study Plan | 2 | Study Plan + cảnh báo viết chung chung |
| 📬 Nộp hồ sơ & Theo dõi | 5 | KVAC, bảo hiểm, vé máy bay... |
| 📜 Dịch thuật & Hợp pháp hóa | 4 | 4 bước: dịch → công chứng → MOFA → ĐSQ Hàn |
| 📌 Lưu ý quan trọng (ALERT) | 9 | Cảnh báo: sao kê ổn định, tên nhất quán, hợp pháp hóa... |
| ⚠️ Xử lý rủi ro (RISK) | 4 | Thư GV, Sejong, lý lịch tư pháp, TOPIK |

**Kết quả test** (đã chạy Node.js script kiểm tra):

| Kịch bản | Items | Kết quả |
|:---------|:-----:|:-------:|
| 🟢 D-4-1 Standard | 42 | ✅ PASS |
| 🔴 D-4-1 High Risk (trượt visa + gap) | 51 | ✅ PASS |
| 🟢 D-2 Standard | 38 | ✅ PASS |
| 🔄 D4→D2 | 6 | ✅ PASS |

#### 2. 📊 Applications CRUD

| API Endpoint | Action | Mô tả |
|---|---|---|
| `action=applications-create` | POST | Tạo hồ sơ đăng ký mới |
| `action=applications-list` | GET | Danh sách hồ sơ |
| `action=applications-get` | GET | Chi tiết 1 hồ sơ |
| `action=applications-update` | PUT | Cập nhật hồ sơ |
| `action=applications-delete` | DELETE | Xoá hồ sơ |
| `public/js/application.js` | UI | Dashboard "📨 Gửi đơn" với 4 thẻ thống kê |

#### 3. ⏰ Reminders

| API Endpoint | Mô tả |
|---|---|
| `action=reminders-list` | Danh sách nhắc nhở |
| `action=reminders-create` | Tạo nhắc nhở mới |
| `action=reminders-complete` | Đánh dấu hoàn thành |
| `action=reminders-delete` | Xoá nhắc nhở |

#### 4. 📄 Document Tracking (4 trạng thái)

Mỗi giấy tờ trong checklist có thanh trạng thái:

```
🔴 Chưa có → 🟡 Đã có → 🔵 Đã dịch → 🟢 ✅ Sẵn sàng
```

- **Click** vào từng bước để cập nhật trạng thái
- **Upload file** → tự động chuyển "Chưa có" → "Đã có"
- **Nút hành động nhanh** sau upload: "🔄 Đã dịch thuật xong" / "✅ Sẵn sàng luôn"
- Khi đạt "✅ Sẵn sàng" → tự động đánh dấu item = completed

#### 5. 📎 File Upload (Supabase Storage)

| Thành phần | Mô tả |
|---|---|
| `handleDocumentUpload` | API upload file base64 → Supabase Storage |
| Bucket | `student-documents` (Public) — **cần tạo trên Supabase Dashboard** |
| Fallback | Nếu bucket chưa tồn tại → vẫn lưu metadata vào DB, trả warning |
| Client | `handleFileUpload` → toast thành công / cảnh báo |

#### 6. 🤖 AI Study Plan Generator

**8 câu hỏi chuyên sâu** (từ Knowledge Base):

| # | Câu hỏi |
|:---:|---------|
| 1 | Vì sao chọn Hàn Quốc, không phải nước khác? |
| 2 | Vì sao chọn trường này? |
| 3 | Kế hoạch học tập theo từng giai đoạn? |
| 4 | Kế hoạch sau khi tốt nghiệp? |
| 5 | Ngành học liên quan đến định hướng nghề nghiệp? |
| 6 | Gap year đã làm gì? |
| 7 | Gia đình/người bảo lãnh có thu nhập ổn định? |
| 8 | Trình độ tiếng Hàn/Anh? |

- Form progress bar (đã trả lời X/8)
- AI tự động sinh Study Plan cá nhân hóa
- Có thể: Copy, Download (.txt), Lưu, Tạo lại

#### 7. 🐛 Bug Fixes (Phase 2)

| Bug | Fix | Commit |
|---|---|---|
| **save-document 500** (upsert không có unique constraint) | Select → insert/update thay vì upsert | `5aa44c6` |
| **document-upload 500** (const doc bị gán lại) | Dùng `let doc` + select-then-insert pattern | `d88fd13` |
| **ALERT-D2 icon trùng emoji** | Đồng bộ icon 📌 | `e44f042` |
| **ALERT-4 hiện cho cả người không trượt visa** | Thêm `rule: { has_visa_rejection: { eq: true } }` | `e44f042` |
| **extraContext không được đưa vào prompt AI** | Append extraContext vào user message | `095b8a9` |

### 🔴 CHƯA LÀM / TỒN ĐỌNG

| # | Việc | Mức độ | Ghi chú |
|:---:|------|:------:|---------|
| 1 | **Tạo bucket `student-documents` trên Supabase** | 🔥 Cần gấp | Vào Supabase Dashboard > Storage > Create bucket (Public) |
| 2 | **Chạy SQL migration files** | 🔥 Cần gấp | `supabase/migration-phase2-*.sql` — copy vào SQL Editor |
| 3 | **Export checklist ra PDF** | 🟡 Nên làm | Có branding, danh sách giấy tờ |
| 4 | **Ẩn document tracking cho warning items** | 🟡 Nên làm | ALERT items không cần upload file |
| 5 | **Auto reminder từ checklist** | 🟢 Có thể sau | Tự tạo reminder khi đến hạn |
| 6 | **Kết nối progress → Dashboard** | 🟢 Có thể sau | Hiển thị tiến độ checklist trong tab Gửi đơn |

### 📋 Commits Phase 2

```
d52f218 — feat: add quick-action buttons after upload - Đã dịch / Sẵn sàng
d88fd13 — fix: handleDocumentUpload const assignment bug - use select-then-insert pattern
5aa44c6 — fix: document-upload 500 + client warning for Storage bucket missing
095b8a9 — feat: AI Study Plan Generator - 8 questions form + API extraData + CSS + download
751fdb7 — feat: sync D-2 with D-4-1: CT07, bank warning, RISK items
f67d6ad — feat: deep research - legalization, financial stability, personalized Study Plan
14214a9 — feat: document tracking UI + Rule Engine fix (snake_case → camelCase)
6091080 — feat: TB test, Business Registration, K-Study, ALERT module
e44f042 — fix: ALERT-D2 icon, ALERT-4 conditional rule
```

---

## 📚 Tài liệu tham khảo

- **Knowledge Base**: `Tự làm hồ sơ/Korean_Study_Abroad_Knowledge_Base.md`
- **Kiến trúc**: `Tự làm hồ sơ/Korea_Study_Agent_Architecture.md`
- **Hệ thống hồ sơ**: `Tự làm hồ sơ/he-thong-ho-so-du-hoc-han-quoc.md`
- **Migration files**: `supabase/migration-phase2-*.sql`

---

## 🚀 Kế hoạch tới

1. Tạo bucket `student-documents` trên Supabase Dashboard
2. Chạy SQL migration files
3. Test upload file → verify quick-action buttons
4. Thảo luận Phase 3
