/**
 * Upload tài liệu Daeduk University lên mục Tin tức
 * - Upload 8 ảnh JPG + 5 PDF lên Supabase Storage
 * - Tạo bài viết trong bảng news_posts
 *
 * Chạy: node scripts/upload-daeduk-news.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Thieu SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'news-images';

// Source directory
// Check actual directory name
const projectDir = path.join(__dirname, '..');
const dirs = fs.readdirSync(projectDir);
const targetDir = dirs.find(d => d.includes('dae덕') || d.includes('주문식') || d.includes('RISE'));
if (!targetDir) {
  console.error('Khong tim thay thu muc chua file!');
  console.log('Cac thu muc trong project:', dirs.filter(d => !d.startsWith('.') && !d.startsWith('node_modules')).join(', '));
  process.exit(1);
}
const actualSourceDir = path.join(projectDir, targetDir);
console.log('Thu muc nguon:', actualSourceDir);

// Map of display names to sanitized storage names
const FILES = [
  // Image files: [displayName, storageName, contentType]
  { display: 'Trang 1 - Quy trinh dao tao', storage: 'daeduk-guide-01.jpg', type: 'image/jpeg' },
  { display: 'Trang 2 - Quy trinh dao tao', storage: 'daeduk-guide-02.jpg', type: 'image/jpeg' },
  { display: 'Trang 3 - Quy trinh dao tao', storage: 'daeduk-guide-03.jpg', type: 'image/jpeg' },
  { display: 'Trang 4 - Quy trinh dao tao', storage: 'daeduk-guide-04.jpg', type: 'image/jpeg' },
  { display: 'Trang 5 - Quy trinh dao tao', storage: 'daeduk-guide-05.jpg', type: 'image/jpeg' },
  { display: 'Trang 6 - Quy trinh dao tao', storage: 'daeduk-guide-06.jpg', type: 'image/jpeg' },
  { display: 'Trang 7 - Quy trinh dao tao', storage: 'daeduk-guide-07.jpg', type: 'image/jpeg' },
  { display: 'Trang 8 - Quy trinh dao tao', storage: 'daeduk-guide-08.jpg', type: 'image/jpeg' },
  // PDF files
  { display: 'Ban thoa thuan thuc tap', storage: 'daeduk-thoa-thuan-thuc-tap.pdf', type: 'application/pdf' },
  { display: 'Ban thoa thuan van hanh', storage: 'daeduk-thoa-thuan-van-hanh.pdf', type: 'application/pdf' },
  { display: 'Khao sat dao tao theo don dat hang', storage: 'daeduk-khao-sat-dao-tao.pdf', type: 'application/pdf' },
  { display: 'Quy dinh van hanh chuong trinh', storage: 'daeduk-quy-dinh-van-hanh.pdf', type: 'application/pdf' },
  { display: 'Hien truong thuc tap hop dong', storage: 'daeduk-hien-truong-thuc-tap.pdf', type: 'application/pdf' },
];

// Find actual source files by listing directory
function getActualFiles(dir) {
  const items = fs.readdirSync(dir);
  const jpgs = items.filter(f => f.endsWith('.jpg') || f.endsWith('.JPG')).sort();
  const pdfs = items.filter(f => f.endsWith('.pdf')).sort();
  return { jpgs, pdfs };
}

async function uploadFile(buffer, storageName, contentType) {
  const prefix = Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const filePath = prefix + '-' + storageName;

  // Check bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.id === BUCKET);
  if (!bucketExists) {
    console.log('   Tao bucket ' + BUCKET + '...');
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      file_size_limit: 20971520,
      allowed_mime_types: [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'application/pdf'
      ],
    });
    if (createError) throw new Error('Khong the tao bucket: ' + createError.message);
    console.log('   Da tao bucket ' + BUCKET);
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return publicUrl;
}

async function main() {
  console.log('\n=== BAT DAU UPLOAD TAI LIEU DAEDUK UNIVERSITY ===\n');

  const { jpgs, pdfs } = getActualFiles(actualSourceDir);
  console.log('Tim thay ' + jpgs.length + ' anh JPG, ' + pdfs.length + ' file PDF\n');

  if (jpgs.length === 0) {
    console.error('Khong tim thay file JPG nao!');
    process.exit(1);
  }

  // Upload images (first 8 FILES entries = images)
  console.log('Dang upload anh...');
  const imageUrls = [];
  for (let i = 0; i < Math.min(jpgs.length, 8); i++) {
    const srcPath = path.join(actualSourceDir, jpgs[i]);
    const buffer = fs.readFileSync(srcPath);
    const fileInfo = FILES[i];
    try {
      const url = await uploadFile(buffer, fileInfo.storage, fileInfo.type);
      imageUrls.push(url);
      console.log('  [' + (i+1) + '/8] ' + fileInfo.display + ' => OK');
    } catch (err) {
      console.log('  [' + (i+1) + '/8] ' + fileInfo.display + ' => LOI: ' + err.message);
    }
  }

  // Upload PDFs (next 5 FILES entries = PDFs)
  console.log('\nDang upload PDF...');
  const pdfUrls = [];
  for (let i = 0; i < Math.min(pdfs.length, 5); i++) {
    const srcPath = path.join(actualSourceDir, pdfs[i]);
    const buffer = fs.readFileSync(srcPath);
    const fileInfo = FILES[8 + i]; // offset by 8 images
    try {
      const url = await uploadFile(buffer, fileInfo.storage, fileInfo.type);
      pdfUrls.push({ name: fileInfo.display, url: url, originalName: pdfs[i] });
      console.log('  [' + (i+1) + '/5] ' + fileInfo.display + ' => OK');
    } catch (err) {
      console.log('  [' + (i+1) + '/5] ' + fileInfo.display + ' => LOI: ' + err.message);
    }
  }

  // Create news post
  console.log('\nDang tao bai viet...');

  let content = '<h3>Gioi thieu ve chuong trinh</h3>';
  content += '<p>Daeduk University (dae덕dae학교) la mot trong nhung truong doi tac uy tin tai Han Quoc, toa lac tai Daejeon. Truong dang trien khai chuong trinh <strong>dao tao theo don dat hang (주문식교육과정)</strong> thuoc he thong RISE (Regional Innovation System) — mot chinh sach moi cua chinh phu Han Quoc nham gan ket dao tao voi nhu cau thuc te cua doanh nghiep.</p>';
  content += '<p>Chuong trinh nay cho phep sinh vien duoc dao tao theo nhu cau cu the cua doanh nghiep, co co hoi thuc tap va lam viec ngay sau khi tot nghiep. Duoi day la bo tai lieu huong dan van hanh chuong trinh.</p>';
  content += '<hr>';
  content += '<h3>Tai lieu huong dan van hanh</h3>';
  content += '<p>Cac trang tai lieu huong dan chi tiet ve quy trinh dao tao theo don dat hang:</p>';

  for (let i = 0; i < imageUrls.length; i++) {
    content += '<p style="text-align:center;margin:1rem 0;">';
    content += '<img src="' + imageUrls[i] + '" alt="Daeduk University - Trang ' + (i+1) + '" style="max-width:100%;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">';
    content += '<br><em>Trang ' + (i+1) + '/' + imageUrls.length + '</em></p>';
  }

  content += '<hr><h3>Tai lieu dinh kem</h3><p>Cac file PDF lien quan den chuong trinh dao tao theo don dat hang:</p><ul>';

  for (const pdf of pdfUrls) {
    content += '<li><a href="' + pdf.url + '" target="_blank" rel="noopener"> ' + pdf.name + '</a></li>';
  }

  content += '</ul><hr><h3>Tong ket</h3>';
  content += '<p>Bo tai lieu nay cho thay Daeduk University dang co mot chuong trinh dao tao rat bai ban, gan lien voi nhu cau thuc te cua doanh nghiep. Day la tin vui cho cac ban du hoc sinh quan tam den truong, vi co hoi thuc tap va viec lam sau tot nghiep se rat cao!</p>';
  content += '<p><strong>Thong tin truong:</strong> Daeduk University (dae덕dae학교) — Daejeon, Han Quoc</p>';
  content += '<p><strong>Chuong trinh:</strong> Dao tao theo don dat hang — He RISE 1-2</p>';

  const postData = {
    title: 'Cap nhat chuong trinh dao tao theo don dat hang tai Daeduk University (He RISE)',
    content: content,
    category: 'news',
    image_urls: imageUrls.slice(0, 5),
    is_published: true,
    created_at: new Date().toISOString(),
  };

  const { data: newPost, error: postError } = await supabase
    .from('news_posts')
    .insert(postData)
    .select()
    .single();

  if (postError) {
    console.error('LOI tao bai viet: ' + postError.message);
  } else {
    console.log('Da tao bai viet thanh cong!');
    console.log('ID: ' + newPost.id);
    console.log('Tieu de: ' + newPost.title);
    console.log('Uploaded: ' + imageUrls.length + ' anh, ' + pdfUrls.length + ' PDF');
  }

  console.log('\n=== HOAN TAT ===\n');
}

main().catch(err => { console.error(err); process.exit(1); });
