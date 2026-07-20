# Hệ thống hỗ trợ tự làm hồ sơ du học Hàn Quốc

## 1. Vấn đề & mục tiêu

**Vấn đề:** Trung tâm du học hiện thu 70+ triệu đồng cho dịch vụ làm hồ sơ, phần lớn giá trị nằm ở tư vấn + soạn giấy tờ + theo dõi tiến độ — những việc học sinh/phụ huynh có thể tự làm nếu được hướng dẫn đúng cách và đúng lúc.

**Mục tiêu:** Xây dựng nền tảng giúp học sinh tự làm 70-80% hồ sơ, chỉ trả tiền cho phần bắt buộc phải qua bên thứ ba có pháp lý (dịch thuật công chứng, mở sổ tiết kiệm...).

**Không làm gì:** Không thay thế dịch thuật công chứng, không tự động nộp hồ sơ, không cam kết tỷ lệ đậu visa.

---

## 2. Đối tượng người dùng

| Persona | Đặc điểm | Nhu cầu chính |
|---|---|---|
| Học sinh cấp 3 tự tìm hiểu | Chưa có ai hỗ trợ, sợ sai sót | Checklist rõ ràng, mẫu viết study plan |
| Phụ huynh không rành tiếng Hàn/tiếng Anh | Lo về tài chính, giấy tờ | Hướng dẫn từng bước bằng tiếng Việt, minh bạch chi phí |
| Học sinh đã có trường (D-4-1) | Cần hoàn thiện hồ sơ visa | Theo dõi tiến độ, nhắc deadline |
| Học sinh chuyển D4→D2 | Đã ở Hàn, cần hồ sơ chuyển đổi | Hồ sơ khác biệt, cần thông tin cập nhật riêng |

---

## 3. Cấu trúc module theo loại visa

### Module A — Visa D-4-1 (khóa tiếng Hàn)

**A1. Giấy tờ hành chính cá nhân** *(tự làm)*
- Đơn xin visa mẫu KSD0-2014
- Hộ chiếu, ảnh 3.5x4.5cm (trong 6 tháng)
- CCCD, hộ khẩu, giấy khai sinh (bản sao)

**A2. Giấy tờ học vấn** *(tự chuẩn bị bản gốc + hỗ trợ dịch thuật)*
- Bằng tốt nghiệp THPT / bảng điểm
- Bản dịch công chứng sang tiếng Hàn/Anh
- Giải trình khoảng trống thời gian (nếu có)

**A3. Giấy tờ từ trường** *(nhận từ trường, hệ thống chỉ theo dõi trạng thái)*
- Admission Letter / Certificate of Admission
- Invoice học phí

**A4. Chứng minh tài chính** *(checklist chi tiết theo hoàn cảnh gia đình)*
- Sổ tiết kiệm tối thiểu 10.000 USD, đủ kỳ hạn 1 tháng
- Giấy cam kết bảo lãnh (nếu người đứng tên khác học sinh)
- Giấy tờ chứng minh quan hệ với người bảo lãnh
- Dịch công chứng toàn bộ

**A5. Study Plan / Personal Statement** *(công cụ AI hỗ trợ soạn thảo — trọng tâm sản phẩm)*
- Bộ câu hỏi dẫn dắt (xem mục 5)
- Bản nháp AI sinh ra + gợi ý chỉnh sửa
- Chấm điểm mức độ cụ thể/chung chung

**A6. Nộp hồ sơ & theo dõi**
- Đặt lịch hẹn ĐSQ/LSQ
- Theo dõi thời gian xét duyệt (5-10 ngày làm việc chuẩn)
- Nhắc lịch nộp trước 2 tháng so với ngày nhập cảnh dự kiến

### Module B — Visa D-2 (đại học chính quy)
*(cần nghiên cứu riêng — hồ sơ khác D-4-1: yêu cầu học lực, đôi khi cần chứng chỉ TOPIK, thư giới thiệu giáo viên)*

### Module C — Chuyển đổi D4 → D2
- Giấy chứng nhận nhập học/bảng điểm đại học Hàn
- Giấy chứng nhận hoàn thành khóa tiếng
- Nộp tại Sở/Văn phòng Di trú, xử lý ~2 tuần

---

## 4. Tính năng nền tảng (feature list)

