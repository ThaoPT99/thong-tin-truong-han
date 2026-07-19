// lib/knowledge-base.js
// Knowledge Base — extracted from Tự làm hồ sơ/ markdown files
// Inject vào AI prompts để tăng độ chính xác khi tư vấn

// ─── Module Structure (từ he-thong-ho-so-du-hoc-han-quoc.md) ───
// Hệ thống module theo loại visa, dùng để hướng dẫn học sinh từng bước
const KB_MODULE_STRUCTURE = `
=== HỆ THỐNG MODULE HỒ SƠ (THEO LOẠI VISA) ===

**Visa D-4-1 (Khóa tiếng Hàn):**
  A1. Giấy tờ hành chính cá nhân — Đơn xin visa, hộ chiếu, ảnh, CCCD, hộ khẩu, giấy khai sinh
  A2. Giấy tờ học vấn — Bằng THPT, học bạ, bảng điểm, dịch công chứng, giải trình gap (nếu có)
  A3. Giấy tờ từ trường — Admission Letter, Certificate of Admission, Invoice học phí
  A4. Chứng minh tài chính — Sổ tiết kiệm (tối thiểu 10.000 USD), giấy cam kết bảo lãnh, quan hệ bảo lãnh
  A5. Study Plan / Personal Statement — AI hỗ trợ soạn thảo, chấm điểm
  A6. Nộp hồ sơ & theo dõi — Đặt lịch KVAC, khám lao phổi, nộp hồ sơ, theo dõi kết quả

**Visa D-2 (Đại học chính quy):**
  — Yêu cầu cao hơn D-4-1: cần chứng chỉ TOPIK, thư giới thiệu giáo viên, học lực cao hơn

**Chuyển đổi D4 → D2:**
  — Giấy chứng nhận nhập học/bảng điểm ĐH Hàn, Giấy hoàn thành khóa tiếng, nộp tại Sở Di trú
`;

// ─── Analysis Framework (từ Korean_Study_Abroad_Knowledge_Base.md) ───
// Framework phân tích hồ sơ cá nhân hóa
const KB_ANALYSIS_FRAMEWORK = `
=== FRAMEWORK PHÂN TÍCH HỒ SƠ CÁ NHÂN HÓA ===

**1. Phân tích hồ sơ theo 6 nhóm:**
  • Nhân thân — Tuổi, quê quán, nơi cư trú, tình trạng hôn nhân
  • Học vấn — Trình độ, trường, GPA, năm tốt nghiệp, TOPIK, IELTS
  • Kinh nghiệm làm việc — Đã đi làm? Thời gian? HĐLĐ? BHXH?
  • Tài chính — Người bảo trợ, nghề nghiệp, thu nhập, tài sản, sổ tiết kiệm
  • Lịch sử nhập cảnh — Đã từng xin visa? Trượt visa? Xuất cảnh?
  • Gia đình — Người thân tại Hàn? Người thân cư trú bất hợp pháp?

**2. Đánh giá từng nhóm:**
  Mỗi nhóm cần xác định: Điểm mạnh - Điểm yếu - Rủi ro - Chứng cứ còn thiếu - Hành động đề xuất

**3. Quyết định sau phân tích:**
  • Có nên nhận hồ sơ? • Có cần bổ sung? • Có cần giải trình?
  • Có cần đổi trường? • Có nên đổi kỳ nhập học? • Có nên học TOPIK trước?
  • Có nên tăng chứng minh tài chính?

**4. Nguyên tắc sinh checklist:**
  — Không sinh checklist cố định cho mọi học sinh
  — Checklist được tạo dựa trên quyết định từ phân tích
  — VD: Gap > 2 năm → cần giải trình + xác nhận công việc
  — VD: Trượt visa → cần phân tích nguyên nhân + hồ sơ cũ + giải trình bổ sung
`;

// ─── 8 Study Plan Questions (từ he-thong-ho-so-du-hoc-han-quoc.md) ───
// Khung câu hỏi cá nhân hóa để AI hiểu context học sinh hơn
const KB_STUDY_PLAN_QUESTIONS = `
=== KHUNG CÂU HỎI CÁ NHÂN HÓA STUDY PLAN ===
(Khi viết Study Plan, hãy giúp học sinh trả lời 8 câu hỏi sau trong bài viết)

1. Vì sao bạn chọn du học Hàn Quốc (không phải nước khác)?
2. Vì sao chọn trường này / thành phố này?
3. Bạn học ngành gì, ngành đó liên quan gì đến định hướng nghề nghiệp?
4. Kế hoạch học tập cụ thể theo từng giai đoạn (6 tháng, 1 năm, 2 năm...)?
5. Bạn có kế hoạch gì sau khi tốt nghiệp (về nước / ở lại làm việc)?
6. Có khoảng trống thời gian sau tốt nghiệp không? Nếu có, lý do là gì?
7. Gia đình/người bảo lãnh có nghề nghiệp, thu nhập ổn định thế nào?
8. Bạn đã học tiếng Hàn/Anh đến trình độ nào, có chứng chỉ gì?
`;

