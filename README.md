# Website Thông tin trường Hàn - Kỳ 9/2026

Website hiển thị toàn bộ nội dung từ Excel/Google Sheet về 11 trường Hàn Quốc.

**Nguồn:** File Excel `Thông tin trường Hàn kỳ tháng 9_2026.xlsx` / [Google Sheet](https://docs.google.com/spreadsheets/d/1LkzsRId4jJ4qLCyggEX_Sj2TzrQ4gu-n)

## Cập nhật từ Excel mới

Chạy script để import dữ liệu từ file Excel:
```
python excel_to_data.py
```
(Lưu file Excel vào Downloads hoặc sửa đường dẫn trong script)

## Chạy website

Mở `index.html` bằng trình duyệt.

## Cập nhật dữ liệu từ Google Sheet

Website **không thể** tự động lấy dữ liệu từ Sheet (cần đăng nhập). Bạn cần **sao chép thủ công** vào file `data.js`:

### Cách lấy dữ liệu từng sheet

1. Mở Google Sheet, chọn tab trường cần thêm (vd: Dong-Eui, YeonSeong...)
2. Sao chép nội dung theo cấu trúc tương tự trường **Nữ Busan** trong `data.js`
3. Điền vào object tương ứng (vd: `"dong-eui": { ... }`)

### Cấu trúc mỗi trường trong data.js

```javascript
"id-truong": {
  id: "id-truong",
  name: "Tên hiển thị",
  nameKr: "한국어",
  nameEn: "English name",
  system: "D2-6 > D2-1",
  quota: 60,
  images: {
    main: "images/truong/truong-chinh.jpg",
    catalog: "images/truong/catalog-cover.jpg",
    locationMap: "images/truong/ban-do.jpg",
    invoice: "images/truong/invoice-mau.jpg",
    gallery: ["images/truong/1.jpg", "images/truong/2.jpg"]
  },
  links: {
    website: "http://...",
    catalog: "documents/truong-catalog.pdf"
  },
  video: {
    youtubeId: "ABC123",  // từ youtube.com/watch?v=ABC123
    title: "Tên video"
  },
  location: "...",
  intro: "...",
  conditions: ["Điều kiện 1", "..."],
  conversion: ["..."],
  tuition: "...",
  insurance: "...",
  ktx: "...",
  schedule: "...",
  advantages: ["..."],
  documents: ["..."],
  documentsNote: "...",
  partners: [{ code: "XXX", name: "...", nameKr: "..." }]
}
```

### Link trực tiếp đến từng sheet

Khi mở một tab trong Google Sheet, URL sẽ có dạng:
`...edit#gid=123456789`

Bạn có thể thêm link này vào `EXTRA_SHEETS` trong `data.js`:
```javascript
EXTRA_SHEETS.visaChecklist.link = "https://docs.google.com/spreadsheets/d/1LkzsRId4jJ4qLCyggEX_Sj2TzrQ4gu-n/edit#gid=XXXX";
```

### Hình ảnh

- Đặt ảnh vào `images/[tên-trường]/` (vd: `images/nubusan/`, `images/dong-eui/`)
- Tên file: `truong-chinh.jpg`, `catalog-cover.jpg`, `ban-do.jpg`, `invoice-mau.jpg`
- Gallery: thêm đường dẫn vào mảng `images.gallery`

### Video YouTube

Lấy **Video ID** từ link (phần sau `v=`):
- Link: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`
- Điền vào `video.youtubeId` trong data.js

## Cấu trúc thư mục

```
thong-tin-truong-han/
├── index.html
├── data.js          ← Cập nhật dữ liệu ở đây
├── render.js
├── styles.css
├── images/
│   ├── placeholder.svg
│   ├── nubusan/
│   │   ├── truong-chinh.jpg
│   │   ├── catalog-cover.jpg
│   │   ├── ban-do.jpg
│   │   └── invoice-mau.jpg
│   ├── dong-eui/
│   └── ...
└── documents/
    ├── nubusan-catalog.pdf
    └── ...
```

## Các sheet trong Google Sheet

- **Trường:** Dong-Eui, YeonSeong, Jangan, Induk, Osan, Suncheon Jeil, Dongnam, KyungGin, Ajou-Motor, Daewon, Nữ BuSan
- **Tài liệu chung:** Check list HS xin Visa D2-6, Tài liệu ôn phỏng vấn, Application trường Hàn, Thông tin làm tem