### Tier 1 — Free
- [ ] Checklist tương tác theo loại visa (tick từng mục, % hoàn thành)
- [ ] Kho template: đơn từ, bảng kê giấy tờ
- [ ] Bài viết hướng dẫn từng bước (kèm ảnh minh họa mẫu giấy tờ)
- [ ] Cộng đồng hỏi đáp (học sinh đi trước chia sẻ kinh nghiệm theo từng trường)
- [ ] Cảnh báo lỗi thường gặp (VD: sổ tiết kiệm chưa đủ kỳ hạn, thiếu giải trình khoảng trống)

### Tier 2 — Trả phí thấp (theo lượt, không theo gói)
- [ ] AI hỗ trợ soạn Study Plan/Personal Statement (theo bộ câu hỏi mục 5)
- [ ] AI chấm điểm & gợi ý sửa bài luận
- [ ] Review hồ sơ tài chính (nhập thông tin → hệ thống chỉ ra thiếu/sai)
- [ ] Mô phỏng phỏng vấn visa bằng AI (câu hỏi thường gặp theo trường)
- [ ] Nhắc deadline tự động theo mốc thời gian nhập học

### Tier 3 — Affiliate / kết nối bên thứ ba
- [ ] Danh sách đơn vị dịch thuật công chứng uy tín + giá tham khảo
- [ ] Kết nối dịch vụ mở sổ tiết kiệm chứng minh tài chính
- [ ] Kết nối bảo hiểm du học

---

## 5. Khung câu hỏi cá nhân hóa Study Plan (lõi sản phẩm)

Hệ thống hỏi tuần tự, câu trả lời được dùng làm input cho AI sinh bản nháp:

1. Vì sao bạn chọn du học Hàn Quốc (không phải nước khác)?
2. Vì sao chọn trường này / thành phố này?
3. Bạn học ngành gì, ngành đó liên quan gì đến định hướng nghề nghiệp?
4. Kế hoạch học tập cụ thể theo từng giai đoạn (6 tháng, 1 năm, 2 năm...)?
5. Bạn có kế hoạch gì sau khi tốt nghiệp (về nước / ở lại làm việc)?
6. Có khoảng trống thời gian sau tốt nghiệp không? Nếu có, lý do là gì?
7. Gia đình/người bảo lãnh có nghề nghiệp, thu nhập ổn định thế nào?
8. Bạn đã học tiếng Hàn/Anh đến trình độ nào, có chứng chỉ gì?

→ Output: bản nháp Study Plan + danh sách điểm cần bổ sung để tránh bị đánh giá "chung chung".

---

## 6. Mô hình dữ liệu (gợi ý sơ bộ)

```
User
 ├─ Profile (visa_type, target_school, timeline)
 ├─ ChecklistProgress (module, item, status, notes)
 ├─ Documents (type, status: draft/translated/notarized/submitted)
 ├─ StudyPlanDrafts (answers, ai_draft, version, feedback)
 └─ Reminders (deadline, description, done)
```

---

## 7. Mô hình doanh thu

| Nguồn | Mô tả | Ước tính |
|---|---|---|
| Freemium upsell | Free checklist → trả phí AI review/soạn thảo | 200-500k/lượt |
| Affiliate | Dịch thuật, bảo hiểm, ngân hàng | Hoa hồng % |
| B2B | Bán nền tảng cho trường cấp 3/trung tâm tiếng Hàn nhỏ | Theo hợp đồng |

---

## 8. Rủi ro & giới hạn

- Dịch thuật công chứng, mở sổ tiết kiệm: **không thể tự động hóa**, luôn cần bên có pháp lý.
- Yêu cầu hồ sơ có thể thay đổi theo từng kỳ nhập học → cần cơ chế cập nhật nội dung thường xuyên, lý tưởng là có người theo dõi trực tiếp từ ĐSQ/trường.
- Rào cản niềm tin: phụ huynh có thể vẫn muốn "có người lo hết" — cần định vị sản phẩm là "hỗ trợ minh bạch, tiết kiệm chi phí" chứ không phải "tự lo 100%, không ai giúp".
- Không cam kết tỷ lệ đậu visa dưới bất kỳ hình thức nào.

---

## 9. Việc cần làm tiếp theo

- [ ] Nghiên cứu chi tiết hồ sơ Module B (visa D-2)
- [ ] Xác minh mẫu đơn KSD0-2014 mới nhất và quy trình đặt lịch ĐSQ/LSQ hiện hành
- [ ] Phỏng vấn 5-10 học sinh/phụ huynh đã tự làm hồ sơ để tìm điểm nghẽn thực tế
- [ ] Thiết kế wireframe cho checklist + luồng soạn Study Plan
