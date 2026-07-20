-- ============================================================
-- Phase 2: Tạo Supabase Storage bucket cho student documents
-- Chạy file này trong Supabase SQL Editor (một lần duy nhất)
-- ============================================================

-- 1. Tạo bucket 'student-documents' (nếu chưa tồn tại)
-- Lưu ý: Supabase Storage bucket cần được tạo qua UI hoặc API
-- Cách 1: Vào Supabase Dashboard > Storage > Tạo bucket "student-documents" (public)
-- Cách 2: Chạy lệnh SQL dưới đây (yêu cầu extensions)

-- Kiểm tra extension pg_cron đã bật chưa
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Tạo function để tạo bucket (gọi qua HTTP nếu cần)
CREATE OR REPLACE FUNCTION create_student_docs_bucket()
RETURNS void AS $$
BEGIN
  -- Bucket sẽ được tạo thủ công qua UI hoặc tự động qua API
  -- Không thể tạo bucket trực tiếp qua SQL
  RAISE NOTICE 'Vui lòng tạo bucket "student-documents" trong Supabase Dashboard > Storage';
END;
$$ LANGUAGE plpgsql;

-- 2. Nếu bucket đã tồn tại, tạo policy cho phép student upload
-- (Chạy sau khi tạo bucket qua UI)
/*
CREATE POLICY "Students can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Students can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
*/

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
