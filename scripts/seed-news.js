/**
 * Seed dữ liệu mẫu cho news_posts — tự tạo ảnh SVG và upload lên Supabase Storage
 * Chạy: node scripts/seed-news.js
 * 
 * Yêu cầu: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env
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
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'news-images';

// ─── Generate SVG image helpers ───
function createSvg(width, height, bgColor, text, textColor = 'white', fontSize = 28) {
  const lines = text.split('\n');
  const lineHeight = fontSize + 8;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 + fontSize;
  const textEls = lines.map((line, i) => 
    `<text x="50%" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}" text-anchor="middle">${escapeXml(line)}</text>`
  ).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${textEls}
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function uploadSvg(fileName, svgContent) {
  const timestamp = Date.now();
  const safeName = timestamp + '-' + fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = 'news/' + safeName;
  const buffer = Buffer.from(svgContent);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType: 'image/svg+xml',
      upsert: false,
    });

  if (error) {
    // Thử tạo bucket nếu chưa có
    if (error.message?.includes('bucket') || error.message?.includes('not found')) {
      console.log(`   📦 Tạo bucket "${BUCKET}"...`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        file_size_limit: 20971520,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
      });
      if (createError) throw new Error('Không thể tạo bucket: ' + createError.message);
      // Retry
      const { error: retryError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, { contentType: 'image/svg+xml' });
      if (retryError) throw new Error(retryError.message);
    } else {
      throw new Error(error.message);
    }
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return publicUrl;
}

// ─── SVG image definitions for sample posts ───
// Each image: [filename, width, height, bgColor, text, textColor, fontSize?]
const sampleImages = [
  // --- Visa post 1 (Nguyễn Thị A) ---
  ['visa-nguyen-thi-a.svg', 600, 400, '#1e3a5f', 'Visa D2-6\nNguyễn Thị A\nInduk University'],
  ['visa-sticker.svg', 600, 400, '#2d5a87', 'Visa Sticker\nD2-6\n2026'],
  ['passport.svg', 600, 400, '#0f766e', 'Passport\nNguyễn Thị A\n✅ Đã đỗ visa'],
  // --- Sendoff 1 (20-07-2026) ---
  ['sendoff-2007.svg', 800, 400, '#0f766e', 'Tiễn Bay\n20/07/2026\n15 học sinh'],
  ['sendoff-group.svg', 600, 400, '#1e3a5f', 'Đoàn Du Học Sinh\nKỳ tháng 9/2026'],
  ['sendoff-airport.svg', 600, 400, '#2d5a87', 'Sân Bay Incheon\nChụp hình lưu niệm'],
  // --- Tuyển sinh ---
  ['tuyen-sinh.svg', 800, 400, '#2563eb', 'Tuyển Sinh\nKỳ tháng 3/2027\n18 trường đối tác'],
  // --- Success 100% ---
  ['success-100.svg', 800, 400, '#059669', '100% Đỗ Visa\nTháng 6/2026'],
  // --- Visa Trần Văn B ---
  ['visa-tran-van-b.svg', 600, 400, '#1e3a5f', 'Visa D2-6\nTrần Văn B\nOsan University'],
  // --- Sendoff 15-06 ---
  ['sendoff-1506.svg', 800, 400, '#0f766e', 'Tiễn Bay\n15/06/2026\n10 học sinh'],
  ['sendoff-memory.svg', 600, 400, '#1e3a5f', 'Chụp Hình\nLưu Niệm\nKỳ tháng 6'],
];

// ─── Sample posts data ───
const samplePosts = [
  {
    title: '🎉 Chúc mừng bạn Nguyễn Thị A đã đỗ visa D2-6 thành công!',
    content: 'Sau 15 ngày chờ đợi, bạn Nguyễn Thị A (sinh năm 2003, GPA 6.5) đã nhận được kết quả visa D2-6 vào trường Induk University. Em chia sẻ: "Nhờ checklist và sự hướng dẫn trên web, em đã tự làm hồ sơ mà không cần qua trung tâm. Cảm ơn các anh chị rất nhiều!" Chúc em có hành trình du học thành công! 🎊',
    category: 'visa',
    imageIndices: [0, 1, 2], // references sampleImages indices
    is_published: true,
    created_at: '2026-07-25T08:00:00Z'
  },
  {
    title: '✈️ Tiễn đoàn du học sinh tháng 7/2026 lên đường!',
    content: 'Sáng ngày 20/07/2026, 15 bạn học sinh đã lên đường sang Hàn Quốc nhập học kỳ tháng 9. Các bạn sẽ theo học tại các trường: Induk, Osan, Yeonsung, Suncheon Jeil. Chúc các bạn có một khởi đầu thuận lợi và gặt hái nhiều thành công! 📚🇰🇷',
    category: 'sendoff',
    imageIndices: [3, 4, 5],
    is_published: true,
    created_at: '2026-07-20T10:00:00Z'
  },
  {
    title: '📢 Mở đơn tuyển sinh kỳ tháng 3/2027 — 18 trường đối tác',
    content: 'Kỳ tuyển sinh tháng 3/2027 đã chính thức mở đơn! Năm nay có 18 trường đối tác với nhiều ngành học đa dạng: Kinh tế, Kỹ thuật, Du lịch, Nhà hàng - Khách sạn, Thiết kế, Công nghệ thông tin,... Học sinh có thể nộp hồ sơ từ nay đến hết tháng 11/2026. Liên hệ Zalo để được tư vấn cụ thể!',
    category: 'news',
    imageIndices: [6],
    is_published: true,
    created_at: '2026-07-15T09:00:00Z'
  },
  {
    title: '🏆 Thành tích: 100% học sinh đỗ visa kỳ tháng 6/2026',
    content: 'Một tin vui cho toàn bộ học sinh của chương trình! Trong kỳ xét duyệt visa tháng 6/2026, 100% học sinh của chúng ta đã đậu visa ngay lần nộp đầu tiên. Đây là thành quả của quy trình tư vấn và chuẩn bị hồ sơ kỹ lưỡng. Cảm ơn sự tin tưởng của các bạn! 🎊🎉',
    category: 'success',
    imageIndices: [7],
    is_published: true,
    created_at: '2026-07-05T14:00:00Z'
  },
  {
    title: '✅ Chúc mừng bạn Trần Văn B — Visa D2-6 đã có kết quả!',
    content: 'Bạn Trần Văn B (2004, GPA 5.5, TOPIK 2) vừa nhận visa D2-6 vào trường Osan University. Đây là trường hợp hồ sơ có GPA khá thấp nhưng nhờ Study Plan chi tiết và tài chính rõ ràng, em đã thuyết phục được ĐSQ. Một minh chứng rằng hồ sơ càng trung thực và có kế hoạch rõ ràng thì tỉ lệ đậu càng cao!',
    category: 'visa',
    imageIndices: [8],
    is_published: true,
    created_at: '2026-06-28T08:30:00Z'
  },
  {
    title: '🇰🇷 Tiễn các bạn kỳ tháng 6 lên đường nhập học',
    content: 'Ngày 15/06/2026, 10 bạn học sinh đã khởi hành đi Hàn Quốc. Các bạn sẽ bắt đầu hành trình du học của mình tại các trường đối tác. Đặc biệt kỳ này có bạn Minh Anh — thủ khoa đầu vào của trường Induk với GPA 8.0 và TOPIK 4. Chúc toàn bộ các bạn học tập thật tốt và sớm hoà nhập với môi trường mới! 🎓',
    category: 'sendoff',
    imageIndices: [9, 10],
    is_published: true,
    created_at: '2026-06-15T09:00:00Z'
  },
];

async function main() {
  console.log(`\n📤 Đang tạo và upload ảnh SVG lên Supabase Storage...\n`);

  // Upload all images first, collect URLs
  const imageUrls = {};
  for (let i = 0; i < sampleImages.length; i++) {
    const [fileName, w, h, bg, text, textColor = 'white', fontSize = 28] = sampleImages[i];
    const svg = createSvg(w, h, bg, text, textColor, fontSize);
    try {
      const url = await uploadSvg(fileName, svg);
      imageUrls[i] = url;
      console.log(`   🖼️  [${i}] ${fileName} → ${url.substring(0, 70)}...`);
    } catch (err) {
      console.error(`   ❌ [${i}] ${fileName}: ${err.message}`);
      // Use placeholder if upload fails
      imageUrls[i] = `https://placehold.co/${w}x${h}/${bg.replace('#','')}/${textColor.replace('#','')}?text=${encodeURIComponent(text.replace(/\n/g, '+'))}`;
      console.log(`   ⚠️  Fallback: placehold.co cho ảnh [${i}]`);
    }
  }

  console.log(`\n📰 Đang seed ${samplePosts.length} bài viết mẫu...\n`);

  for (const post of samplePosts) {
    const urls = (post.imageIndices || []).map(idx => imageUrls[idx]).filter(Boolean);
    
    const { data, error } = await supabase
      .from('news_posts')
      .insert({
        title: post.title,
        content: post.content,
        category: post.category,
        image_urls: urls,
        is_published: post.is_published,
        created_at: post.created_at,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`❌ Lỗi: "${post.title.substring(0, 40)}..." → ${error.message}`);
    } else {
      console.log(`   ✅ ${post.category.toUpperCase()}: "${post.title.substring(0, 50)}..." → ID: ${data.id}`);
    }
  }

  console.log(`\n✅ Seed hoàn tất!`);
  console.log(`📊 Tổng: ${sampleImages.length} ảnh SVG đã upload, ${samplePosts.length} bài viết đã tạo.\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
