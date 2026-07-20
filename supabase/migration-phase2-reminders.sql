-- ============================================================
-- Phase 2: Reminders + Applications enhancements
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bảng reminders — nhắc nhở deadline cho học sinh
CREATE TABLE IF NOT EXISTS reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  application_id  UUID REFERENCES school_applications(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT DEFAULT '',
  due_date        DATE NOT NULL,
  reminder_type   VARCHAR(30) DEFAULT 'other', -- document, submission, interview, health_check, visa_appointment, other
  is_completed    BOOLEAN DEFAULT false,
  notified        BOOLEAN DEFAULT false, -- đã gửi thông báo chưa
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_student ON reminders(student_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(is_completed);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_manage_reminders" ON reminders 
  FOR ALL USING (student_id IN (SELECT id FROM student_profiles WHERE auth_id = auth.uid()));

-- 2. Thêm cột student_id vào school_applications nếu chưa có
ALTER TABLE school_applications ADD COLUMN IF NOT EXISTS student_profile_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_applications_student_profile ON school_applications(student_profile_id);

-- 3. Thêm cột file_url vào student_documents (cho upload file thật)
ALTER TABLE student_documents ADD COLUMN IF NOT EXISTS file_url VARCHAR(500) DEFAULT '';
ALTER TABLE student_documents ADD COLUMN IF NOT EXISTS file_name VARCHAR(200) DEFAULT '';
ALTER TABLE student_documents ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT 0;

-- 4. Bảng student_applications (kết nối student với school_applications)
-- Đã có school_applications, cần thêm student_profile_id để biết của ai
