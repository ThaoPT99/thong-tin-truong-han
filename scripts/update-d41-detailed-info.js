/**
 * Cập nhật thông tin chi tiết cho 12 trường D4-1
 * Gồm: học phí, ký túc xá, giới thiệu (có địa chỉ, SĐT, email)
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const schoolsData = [
  // 1. Sungshin Women's University
  {
    slug: 'sungshin-women',
    tuition: '1,600,000 KRW/kỳ (10 tuần)\nPhí đăng ký: 80,000 KRW (lần đầu)',
    ktx: 'Phòng 2 người: ~400,000 KRW/tháng\nPhòng 1 người: ~680,000 KRW/tháng',
    intro: '📍 Địa chỉ: 2 Sungshinyeodae-gil, Seongbuk-gu, Seoul, 02844, Korea\n📞 Điện thoại: +82-2-920-7788\n📧 Email: lang@sungshin.ac.kr\n\nSungshin Women\'s University là trường đại học nữ sinh danh tiếng tại Seoul. Chương trình tiếng Hàn được thiết kế dành riêng cho sinh viên quốc tế với đội ngũ giảng viên giàu kinh nghiệm. Trường có ký túc xá riêng cho sinh viên nước ngoài ngay trong khuôn viên.',
  },
  // 2. Korea University
  {
    slug: 'korea-university-klc',
    tuition: '1,700,000 - 1,800,000 KRW/kỳ (10 tuần)',
    ktx: 'Frontier Hall: ~1,400,000 KRW/kỳ (10 tuần, áp dụng cho sinh viên mới)',
    intro: '📍 Địa chỉ: Room 301, Korean Education Building, 145 Anam-ro, Seongbuk-gu, Seoul, 02841, Korea\n📞 Điện thoại: +82-2-3290-2971~3\n📧 Email: korklcc@gmail.com\n\nKorea University là 1 trong 3 trường SKY danh giá nhất Hàn Quốc. Trung tâm tiếng Hàn (KLCE) có lịch sử lâu đời và chương trình giảng dạy chất lượng cao. Cơ sở vật chất hiện đại với thư viện, phòng tự học và khuôn viên rộng lớn.',
  },
  // 3. Chung-Ang University
  {
    slug: 'chung-ang-ile',
    tuition: '1,700,000 KRW/kỳ (Seoul Campus, 10 tuần)',
    ktx: '~800,000 KRW/kỳ (10 tuần, Seoul Campus)',
    intro: '📍 Địa chỉ: Room 101, Bldg 101, 84 Heukseok-ro, Dongjak-gu, Seoul, 06974, Korea\n📞 Điện thoại: +82-2-820-6111\n📧 Email: korean@cau.ac.kr\n\nChung-Ang University (CAU) tọa lạc tại khu vực Heukseok-dong, Seoul. Viện Ngôn ngữ (ILE) cung cấp chương trình tiếng Hàn chất lượng với nhiều hoạt động văn hóa. Trường có vị trí thuận lợi gần trung tâm thủ đô.',
  },
  // 4. Sejong University
  {
    slug: 'sejong-language',
    tuition: '1,600,000 KRW/kỳ (10 tuần)',
    ktx: '600,000 - 800,000 KRW/kỳ (tuỳ loại phòng)',
    intro: '📍 Địa chỉ: Kimwon Bldg, 195-16 Neungdong-ro, Gwangjin-gu, Seoul, Korea\n📞 Điện thoại: +82-2-3408-4052~3\n📧 Email: ili@sejong.ac.kr\n\nSejong University nổi tiếng với chương trình đào tạo tiếng Hàn cho người nước ngoài. Trung tâm Ngôn ngữ Sejong có cơ sở vật chất hiện đại tại khu vực Gwangjin-gu, Seoul. Chương trình học đa dạng từ sơ cấp đến cao cấp.',
  },
  // 5. Sungkyunkwan University
  {
    slug: 'skku-sli',
    tuition: 'Cơ sở Seoul: 1,780,000 KRW/kỳ\nCơ sở Suwon: 1,500,000 KRW/kỳ',
    ktx: 'Liên hệ trường để biết chi phí ký túc xá (tuỳ cơ sở)',
    intro: '📍 Địa chỉ (Seoul): 171 Yulgok-ro, Jongno-gu, Seoul, Korea\n📞 Điện thoại: +82-2-760-1225\n📧 Email: koreansli@skku.edu\n\nSungkyunkwan University (SKKU) là trường đại học lâu đời nhất Hàn Quốc (thành lập 1398). Viện Ngôn ngữ Sungkyun (SLI) cung cấp chương trình tiếng Hàn chất lượng cao tại 2 cơ sở Seoul và Suwon. Thư viện cổ và cơ sở vật chất hiện đại.',
  },
  // 6. Seoul Women's University
  {
    slug: 'seoul-women-klc',
    tuition: '1,450,000 - 1,650,000 KRW/kỳ',
    ktx: '775,000 - 1,720,000 KRW/kỳ (tuỳ diện sinh viên mới/cũ)',
    intro: '📍 Địa chỉ: 621 Hwarang-ro, Nowon-gu, Seoul, Korea\n📞 Điện thoại: +82-2-970-7804\n📧 Email: KLC@swu.ac.kr\n\nSeoul Women\'s University là trường nữ sinh với khuôn viên xanh đẹp tại Nowon-gu, Seoul. Trung tâm tiếng Hàn (KLC) có chương trình giảng dạy chuyên sâu với nhiều hoạt động ngoại khóa và trải nghiệm văn hóa.',
  },
  // 7. Sun Moon University
  {
    slug: 'sunmoon-kli',
    tuition: '1,400,000 KRW/kỳ',
    ktx: '917,400 KRW/kỳ (đã bao gồm ăn sáng)',
    intro: '📍 Địa chỉ: 70, Sunmoon-ro 221beon-gil, Tangjeong-myeon, Asan-si, Chungcheongnam-do, Korea\n📞 Điện thoại: +82-41-530-2091\n📧 Email: korean@sunmoon.ac.kr\n\nSun Moon University tọa lạc tại Asan, tỉnh Chungcheongnam-do. Viện Ngôn ngữ Hàn (KLI) cung cấp chương trình tiếng Hàn với chi phí hợp lý. Ký túc xá bao gồm bữa sáng, giúp sinh viên tiết kiệm chi phí.',
  },
  // 8. Inha University
  {
    slug: 'inha-ltc',
    tuition: '1,400,000 KRW/kỳ (10 tuần) + phí đăng ký ~100,000 KRW',
    ktx: 'Liên hệ trường: ltc@inha.ac.kr để biết chi phí KTX',
    intro: '📍 Địa chỉ: 100 Inha-ro, Michuhol-gu, Incheon 22212, Korea\n📞 Điện thoại: +82-32-860-8274, 8275, 8303\n📧 Email: ltc@inha.ac.kr\n\nInha University tọa lạc tại Incheon, thành phố cảng lớn gần sân bay quốc tế Incheon. Trung tâm Đào tạo Ngôn ngữ (LTC) cung cấp chương trình tiếng Hàn chất lượng trong khuôn viên trường rộng rãi, hiện đại.',
  },
  // 9. Ajou University
  {
    slug: 'ajou-korean',
    tuition: '1,450,000 - 1,500,000 KRW/kỳ (10 tuần)',
    ktx: 'Phòng 4 người: ~712,000 KRW/kỳ\nPhòng 2 người: ~1,050,000 KRW/kỳ',
    intro: '📍 Địa chỉ: 206 World cup-ro, Yeongtong-gu, Suwon, Gyeonggi-do, 16499, Korea\n📞 Điện thoại: +82-31-219-3599\n📧 Email: koli@ajou.ac.kr\n\nAjou University tọa lạc tại Suwon, tỉnh Gyeonggi-do (gần Seoul). Chương trình tiếng Hàn có chất lượng giảng dạy tốt với chi phí hợp lý. Thành phố Suwon có nhiều di tích lịch sử và khu vui chơi giải trí.',
  },
  // 10. Joongbu University
  {
    slug: 'joongbu-klc',
    tuition: '1,100,000 - 1,200,000 KRW/kỳ',
    ktx: '400,000 - 450,000 KRW/tháng',
    intro: '📍 Địa chỉ (Goyang Campus): 305 Dae-hak-ro, Deogyang-gu, Goyang-si, Gyeonggi-do, Korea\n📞 Điện thoại: +82-41-750-0123 (Văn phòng quốc tế)\n📧 Email: joongbu@joongbu.ac.kr\n\nJoongbu University có chi phí học tập thấp nhất trong các trường D4-1. Trường nằm tại Goyang-si, Gyeonggi-do, gần Seoul. Chương trình tiếng Hàn phù hợp với sinh viên có ngân sách hạn chế.',
  },
  // 11. Konyang University
  {
    slug: 'konyang-klc',
    tuition: '~1,000,000 - 1,100,000 KRW/kỳ',
    ktx: 'Liên hệ trường để biết chi phí KTX',
    intro: '📍 Địa chỉ: 158 Gwanjeodong-ro, Seo-gu, Daejeon, Korea\n📞 Điện thoại: +82-41-730-5114\n📧 Email: konyang@konyang.ac.kr\n\nKonyang University có mức học phí thấp, phù hợp với sinh viên muốn tiết kiệm chi phí. Trường tọa lạc tại Daejeon - thành phố khoa học công nghệ lớn thứ 5 Hàn Quốc, với nhiều viện nghiên cứu và trường đại học.',
  },
  // 12. Kyungsung University
  {
    slug: 'kyungsung-klc',
    tuition: '1,200,000 - 1,300,000 KRW/kỳ',
    ktx: 'Liên hệ trường để biết chi phí KTX',
    intro: '📍 Địa chỉ: 309 Suyeong-ro, Nam-gu, Busan 48434, Korea\n📞 Điện thoại: +82-51-663-4063\n📧 Email: hanalee@ks.ac.kr\n\nKyungsung University tọa lạc tại Busan - thành phố biển lớn thứ 2 Hàn Quốc. Viện Ngôn ngữ Hàn cung cấp chương trình tiếng Hàn chất lượng với chi phí hợp lý. Busan nổi tiếng với bãi biển Haeundae, hải sản tươi ngon và nhịp sống năng động.',
  },
];

async function main() {
  console.log('=== Cập nhật thông tin chi tiết 12 trường D4-1 ===\n');
  let ok = 0, fail = 0;

  for (const s of schoolsData) {
    const { data, error } = await supabase
      .from('schools')
      .update({
        tuition: s.tuition,
        ktx: s.ktx,
        intro: s.intro,
      })
      .eq('slug', s.slug)
      .eq('visa_type', 'D4-1')
      .select('name');
    
    if (error) {
      console.error(`❌ ${s.slug}: ${error.message}`);
      fail++;
    } else if (data && data.length > 0) {
      console.log(`✅ ${data[0].name}: tuition=${s.tuition.substring(0, 40)}...`);
      ok++;
    } else {
      console.log(`⚠️  ${s.slug}: Không tìm thấy`);
      fail++;
    }
  }

  console.log(`\n=== Kết quả: ${ok} thành công, ${fail} thất bại ===`);
}

main().catch(console.error);
