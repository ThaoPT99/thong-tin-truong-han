/**
 * Script tạo Supabase Storage bucket "news-images"
 * Chạy: node scripts/setup-news-storage.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        if (!process.env[key]) process.env[key] = parts.slice(1).join('=').trim();
      }
    });
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'news-images';

async function main() {
  console.log(`\n📦 Đang tạo bucket "${BUCKET_NAME}"...\n`);
  const { data: buckets } = await supabase.storage.listBuckets();
  const existing = buckets.find(b => b.name === BUCKET_NAME);

  if (!existing) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      file_size_limit: 20971520, // 20MB
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    });
    if (error) {
      console.error('❌ Lỗi:', error.message);
      process.exit(1);
    }
    console.log(`   ✅ Bucket "${BUCKET_NAME}" đã tạo!`);
  } else {
    console.log(`   ✅ Bucket "${BUCKET_NAME}" đã tồn tại.`);
  }

  console.log(`\n📋 Tên: ${BUCKET_NAME} | Public: true | 20MB | JPEG/PNG/WEBP/GIF/SVG`);
  console.log(`\n✅ Hoàn tất!`);
}
main().catch(err => { console.error(err); process.exit(1); });
