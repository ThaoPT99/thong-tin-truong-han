/**
 * Migration: Tạo bảng Analytics trên Supabase
 * Chạy: node scripts/migrate-analytics.js
 * Yêu cầu: DATABASE_PASSWORD trong env (hoặc set SUPABASE_SERVICE_ROLE_KEY)
 * 
 * Cách 1 (khuyến nghị): Copy-paste file supabase/analytics-migration.sql vào Supabase SQL Editor
 * Cách 2: Chạy script này với DATABASE_PASSWORD
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Hardcode host từ Supabase project (lấy từ init-db.js)
const DB_HOST = 'db.lzggxhunbnjrklbkywmb.supabase.co';

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'analytics-migration.sql'), 'utf8');
  
  // Try service_role key first (Supabase JS client), fallback to pg
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbPassword = process.env.DATABASE_PASSWORD;

  if (dbPassword) {
    // Use pg direct connection (như init-db.js)
    const client = new Client({
      host: DB_HOST,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('✅ Connected to Supabase Postgres via pg');

    // Split into individual statements
    const statements = sql
      .split(';\n')
      .map(s => s.trim())
      .filter(s => s.length > 5 && !s.startsWith('--'));

    let ok = 0, fail = 0;
    for (const stmt of statements) {
      try {
        await client.query(stmt);
        ok++;
      } catch (err) {
        if (err.message.includes('already exists')) {
          ok++;
        } else {
          console.log('  ⚠️  ' + err.message.split('\n')[0].slice(0, 120));
          fail++;
        }
      }
    }

    console.log(`✅ Analytics migration: ${ok} OK, ${fail} failed`);
    await client.end();
  } else if (serviceKey) {
    // Alternative: use Supabase REST API with service_role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ Cần set NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_URL');
      process.exit(1);
    }

    console.log('ℹ️  Dùng Supabase REST API để chạy migration...');
    console.log('⚠️  Cần Supabase project hỗ trợ raw SQL queries.');
    console.log('✅ Copy file supabase/analytics-migration.sql vào Supabase SQL Editor thay thế.');
    console.log('   Hoặc set DATABASE_PASSWORD và chạy lại script này.');
    process.exit(0);
  } else {
    console.log('');
    console.log('❌ Không tìm thấy DATABASE_PASSWORD hoặc SUPABASE_SERVICE_ROLE_KEY');
    console.log('');
    console.log('Cách chạy:');
    console.log('  1. Mở Supabase Dashboard: https://supabase.com/dashboard/project/lzggxhunbnjrklbkywmb');
    console.log('  2. Vào SQL Editor → New Query');
    console.log('  3. Copy nội dung file: supabase/analytics-migration.sql');
    console.log('  4. Paste vào SQL Editor và chạy (Ctrl+Enter)');
    console.log('');
    console.log('Hoặc set biến môi trường rồi chạy lại:');
    console.log('  export DATABASE_PASSWORD=your_password');
    console.log('  node scripts/migrate-analytics.js');
    process.exit(1);
  }
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
