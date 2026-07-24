-- Migration: Thêm cột journey_stage vào bảng student_profiles
-- Hành trình học sinh: exploring → building_profile → preparing_docs → ready_to_submit → submitted → approved/rejected

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS journey_stage VARCHAR(30) DEFAULT NULL;

COMMENT ON COLUMN student_profiles.journey_stage IS 'Giai đoạn hiện tại: exploring, building_profile, preparing_docs, ready_to_submit, submitted, approved, rejected';

CREATE INDEX IF NOT EXISTS idx_student_profiles_journey_stage 
ON student_profiles(journey_stage);
