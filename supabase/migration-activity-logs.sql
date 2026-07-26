-- Migration: student_activity_logs — ghi lại hành vi người dùng trên site
-- Mỗi lần user làm 1 hành động (xem trường, chat, tìm kiếm, v.v.) sẽ ghi 1 dòng

CREATE TABLE IF NOT EXISTS student_activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  email           VARCHAR(255) DEFAULT '',
  full_name       VARCHAR(200) DEFAULT '',
  activity_type   VARCHAR(100) NOT NULL,   -- 'page_view', 'tool_use', 'search', 'chat', 'advisor', 'checklist', 'document', 'save_school', 'view_school'
  page            VARCHAR(500) DEFAULT '',
  details         JSONB DEFAULT '{}',
  ip              VARCHAR(45) DEFAULT '',
  user_agent      TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON student_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_student ON student_activity_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON student_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_email ON student_activity_logs(email);

ALTER TABLE student_activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin có thể đọc tất cả
CREATE POLICY "admin_read_activity_logs" ON student_activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
);
