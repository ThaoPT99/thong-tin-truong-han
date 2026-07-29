-- ============================================================
-- Migration: Premium & Payment system for B2C
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bảng premium subscriptions
CREATE TABLE IF NOT EXISTS student_premium (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  is_premium      BOOLEAN DEFAULT false,
  premium_type    VARCHAR(30) DEFAULT 'basic', -- 'basic', 'pro', 'vip'
  premium_until   TIMESTAMPTZ,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_premium_email ON student_premium(email);
CREATE INDEX IF NOT EXISTS idx_premium_active ON student_premium(is_premium) WHERE is_premium = true;

-- 2. Bảng giao dịch thanh toán
CREATE TABLE IF NOT EXISTS payment_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL,
  student_name    VARCHAR(200),
  student_phone   VARCHAR(20),
  amount          INTEGER NOT NULL, -- số tiền (VND)
  currency        VARCHAR(10) DEFAULT 'VND',
  payment_method  VARCHAR(30) NOT NULL, -- 'stripe', 'bank_transfer'
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  bank_receipt_url VARCHAR(500),
  status          VARCHAR(30) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  premium_type    VARCHAR(30) DEFAULT 'basic', -- 'basic', 'pro', 'vip'
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_email ON payment_transactions(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payment_transactions(created_at DESC);

-- 3. Bảng premium feature usage (giới hạn số lần dùng cho 1 số features)
CREATE TABLE IF NOT EXISTS premium_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL,
  feature         VARCHAR(50) NOT NULL, -- 'consistency_check', 'visa_score', 'expert_review'
  used_count      INTEGER DEFAULT 0,
  max_count       INTEGER DEFAULT -1, -- -1 = không giới hạn
  last_used_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, feature)
);

-- RLS policies
ALTER TABLE student_premium ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_usage ENABLE ROW LEVEL SECURITY;

-- Public read policy cho student_premium (chỉ đọc bản ghi của chính mình)
CREATE POLICY "read_own_premium" ON student_premium
  FOR SELECT USING (email = current_setting('request.jwt.claims')::json->>'email');

-- Insert policy cho payment_transactions (cho phép insert từ API)
CREATE POLICY "insert_payments" ON payment_transactions
  FOR INSERT WITH CHECK (true);

-- Admin policies (service_role key bypasses RLS)
