# TODO - Fix bug project thong-tin-truong-han

## Bước 1: Khắc phục bug runtime/dependency (ưu tiên cao)
- [ ] Loại bỏ phụ thuộc chéo advisor.js -> showSchool() bằng cách chuyển logic `showSchool` binding vào render.js sau khi tất cả script đã load.

## Bước 2: Khắc phục bug UI không cập nhật subtitle
- [ ] Thêm element `.subtitle` vào index.html (hoặc sửa selector trong render.js để khớp DOM thực tế).

## Bước 3: Lint/kiểm tra lỗi tiềm ẩn
- [ ] Rà soát `zalo-popup.js` (biến ZALO_GROUP_URL dư) và chuẩn hoá hành vi mở/đóng popup.
- [ ] Kiểm tra các nơi dùng `localStorage` và `navigator.clipboard` có fallback khi không hỗ trợ.

## Bước 4: Chạy thử
- [ ] Mở index.html trong trình duyệt, test các tab: Trường/Tư vấn/So sánh/Bản đồ/Tài liệu/Cẩm nang.
- [ ] Test submit advisor form và bấm “Xem chi tiết trường”.

