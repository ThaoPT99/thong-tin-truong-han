// Seed: Nhập 12 trường D4-1 vào Supabase
// Chạy: node scripts/seed-d41-schools.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── 12 trường D4-1 ───
const d41Schools = [
  {
    slug: 'sungshin-women',
    name: 'Sungshin Women\'s University',
    name_kr: '성신여자대학교',
    name_en: 'Sungshin Women\'s University',
    system: 'Trung tâm tiếng Hàn (Viện Giáo dục Quốc tế)',
    visa_type: 'D4-1',
    region: 'seoul',
    location: 'Seongbuk-gu, Seoul, Hàn Quốc',
    quota: 0,
    tuition: '1,600,000 KRW/kỳ (10 tuần)',
    ktx: '1,270,000 KRW/3 tháng (phòng đôi ~400,000 KRW/tháng)',
    intro: 'Sungshin Women\'s University là trường nữ tư thục danh tiếng tại Seoul, thành lập năm 1936. Chương trình tiếng Hàn tại Viện Giáo dục Quốc tế được thiết kế bài bản, kết hợp trải nghiệm văn hóa K-Beauty và K-Culture đặc sắc. Trường có thế mạnh về các ngành Làm đẹp, Thiết kế và Điều dưỡng.',
    website: 'https://www.sungshin.ac.kr/siie_eng/index.do',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Hạn chế học sinh khu vực miền Trung',
      'Bắt buộc mở K-study 10 triệu won',
      'Trường nữ sinh (chỉ nhận nữ)'
    ],
    advantages: [
      'Trường nữ tư thục lâu đời tại Seoul (thành lập 1936)',
      'Thế mạnh ngành Làm đẹp (Beauty), Thiết kế, Điều dưỡng',
      'Chương trình văn hóa K-Culture, K-Beauty đặc sắc',
      'Học bổng theo TOPIK lên đến 100%',
      'Ký túc xá riêng cho sinh viên quốc tế',
      'Woonjung Green Campus hiện đại'
    ],
    documents: [
      'Bằng tốt nghiệp THPT (công chứng + dịch thuật)',
      'Học bạ THPT (công chứng + dịch thuật)',
      'Sổ tiết kiệm + xác nhận số dư (tối thiểu 10,000 USD)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Giấy tờ chứng minh thu nhập gia đình',
      'Kế hoạch học tập (Study Plan)',
      'Giới thiệu bản thân (Self Introduction)'
    ],
    documents_note: 'Hồ sơ cần có chứng nhận lãnh sự hoặc Apostille. Ưu tiên có TOPIK 2 trở lên.',
    insurance: '',
    schedule: '4 kỳ/năm (Xuân, Hạ, Thu, Đông), mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://www.sungshin.ac.kr/siie_eng/index.do',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'female',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'seoul',
      cost_level: 4,
      visa_chance: 4,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['prestige', 'women-only']
    }
  },
  {
    slug: 'korea-university-klc',
    name: 'Korea University',
    name_kr: '고려대학교',
    name_en: 'Korea University Korean Language Center',
    system: 'Trung tâm Ngôn ngữ Hàn Quốc (KU KLC)',
    visa_type: 'D4-1',
    region: 'seoul',
    location: '145 Anam-ro, Seongbuk-gu, Seoul, Hàn Quốc',
    quota: 0,
    tuition: '1,800,000 KRW/kỳ (10 tuần) + phí nhập học 120,000 KRW',
    ktx: '~1,400,000 KRW/kỳ',
    intro: 'Korea University Korean Language Center (KU KLC) là trung tâm tiếng Hàn uy tín tại Seoul. Korea University thuộc nhóm SKY (Top 3 trường danh giá nhất Hàn Quốc), nổi tiếng với kiến trúc Gothic cổ kính. Chương trình tiếng Hàn chất lượng cao với lớp học quy mô nhỏ (~14 học viên).',
    website: 'https://klceng.korea.ac.kr/',
    conditions: [
      'GPA ≥ 7.5',
      'Trống học < 2 năm',
      'Hạn chế học sinh khu vực miền Trung',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Top SKY (Top 3 trường danh giá nhất Hàn Quốc)',
      'Trung tâm tiếng Hàn lâu đời và uy tín',
      'Lớp học quy mô nhỏ (~14 học viên/lớp)',
      'Khuôn viên kiến trúc Gothic cổ kính',
      'Cơ sở vật chất hiện đại, thư viện lớn',
      'Cơ hội học lên chuyên ngành tại KU'
    ],
    documents: [
      'Bằng tốt nghiệp THPT (hợp pháp hóa lãnh sự)',
      'Học bạ THPT (hợp pháp hóa lãnh sự)',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình',
      'Kế hoạch học tập',
      'Giới thiệu bản thân'
    ],
    documents_note: 'Trường thuộc nhóm SKY nên yêu cầu hồ sơ khắt khe. Cần chứng nhận lãnh sự đầy đủ.',
    insurance: '',
    schedule: '4 kỳ/năm (Xuân, Hạ, Thu, Đông), mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://klceng.korea.ac.kr/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.5,
      max_absences: 10,
      region: 'seoul',
      cost_level: 5,
      visa_chance: 4,
      job_opportunity: 4,
      e7_opportunity: 3,
      study_load: 4,
      interview_difficulty: 4,
      tags: ['prestige', 'top-tier', 'skku']
    }
  },
  {
    slug: 'chung-ang-ile',
    name: 'Chung-Ang University',
    name_kr: '중앙대학교',
    name_en: 'Chung-Ang University (Institute of Language Education)',
    system: 'Viện Giáo dục Ngôn ngữ (ILE)',
    visa_type: 'D4-1',
    region: 'seoul',
    location: '84 Heukseok-ro, Dongjak-gu, Seoul, Hàn Quốc',
    quota: 0,
    tuition: '1,700,000 KRW/kỳ (10 tuần)',
    ktx: '900,000 KRW/3 tháng (Global House, phòng đôi)',
    intro: 'Chung-Ang University (CAU) là trường tư thục hàng đầu Seoul, nổi tiếng với các ngành Nghệ thuật, Truyền thông và Ngôn ngữ. Viện Giáo dục Ngôn ngữ (ILE) cung cấp chương trình tiếng Hàn chất lượng cao. Trường yêu cầu đăng ký tối thiểu 4 kỳ cho visa D4-1.',
    website: 'https://korean.cau.ac.kr/',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền',
      'Bắt buộc đăng ký tối thiểu 4 kỳ (1 năm)',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Trường tư thục hàng đầu tại Seoul',
      'Thế mạnh Nghệ thuật, Truyền thông, Ngôn ngữ',
      'Campus Seoul sầm uất, gần trung tâm',
      'Ký túc xá Global House tiện nghi',
      'Học bổng theo thành tích học tập',
      'Hoạt động ngoại khóa và trải nghiệm văn hóa'
    ],
    documents: [
      'Bằng tốt nghiệp THPT (Apostille hoặc chứng nhận lãnh sự)',
      'Học bạ THPT (Apostille hoặc chứng nhận lãnh sự)',
      'Sổ tiết kiệm tối thiểu 10,000 USD',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình',
      'Kế hoạch học tập',
      'Giới thiệu bản thân'
    ],
    documents_note: 'Yêu cầu Apostille hoặc chứng nhận lãnh sự cho tất cả giấy tờ học tập. Đăng ký tối thiểu 4 kỳ.',
    insurance: '',
    schedule: '4 kỳ/năm (Xuân, Hạ, Thu, Đông), mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://korean.cau.ac.kr/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'seoul',
      cost_level: 4,
      visa_chance: 4,
      job_opportunity: 4,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['prestige', 'arts']
    }
  },
  {
    slug: 'sejong-language',
    name: 'Sejong University',
    name_kr: '세종대학교',
    name_en: 'Sejong University (Sejong Language Center)',
    system: 'Trung tâm Ngôn ngữ Sejong',
    visa_type: 'D4-1',
    region: 'seoul',
    location: '195-16 Neungdong-ro, Gwangjin-gu, Seoul, Hàn Quốc',
    quota: 0,
    tuition: '1,650,000 KRW/kỳ (10 tuần)',
    ktx: '600,000 KRW/kỳ',
    intro: 'Sejong University tọa lạc tại trung tâm Seoul (quận Gwangjin), nổi tiếng với các ngành Công nghệ, Khách sạn, Du lịch và Nghệ thuật. Trung tâm Ngôn ngữ Sejong tập trung vào kỹ năng giao tiếp thực tế kết hợp trải nghiệm văn hóa, thường xuyên tổ chức tham quan dã ngoại.',
    website: 'https://en.sejong.ac.kr/',
    conditions: [
      'GPA ≥ 7.2 (không có năm nào dưới 6.8)',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Vị trí trung tâm Seoul, gần ga tàu điện ngầm',
      'Thế mạnh Công nghệ, Khách sạn, Du lịch',
      'Hoạt động trải nghiệm văn hóa hàng kỳ',
      'Ký túc xá tiện nghi trong khuôn viên',
      'Học phí cạnh tranh',
      'Cơ hội học chuyên ngành sau tiếng'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT (bảng điểm 3 năm)',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình',
      'Kế hoạch học tập'
    ],
    documents_note: 'Yêu cầu GPA chi tiết theo từng năm học. Không có năm nào GPA dưới 6.8.',
    insurance: '',
    schedule: '4 kỳ/năm (Xuân, Hạ, Thu, Đông), mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://en.sejong.ac.kr/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.2,
      max_absences: 10,
      region: 'seoul',
      cost_level: 3,
      visa_chance: 4,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['prestige', 'good-value']
    }
  },
  {
    slug: 'skku-sli',
    name: 'Sungkyunkwan University',
    name_kr: '성균관대학교',
    name_en: 'Sungkyunkwan University (Sungkyun Language Institute)',
    system: 'Viện Ngôn ngữ Sungkyun (SLI)',
    visa_type: 'D4-1',
    region: 'seoul',
    location: '25-2 Sungkyunkwan-ro, Jongno-gu, Seoul & Suwon, Gyeonggi',
    quota: 0,
    tuition: 'Seoul: 1,780,000 KRW/kỳ / Suwon: 1,500,000 KRW/kỳ',
    ktx: 'Theo campus',
    intro: 'Sungkyunkwan University (SKKU) là trường đại học lâu đời nhất Hàn Quốc, được Samsung bảo trợ. SKKU có 2 campus: Seoul (Nhân văn) và Suwon (Khoa học). Lưu ý: Từ 2026, SKKU đã chuyển từ 6 kỳ/năm sang 4 kỳ/năm. Chương trình tiếng Hàn học thuật cao, phù hợp học lên chuyên ngành.',
    website: 'https://koreansli.skku.edu/',
    conditions: [
      'GPA ≥ 7.5',
      'Trống học < 2 năm',
      'Bắt buộc mở K-study 10 triệu won',
      'Học phí Seoul cao hơn Suwon',
      'Yêu cầu đầu vào khắt khe'
    ],
    advantages: [
      'Trường lâu đời nhất Hàn Quốc (+600 năm)',
      'Được Samsung bảo trợ, cơ sở vật chất hàng đầu',
      'Top đầu Hàn Quốc về chất lượng đào tạo',
      '2 campus: Seoul (Nhân văn) & Suwon (Khoa học)',
      'Giáo trình bài bản, học thuật cao',
      'Cơ hội việc làm tại Samsung'
    ],
    documents: [
      'Bằng tốt nghiệp THPT (hợp pháp hóa lãnh sự)',
      'Học bạ THPT (hợp pháp hóa lãnh sự)',
      'Sổ tiết kiệm + K-study 10 triệu won',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình',
      'Kế hoạch học tập chi tiết',
      'Giới thiệu bản thân'
    ],
    documents_note: 'Yêu cầu rất khắt khe. Cần chuẩn bị K-study 10 triệu won. Từ 2026: 4 kỳ/năm (thay vì 6 kỳ).',
    insurance: '',
    schedule: '4 kỳ/năm (từ 2026)',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://koreansli.skku.edu/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.5,
      max_absences: 8,
      region: 'seoul',
      cost_level: 5,
      visa_chance: 4,
      job_opportunity: 5,
      e7_opportunity: 3,
      study_load: 5,
      interview_difficulty: 4,
      tags: ['prestige', 'top-tier', 'samsung', 'competitive']
    }
  },
  {
    slug: 'seoul-women-klc',
    name: 'Seoul Women\'s University',
    name_kr: '서울여자대학교',
    name_en: 'Seoul Women\'s University (Korean Language Center)',
    system: 'Trung tâm Ngôn ngữ Hàn Quốc (KLC)',
    visa_type: 'D4-1',
    region: 'seoul',
    location: 'Nowon-gu, Seoul, Hàn Quốc',
    quota: 0,
    tuition: '1,500,000 KRW/kỳ (10 tuần)',
    ktx: '663,000 KRW/13 tuần (International Residence Hall)',
    intro: 'Seoul Women\'s University (SWU) là trường nữ tư thục thành lập năm 1960, tọa lạc tại quận Nowon, Seoul. Trung tâm Ngôn ngữ Hàn Quốc (KLC) có quy mô lớp nhỏ 10-15 sinh viên, chương trình 6 cấp độ. Đặc biệt có lớp luyện TOPIK mỗi thứ Tư và Buddy Program kết nối sinh viên Hàn.',
    website: 'http://klc.swu.ac.kr',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Nhận học sinh miền Trung',
      'Bắt buộc mở K-study 10 triệu won',
      'Trường nữ sinh (chỉ nhận nữ)'
    ],
    advantages: [
      'Trường nữ tư thục uy tín tại Seoul',
      'Lớp học nhỏ (10-15 SV) - chất lượng cao',
      'Luyện TOPIK hàng tuần',
      'Buddy Program kết nối SV Hàn Quốc',
      'Ký túc xá International Residence Hall',
      'Học bổng khuyến khích hàng kỳ'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'Trường nữ sinh, chỉ nhận nữ. Có kiểm tra sức khỏe X-quang phổi khi nhập cư.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần (6 cấp độ)',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'http://klc.swu.ac.kr',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'female',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'seoul',
      cost_level: 3,
      visa_chance: 4,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['women-only', 'good-support']
    }
  },
  {
    slug: 'sunmoon-kli',
    name: 'Sunmoon University',
    name_kr: '선문대학교',
    name_en: 'Sunmoon University (Korean Language Institute)',
    system: 'Viện Ngôn ngữ Hàn Quốc (KLI)',
    visa_type: 'D4-1',
    region: 'chungcheongnam',
    location: 'Asan, Chungcheongnam, Hàn Quốc',
    quota: 0,
    tuition: '1,400,000 KRW/kỳ + phí đăng ký 100,000 KRW',
    ktx: '667,400 KRW/kỳ (bắt buộc kỳ đầu)',
    intro: 'Sunmoon University tọa lạc tại Asan, Chungcheongnam. Trường được đánh giá là thân thiện với sinh viên quốc tế, có tỷ lệ sinh viên quốc tế cao. Chương trình tiếng Hàn chú trọng giao tiếp thực tế. Học bổng hào phóng (giảm 30%-100% học phí). KTX bắt buộc kỳ đầu tiên.',
    website: 'https://kli.sunmoon.ac.kr/',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền (miền Trung chỉ nhận nữ)',
      'Miễn K-study nếu GPA > 8.0 hoặc TOPIK 2',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Thân thiện với sinh viên quốc tế nhất',
      'Học bổng hào phóng (30%-100%)',
      'Khuôn viên hiện đại, yên tĩnh',
      'Chi phí sinh hoạt thấp',
      'Miễn K-study cho học sinh giỏi',
      'Bảo hiểm ~120,000 KRW/7 tháng'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'KTX bắt buộc kỳ đầu. Phí bảo hiểm ~120,000 KRW/7 tháng. Học bổng giảm đến 100% cho HS xuất sắc.',
    insurance: '~120,000 KRW/7 tháng',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://kli.sunmoon.ac.kr/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.0,
      max_absences: 20,
      region: 'chungcheongnam',
      cost_level: 2,
      visa_chance: 4,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 2,
      interview_difficulty: 2,
      tags: ['scholarship-friendly', 'low-cost']
    }
  },
  {
    slug: 'inha-ltc',
    name: 'Inha University',
    name_kr: '인하대학교',
    name_en: 'Inha University (Language Training Center)',
    system: 'Trung tâm Đào tạo Ngôn ngữ (LTC)',
    visa_type: 'D4-1',
    region: 'incheon',
    location: 'Incheon, Hàn Quốc (gần sân bay quốc tế)',
    quota: 0,
    tuition: '1,400,000 KRW/kỳ + phí đăng ký 100,000 KRW',
    ktx: '1,200,000 KRW/6 tháng',
    intro: 'Inha University là trường tư thục danh giá tại Incheon, nổi tiếng với các ngành Kỹ thuật và Khoa học tự nhiên. Trường được thành lập bởi cố Tổng thống Syngman Rhee. Gần sân bay quốc tế Incheon, di chuyển đến Seoul chỉ mất ~30 phút tàu điện ngầm. Có chương trình Preschool (dự bị).',
    website: 'https://ltc.inha.ac.kr/',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Hạn chế học sinh miền Trung',
      'Không bắt buộc mở K-study',
      'Học khóa Preschool (dự bị)',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Trường tư thục danh giá tại Incheon',
      'Gần sân bay quốc tế, đi Seoul 30 phút',
      'Thế mạnh Kỹ thuật và Khoa học tự nhiên',
      'Học bổng cạnh tranh lên đến 100%',
      'Chương trình dự bị (Preschool)',
      'Môi trường năng động, phát triển'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'Học Preschool (dự bị) trước khi vào chính khóa. Phí đăng ký 100,000 KRW không hoàn lại.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://ltc.inha.ac.kr/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'incheon',
      cost_level: 3,
      visa_chance: 4,
      job_opportunity: 4,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['prestige', 'engineering', 'good-location']
    }
  },
  {
    slug: 'ajou-korean',
    name: 'Ajou University',
    name_kr: '아주대학교',
    name_en: 'Ajou University (Korean Language Program)',
    system: 'Chương trình tiếng Hàn (Văn phòng Quốc tế)',
    visa_type: 'D4-1',
    region: 'gyeonggi',
    location: 'Suwon, Gyeonggi, Hàn Quốc (cách Seoul 30km)',
    quota: 0,
    tuition: '1,500,000 KRW/kỳ (10 tuần)',
    ktx: '1,055,000 won/6 tháng (phòng 4 người) / 1,489,000 won/6 tháng (phòng 2 người)',
    intro: 'Ajou University tọa lạc tại Suwon, Gyeonggi (cách Seoul 30km) - trung tâm công nghệ của Samsung. Trường nổi tiếng với các ngành Kỹ thuật, CNTT, Y tế (có bệnh viện ĐH riêng). Chương trình tiếng Hàn tập trung vào giao tiếp thực tế và có lộ trình lên đại học. Học bổng hấp dẫn 15%-100%.',
    website: 'http://www.ajou.ac.kr/iadmissions_en/korean/course.do',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền',
      'Phỏng vấn bằng tiếng Anh',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Top đầu về Kỹ thuật, CNTT, Y tế',
      'Suwon - trung tâm Samsung, cơ hội việc làm cao',
      'Có bệnh viện Đại học riêng',
      'Học bổng 15%-100% học phí',
      'Hỗ trợ KTX kỳ đầu',
      'Mentor program kết nối SV Hàn'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình',
      'Chứng chỉ tiếng Anh (nếu có)'
    ],
    documents_note: 'Phỏng vấn đầu vào bằng tiếng Anh. Học bổng dựa trên TOPIK/IELTS.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'http://www.ajou.ac.kr/iadmissions_en/korean/course.do',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'gyeonggi',
      cost_level: 3,
      visa_chance: 4,
      job_opportunity: 5,
      e7_opportunity: 3,
      study_load: 3,
      interview_difficulty: 3,
      tags: ['prestige', 'engineering', 'samsung-area', 'good-job']
    }
  },
  {
    slug: 'joongbu-klc',
    name: 'Joongbu University',
    name_kr: '중부대학교',
    name_en: 'Joongbu University (Korean Language Center)',
    system: 'Trung tâm Ngôn ngữ Hàn Quốc',
    visa_type: 'D4-1',
    region: 'chungcheongnam',
    location: 'Geumsan, Chungcheongnam & Goyang, Gyeonggi, Hàn Quốc',
    quota: 0,
    tuition: '1,100,000 KRW/kỳ (10 tuần)',
    ktx: '1,090,000 KRW/6 tháng',
    intro: 'Joongbu University có 2 cơ sở tại Geumsan (Chungcheongnam) và Goyang (gần Seoul). Trường nổi tiếng với môi trường học tập thực tế và hỗ trợ sinh viên quốc tế. Học phí thấp nhất trong 12 trường, phù hợp với học sinh cần tiết kiệm chi phí. Học bổng đa dạng 30%-80%.',
    website: 'https://www.joongbu.ac.kr/eng/',
    conditions: [
      'GPA ≥ 6.5',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Học phí thấp nhất (1,100,000/kỳ)',
      '2 cơ sở: Geumsan + Goyang (gần Seoul)',
      'Học bổng đa dạng 30%-80%',
      'Môi trường an toàn, thân thiện',
      'Chi phí sinh hoạt hợp lý',
      'Cộng đồng sinh viên quốc tế đa dạng'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'Học phí thấp, phù hợp học sinh cần tiết kiệm. Cơ sở Goyang gần Seoul.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://www.joongbu.ac.kr/eng/',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 6.5,
      max_absences: 25,
      region: 'chungcheongnam',
      cost_level: 1,
      visa_chance: 3,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 2,
      interview_difficulty: 2,
      tags: ['low-cost', 'easy-entry', 'scholarship-friendly']
    }
  },
  {
    slug: 'konyang-klc',
    name: 'Konyang University',
    name_kr: '건양대학교',
    name_en: 'Konyang University (Korean Language Center)',
    system: 'Trung tâm Ngôn ngữ Hàn Quốc',
    visa_type: 'D4-1',
    region: 'chungcheongnam',
    location: 'Nonsan & Daejeon, Chungcheongnam, Hàn Quốc',
    quota: 0,
    tuition: '1,100,000 KRW/kỳ (10 tuần)',
    ktx: '910,000 KRW/kỳ',
    intro: 'Konyang University tọa lạc tại Nonsan/Daejeon, Chungcheongnam. Trường có thế mạnh về các ngành Y tế, Điều dưỡng và Thực hành. Học phí thấp, chi phí sinh hoạt hợp lý. Học bổng từ 30%-100% dựa trên GPA. Phù hợp với học sinh muốn tiết kiệm và định hướng ngành Y.',
    website: 'https://www.konyang.ac.kr/eng.do',
    conditions: [
      'GPA ≥ 6.8',
      'Trống học < 2 năm',
      'Không hạn chế vùng miền',
      'Không bắt buộc mở K-study',
      'Cần sổ lãi 6 tháng ≥ 200 triệu VND'
    ],
    advantages: [
      'Thế mạnh Y tế, Điều dưỡng, Thực hành',
      'Học phí thấp (1,100,000/kỳ)',
      'Học bổng 30%-100% theo GPA',
      'Chi phí sinh hoạt hợp lý',
      'Môi trường học tập yên tĩnh',
      'KTX tiện nghi, ưu tiên tân SVQT'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm 200 triệu+ (6 tháng)',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'Phù hợp học sinh muốn học ngành Y tế, Điều dưỡng. Chi phí thấp.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://www.konyang.ac.kr/eng.do',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 6.8,
      max_absences: 20,
      region: 'chungcheongnam',
      cost_level: 1,
      visa_chance: 3,
      job_opportunity: 3,
      e7_opportunity: 2,
      study_load: 2,
      interview_difficulty: 2,
      tags: ['low-cost', 'medical', 'easy-entry']
    }
  },
  {
    slug: 'kyungsung-klc',
    name: 'Kyungsung University',
    name_kr: '경성대학교',
    name_en: 'Kyungsung University (Korean Language Institute)',
    system: 'Viện Ngôn ngữ Hàn Quốc',
    visa_type: 'D4-1',
    region: 'busan',
    location: 'Busan, Hàn Quốc (trung tâm thành phố)',
    quota: 0,
    tuition: '1,200,000 KRW/kỳ (10 tuần)',
    ktx: '750,000 KRW/kỳ (Nuri Dormitory)',
    intro: 'Kyungsung University tọa lạc tại trung tâm Busan - thành phố cảng lớn nhất Hàn Quốc. Trường có vị trí gần biển, giao thông thuận tiện. Viện Ngôn ngữ tổ chức 4 kỳ/năm, tập trung vào luyện TOPIK. Học bổng 10%-100% dựa trên TOPIK/IELTS. Cuộc sống năng động tại Busan.',
    website: 'https://ks.ac.kr/eng/main.do',
    conditions: [
      'GPA ≥ 7.0',
      'Trống học < 2 năm',
      'Nhận học sinh miền Trung (số lượng hạn chế)',
      'Bắt buộc mở K-study 8 triệu won',
      'Phù hợp học sinh thích Busan'
    ],
    advantages: [
      'Vị trí trung tâm Busan, gần biển',
      'Thành phố năng động, nhiều cơ hội làm thêm',
      'Học bổng 10%-100% theo TOPIK/IELTS',
      'KTX Nuri Dormitory hiện đại',
      'Chi phí thấp hơn Seoul',
      'Luyện thi TOPIK chuyên sâu'
    ],
    documents: [
      'Bằng tốt nghiệp THPT',
      'Học bạ THPT',
      'Sổ tiết kiệm + K-study 8 triệu won',
      'Hộ chiếu (còn hạn)',
      'CCCD/Căn cước công dân',
      'Giấy khai sinh',
      'Chứng minh thu nhập gia đình'
    ],
    documents_note: 'Bắt buộc mở K-study 8 triệu won. Nhận học sinh miền Trung số lượng hạn chế.',
    insurance: '',
    schedule: '4 kỳ/năm, mỗi kỳ 10 tuần',
    mou: '',
    image_main: 'images/placeholder.svg',
    video_title: '',
    video_url: '',
    video_youtube_id: '',
    catalog_url: 'https://ks.ac.kr/eng/main.do',
    invoice_url: '',
    partners: [],
    advisorProfile: {
      gender: 'all',
      min_gpa: 7.0,
      max_absences: 15,
      region: 'busan',
      cost_level: 2,
      visa_chance: 4,
      job_opportunity: 4,
      e7_opportunity: 2,
      study_load: 3,
      interview_difficulty: 2,
      tags: ['busan', 'good-location', 'coastal']
    }
  }
];

