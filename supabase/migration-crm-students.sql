-- ============================================================
-- CRM Học sinh — Cho sale cập nhật thông tin
-- ============================================================

CREATE TABLE IF NOT EXISTS crm_students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ─── Thông tin cơ bản ───
  full_name       VARCHAR(200) NOT NULL,
  birth_date      DATE,
  birthplace      TEXT,             -- Quê quán
  id_number       VARCHAR(50),      -- Số CCCD / Hộ chiếu

  -- ─── Trường Việt ───
  vn_school       VARCHAR(200),
  vn_major        VARCHAR(200),

  -- ─── Trường Hàn ───
  kr_school       VARCHAR(200),
  kr_major        VARCHAR(200),

  -- ─── Chứng chỉ tiếng ───
  language_cert   TEXT,             -- VD: TOPIK 3, Sejong 2, IELTS 5.5...

  -- ─── Lớp học ───
  cd_class        VARCHAR(50),      -- VD: "Lớp số 3"
  sejong_class    VARCHAR(50),     -- VD: "Sejong 1"

  -- ─── Thanh toán ───
  payment_count   INTEGER DEFAULT 0,
  payment_amount  DECIMAL(15,0) DEFAULT 0,  -- Tổng số tiền đã đóng (VNĐ)

  -- ─── Học sinh nguồn (thêm) ───
  is_source       BOOLEAN DEFAULT false,
  family_info     JSONB DEFAULT '{}',  -- { members: 4, father_job: "...", mother_job: "...", has_bhp: false, bhp_note: "..." }

  -- ─── Sales tracking ───
  status          VARCHAR(30) DEFAULT 'new',
  -- new, contacted, consulting, enrolled, converted, dropped
  sale_note       TEXT,             -- Ghi chú nội bộ của sale
  owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_students_status ON crm_students(status);
CREATE INDEX IF NOT EXISTS idx_crm_students_owner ON crm_students(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_students_full_name ON crm_students(full_name);
CREATE INDEX IF NOT EXISTS idx_crm_students_created ON crm_students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_students_source ON crm_students(is_source);

-- ============================================================
-- Audit Log — Lịch sử thay đổi CRM
-- ============================================================

CREATE TABLE IF NOT EXISTS crm_audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES crm_students(id) ON DELETE SET NULL,
  action          VARCHAR(50) NOT NULL,  -- 'created', 'updated', 'deleted'
  changes         JSONB DEFAULT '{}',    -- { field: { old: ..., new: ... } }
  changed_by      VARCHAR(200) NOT NULL, -- Email người thay đổi
  changed_by_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_audit_student ON crm_audit_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_crm_audit_created ON crm_audit_logs(created_at DESC);

-- RLS off (admin-only via API)
ALTER TABLE crm_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_audit_logs ENABLE ROW LEVEL SECURITY;
