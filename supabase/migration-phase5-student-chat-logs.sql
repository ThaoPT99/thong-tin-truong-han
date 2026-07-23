-- ============================================================
-- Phase 5: Student Chat History + Login Logs
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bảng student_chat_history — lưu lịch sử chat với AI Agent
CREATE TABLE IF NOT EXISTS student_chat_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  role            VARCHAR(10) NOT NULL, -- 'user' hoặc 'assistant'
  content         TEXT NOT NULL,
  tool_used       VARCHAR(50) DEFAULT '', -- 'search_schools', 'apply_school', ...
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_student ON student_chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created ON student_chat_history(student_id, created_at DESC);

ALTER TABLE student_chat_history ENABLE ROW LEVEL SECURITY;

-- Policy: admin đọc được tất cả
CREATE POLICY "admin_read_chat_history" ON student_chat_history 
  FOR SELECT USING (true);

-- Policy: insert từ server (service_role)
CREATE POLICY "service_insert_chat_history" ON student_chat_history 
  FOR INSERT WITH CHECK (true);

-- 2. Bảng student_login_logs — theo dõi đăng nhập
CREATE TABLE IF NOT EXISTS student_login_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  ip              VARCHAR(45) DEFAULT '',
  user_agent      TEXT DEFAULT '',
  action          VARCHAR(20) NOT NULL DEFAULT 'login', -- login, logout, refresh
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_logs_student ON student_login_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_created ON student_login_logs(created_at DESC);

ALTER TABLE student_login_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_insert_login_logs" ON student_login_logs FOR INSERT WITH CHECK (true);

-- 3. Thêm cột last_active vào student_profiles (theo dõi lần cuối hoạt động)
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS last_ip VARCHAR(45) DEFAULT '';
