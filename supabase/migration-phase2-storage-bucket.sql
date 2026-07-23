-- ============================================================
-- Phase 2: Tạo Supabase Storage bucket cho student documents
-- Chạy file này trong Supabase SQL Editor (một lần duy nhất)
-- ============================================================

-- LƯU Ý: Storage bucket KHÔNG thể tạo qua SQL.
-- Chạy script sau để tạo bucket tự động:
--   node scripts/setup-storage-bucket.js
-- Hoặc tạo thủ công: Supabase Dashboard > Storage > Tạo bucket "student-documents" (public)

-- Sau khi bucket đã được tạo, chạy các lệnh SQL dưới đây
-- để thiết lập policies cho storage.objects

-- ============================================
-- STORAGE POLICIES (chạy SAU KHI tạo bucket)
-- ============================================

-- 1. Policy: public đọc file (vì bucket là public, ai cũng xem được file đã upload)
DROP POLICY IF EXISTS "public_read_student_docs" ON storage.objects;
CREATE POLICY "public_read_student_docs"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-documents');

-- 2. Policy: service_role quản lý tất cả (dùng cho server-side upload)
DROP POLICY IF EXISTS "service_manage_student_docs" ON storage.objects;
CREATE POLICY "service_manage_student_docs"
ON storage.objects FOR ALL
USING (bucket_id = 'student-documents')
WITH CHECK (bucket_id = 'student-documents');

-- 3. Cập nhật RLS cho bảng student_documents (nếu chưa có)
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_manage_own_docs" ON student_documents;
CREATE POLICY "student_manage_own_docs"
ON student_documents
FOR ALL
USING (
  student_id IN (
    SELECT id FROM student_profiles WHERE auth_id = auth.uid()
  )
);
