-- ============================================================
-- Migration Phase 4: Learning Agent — Case Database
-- Bảng lưu case học sinh đã tư vấn + kết quả thực tế
-- ============================================================

-- 1. Bảng advisor_cases — lưu từng case tư vấn
CREATE TABLE IF NOT EXISTS advisor_cases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Thông tin hồ sơ (snapshot tại thời điểm tư vấn)
  student_name      VARCHAR(200) DEFAULT '',
  student_phone     VARCHAR(20) DEFAULT '',
  student_profile   JSONB NOT NULL DEFAULT '{}',

  -- Kết quả tư vấn
  visa_type         VARCHAR(10) NOT NULL DEFAULT 'D2-6',
  recommendation    JSONB DEFAULT '{}',
  top_schools       JSONB DEFAULT '[]',     -- [{id, name, score, level}]
  ai_advice         TEXT DEFAULT '',         -- Raw AI response text

  -- Kết quả thực tế (chuyên viên xác nhận)
  result            VARCHAR(20) DEFAULT 'pending'
                    CHECK (result IN ('pending', 'approved', 'rejected', 'other')),
  confirmed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at      TIMESTAMPTZ,
  notes             TEXT DEFAULT '',
  lessons_learned   TEXT[] DEFAULT '{}',     -- Bài học rút ra (tags)

  -- Liên kết
  school_id         UUID REFERENCES schools(id) ON DELETE SET NULL,
  semester_id       UUID REFERENCES semesters(id) ON DELETE SET NULL,
  student_id        UUID REFERENCES students(id) ON DELETE SET NULL,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Metadata
  tags              TEXT[] DEFAULT '{}',     -- Tags: "gap_year", "visa_fail", "topik3", ...
  is_flagged        BOOLEAN DEFAULT false,   -- Case đặc biệt cần chú ý
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_visa_type ON advisor_cases(visa_type);
CREATE INDEX IF NOT EXISTS idx_cases_result ON advisor_cases(result);
CREATE INDEX IF NOT EXISTS idx_cases_created ON advisor_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_student_name ON advisor_cases(student_name);
CREATE INDEX IF NOT EXISTS idx_cases_school ON advisor_cases(school_id);
CREATE INDEX IF NOT EXISTS idx_cases_confirmed ON advisor_cases(confirmed_at) WHERE confirmed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cases_tags ON advisor_cases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_cases_lessons ON advisor_cases USING GIN(lessons_learned);

-- RLS
ALTER TABLE advisor_cases ENABLE ROW LEVEL SECURITY;

-- Admin đọc tất cả
CREATE POLICY "admin_read_cases" ON advisor_cases FOR SELECT USING (true);
CREATE POLICY "admin_insert_cases" ON advisor_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_update_cases" ON advisor_cases FOR UPDATE USING (true);

-- Public insert (cho client anonymous gửi case lên)
CREATE POLICY "public_insert_cases" ON advisor_cases FOR INSERT WITH CHECK (true);
