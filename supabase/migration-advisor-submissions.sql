-- Migration: Lưu thông tin học sinh từ form Tư vấn
-- Khi học sinh điền form Tư vấn chọn trường, dữ liệu được tự động lưu
-- Giám đốc / Sale có thể xem trong admin

CREATE TABLE IF NOT EXISTS student_advisor_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id  UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  
  -- Thông tin hồ sơ từ form Tư vấn
  visa_type           VARCHAR(10) DEFAULT 'D2-6',
  gender              VARCHAR(10),
  age                 INTEGER DEFAULT 0,
  gpa                 DECIMAL(3,1),
  absences            INTEGER DEFAULT 0,
  korean_level        VARCHAR(20),
  visa_fail           VARCHAR(10),
  region              VARCHAR(50),
  budget              VARCHAR(20),
  priorities          TEXT[] DEFAULT '{}',
  
  -- Kết quả phân tích (top 3 trường đề xuất)
  top_schools         JSONB,
  analysis_result     TEXT,
  
  -- Nguồn: 'advisor_form' (phân tích tự động) hoặc 'ai_advisor' (AI tư vấn)
  source              VARCHAR(30) DEFAULT 'advisor_form',
  
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisor_submissions_profile ON student_advisor_submissions(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_advisor_submissions_created ON student_advisor_submissions(created_at DESC);

ALTER TABLE student_advisor_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: học sinh chỉ xem được submissions của mình
CREATE POLICY "student_read_own_submissions" ON student_advisor_submissions 
  FOR SELECT USING (
    student_profile_id IN (
      SELECT id FROM student_profiles WHERE auth_id = auth.uid()
    )
  );

-- Policy: cho phép insert từ server (service_role)
CREATE POLICY "service_insert_submissions" ON student_advisor_submissions 
  FOR INSERT WITH CHECK (true);
