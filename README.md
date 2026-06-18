# Website Thông tin trường Hàn - Kỳ tháng 3/2027

Website tra cứu thông tin du học Visa D2-6: danh sách 18 trường Hàn Quốc, điều kiện tuyển sinh, học phí, hồ sơ và công cụ tư vấn chọn trường.

**URL:** https://thongtintruonghan.vercel.app  
**Nguồn dữ liệu:** File Excel `Thong_tin_truong_Han_ky_thang_3_2027.xlsx` / [Google Sheet](https://docs.google.com/spreadsheets/d/1H5tFffhJeLETHrNeRLV2l_gpg-KDQITD/edit?usp=sharing&ouid=112929137164133989656&rtpof=true&sd=true)

---

## Kiến trúc tổng quan

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Frontend   │ ──→ │  Vercel API      │ ──→ │  Supabase        │
│  (SPA thuần)│     │  (Serverless)    │     │  (PostgreSQL)    │
│  index.html │ ←── │  /api/*          │ ←── │  + Storage       │
│  render.js  │     │  + Admin /api/*  │     │                  │
│  advisor.js │     └──────────────────┘     └──────────────────┘
│  api-loader │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Admin UI         │
│  (static HTML)    │
│  dashboard.html   │
│  editor.html      │
│  import.html      │
│  semester.html    │
│  checklist.html   │
└──────────────────┘
```

## Deploy lên Vercel

Dự án gồm **static site + Vercel Serverless Functions + Build step**:

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import repo
3. Framework: **Other**
4. Root directory: để trống
5. `vercel.json` đã config sẵn build command (`npm run build` chạy `scripts/pre-render.js` sinh SEO pages + sitemap) + output directory (`public`)

**Biến môi trường cần set trên Vercel (Project Settings → Environment Variables):**

| Variable | Mô tả |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (admin operations) |
| `JWT_SECRET` | Secret key cho admin JWT |

## ## Chạy local

```bash
# Dùng Vercel Dev để chạy full-stack local (API + static)
npx vercel dev
```

Sau đó mở http://localhost:3000. Dữ liệu load từ API (Supabase).

> **Lưu ý:** Các file HTML mở trực tiếp bằng file:// không hoạt động vì API cần server.

## Cập nhật dữ liệu từ Excel

### Cách 1: Dùng Admin UI (khuyến nghị)

1. Đăng nhập vào `/admin/login.html`
2. Vào Import Excel → upload file `.xlsx` → xem trước → Import

### Cách 2: Dùng script Python + Admin Import

Chạy script Python để parse Excel, sau đó import qua Admin API:

```bash
pip install openpyxl
python scripts/import-excel.py
```

(Lưu file Excel vào thư mục gốc: `Thong_tin_truong_Han_ky_thang_3_2027.xlsx`)

Sau đó vào Admin UI → Import → upload file JSON đã parse.

### Setup database từ đầu

```bash
# 1. Init schema
node scripts/init-db.js

# 2. Seed admin user
node scripts/seed-admin.js

# 3. Seed visa checklist
node scripts/seed-checklist.js
```

---

## Danh sách 18 trường

| # | Tên trường | Tên tiếng Hàn | Hệ học | Khu vực |
|---|-----------|--------------|--------|--------|
| 1 | Osan | 오산대학교 | D2-6 → D2-1 (Cao đẳng) | Gyeonggi |
| 2 | Induk | 인덕대학교 | D2-6 → D2-1 (Cao đẳng) | Seoul |
| 3 | YeonSung | 연성대학교 | D2-6 → D2-1 (Cao đẳng) | Gyeonggi |
| 4 | Sangmyung | 상명대학교 | D2-6 → D2-2 (Đại học 4 năm) | Seoul |
| 5 | KyungGin | 경인여자대학교 | D2-6 → D2-1 (Cao đẳng) | Incheon |
| 6 | Dongnam | 동남보건대학교 | D2-6 → D2-1 (Cao đẳng) | Gyeonggi |
| 7 | Dong-Eui | 동의대학교 | D2-6 → D2-2 (Đại học) | Busan |
| 8 | Suncheon Jeil | 순천제일 | D2-6 → D2-1 (Cao đẳng) | Jeollanam |
| 9 | Nữ Busan | 부산여자대학교 | D2-6 → D2-1 (Cao đẳng) | Busan |
| 10 | Busan Catholic | 부산가톨릭대학교 | D2-6 → D2-1 (Cao đẳng) | Busan |
| 11 | Gimhae | 김해대학교 | D2-6 → D2-1 (Cao đẳng) | Gyeongsangnam |
| 12 | Gwangju | 광주대학교 | D2-6 → D2-2 (Đại học 4 năm) | Gwangju |
| 13 | Nambu | 남부대학교 | D2-6 → D2-2 (Đại học 4 năm) | Gwangju |
| 14 | Daewon | 대원대학교 | D2-6 → D2-1 (Cao đẳng) | Chungcheongbuk |
| 15 | Sengmyung | 세명대학교 | D2-6 → D2-2 (Đại học 4 năm) | Chungcheongbuk |
| 16 | DongDuk (Nữ sinh) | 동덕여자대학교 | D2-6 → D2-2 (Đại học 4 năm) | Seoul |
| 17 | Catholic Kwandong | 가톨릭관동대학교 | D2-2 (Đại học 4 năm) | Gangwon |
| 18 | Jeonju | 전주대학교 | D2-6 → D2-2 (Đại học 4 năm) | Jeollabuk |

---

## Cấu trúc thư mục

```
thong-tin-truong-han/
├── public/                    # Static website (deploy lên Vercel)
│   ├── index.html             # SPA chính (6 tab)
│   ├── styles.css             # Stylesheet (light/dark, responsive, print)
│   ├── sw.js                  # Service Worker (cache static assets)
│   ├── sitemap.xml            # Tự động sinh bởi pre-render.js
│   ├── robots.txt
│   ├── truong/                # Pre-render SEO pages (tự động sinh)
│   │   └── [slug]/index.html
│   ├── js/
│   │   ├── api-loader.js      # Load dữ liệu từ API, transform, dispatch event
│   │   ├── render.js          # Render engine (directory, detail, compare, checklist...)
│   │   ├── advisor.js         # Công cụ tư vấn chọn trường (scoring algorithm)
│   │   └── zalo-popup.js      # Popup Zalo + theme toggle
│   ├── admin/                 # Admin UI (static HTML + vanilla JS)
│   │   ├── admin.js           # Shared helpers (auth, API, toast)
│   │   ├── admin.css
│   │   ├── login.html         # Đăng nhập (JWT)
│   │   ├── dashboard.html     # Dashboard + danh sách trường
│   │   ├── editor.html        # CRUD trường (7 sections)
│   │   ├── import.html        # Import Excel (client-side parse + preview)
│   │   ├── semester.html      # Quản lý kỳ tuyển sinh + gán trường
│   │   └── checklist.html     # Quản lý visa checklist
│   └── images/
│       ├── placeholder.svg
│       ├── logo-d26-horizontal.svg
│       ├── logo-d26-sidebar.svg
│       ├── maphanquoc-optimized.webp
│       └── ...
├── api/                       # Vercel Serverless Functions
│   ├── schools/
│   │   ├── index.js           # GET /api/schools — danh sách trường
│   │   └── [slug].js          # GET /api/schools/:slug — chi tiết 1 trường
│   ├── extras/
│   │   └── index.js           # GET /api/extras — semesters, checklist, interviews
│   ├── auth/
│   │   └── [action].js        # POST /api/auth/login, GET /api/auth/verify
│   └── admin/
│       ├── schools/
│       │   ├── index.js       # POST (create)
│       │   └── [id].js        # PUT/DELETE (update/delete)
│       ├── semesters/
│       │   └── index.js       # CRUD semesters + school assignment
│       ├── checklist/
│       │   ├── index.js       # GET/POST
│       │   └── [id].js        # PUT/DELETE
│       ├── import/
│       │   └── index.js       # POST — batch import từ Excel JSON
│       └── export.js          # GET — export toàn bộ dữ liệu
├── lib/                       # Shared server-side helpers
│   ├── supabase.js            # Supabase client
│   ├── auth.js                # JWT sign/verify + requireAdmin middleware
│   └── helpers.js             # replaceChildTable, replacePartners, upsertAdvisorProfile
├── supabase/
│   └── schema.sql             # Database schema (full)
├── scripts/                   # Scripts chạy local hoặc deploy
│   ├── import-excel.py        # Parse Excel → JSON (Python + openpyxl)
│   ├── import-supabase.js     # [LEGACY] Import JSON lên Supabase (dùng Admin API thay thế)
│   ├── init-db.js             # Chạy schema.sql
│   ├── seed-admin.js          # Tạo admin user
│   ├── seed-checklist.js      # Seed 39 checklist items
│   ├── migrate-semesters.js   # Migration semester_info → semesters
│   ├── pre-render.js          # Sinh SEO pages + sitemap
│   └── upload-videos.js       # Upload video lên Supabase Storage
├── vercel.json                # Vercel config (rewrites, build)
├── package.json
└── Thong_tin_truong_Han_ky_thang_3_2027.xlsx  # File Excel nguồn
```

---

## API Endpoints

### Public API (không cần auth)

| Endpoint | Method | Mô tả |
|---|---|---|
| `/api/schools` | GET | Danh sách trường. Hỗ trợ `?full=false` (lightweight), `?semester=id` (lọc kỳ) |
| `/api/schools/:slug` | GET | Chi tiết 1 trường (kèm child tables: conditions, majors, advantages, ...) |
| `/api/extras` | GET | Semester info, danh sách kỳ, visa checklist, interviews |

### Admin API (cần JWT Bearer token)

| Endpoint | Method | Mô tả |
|---|---|---|
| `/api/auth/login` | POST | Đăng nhập → nhận JWT token |
| `/api/auth/verify` | GET | Verify token còn hạn không |
| `/api/admin/schools` | POST | Tạo trường mới |
| `/api/admin/schools/:id` | PUT/DELETE | Sửa/xoá trường |
| `/api/admin/import` | POST | Import batch (JSON array schools + extraSheets + semesterInfo) |
| `/api/admin/export` | GET | Export toàn bộ dữ liệu (schools, checklist, interviews, semesters) |
| `/api/admin/checklist` | GET/POST | Danh sách / thêm mới visa checklist item |
| `/api/admin/checklist/:id` | PUT/DELETE | Sửa/xoá checklist item |
| `/api/admin/semesters` | GET/POST/PUT/DELETE | CRUD kỳ tuyển sinh + gán trường (`?action=schools`) |

---

## Database (Supabase PostgreSQL)

### Core tables

- **`schools`** — Thông tin chính (slug, name, region, tuition, images, video...)
- **`school_conditions`** — Điều kiện tuyển sinh (1-nhiều)
- **`school_majors`** — Chuyên ngành (1-nhiều)
- **`school_advantages`** — Ưu điểm (1-nhiều)
- **`school_conversions`** — Lộ trình chuyển đổi (1-nhiều)
- **`school_documents`** — Hồ sơ cần lưu ý (1-nhiều)
- **`school_partners`** — Đối tác VN (1-nhiều, có UNIQUE school_id + code)
- **`school_advisor_profiles`** — Advisor profile (1-1 với schools)

### Supporting tables

- **`semesters`** — Kỳ tuyển sinh (unique: ky + nam, có is_active flag)
- **`semester_schools`** — N-N mapping (trường thuộc kỳ nào)
- **`extra_visa_checklist`** — Checklist hồ sơ visa (39 items, 5 nhóm)
- **`extra_interviews`** — Tài liệu ôn phỏng vấn
- **`users`** — Admin users (bcrypt password, JWT auth)

---

## Các chức năng chính

| Tab | Mô tả |
|-----|-------|
| **Trường** | Danh sách 18 trường + tìm kiếm/lọc (khu vực, hệ học) + xem chi tiết từng trường |
| **Tư vấn** | Form nhập hồ sơ (tuổi, GPA, tiếng Hàn, vùng miền...) → phân tích → Top 3 trường |
| **So sánh** | Chọn 3 trường so sánh cạnh nhau (học phí, KTX, ưu điểm, rủi ro) |
| **Bản đồ** | Bản đồ vị trí các trường tại Hàn Quốc |
| **Tài liệu** | Checklist hồ sơ D2-6 + tài liệu chung + kiểm tra dữ liệu |
| **Cẩm nang D2-6** | Hướng dẫn chi tiết: tổng quan → lợi ích → điều kiện → hồ sơ → lộ trình → E7 → lỗi thường gặp |

---

## Cấu trúc mỗi trường (API response)

```javascript
{
  id: "uuid",
  slug: "dh-osan",
  name: "Osan",
  name_kr: "오산대학교",
  name_en: "Osan University",
  system: "D2-6 > D2-1 (Cao đẳng)",
  quota: 60,
  region: "gyeonggi",
  location: "...",
  intro: "...",
  image_main: "images/placeholder.svg",
  image_catalog: "",
  image_location: "",
  image_invoice: "",
  website: "http://...",
  catalog_url: "documents/...",
  invoice_url: "https://...",
  video_url: "https://www.youtube.com/watch?v=...",
  video_youtube_id: "ABC123",
  video_title: "...",
  tuition: "...",
  insurance: "...",
  ktx: "...",
  schedule: "...",
  documents_note: "...",
  mou: "...",
  conditions: [{ text: "...", sort_order: 0 }],
  majors: [{ text: "...", sort_order: 0 }],
  advantages: [{ text: "...", sort_order: 0 }],
  conversion: [{ text: "...", sort_order: 0 }],
  documents: [{ text: "...", sort_order: 0 }],
  partners: [{ code: "XXX", name: "...", name_kr: "..." }],
  advisorProfile: { gender: "all", minGpa: 5.0, ... }
}
```

---

## Hình ảnh

- Đặt ảnh vào `public/images/[tên-trường]/` (vd: `public/images/nubusan/`)
- Tên file: `truong-chinh.jpg`, `catalog-cover.jpg`, `ban-do.jpg`, `invoice-mau.jpg`
- Để thêm ảnh vào database, dùng Admin UI → Editor → nhập đường dẫn

## Video YouTube

Lấy **Video ID** từ link (phần sau `v=`):
```
Link: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```
Nhập vào Admin UI → Editor → Video Youtube ID.

---

## Các sheet trong file Excel / Google Sheet

- **Trường (18 sheet):** Osan, Induk, YeonSeong, Sangmyung, KyungGin (Nữ), Dongnam, Dong-Eui, Suncheon Jeil, Nữ Busan, Busan Catholic, Gimhae, Gwangju, Nambu, Daewon, Sengmyung, DongDuk (Nữ), Catholic Kwandong, Jeonju
- **Tài liệu chung:** Check list HS xin Visa D2-6, Tài liệu ôn phỏng vấn, Application trường Hàn, Thông tin làm tem
