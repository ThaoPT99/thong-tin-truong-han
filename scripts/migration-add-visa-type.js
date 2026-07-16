// Migration: Thêm cột visa_type vào bảng schools
// Chạy: node scripts/migration-add-visa-type.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('🔄 Bắt đầu migration thêm cột visa_type...');

  // Bước 1: Thêm cột visa_type
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE schools ADD COLUMN IF NOT EXISTS visa_type VARCHAR(10) DEFAULT 'D2-6';`
  });

  if (alterError) {
    // Fallback: thử SQL trực tiếp
    console.log('⚠️ RPC exec_sql không khả dụng, thử SQL trực tiếp...');
    const { error: directError } = await supabase
      .from('schools')
      .update({ visa_type: 'D2-6' })
      .is('visa_type', null);
    
    if (directError) {
      console.error('❌ Lỗi update visa_type:', directError.message);
      // Có thể chưa có cột, thử add column qua SQL editor thủ công
      console.log('⚠️ Vui lòng chạy SQL sau trong Supabase SQL Editor:');
      console.log(`
ALTER TABLE schools ADD COLUMN IF NOT EXISTS visa_type VARCHAR(10) DEFAULT 'D2-6';
CREATE INDEX IF NOT EXISTS idx_schools_visa_type ON schools(visa_type);

-- Gán D2-6 cho các trường cũ (nếu NULL)
UPDATE schools SET visa_type = 'D2-6' WHERE visa_type IS NULL;
      `);
      process.exit(1);
    }
  }

  // Bước 2: Tạo index
  try {
    await supabase.rpc('exec_sql', {
      sql: `CREATE INDEX IF NOT EXISTS idx_schools_visa_type ON schools(visa_type);`
    });
  } catch (e) {
    console.log('⚠️ Không tạo được index, bỏ qua');
  }

  // Bước 3: Gán D2-6 cho tất cả trường hiện tại
  const { error: updateError } = await supabase
    .from('schools')
    .update({ visa_type: 'D2-6' })
    .is('visa_type', null);

  if (updateError) {
    console.error('❌ Lỗi gán D2-6 cho trường cũ:', updateError.message);
    process.exit(1);
  }

  // Bước 4: Kiểm tra kết quả
  const { data: count, error: countError } = await supabase
    .from('schools')
    .select('visa_type', { count: 'exact' });

  if (countError) {
    console.error('❌ Lỗi kiểm tra:', countError.message);
    process.exit(1);
  }

  console.log(`✅ Migration hoàn tất! Tổng số trường: ${count.length}`);
  
  const { data: d26Count } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .eq('visa_type', 'D2-6');
  const { data: d41Count } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .eq('visa_type', 'D4-1');

  console.log(`   - D2-6: ${d26Count?.count || 0} trường`);
  console.log(`   - D4-1: ${d41Count?.count || 0} trường`);
  process.exit(0);
}

migrate();
