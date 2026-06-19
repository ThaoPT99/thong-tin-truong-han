-- ============================================================
-- MIGRATION: Access Control Blocklist (cho phép mặc định, chỉ chặn khi có rule)
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- 1. Tạo bảng access_control (BLOCKLIST: block_password, block_ip, block_email)
CREATE TABLE IF NOT EXISTS access_control (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            VARCHAR(20) NOT NULL, -- 'block_password', 'block_ip', 'block_email'
  value           TEXT NOT NULL, -- password hash, IP, email
  description     TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tạo bảng access_logs (audit log)
CREATE TABLE IF NOT EXISTS access_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip              VARCHAR(45),
  user_agent      TEXT,
  path            TEXT,
  method          VARCHAR(10),
  status          INTEGER,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  blocked         BOOLEAN DEFAULT false,
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip ON access_logs(ip);
CREATE INDEX IF NOT EXISTS idx_access_control_type ON access_control(type);

-- 4. Row Level Security
ALTER TABLE access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Drop existing policies first (avoid "already exists" error)
DROP POLICY IF EXISTS "director_access_control" ON access_control;
DROP POLICY IF EXISTS "director_access_logs" ON access_logs;

-- Policy: Chỉ director (role = director) mới được CRUD access_control
CREATE POLICY "director_access_control" ON access_control
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'director'
  );

-- Access logs: director thấy tất cả
CREATE POLICY "director_access_logs" ON access_logs
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'director'
  );