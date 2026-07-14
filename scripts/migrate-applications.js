/**
 * Migration: Thêm bảng school_applications
 * Chạy: node scripts/migrate-applications.js
 * 
 * Nếu DATABASE_PASSWORD không được set, script sẽ in ra SQL để chạy thủ công.
 */

const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const dbPassword = process.env.DATABASE_PASSWORD;

const MIGRATION_SQL = `
-- ==============================================
-- Migration: Thêm bảng school_applications
-- Chạy trong Supabase SQL Editor
-- ==============================================

-- 1. Tạo bảng school_applications
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
  status          VARCHAR(30) DEFAULT 'draft',
  admin_note      TEXT DEFAULT '',
  
  -- Metadata
  source          VARCHAR(50) DEFAULT 'web',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON school_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_school ON school_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_applications_semester ON school_applications(semester_id);
CREATE INDEX IF NOT EXISTS idx_applications_created ON school_applications(created_at DESC);

-- 3. Row Level Security
ALTER TABLE school_applications ENABLE ROW LEVEL SECURITY;

-- 4. Policy: cho phép public INSERT (gửi đơn), admin có thể SELECT/UPDATE qua service_role
CREATE POLICY "public_insert_applications" ON school_applications
  FOR INSERT WITH CHECK (true);

-- 5. Policy: cho phép tra cứu theo ID (public GET)
CREATE POLICY "public_select_applications" ON school_applications
  FOR SELECT USING (true);

-- 6. Verify
SELECT '✅ school_applications table created successfully' as result;
`;

async function runMigration() {
  console.log('🔄 Migration: Thêm bảng school_applications...\n');

  // Try direct PG connection first
  if (dbPassword) {
    try {
      const client = new Client({
        host: 'db.lzggxhunbnjrklbkywmb.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: dbPassword,
        ssl: { rejectUnauthorized: false },
      });

      await client.connect();
      console.log('✅ Connected to Supabase Postgres via direct PG');

      // Split SQL into individual statements
      const statements = MIGRATION_SQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 5 && !s.startsWith('--') && !s.startsWith('\n--'));

      let ok = 0, fail = 0;
      for (const stmt of statements) {
        try {
          await client.query(stmt + ';');
          ok++;
          process.stdout.write('  ✅ ');
        } catch (err) {
          if (err.message.includes('already exists')) {
            ok++;
            process.stdout.write('  ⏩ ');
          } else {
            fail++;
            process.stdout.write('  ❌ ');
          }
          console.log(err.message.split('\n')[0].slice(0, 120));
        }
      }

      console.log(`\n📊 Result: ${ok} OK, ${fail} failed`);
      await client.end();

      if (fail === 0) {
        console.log('\n✅ Migration thành công!');
      } else {
        console.log('\n⚠️  Có lỗi, kiểm tra lại SQL hoặc chạy thủ công trong Supabase SQL Editor');
      }
      return;
    } catch (err) {
      console.log('⚠️  PG direct connection failed:', err.message);
    }
  }

  // Try Supabase client (REST)
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Try to insert a test row to see if table exists
      const { error: testErr } = await supabase
        .from('school_applications')
        .select('id')
        .limit(1);

      if (!testErr) {
        console.log('✅ Bảng school_applications đã tồn tại!');
        return;
      }

      // Table doesn't exist, try via RPC
      const { error: rpcErr } = await supabase.rpc('exec_sql', {
        sql: MIGRATION_SQL
      });

      if (rpcErr) {
        console.log('⚠️  RPC exec_sql không khả dụng:', rpcErr.message);
        throw new Error('rpc_failed');
      }

      console.log('✅ Migration thành công!');
      return;
    } catch (err) {
      if (err.message !== 'rpc_failed') {
        console.log('⚠️  Supabase client failed:', err.message);
      }
    }
  }

  // Fallback: print SQL for manual execution
  console.log('\n📋 === CHẠY THỦ CÔNG TRONG SUPABASE SQL EDITOR ===');
  console.log('Link: https://supabase.com/dashboard/project/lzggxhunbnjrklbkywmb/sql/new');
  console.log('\nCopy và paste đoạn SQL sau:\n');
  console.log(MIGRATION_SQL);
  console.log('\n📋 === HẾT ===');
}

runMigration().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
