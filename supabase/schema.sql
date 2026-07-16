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
  application_form_url VARCHAR(500) DEFAULT '',
  image_main       VARCHAR(500) DEFAULT 'images/placeholder.svg',
  image_catalog    VARCHAR(500),
  image_location   VARCHAR(500),
  image_invoice    VARCHAR(500),
  visa_type        VARCHAR(10) DEFAULT 'D2-6',
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

-- 3b. Ghi chú nội bộ (chỉ admin xem)
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internal_note TEXT DEFAULT '';

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

-- 5. Semesters — danh sách kỳ tuyển sinh
CREATE TABLE IF NOT EXISTS semesters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ky            VARCHAR(10) NOT NULL,
  nam           VARCHAR(10) NOT NULL,
  title         TEXT,
  is_active     BOOLEAN DEFAULT false,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ky, nam)
);

-- 5b. Semester-schools — trường nào thuộc kỳ nào
CREATE TABLE IF NOT EXISTS semester_schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id   UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(semester_id, school_id)
);

-- Migrate: copy dữ liệu từ semester_info cũ sang semesters
INSERT INTO semesters (ky, nam, title, is_active, sort_order)
SELECT COALESCE(ky, '3'), COALESCE(nam, '2027'), COALESCE(title, ''), true, 0
FROM semester_info
WHERE EXISTS (SELECT 1 FROM semester_info)
ON CONFLICT (ky, nam) DO NOTHING;

-- 5c. Semester info (giữ lại để không break API cũ, sẽ xoá sau)
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
CREATE INDEX IF NOT EXISTS idx_schools_visa_type ON schools(visa_type);
CREATE INDEX IF NOT EXISTS idx_schools_system ON schools(system);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_semester ON students(semester_id);
CREATE INDEX IF NOT EXISTS idx_student_logs_student ON student_logs(student_id);

-- 9. Students — CRM mini
CREATE TABLE IF NOT EXISTS students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  phone           VARCHAR(20),
  email           VARCHAR(200),
  gender          VARCHAR(10),
  age             INTEGER DEFAULT 0,
  gpa             DECIMAL(3,1),
  korean_level    VARCHAR(20),
  school_id       UUID REFERENCES schools(id) ON DELETE SET NULL,
  semester_id     UUID REFERENCES semesters(id) ON DELETE SET NULL,
  owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  status          VARCHAR(30) DEFAULT 'new', -- new, consulting, applied, waiting_visa, visa_approved, visa_rejected, enrolled
  note            TEXT,
  next_action     TEXT,
  next_action_date DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- History log cho mỗi student
CREATE TABLE IF NOT EXISTS student_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  action          VARCHAR(100) NOT NULL,
  description     TEXT,
  created_by      VARCHAR(200),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_semester ON students(semester_id);
CREATE INDEX IF NOT EXISTS idx_students_owner ON students(owner_id);
CREATE INDEX IF NOT EXISTS idx_student_logs_student ON student_logs(student_id);

-- 10. Access Control — Quản lý truy cập web riêng (BLOCKLIST: mặc định cho phép, chỉ chặn khi có rule)
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

-- Access log để audit
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

CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip ON access_logs(ip);
CREATE INDEX IF NOT EXISTS idx_access_control_type ON access_control(type);
CREATE INDEX IF NOT EXISTS idx_student_logs_student ON student_logs(student_id);
ALTER TABLE school_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_visa_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_schools ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "public_read_semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "public_read_semester_schools" ON semester_schools FOR SELECT USING (true);
CREATE POLICY "public_read_semester" ON semester_info FOR SELECT USING (true);

-- 11. Applications — Đơn đăng ký nhập học từ học sinh
CREATE TABLE IF NOT EXISTS school_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES students(id) ON DELETE SET NULL,
  
  -- Personal Info
  full_name       VARCHAR(200) NOT NULL,
  full_name_kr    VARCHAR(200) DEFAULT '',
  full_name_en    VARCHAR(200) DEFAULT '',
  date_of_birth   DATE,
  gender          VARCHAR(10) DEFAULT '',
  nationality     VARCHAR(100) DEFAULT 'Vietnam',
  passport_no     VARCHAR(50) DEFAULT '',
  passport_expiry DATE,
  phone           VARCHAR(20) DEFAULT '',
  email           VARCHAR(200) DEFAULT '',
  address         TEXT DEFAULT '',
  
  -- Education
  high_school_name    VARCHAR(200) DEFAULT '',
  high_school_address TEXT DEFAULT '',
  high_school_start   DATE,
  high_school_end     DATE,
  high_school_major   VARCHAR(200) DEFAULT '',
  high_school_gpa     DECIMAL(3,1),
  high_school_absences INTEGER DEFAULT 0,
  high_school_status  VARCHAR(30) DEFAULT 'graduated',
  university_name     VARCHAR(200) DEFAULT '',
  university_major    VARCHAR(200) DEFAULT '',
  university_start    DATE,
  university_end      DATE,
  university_gpa      DECIMAL(3,1),
  university_degree   VARCHAR(100) DEFAULT '',
  
  -- Korean
  korean_level     VARCHAR(20) DEFAULT 'none',
  topik_level      INTEGER,
  korean_education TEXT DEFAULT '',
  
  -- Family
  father_name       VARCHAR(200) DEFAULT '',
  father_occupation VARCHAR(200) DEFAULT '',
  father_phone      VARCHAR(20) DEFAULT '',
  mother_name       VARCHAR(200) DEFAULT '',
  mother_occupation VARCHAR(200) DEFAULT '',
  mother_phone      VARCHAR(20) DEFAULT '',
  
  -- Selection
  school_id       UUID REFERENCES schools(id) ON DELETE SET NULL,
  semester_id     UUID REFERENCES semesters(id) ON DELETE SET NULL,
  
  -- Documents (file URLs or status)
  doc_application_form     VARCHAR(500) DEFAULT '',
  doc_study_plan           VARCHAR(500) DEFAULT '',
  doc_self_introduction    VARCHAR(500) DEFAULT '',
  doc_high_school_diploma  VARCHAR(500) DEFAULT '',
  doc_high_school_transcript VARCHAR(500) DEFAULT '',
  doc_passport_copy        VARCHAR(500) DEFAULT '',
  doc_birth_certificate    VARCHAR(500) DEFAULT '',
  doc_family_register      VARCHAR(500) DEFAULT '',
  doc_bank_statement       VARCHAR(500) DEFAULT '',
  doc_health_certificate   VARCHAR(500) DEFAULT '',
  doc_photo                VARCHAR(500) DEFAULT '',
  doc_topik_certificate    VARCHAR(500) DEFAULT '',
  doc_other                TEXT DEFAULT '',
  
  -- Status
  status          VARCHAR(30) DEFAULT 'draft', -- draft, submitted, reviewing, approved, rejected
  admin_note      TEXT DEFAULT '',
  
  -- Metadata
  source          VARCHAR(50) DEFAULT 'web',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON school_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_school ON school_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_applications_semester ON school_applications(semester_id);
CREATE INDEX IF NOT EXISTS idx_applications_created ON school_applications(created_at DESC);

-- Public read: chỉ cho phép đọc nếu biết ID (dùng để tra cứu)
ALTER TABLE school_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_applications" ON school_applications FOR INSERT WITH CHECK (true);

-- Indexes cho semesters
CREATE INDEX IF NOT EXISTS idx_semester_schools_semester ON semester_schools(semester_id);
CREATE INDEX IF NOT EXISTS idx_semester_schools_school ON semester_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_semesters_active ON semesters(is_active);
