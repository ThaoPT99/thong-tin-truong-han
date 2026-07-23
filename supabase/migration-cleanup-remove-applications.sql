-- Migration: Clean up redundant school_applications table
-- Sau khi bỏ tab "Gửi đơn", dữ liệu học sinh đã có trong:
--   - student_checklist_progress (thông tin hồ sơ)
--   - student_documents (giấy tờ, bản nháp)
--   - reminders (nhắc nhở)

-- 1. Xoá application_id khỏi reminders (FK đến school_applications)
ALTER TABLE reminders DROP COLUMN IF EXISTS application_id;

-- 2. Xoá bảng school_applications
DROP TABLE IF EXISTS school_applications CASCADE;

-- 3. Xoá bucket storage 'applications' nếu còn
-- (Chỉ chạy nếu dùng management API, hoặc làm thủ công trong Dashboard)
-- Lưu ý: bucket 'student-documents' vẫn được giữ nguyên

SELECT '✅ Cleanup complete: school_applications removed' as result;
