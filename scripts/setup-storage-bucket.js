/**
 * Script tạo Supabase Storage bucket "student-documents"
 * Chạy: node scripts/setup-storage-bucket.js
 *
 * Yêu cầu:
 * - Biến môi trường: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   (hoặc đặt trong file .env ở thư mục gốc)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Đọc .env.local trước, sau đó .env (nếu có)
// .env.local chứa thông tin thật (đã được gitignore)
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
        const value = parts.slice(1).join('=').trim();
        // Không ghi đè nếu biến đã được set trước đó
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu biến môi trường SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Tạo file .env với nội dung:');
  console.error('   SUPABASE_URL=https://xxx.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'student-documents';

async function main() {
  console.log(`\n📦 Đang kiểm tra bucket "${BUCKET_NAME}"...\n`);

  // 1. Liệt kê các bucket hiện có
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('❌ Lỗi liệt kê bucket:', listError.message);
    process.exit(1);
  }

  const existing = buckets.find(b => b.name === BUCKET_NAME);

  // 2. Tạo bucket nếu chưa tồn tại
  if (!existing) {
    console.log(`   ➕ Bucket "${BUCKET_NAME}" chưa tồn tại. Đang tạo...`);
    const { data: newBucket, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Cho phép đọc file public (AI-generated drafts, etc.)
      file_size_limit: 10485760, // 10MB
      allowed_mime_types: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'application/octet-stream',
      ],
    });

    if (createError) {
      console.error(`❌ Lỗi tạo bucket:`, createError.message);
      console.error(`\n   👉 Thử tạo thủ công trong Supabase Dashboard > Storage >`);
      console.error(`      Tạo bucket "${BUCKET_NAME}" (public)`);
      process.exit(1);
    }

    console.log(`   ✅ Bucket "${BUCKET_NAME}" đã được tạo thành công!`);
  } else {
    console.log(`   ✅ Bucket "${BUCKET_NAME}" đã tồn tại.`);

    // Cập nhật bucket thành public
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
      public: true,
    });
    if (updateError) {
      console.warn(`   ⚠️  Không thể cập nhật bucket:`, updateError.message);
    } else {
      console.log(`   ✅ Bucket đã được cập nhật thành public.`);
    }
  }

  // 3. Kiểm tra bucket hoạt động
  console.log(`\n   🔍 Kiểm tra bucket...`);
  const { data: testFiles } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
  if (testFiles !== null) {
    console.log(`   ✅ Bucket hoạt động bình thường.`);
  }

  console.log(`\n📋 Thông tin bucket:`);
  console.log(`   - Tên: ${BUCKET_NAME}`);
  console.log(`   - Public: true`);
  console.log(`   - Giới hạn: 10MB`);
  console.log(`   - Định dạng: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX, TXT`);

  // 4. Hướng dẫn SQL policies (cần chạy thủ công trong SQL Editor)
  console.log(`\n📝 Tiếp theo, chạy SQL policies trong Supabase SQL Editor:`);
  console.log(`\n-- ============================================`);
  console.log(`-- Storage policies cho bucket "${BUCKET_NAME}"`);
  console.log(`-- ============================================`);
  console.log(`
-- Cho phép public đọc file (vì bucket là public)
CREATE POLICY "public_read_student_docs"
ON storage.objects FOR SELECT
USING (bucket_id = '${BUCKET_NAME}');

-- Cho phép service_role upload/xoá
CREATE POLICY "service_manage_student_docs"
ON storage.objects FOR ALL
USING (bucket_id = '${BUCKET_NAME}')
WITH CHECK (bucket_id = '${BUCKET_NAME}');
`);

  console.log(`\n✅ Hoàn tất! Học sinh có thể upload giấy tờ lên bucket "${BUCKET_NAME}".`);
}

main().catch(err => {
  console.error('❌ Lỗi không xác định:', err);
  process.exit(1);
});
