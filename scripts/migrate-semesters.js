// Migration: thêm bảng semesters + semester_schools, migrate dữ liệu từ semester_info
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Cần set SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔄 Running semester migration...');

  // 1. Create semesters table
  const { error: e1 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS semesters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ky VARCHAR(10) NOT NULL,
        nam VARCHAR(10) NOT NULL,
        title TEXT,
        is_active BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(ky, nam)
      );
    `
  });
  if (e1 && !e1.message?.includes('already exists')) {
    console.log('⚠️  RPC not available, trying direct INSERT...', e1.message);
  } else {
    console.log('✅ semesters table created');
  }

  // Try creating tables via raw SQL using the pg client connection
  // Since supabase.rpc('exec_sql') may not exist, let's use a different approach
  
  // Check if semesters table exists
  const { data: existingSems } = await supabase.from('semesters').select('id').limit(1);
  if (existingSems && existingSems.length > 0) {
    console.log('✅ semesters table already has data, skipping migration');
    return;
  }

  // Try to create via POST to management API
  console.log('📋 Attempting to create tables via Supabase Management API...');

  // Fallback: try direct insert of a test row
  const { data: oldSem } = await supabase.from('semester_info').select('*').limit(1).maybeSingle();
  
  if (oldSem) {
    // Try inserting directly - if table doesn't exist, this will error
    try {
      const { error: insErr } = await supabase.from('semesters').insert({
        ky: oldSem.ky || '3',
        nam: oldSem.nam || '2027',
        title: oldSem.title || `Kỳ tháng ${oldSem.ky || '3'}/${oldSem.nam || '2027'}`,
        is_active: true,
        sort_order: 0,
      }).select('*').single();
      
      if (insErr) {
        console.error('❌ Table does not exist or insert failed:', insErr.message);
        console.log('\n📋 === VUI LÒNG CHẠY SQL SAU TRONG SUPABASE SQL EDITOR ===');
        console.log('Link: https://supabase.com/dashboard/project/fhuixmxxmpjpsagqgrnk/sql/new');
        console.log('\n--- Copy and paste this SQL ---\n');
        console.log(getMigrationSQL());
        return;
      }
      console.log('✅ Semester created successfully!');
    } catch (e) {
      console.error('❌ Error:', e.message);
      console.log('\n📋 === VUI LÒNG CHẠY SQL SAU TRONG SUPABASE SQL EDITOR ===');
      console.log(getMigrationSQL());
      return;
    }
  }

  // Assign all schools to this semester
  if (oldSem) {
    const { data: newSem } = await supabase.from('semesters').select('id').eq('ky', oldSem.ky).eq('nam', oldSem.nam).maybeSingle();
    const { data: allSchools } = await supabase.from('schools').select('id');
    
    if (newSem && allSchools && allSchools.length > 0) {
      const rows = allSchools.map(s => ({ semester_id: newSem.id, school_id: s.id }));
      const { error: ssErr } = await supabase.from('semester_schools').upsert(rows, { onConflict: 'semester_id,school_id', ignoreDuplicates: true });
      if (ssErr) {
        console.log('⚠️ Could not assign schools to semester:', ssErr.message);
      } else {
        console.log(`✅ Assigned ${rows.length} schools to the semester`);
      }
    }
  }
}

function getMigrationSQL() {
  return `-- ==============================================
-- Migration: Add semesters + semester_schools tables
-- Run this in Supabase SQL Editor
-- ==============================================

-- 1. Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ky VARCHAR(10) NOT NULL,
  nam VARCHAR(10) NOT NULL,
  title TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ky, nam)
);

-- 2. Create semester_schools table
CREATE TABLE IF NOT EXISTS semester_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(semester_id, school_id)
);

-- 3. RLS
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_schools ENABLE ROW LEVEL SECURITY;

-- 4. Public read policies
CREATE POLICY "public_read_semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "public_read_semester_schools" ON semester_schools FOR SELECT USING (true);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_semester_schools_semester ON semester_schools(semester_id);
CREATE INDEX IF NOT EXISTS idx_semester_schools_school ON semester_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_semesters_active ON semesters(is_active);

-- 6. Migrate data from semester_info
INSERT INTO semesters (ky, nam, title, is_active, sort_order)
SELECT COALESCE(ky, '3'), COALESCE(nam, '2027'), COALESCE(title, ''), true, 0
FROM semester_info
WHERE EXISTS (SELECT 1 FROM semester_info)
ON CONFLICT (ky, nam) DO NOTHING;

-- 7. Assign all schools to the first semester
INSERT INTO semester_schools (semester_id, school_id)
SELECT s.id, sch.id
FROM semesters s
CROSS JOIN schools sch
WHERE s.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM semester_schools ss
  WHERE ss.semester_id = s.id AND ss.school_id = sch.id
);`;
}

runMigration();
