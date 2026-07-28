/**
 * Cleanup: Xoá tất cả dữ liệu Tin tức & Thành tích
 * - Xoá tất cả bài viết trong bảng news_posts
 * - Xoá tất cả ảnh trong storage bucket news-images
 *
 * Chạy: node scripts/cleanup-news-data.js
 *
 * Yêu cầu: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env hoặc biến môi trường
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Load .env ───
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
  console.error('   Hãy set biến môi trường hoặc tạo file .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'news-images';

async function main() {
  console.log('\n🧹 BẮT ĐẦU DỌN DẸP DỮ LIỆU TIN TỨC\n');

  // ─── Bước 1: Xoá tất cả bài viết ───
  console.log('📰 Đang xoá bài viết trong bảng news_posts...');
  const { data: deletedPosts, error: deleteError } = await supabase
    .from('news_posts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (deleteError) {
    console.error('   ❌ Lỗi xoá bài viết:', deleteError.message);
  } else {
    console.log(`   ✅ Đã xoá tất cả bài viết trong bảng news_posts`);
  }

  // ─── Bước 2: Xoá tất cả ảnh trong storage bucket ───
  console.log('\n🖼️  Đang xoá ảnh trong bucket news-images...');

  // Liệt kê tất cả file trong bucket
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list('news', { limit: 1000 });

  if (listError) {
    // Thử list ở root nếu không có folder 'news'
    console.log('   ⚠️  Không list được folder news, thử list root bucket...');
    const { data: rootFiles, error: rootListError } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 1000 });

    if (rootListError) {
      if (rootListError.message?.includes('bucket') || rootListError.message?.includes('not found')) {
        console.log('   ℹ️  Bucket news-images không tồn tại, bỏ qua bước xoá ảnh.');
      } else {
        console.error('   ❌ Lỗi list file:', rootListError.message);
      }
    } else if (rootFiles && rootFiles.length > 0) {
      const filePaths = rootFiles.map(f => f.name);
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove(filePaths);

      if (removeError) {
        console.error('   ❌ Lỗi xoá file:', removeError.message);
      } else {
        console.log(`   ✅ Đã xoá ${filePaths.length} ảnh trong bucket`);
      }
    } else {
      console.log('   ℹ️  Bucket không có file nào.');
    }
  } else if (files && files.length > 0) {
    const filePaths = files.map(f => 'news/' + f.name);
    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove(filePaths);

    if (removeError) {
      console.error('   ❌ Lỗi xoá file:', removeError.message);
    } else {
      console.log(`   ✅ Đã xoá ${filePaths.length} ảnh trong news/`);
    }
  } else {
    console.log('   ℹ️  Không có ảnh nào trong bucket.');
  }

  // ─── Bước 3: Xoá luôn bucket (tuỳ chọn - xoá để làm sạch hoàn toàn) ───
  console.log('\n🗑️  Đang xoá bucket news-images...');
  const { error: deleteBucketError } = await supabase.storage
    .deleteBucket(BUCKET);

  if (deleteBucketError) {
    if (deleteBucketError.message?.includes('not found')) {
      console.log('   ℹ️  Bucket không tồn tại.');
    } else {
      console.log('   ⚠️  Không thể xoá bucket (có thể còn file):', deleteBucketError.message);
      console.log('   💡 Bucket sẽ được tạo lại tự động khi upload ảnh mới.');
    }
  } else {
    console.log('   ✅ Đã xoá bucket news-images');
  }

  console.log('\n✅ DỌN DẸP HOÀN TẤT!');
  console.log('📊 Các bài viết và ảnh tin tức đã được xoá sạch.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
