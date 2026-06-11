# TODO - SEO Google

## Phase 1 (nhanh)
- [x] Tạo `robots.txt`
- [x] Tạo `sitemap.xml` tối thiểu cho trang chủ
- [ ] Cập nhật `index.html` (meta description, canonical, og tags đồng bộ)

## Phase 2 (hiệu quả hơn: SEO tĩnh từng trường)
- [ ] Tạo script pre-render (tạo file `truong/<slug>.html` từ `data.js`)
- [ ] Nâng cấp `sitemap.xml` để liệt kê tất cả `/truong/<slug>/`
- [ ] Tạo/điều chỉnh `render` để không ảnh hưởng SEO nội dung pre-render

## Phase 3 (kiểm thử)
- [ ] Build/pre-render và kiểm tra URL
- [ ] Gửi sitemap lên Google Search Console

