/**
 * Khởi tạo database: chạy schema.sql
 * Chạy: node scripts/init-db.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
  
  const client = new Client({
    host: 'db.lzggxhunbnjrklbkywmb.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Hoangtumua@123',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to Supabase Postgres');

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
        console.log('  ⚠️  ' + err.message.split('\n')[0].slice(0, 100));
        fail++;
      }
    }
  }

  console.log(`✅ Schema: ${ok} OK, ${fail} failed`);
  await client.end();
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