// ─── Document Decision Rules (từ Korean_Study_Abroad_Knowledge_Base.md) ───
// Logic quyết định giấy tờ dựa trên đặc điểm hồ sơ
const KB_DOCUMENT_DECISION_RULES = `
=== LOGIC QUYẾT ĐỊNH GIẤY TỜ THEO HỒ SƠ ===
(Không áp dụng checklist cố định — suy luận dựa trên đặc điểm học sinh)

• Nếu Gap Year > 2 năm → Cần: Giải trình khoảng thời gian + Xác nhận công việc + HĐLĐ
• Nếu từng trượt visa → Cần: Phân tích nguyên nhân + Hồ sơ cũ + Giải trình bổ sung
• Nếu bảo lãnh không phải tự thân → Cần: Giấy cam kết bảo lãnh + Giấy tờ quan hệ
• Nếu có người thân tại Hàn → Cần: Khai báo rõ ràng, tránh nghi ngờ
• Nếu học lực thấp (GPA < 5.0) → Cần: Giải trình học tập + cam kết cải thiện
• Nếu tuổi cao (> 28) → Cần: Lý do du học hợp lý, lộ trình nghề nghiệp rõ
`;

// ─── Combined KB for Chat Web (compact) ───
const KB_FOR_CHAT = `
=== KIẾN THỨC NỀN TẢNG XỬ LÝ HỒ SƠ ===

${KB_MODULE_STRUCTURE}

${KB_ANALYSIS_FRAMEWORK}

${KB_STUDY_PLAN_QUESTIONS}
`.trim();

// ─── KB for Study Plan (compact) ───
const KB_FOR_STUDY_PLAN = `
=== KHUNG ĐỂ VIẾT STUDY PLAN CHẤT LƯỢNG ===

${KB_STUDY_PLAN_QUESTIONS}

Các bước phân tích trước khi viết:
1. Xác định đặc điểm học sinh (học lực, tiếng Hàn, kinh nghiệm, tài chính)
2. Xác định rủi ro cần giải trình (gap year, trượt visa, tuổi cao, GPA thấp)
3. Đảm bảo Study Plan trả lời được: tại sao Hàn Quốc, tại sao trường này, kế hoạch cụ thể, tương lai sau tốt nghiệp
`.trim();

// ─── KB for Gap Explanation — analysis-focused ───
const KB_FOR_GAP = `
=== PHÂN TÍCH GAP YEAR ===

Khi phân tích gap year, hãy xem xét:
• Thời gian gap dài bao lâu?
• Trong gap đã làm gì? (học ngoại ngữ, đi làm, chờ điều kiện, lý do sức khoẻ)
• Có chứng cứ gì cho hoạt động trong gap? (HĐLĐ, chứng chỉ, giấy tờ)
• Gap có ảnh hưởng đến động lực du học không?
• Gap có hợp lý với hoàn cảnh gia đình/cá nhân không?

TUYỆT ĐỐI KHÔNG dùng lý do tài chính gia đình khó khăn để giải thích gap.
`.trim();

// ─── KB for Visa Rejection — analysis + improvement ───
const KB_FOR_REJECTION = `
=== PHÂN TÍCH HỒ SƠ TRƯỢT VISA ===

Khi phân tích hồ sơ trượt visa, cần:
1. Xác định nguyên nhân trượt từ lý do cụ thể
2. Đề xuất cải thiện tương ứng:
   • Thiếu giấy tờ tài chính → Bổ sung sổ tiết kiệm, sao kê, giấy tờ thu nhập
   • Study Plan chung chung → Viết lại chi tiết, cá nhân hoá, có mốc thời gian
   • Không chứng minh được mối quan hệ gia đình → Bổ sung giấy tờ quan hệ
   • Học lực không đáp ứng → Cải thiện GPA, học thêm, thi TOPIK
   • Lý do khác → Phân tích cụ thể theo hồ sơ
3. Cam kết hồ sơ lần này đã hoàn chỉnh hơn, thể hiện thiện chí
`.trim();

module.exports = {
  KB_MODULE_STRUCTURE,
  KB_ANALYSIS_FRAMEWORK,
  KB_STUDY_PLAN_QUESTIONS,
  KB_DOCUMENT_DECISION_RULES,
  KB_FOR_CHAT,
  KB_FOR_STUDY_PLAN,
  KB_FOR_GAP,
  KB_FOR_REJECTION,
};
