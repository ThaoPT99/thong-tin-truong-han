// Update: Cập nhật catalog_url, website và thông tin chi tiết cho 12 trường D4-1
// Chạy: node scripts/update-d41-catalogs.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── Catalog URLs tìm được từ web ───
const catalogUpdates = {
  'sungshin-women': {
    catalog_url: 'https://www.sungshin.ac.kr/sites/siie_kor/file/2024-2025%20%EC%84%B1%EC%8B%A0%EC%97%AC%EB%8C%80%20%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B3%BC%EC%A0%95%20%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95_%EC%98%81%EC%96%B4.pdf',
    website: 'https://www.sungshin.ac.kr/siie_eng/index.do',
    intro: '🏛️ Sungshin Women\'s University là trường nữ tư thục danh tiếng tại Seoul, thành lập năm 1936. Tọa lạc tại quận Seongbuk, trường có 2 cơ sở: Soojung Campus và Woonjung Green Campus hiện đại. Chương trình tiếng Hàn tại Viện Giáo dục Quốc tế (International Education Institute) được thiết kế dành riêng cho sinh viên quốc tế, kết hợp giảng dạy ngôn ngữ với trải nghiệm văn hóa K-Beauty và K-Culture đặc sắc - thế mạnh riêng của trường. Trường đặc biệt nổi tiếng với các ngành Làm đẹp (Beauty Industry), Thiết kế thời trang, Nghệ thuật và Điều dưỡng. Ký túc xá SeongMiRyo nằm ngay gần cổng trường, chỉ 5 phút đi bộ. Học bổng từ 30% đến 100% học phí dựa trên chứng chỉ TOPIK.',
    tuition: '1,600,000 KRW/kỳ (10 tuần) + phí đăng ký 80,000 KRW',
    ktx: 'Phòng đơn ~680,000 KRW/tháng, phòng đôi ~400,000 KRW/tháng (SeongMiRyo)',
    schedule: '4 kỳ/năm (Xuân, Hạ, Thu, Đông), mỗi kỳ 10 tuần. Lớp ~14 học viên.'
  },
  'korea-university-klc': {
    catalog_url: 'https://klceng.korea.ac.kr/klceng/course/regular_guide.do',
    website: 'https://klceng.korea.ac.kr/',
    intro: '🥇 Korea University Korean Language Center (KU KLC) là trung tâm tiếng Hàn uy tín bậc nhất Hàn Quốc, trực thuộc Korea University - một trong 3 trường thuộc nhóm SKY danh giá nhất Hàn Quốc. Tọa lạc tại 145 Anam-ro, Seongbuk-gu, Seoul, khuôn viên trường nổi tiếng với kiến trúc Gothic cổ kính và không gian học tập mang tính biểu tượng. Chương trình tiếng Hàn chính quy gồm 6 cấp độ (từ sơ cấp đến cao cấp), mỗi lớp chỉ từ 12-14 học viên, đảm bảo chất lượng giảng dạy tối ưu. Học viên được sử dụng toàn bộ cơ sở vật chất của trường: thư viện trung tâm, thư viện số, trung tâm thể thao và hệ thống canteen đa dạng. KU KLC là lựa chọn hàng đầu cho học sinh muốn học tiếng Hàn trong môi trường học thuật đẳng cấp thế giới.',
    tuition: '1,800,000 KRW/kỳ (10 tuần) + phí nhập học 120,000 KRW',
    ktx: '~1,400,000 KRW/kỳ',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Lớp ~14 học viên. Có lớp sáng và chiều.'
  },
  'chung-ang-ile': {
    catalog_url: 'https://korean.cau.ac.kr/english/registration.php?mid=n03_01_04',
    website: 'https://korean.cau.ac.kr/',
    intro: '🏛️ Chung-Ang University (CAU) là trường tư thục hàng đầu tại Seoul, đặc biệt nổi tiếng với các ngành Nghệ thuật, Truyền thông, Kịch nghệ và Điện ảnh - nơi đào tạo nhiều ngôi sao K-Pop và diễn viên nổi tiếng. Viện Giáo dục Ngôn ngữ (Institute of Language Education - ILE) tọa lạc tại Seoul Campus (84 Heukseok-ro, Dongjak-gu) cung cấp chương trình tiếng Hàn chất lượng cao. Điểm đặc biệt: trường yêu cầu đăng ký tối thiểu 4 kỳ (1 năm) cho visa D4-1, đảm bảo học viên có đủ thời gian nâng cao trình độ tiếng Hàn trước khi chuyển lên chuyên ngành. Ký túc xá Global House hiện đại, phòng đôi tiện nghi.',
    tuition: '1,700,000 KRW/kỳ (10 tuần) + phí đăng ký 100,000 KRW',
    ktx: '900,000 KRW/3 tháng (Global House, phòng đôi)',
    schedule: '4 kỳ/năm. Yêu cầu đăng ký tối thiểu 4 kỳ (1 năm) cho visa D4-1.'
  },
  'sejong-language': {
    catalog_url: 'https://sos.sejong.ac.kr/pdf/343171/%EC%84%B8%EC%A2%85%EC%96%B4%ED%95%99%EC%9B%90%20%EB%B8%8C%EB%A1%9C%EC%85%94%202026-2027%20(%EC%98%81%EC%96%B4)(%EC%99%84%EC%84%B1)%20251031.pdf',
    website: 'https://en.sejong.ac.kr/eng/academics/Korean_language_program.do',
    intro: '🏛️ Sejong University tọa lạc tại vị trí đắc địa ở trung tâm Seoul (195-16 Neungdong-ro, Gwangjin-gu), gần ga tàu điện ngầm, thuận tiện di chuyển. Trường nổi tiếng với thế mạnh về Công nghệ thông tin, Kỹ thuật phần mềm, Khách sạn và Du lịch. Trung tâm Ngôn ngữ Sejong tập trung vào phương pháp giảng dạy giao tiếp thực tế, kết hợp với các hoạt động trải nghiệm văn hóa thường kỳ như tham quan dã ngoại, học nấu ăn Hàn Quốc, trải nghiệm Hanbok. Học phí cạnh tranh, chi phí sinh hoạt hợp lý so với các trường cùng khu vực Seoul.',
    tuition: '1,650,000 KRW/kỳ (10 tuần)',
    ktx: '600,000 KRW/kỳ',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Có tham quan văn hóa hàng kỳ.'
  },
  'skku-sli': {
    catalog_url: 'https://koreansli.skku.edu/ksli_eng/application/regular_g.do',
    website: 'https://koreansli.skku.edu/',
    intro: '🥇 Sungkyunkwan University (SKKU) là trường đại học lâu đời nhất Hàn Quốc (thành lập năm 1398), được tập đoàn Samsung bảo trợ. Với hơn 600 năm lịch sử, SKKU là biểu tượng của giáo dục Hàn Quốc, kết hợp giữa truyền thống và hiện đại. Trường có 2 campus: Seoul (Jongno-gu - Khoa học Xã hội & Nhân văn) và Suwon (Khoa học Tự nhiên & Kỹ thuật). Viện Ngôn ngữ Sungkyun (SLI) cung cấp chương trình tiếng Hàn học thuật cao, giáo trình bài bản, phù hợp cho học sinh có định hướng học lên Đại học hoặc Cao học. LƯU Ý: Từ năm 2026, SKKU đã thay đổi từ 6 kỳ/năm sang 4 kỳ/năm.',
    tuition: 'Seoul: 1,780,000 KRW/kỳ / Suwon: 1,500,000 KRW/kỳ. Phí đăng ký: 80,000 KRW',
    ktx: 'Theo campus (Seoul hoặc Suwon)',
    schedule: '4 kỳ/năm (từ 2026, thay đổi từ 6 kỳ/năm). Hệ thống quản lý điểm danh nghiêm ngặt.'
  },
  'seoul-women-klc': {
    catalog_url: 'https://www.swu.ac.kr/english/3040/subview.do',
    website: 'http://klc.swu.ac.kr',
    intro: '🏛️ Seoul Women\'s University (SWU) là trường nữ tư thục được thành lập năm 1960 bởi Giáo hội Trưởng lão Hàn Quốc, tọa lạc tại quận Nowon, Seoul. Trường có 5 trường đại học thành viên, 31 chuyên ngành cử nhân. Trung tâm Ngôn ngữ Hàn Quốc (KLC) áp dụng mô hình lớp học quy mô nhỏ (10-15 sinh viên/lớp) để đảm bảo chất lượng giảng dạy tối ưu. Điểm đặc biệt: có lớp luyện thi TOPIK định kỳ mỗi thứ Tư hàng tuần, và chương trình Buddy Program kết nối sinh viên quốc tế với sinh viên Hàn Quốc, giúp cải thiện kỹ năng giao tiếp thực tế. Môi trường học tập an toàn, thân thiện.',
    tuition: '1,500,000 KRW/kỳ (10 tuần) + phí nhập học 20,000 KRW',
    ktx: '663,000 KRW/13 tuần - International Residence Hall (phòng đôi)',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần (6 cấp độ). Có lớp luyện TOPIK thứ Tư hàng tuần.'
  },
  'sunmoon-kli': {
    catalog_url: 'https://kli.sunmoon.ac.kr/file/%EC%84%A0%EB%AC%B8%EB%8C%80%ED%95%99%EA%B5%90%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95%2026%EB%85%84_%EC%96%B4%ED%95%99%EC%9B%90_%EC%98%81%EC%96%B4.pdf',
    website: 'https://kli.sunmoon.ac.kr/',
    intro: '🏛️ Sunmoon University tọa lạc tại Asan, Chungcheongnam - một thành phố yên bình, chi phí sinh hoạt thấp. Trường được đánh giá là một trong những trường thân thiện với sinh viên quốc tế nhất Hàn Quốc, với tỷ lệ sinh viên quốc tế cao và đội ngũ hỗ trợ tận tâm. Viện Ngôn ngữ Hàn Quốc (KLI) tổ chức 4 kỳ/năm, mỗi kỳ 10 tuần. Chính sách học bổng hào phóng (giảm 30%-100% học phí) và miễn phí mở K-study cho học sinh có GPA > 8.0 hoặc TOPIK 2. KTX bắt buộc kỳ đầu tiên với chi phí phải chăng. Phù hợp với học sinh muốn tập trung học tập trong môi trường yên tĩnh, ít xô bồ.',
    tuition: '1,400,000 KRW/kỳ + phí đăng ký 100,000 KRW',
    ktx: '667,400 KRW/kỳ (bắt buộc kỳ đầu, bao gồm ăn sáng). Bảo hiểm ~120,000 KRW/7 tháng.',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Hỗ trợ đa ngôn ngữ (Anh, Việt, Hàn).'
  },
  'inha-ltc': {
    catalog_url: 'https://ltc.inha.ac.kr/sites/ltc/file/General%20Guide%20for%20International%20Students.pdf',
    website: 'https://ltc.inha.ac.kr/',
    intro: '🏛️ Inha University là trường tư thục danh giá tại Incheon, được thành lập bởi cố Tổng thống Hàn Quốc Syngman Rhee. Trường đặc biệt nổi tiếng với thế mạnh về Kỹ thuật, Khoa học Tự nhiên và Hàng không Vũ trụ. Trung tâm Đào tạo Ngôn ngữ (Language Training Center - LTC) tọa lạc tại Incheon (gần sân bay quốc tế Incheon), di chuyển đến Seoul chỉ mất ~30 phút tàu điện ngầm. Chương trình tiếng Hàn có lộ trình rõ ràng, phù hợp cho học sinh muốn học lên các ngành kỹ thuật tại Inha. Trường cung cấp chương trình Preschool (dự bị) giúp học sinh làm quen với môi trường học tập trước khi vào chính khóa.',
    tuition: '1,400,000 KRW/kỳ (10 tuần) + phí đăng ký 100,000 KRW',
    ktx: '1,200,000 KRW/6 tháng (phân theo giới tính, có giờ giới nghiêm)',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Có chương trình Preschool (dự bị).'
  },
  'ajou-korean': {
    catalog_url: 'http://www.ajou.ac.kr/iadmissions_en/korean/course.do',
    website: 'http://www.ajou.ac.kr/iadmissions_en/korean/course.do',
    intro: '🏛️ Ajou University tọa lạc tại Suwon, Gyeonggi - trung tâm công nghệ của tập đoàn Samsung, cách Seoul 30km. Trường được thành lập năm 1973, nổi tiếng với thế mạnh về Kỹ thuật, Công nghệ thông tin, Khoa học Y tế và Kinh doanh. Điểm đặc biệt: Ajou sở hữu bệnh viện đại học riêng đạt chuẩn quốc tế. Chương trình tiếng Hàn gồm 6 cấp độ (Level 1-6), mỗi kỳ 10 tuần, 200 giờ học. Sau khi hoàn thành cấp độ 3, học viên có thể đăng ký học chuyên ngành. Phỏng vấn đầu vào bằng tiếng Anh. Cơ hội thực tập tại Samsung và các công ty công nghệ cao trong khu vực Suwon.',
    tuition: '1,500,000 KRW/kỳ (10 tuần)',
    ktx: '1,055,000 won/6 tháng (phòng 4 người) / 1,489,000 won/6 tháng (phòng 2 người)',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần (200 giờ). Học từ T2-T6, 4 giờ/ngày.'
  },
  'joongbu-klc': {
    catalog_url: 'https://eng.kbu.ac.kr/eng/CMS/Contents/Contents.do?mCode=MN027',
    website: 'https://www.joongbu.ac.kr/eng/',
    intro: '🏛️ Joongbu University có 2 cơ sở: Geumsan (Chungcheongnam) và Goyang (Gyeonggi - gần Seoul). Trường nổi tiếng với môi trường học tập thực tế và sự hỗ trợ mạnh mẽ dành cho sinh viên quốc tế. Đây là trường có học phí thấp nhất trong hệ thống các trường D4-1 (chỉ 1,100,000 KRW/kỳ), phù hợp với học sinh có ngân sách hạn chế. Chương trình tiếng Hàn tập trung vào đào tạo ngôn ngữ kết hợp khám phá văn hóa. Học bổng đa dạng từ 30% đến 80% học phí dựa trên trình độ TOPIK hoặc IELTS/TOEFL. Cơ sở Goyang gần Seoul giúp học sinh dễ dàng tiếp cận thủ đô.',
    tuition: '1,100,000 KRW/kỳ (10 tuần)',
    ktx: '1,090,000 KRW/6 tháng',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. 2 cơ sở: Geumsan & Goyang.'
  },
  'konyang-klc': {
    catalog_url: 'https://www.konyang.ac.kr/eng.do',
    website: 'https://www.konyang.ac.kr/eng.do',
    intro: '🏛️ Konyang University tọa lạc tại Nonsan/Daejeon, Chungcheongnam. Trường có thế mạnh đặc biệt về các ngành Y tế, Điều dưỡng và Khoa học sức khỏe - là một trong số ít trường đại học có bệnh viện thực hành ngay trong khuôn viên. Trung tâm Ngôn ngữ Hàn Quốc thiết kế lộ trình học tập bài bản, giúp sinh viên quốc tế nhanh chóng đạt năng lực tiếng Hàn cần thiết để theo học chuyên ngành. Học phí thuộc nhóm thấp nhất (1,100,000 KRW/kỳ), chi phí sinh hoạt tại Daejeon hợp lý, phù hợp với học sinh muốn tiết kiệm chi phí. Học bổng lên đến 30%-100% dựa trên GPA.',
    tuition: '1,100,000 KRW/kỳ (10 tuần)',
    ktx: '910,000 KRW/kỳ',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Trọng tâm: ngành Y tế & Điều dưỡng.'
  },
  'kyungsung-klc': {
    catalog_url: 'https://kscms.ks.ac.kr/attach/EDITOR/FILE/2025/5/aDq4GS7q9wVCHFFLg6te.pdf',
    website: 'https://ks.ac.kr/eng/main.do',
    intro: '🏛️ Kyungsung University tọa lạc tại trung tâm Busan - thành phố cảng lớn nhất Hàn Quốc, nổi tiếng với bãi biển Haeundae, chợ cá Jagalchi và cuộc sống sôi động. Trường nằm ở vị trí trung tâm, giao thông thuận tiện, gần các khu vui chơi giải trí và trung tâm thương mại. Viện Ngôn ngữ Hàn Quốc tổ chức 4 kỳ/năm, tập trung vào luyện thi TOPIK và kỹ năng giao tiếp thực tế. Ký túc xá Nuri Dormitory hiện đại, đầy đủ tiện nghi. Busan là thành phố lý tưởng cho học sinh yêu thích biển, muốn trải nghiệm cuộc sống năng động với chi phí thấp hơn Seoul. Học bổng từ 10% đến 100% dựa trên TOPIK/IELTS.',
    tuition: '1,200,000 KRW/kỳ (10 tuần)',
    ktx: '750,000 KRW/kỳ (Nuri Dormitory)',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần. Luyện thi TOPIK chuyên sâu.'
  }
};

