-- ============================================================
-- Schema cho Dữ liệu trường Hàn (D2-6)
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bảng schools — thông tin chính
CREATE TABLE IF NOT EXISTS schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(200) NOT NULL,
  name_kr         VARCHAR(200),
  name_en         VARCHAR(200),
  system          VARCHAR(100),
  quota           INTEGER DEFAULT 0,
  region          VARCHAR(50),
  location        TEXT,
  intro           TEXT,
  tuition         TEXT,
  insurance       TEXT,
  ktx             TEXT,
  schedule        TEXT,
  documents_note  TEXT,
  mou             TEXT,
  website         VARCHAR(500),
  catalog_url     VARCHAR(500),
  invoice_url     VARCHAR(500),
  video_url       VARCHAR(500),
  video_youtube_id VARCHAR(50),
  video_title     VARCHAR(200),
  image_main       VARCHAR(500) DEFAULT 'images/placeholder.svg',
  image_catalog    VARCHAR(500),
  image_location   VARCHAR(500),
  image_invoice    VARCHAR(500),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng con (1-nhiều)
CREATE TABLE IF NOT EXISTS school_conditions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_majors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_advantages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_conversions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Đối tác
CREATE TABLE IF NOT EXISTS school_partners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  code          VARCHAR(20),
  name          VARCHAR(200),
  name_kr       VARCHAR(200),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, code)
);

-- 4. Advisor profiles (1-1 với schools)
CREATE TABLE IF NOT EXISTS school_advisor_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
  gender              VARCHAR(10) DEFAULT 'all',
  min_gpa             DECIMAL(3,1) DEFAULT 5.0,
  max_absences        INTEGER DEFAULT 30,
  region              VARCHAR(50),
  cost_level          INTEGER DEFAULT 3 CHECK (cost_level BETWEEN 1 AND 5),
  visa_chance         INTEGER DEFAULT 3 CHECK (visa_chance BETWEEN 1 AND 5),
  job_opportunity     INTEGER DEFAULT 3 CHECK (job_opportunity BETWEEN 1 AND 5),
  e7_opportunity      INTEGER DEFAULT 3 CHECK (e7_opportunity BETWEEN 1 AND 5),
  study_load          INTEGER DEFAULT 3 CHECK (study_load BETWEEN 1 AND 5),
  interview_difficulty INTEGER DEFAULT 2 CHECK (interview_difficulty BETWEEN 1 AND 5),
  tags                TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Semester info (1 dòng: kỳ tuyển sinh hiện tại)
CREATE TABLE IF NOT EXISTS semester_info (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ky            VARCHAR(10),
  nam           VARCHAR(10),
  title         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Extra sheets
CREATE TABLE IF NOT EXISTS extra_visa_checklist (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt           VARCHAR(10),
  group_name    TEXT,
  content       TEXT NOT NULL,
  note          TEXT,
  level         TEXT DEFAULT 'Bắt buộc',
  link_url      VARCHAR(500),
  link_text     VARCHAR(200),
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS extra_interviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt           VARCHAR(10),
  content       TEXT NOT NULL,
  link_url      VARCHAR(500),
  link_text     VARCHAR(200),
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Users (admin)
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  display_name    VARCHAR(100),
  role            VARCHAR(20) DEFAULT 'admin',
  is_active       BOOLEAN DEFAULT true,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_conditions_school ON school_conditions(school_id);
CREATE INDEX IF NOT EXISTS idx_majors_school ON school_majors(school_id);
CREATE INDEX IF NOT EXISTS idx_advantages_school ON school_advantages(school_id);
CREATE INDEX IF NOT EXISTS idx_conversions_school ON school_conversions(school_id);
CREATE INDEX IF NOT EXISTS idx_documents_school ON school_documents(school_id);
CREATE INDEX IF NOT EXISTS idx_partners_school ON school_partners(school_id);
CREATE INDEX IF NOT EXISTS idx_advisor_school ON school_advisor_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_schools_region ON schools(region);
CREATE INDEX IF NOT EXISTS idx_schools_system ON schools(system);

-- 10. Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_advantages ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_visa_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_info ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_schools" ON schools FOR SELECT USING (true);
CREATE POLICY "public_read_conditions" ON school_conditions FOR SELECT USING (true);
CREATE POLICY "public_read_majors" ON school_majors FOR SELECT USING (true);
CREATE POLICY "public_read_advantages" ON school_advantages FOR SELECT USING (true);
CREATE POLICY "public_read_conversions" ON school_conversions FOR SELECT USING (true);
CREATE POLICY "public_read_documents" ON school_documents FOR SELECT USING (true);
CREATE POLICY "public_read_partners" ON school_partners FOR SELECT USING (true);
CREATE POLICY "public_read_advisor" ON school_advisor_profiles FOR SELECT USING (true);
CREATE POLICY "public_read_checklist" ON extra_visa_checklist FOR SELECT USING (true);
CREATE POLICY "public_read_interviews" ON extra_interviews FOR SELECT USING (true);
CREATE POLICY "public_read_semester" ON semester_info FOR SELECT USING (true);
