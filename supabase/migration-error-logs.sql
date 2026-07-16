-- Migration: Add error_logs table for server error monitoring
-- Chạy trong Supabase SQL Editor

CREATE TABLE IF NOT EXISTS error_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level           VARCHAR(20) DEFAULT 'error',
  message         TEXT NOT NULL,
  stack           TEXT,
  context         JSONB,
  ip              VARCHAR(45),
  user_agent      TEXT,
  path            TEXT,
  method          VARCHAR(10),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);

-- Public read policy (cho phép admin đọc từ API)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_read_error_logs" ON error_logs FOR SELECT USING (true);
CREATE POLICY "service_insert_error_logs" ON error_logs FOR INSERT WITH CHECK (true);