async function updateCatalogs() {
  console.log('🔄 Đang cập nhật catalog_url, website và thông tin chi tiết cho 12 trường D4-1...\n');

  for (const [slug, data] of Object.entries(catalogUpdates)) {
    // Tìm school theo slug
    const { data: school, error: findError } = await supabase
      .from('schools')
      .select('id, name')
      .eq('slug', slug)
      .maybeSingle();

    if (findError || !school) {
      console.log(`⚠️ Không tìm thấy trường slug: ${slug}`);
      continue;
    }

    // Update
    const { error: updateError } = await supabase
      .from('schools')
      .update({
        catalog_url: data.catalog_url,
        website: data.website,
        intro: data.intro,
        tuition: data.tuition,
        ktx: data.ktx,
        schedule: data.schedule,
        updated_at: new Date().toISOString()
      })
      .eq('id', school.id);

    if (updateError) {
      console.error(`❌ Lỗi cập nhật "${school.name}":`, updateError.message);
    } else {
      console.log(`✅ Đã cập nhật "${school.name}"`);
      console.log(`   📄 Catalog: ${data.catalog_url?.substring(0, 80)}...`);
    }
  }

  console.log('\n📊 Hoàn tất cập nhật catalog cho 12 trường D4-1!');
  process.exit(0);
}

updateCatalogs().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
