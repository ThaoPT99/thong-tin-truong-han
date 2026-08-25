-- ============================================================
-- Migration: thêm cột is_active cho bảng schools
-- Cho phép tắt/bật trường (ẩn khỏi web) mà không phải xoá dữ liệu
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Mặc định: các trường hiện có đều đang bật
UPDATE schools SET is_active = true WHERE is_active IS NULL;

CREATE INDEX IF NOT EXISTS idx_schools_is_active ON schools(is_active);
