-- Migration: student_tool_logs — ghi log tool calls của Student Agent
-- Mỗi lần AI gọi 1 tool (search_schools, get_school_detail, v.v.) sẽ ghi 1 dòng

CREATE TABLE IF NOT EXISTS student_tool_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_email   VARCHAR(200),
  student_name    VARCHAR(200),
  tool_name       VARCHAR(100) NOT NULL,
  params          JSONB,
  result_summary  TEXT,
  result_count    INTEGER DEFAULT 0,
  success         BOOLEAN DEFAULT true,
  error_message   TEXT,
  user_message    TEXT,
  duration_ms     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tool_logs_created ON student_tool_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_logs_tool ON student_tool_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_logs_student ON student_tool_logs(student_email);

ALTER TABLE student_tool_logs ENABLE ROW LEVEL SECURITY;

-- Admin có thể đọc tất cả
CREATE POLICY "admin_read_tool_logs" ON student_tool_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email' AND role = 'admin')
);
