# Website Thông tin trường Hàn - Kỳ tháng 3/2027

Website tra cứu thông tin du học Visa D2-6: danh sách 18 trường Hàn Quốc, điều kiện tuyển sinh, học phí, hồ sơ và công cụ tư vấn chọn trường.

**Nguồn dữ liệu:** File Excel `Thong_tin_truong_Han_ky_thang_3_2027.xlsx` / 
[Google Sheet](https://docs.google.com/spreadsheets/d/1H5tFffhJeLETHrNeRLV2l_gpg-KDQITD/edit?usp=sharing&ouid=112929137164133989656&rtpof=true&sd=true)

---

## Chạy website

Mở `index.html` bằng trình duyệt.

## Deploy lên Vercel

Dự án là **static site thuần**, deploy trực tiếp lên Vercel:

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import repo
3. Framework: **Other** (không cần build command)
4. Output directory: để trống

Hoặc dùng Vercel CLI:
```bash
vercel --prod
```

---

## Cập nhật dữ liệu từ Excel

Chạy script Python để import dữ liệu từ file Excel vào `data.js`:
```bash
pip install openpyxl
python excel_to_data.py
```
(Lưu file Excel `Thong_tin_truong_Han_ky_thang_3_2027.xlsx` vào thư mục gốc hoặc Downloads)

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
├── index.html              # SPA chính (6 tab)
├── data.js                 # Dữ liệu 18 trường + advisor profiles
├── render.js               # Render engine (directory, detail, compare, checklist...)
├── advisor.js              # Công cụ tư vấn chọn trường
├── styles.css              # Stylesheet (light/dark, responsive, print)
├── zalo-popup.js           # Popup Zalo + theme toggle
├── excel_to_data.py        # Script import Excel → data.js
├── images/
│   ├── placeholder.svg
│   ├── logo-d26-horizontal.svg
│   ├── logo-d26-sidebar.svg
│   ├── maphanquoc-optimized.webp
│   └── ...
├── robots.txt
├── sitemap.xml
└── Thong_tin_truong_Han_ky_thang_3_2027.xlsx  # File Excel nguồn
```

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

## Cấu trúc mỗi trường trong data.js

```javascript
"id-truong": {
  id: "id-truong",
  name: "Tên hiển thị",
  nameKr: "한국어",
  nameEn: "English name",
  system: "D2-6 > D2-1",
  quota: 60,
  region: "seoul",
  images: {
    main: "images/truong/truong-chinh.jpg",
    catalog: "images/truong/catalog-cover.jpg",
    locationMap: "images/truong/ban-do.jpg",
    invoice: "images/truong/invoice-mau.jpg",
    gallery: []
  },
  links: {
    website: "http://...",
    catalog: "documents/truong-catalog.pdf",
    invoice: "https://drive.google.com/..."
  },
  video: {
    url: "https://www.youtube.com/watch?v=...",
    youtubeId: "ABC123",
    title: "Tên video"
  },
  location: "...",
  intro: "...",
  conditions: ["Điều kiện 1", "..."],
  majors: ["Chuyên ngành 1", "..."],
  conversion: ["..."],
  tuition: "...",
  insurance: "...",
  ktx: "...",
  schedule: "...",
  advantages: ["..."],
  documents: ["..."],
  documentsNote: "...",
  partners: [{ code: "XXX", name: "...", nameKr: "..." }],
  mou: "..."
}
```

---

## Hình ảnh

- Đặt ảnh vào `images/[tên-trường]/` (vd: `images/nubusan/`)
- Tên file: `truong-chinh.jpg`, `catalog-cover.jpg`, `ban-do.jpg`, `invoice-mau.jpg`
- Gallery: thêm đường dẫn vào mảng `images.gallery`

> **Lưu ý:** Hiện tại chưa có ảnh thật cho các trường. Cần tạo thư mục `images/[tên-trường]/` và thêm ảnh tương ứng.

## Video YouTube

Lấy **Video ID** từ link (phần sau `v=`):
```
Link: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```
Điền vào `video.youtubeId` trong data.js.

---

## Các sheet trong file Excel / Google Sheet

- **Trường (18 sheet):** Osan, Induk, YeonSeong, Sangmyung, KyungGin (Nữ), Dongnam, Dong-Eui, Suncheon Jeil, Nữ Busan, Busan Catholic, Gimhae, Gwangju, Nambu, Daewon, Sengmyung, DongDuk (Nữ), Catholic Kwandong, Jeonju
- **Tài liệu chung:** Check list HS xin Visa D2-6, Tài liệu ôn phỏng vấn, Application trường Hàn, Thông tin làm tem
