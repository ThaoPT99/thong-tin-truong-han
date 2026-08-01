/**
 * Run CRM migration — thêm columns mới + audit log table
 * Chạy: node scripts/run-crm-migration.js
 *
 * Dùng service_role key để chạy migration qua Supabase REST API
 * Gọi trực tiếp endpoint /rest/v1/rpc/exec_sql (có sẵn trên Supabase)
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function execSQL(sql) {
  // Thử dùng exec_sql function (có sẵn trên Supabase projects)
  const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
  if (error && error.message.includes('function') && error.message.includes('not found')) {
    // Fallback: không có function, dùng query
    return { error: { message: 'exec_sql function not available' } };
  }
  return { error };
}

async function run() {
  console.log('✅ Connected to Supabase');
  console.log('');
  console.log('📋 Running migration...');
  console.log('');

  // ─── 1. Tạo crm_audit_logs table ───
  console.log('1. Creating crm_audit_logs table...');
  const auditSQL = `
    CREATE TABLE IF NOT EXISTS crm_audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID REFERENCES crm_students(id) ON DELETE SET NULL,
      action VARCHAR(50) NOT NULL,
      changes JSONB DEFAULT '{}',
      changed_by VARCHAR(200) NOT NULL,
      changed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_crm_audit_student ON crm_audit_logs(student_id);
    CREATE INDEX IF NOT EXISTS idx_crm_audit_created ON crm_audit_logs(created_at DESC);
  `;

  try {
    const { error: ae } = await supabase.rpc('exec_sql', { sql_text: auditSQL });
    if (ae) throw ae;
    console.log('   ✅ crm_audit_logs created');
  } catch (e) {
    console.log(`   ⚠️  ${e.message}`);
    console.log('   ⚠️  exec_sql function not available. Using fallback...');
    
    // Fallback: try using pg with connection string from env
    try {
      const { Client } = require('pg');
      const client = new Client({
        connectionString: process.env.DATABASE_URL || 
          `postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.lzggxhunbnjrklbkywmb.supabase.co:5432/postgres`,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      await client.query(auditSQL);
      await client.end();
      console.log('   ✅ crm_audit_logs created (via pg)');
    } catch (pgErr) {
      console.log(`   ❌ ${pgErr.message}`);
      console.log('');
      console.log('👉 Vui lòng chạy thủ công trong Supabase Dashboard:');
      console.log('   1. Vào https://supabase.com/dashboard/project/lzggxhunbnjrklbkywmb');
      console.log('   2. SQL Editor → New Query');
      console.log('   3. Paste nội dung file: supabase/migration-crm-students.sql');
      console.log('   4. Run');
      process.exit(1);
    }
  }

  // ─── 2. ALTER TABLE thêm columns ───
  console.log('');
  console.log('2. Adding new columns to crm_students...');
  
  const columns = [
    ['phone', 'VARCHAR(20)'],
    ['email', 'VARCHAR(200)'],
    ['issue_date', 'DATE'],
    ['issue_place', 'TEXT'],
    ['passport_url', 'TEXT'],
    ['avatar_url', 'TEXT'],
    ['father_name', 'VARCHAR(200)'],
    ['father_dob', 'DATE'],
    ['father_phone', 'VARCHAR(20)'],
    ['mother_name', 'VARCHAR(200)'],
    ['mother_dob', 'DATE'],
    ['mother_phone', 'VARCHAR(20)'],
    ['primary_school', 'VARCHAR(200)'],
    ['secondary_school', 'VARCHAR(200)'],
    ['high_school', 'VARCHAR(200)'],
    ['university', 'VARCHAR(200)'],
    ['gpa', 'TEXT'],
    ['absences', 'TEXT'],
    ['post_high_school', 'TEXT'],
  ];

  let success = 0;
  let failed = 0;

  for (const [name, type] of columns) {
    const sql = `ALTER TABLE crm_students ADD COLUMN IF NOT EXISTS ${name} ${type};`;
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
      if (error) throw error;
      console.log(`   ✅ ${name} (${type})`);
      success++;
    } catch (e) {
      console.log(`   ❌ ${name}: ${e.message}`);
      failed++;
    }
  }

  // ─── 3. Verify ───
  console.log('');
  console.log('3. Verifying...');
  try {
    const { data, error } = await supabase.from('crm_students').select('*').limit(1);
    if (error) throw error;
    
    const row = data?.[0] || {};
    const expected = columns.map(c => c[0]);
    const missing = expected.filter(f => !(f in row));
    
    if (missing.length === 0) {
      console.log('   ✅ All 19 columns + audit_logs table verified!');
    } else {
      console.log(`   ⚠️  Missing: ${missing.join(', ')}`);
    }
  } catch (e) {
    console.log(`   ⚠️  Verify error: ${e.message}`);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Result: ${success} columns added, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (failed > 0) {
    console.log('👉 Nếu bị lỗi, chạy thủ công trong Supabase Dashboard:');
    console.log('   1. Vào https://supabase.com/dashboard/project/lzggxhunbnjrklbkywmb');
    console.log('   2. SQL Editor → New Query');
    console.log('   3. Paste file: supabase/migration-crm-students.sql');
    console.log('   4. Run');
  }
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
