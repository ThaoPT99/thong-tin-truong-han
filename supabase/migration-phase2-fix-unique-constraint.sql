-- ============================================================
-- Phase 2: Fix unique constraint cho student_documents
-- Chạy file này trong Supabase SQL Editor (một lần duy nhất)
-- ============================================================

-- Thêm unique constraint để hỗ trợ upsert
ALTER TABLE student_documents
ADD CONSTRAINT student_documents_student_doc_type_key
UNIQUE (student_id, doc_type);
