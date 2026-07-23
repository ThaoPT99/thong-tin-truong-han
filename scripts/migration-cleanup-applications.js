// Migration: Xoá bảng school_applications (sau khi bỏ tab "Gửi đơn")
// Chạy: node scripts/migration-cleanup-applications.js
// Yêu cầu: SUPABASE_SERVICE_ROLE_KEY và NEXT_PUBLIC_SUPABASE_URL trong .env
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.log('');
  console.log('📋 Cách thủ công:');
  console.log('1. Mở https://supabase.com/dashboard/project/lzggxhunbnjrklbkywmb');
  console.log('2. Vào SQL Editor → New Query');
  console.log('3. Copy-Paste nội dung file supabase/migration-cleanup-remove-applications.sql');
  console.log('4. Chạy (Ctrl+Enter)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔄 Bắt đầu migration cleanup applications...\n');

  // Đọc file SQL
  const fs = require('fs');
  const path = require('path');
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migration-cleanup-remove-applications.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Không tìm thấy file migration:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Method 1: Use exec_sql RPC
  try {
    console.log('📤 Đang chạy SQL qua RPC exec_sql...');
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
    if (error) throw error;
    console.log('✅ Migration thành công!');
    return;
  } catch (rpcErr) {
    console.log('⚠️ RPC exec_sql không khả dụng:', rpcErr.message);
    console.log('⚠️ Thử cách 2: Chạy từng câu lệnh...');
  }

  // Method 2: Chạy từng câu lệnh SQL riêng lẻ
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && !s.startsWith('SELECT'));

  let success = 0;
  let failed = 0;

  for (const stmt of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_text: stmt + ';' });
      if (error) throw error;
      console.log(`  ✅ ${stmt.substring(0, 60)}...`);
      success++;
    } catch (err) {
      console.log(`  ❌ ${stmt.substring(0, 60)}... → ${err.message}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log(`\n✅ Migration hoàn tất: ${success} lệnh thành công`);
  } else {
    console.log(`\n⚠️ Migration: ${success} OK, ${failed} lỗi`);
    console.log('\n📋 Nếu có lỗi, hãy chạy thủ công:');
    console.log('1. Mở Supabase Dashboard → SQL Editor');
    console.log('2. Copy-Paste file supabase/migration-cleanup-remove-applications.sql');
    console.log('3. Chạy (Ctrl+Enter)');
  }
}

runMigration().catch(err => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