// ─── Hàm insert ───
async function seedD41() {
  console.log('🔄 Đang nhập 12 trường D4-1...');

  for (const school of d41Schools) {
    const { advisorProfile, conditions, advantages, documents, partners, visa_type, ...schoolData } = school;
    
    // Kiểm tra trùng slug
    const { data: existing } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', schoolData.slug)
      .maybeSingle();

    if (existing) {
      console.log(`⚠️ Trường "${schoolData.name}" đã tồn tại (slug: ${schoolData.slug}), cập nhật...`);
      
      // Update existing school
      const { error: updateError } = await supabase
        .from('schools')
        .update({ ...schoolData, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`❌ Lỗi cập nhật "${schoolData.name}":`, updateError.message);
        continue;
      }

      // Update advisor profile
      if (advisorProfile) {
        const { error: apError } = await supabase
          .from('school_advisor_profiles')
          .upsert({
            school_id: existing.id,
            ...advisorProfile,
            updated_at: new Date().toISOString()
          }, { onConflict: 'school_id' });

        if (apError) console.error(`❌ Lỗi advisor profile "${schoolData.name}":`, apError.message);
      }

      console.log(`✅ Đã cập nhật "${schoolData.name}"`);
      continue;
    }

    // Insert new school
    const { data: newSchool, error: insertError } = await supabase
      .from('schools')
      .insert({ ...schoolData, visa_type: 'D4-1' })
      .select('id')
      .single();

    if (insertError) {
      console.error(`❌ Lỗi insert "${schoolData.name}":`, insertError.message);
      console.log('   SQL:', JSON.stringify(schoolData));
      continue;
    }

    console.log(`✅ Đã tạo "${schoolData.name}" (ID: ${newSchool.id})`);

    // Insert advisor profile
    if (advisorProfile && newSchool) {
      const { error: apError } = await supabase
        .from('school_advisor_profiles')
        .insert({
          school_id: newSchool.id,
          ...advisorProfile
        });

      if (apError) {
        console.error(`❌ Lỗi advisor profile "${schoolData.name}":`, apError.message);
      }
    }

    // Insert child tables (conditions, advantages, documents)
    const childTables = [
      { table: 'school_conditions', items: conditions },
      { table: 'school_advantages', items: advantages },
      { table: 'school_documents', items: documents },
    ];

    for (const ct of childTables) {
      if (!ct.items || ct.items.length === 0) continue;
      const inserts = ct.items.map((text, i) => ({
        school_id: newSchool.id,
        text: text,
        sort_order: i
      }));

      const { error: childError } = await supabase
        .from(ct.table)
        .insert(inserts);

      if (childError) {
        console.error(`❌ Lỗi insert ${ct.table} cho "${schoolData.name}":`, childError.message);
      }
    }
  }

  // Kiểm tra tổng kết
  const { count } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })
    .eq('visa_type', 'D4-1');

  console.log(`\n📊 Tổng kết: ${count || 0} trường D4-1 đã được nhập.`);
  process.exit(0);
}

seedD41().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
