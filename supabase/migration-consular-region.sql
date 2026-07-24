-- Migration: Thêm cột consular_region vào bảng student_profiles
-- Vùng lãnh sự (KVAC Hà Nội / LSQ TP.HCM)

-- Bước 1: Thêm cột consular_region
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS consular_region VARCHAR(20) DEFAULT NULL;

COMMENT ON COLUMN student_profiles.consular_region IS 'Vùng lãnh sự nộp hồ sơ: kvac_hanoi hoặc lsq_hcm';

-- Bước 2: Tạo index cho cột mới (hỗ trợ query filter theo vùng lãnh sự)
CREATE INDEX IF NOT EXISTS idx_student_profiles_consular_region 
ON student_profiles(consular_region);

-- Bước 3: Thêm ràng buộc check giá trị hợp lệ
ALTER TABLE student_profiles
ADD CONSTRAINT chk_consular_region_valid
CHECK (consular_region IS NULL OR consular_region IN ('kvac_hanoi', 'lsq_hcm'));
