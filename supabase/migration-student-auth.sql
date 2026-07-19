-- Migration: Student Auth — thêm bảng student_profiles
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS student_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id         UUID UNIQUE NOT NULL,         -- Supabase Auth user ID
  email           VARCHAR(255) NOT NULL,
  full_name       VARCHAR(200) DEFAULT '',
  phone           VARCHAR(20) DEFAULT '',
  avatar_url      VARCHAR(500) DEFAULT '',
  saved_schools   UUID[] DEFAULT '{}',          -- Danh sách trường đã lưu
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist progress: lưu trạng thái từng mục trong multi-step form
CREATE TABLE IF NOT EXISTS student_checklist_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  step_id         VARCHAR(50) NOT NULL,          -- 'personal', 'education', 'finance', 'risk', 'analysis'
  data            JSONB NOT NULL DEFAULT '{}',   -- Form data
  checklist       JSONB DEFAULT '{}',            -- AI-generated checklist items
  completed       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, step_id)
);

-- Study Plan drafts: lưu bản nháp AI + bản chỉnh sửa
CREATE TABLE IF NOT EXISTS student_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  doc_type        VARCHAR(50) NOT NULL,          -- 'study_plan', 'gap_explanation', 'visa_rejection'
  ai_draft        TEXT DEFAULT '',
  user_edit       TEXT DEFAULT '',
  final_version   TEXT DEFAULT '',
  status          VARCHAR(20) DEFAULT 'draft',   -- 'draft', 'reviewing', 'finalized'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_auth ON student_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_student_checklist_student ON student_checklist_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student ON student_documents(student_id);

-- Enable RLS (though we handle auth server-side)
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- Public read: students can read their own data (via API, not direct)
CREATE POLICY "public_insert_profiles" ON student_profiles FOR INSERT WITH CHECK (true);
