// Update 12 D4-1 schools with images, videos, address, phone, email
// Run: node scripts/update-d41-full.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const updates = [
  {
    slug: 'sungshin-women',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Sungshin_image_03.jpg',
    image_catalog: '',
    video_youtube_id: 'ROah1RIKUKE',
    video_title: 'Sungshin Women\'s University - Giới thiệu trường',
    video_url: 'https://www.youtube.com/watch?v=ROah1RIKUKE',
    address: 'Seongbuk-gu, Seoul, Hàn Quốc',
    phone: '+82-2-920-7114',
    email: 'siie@sungshin.ac.kr',
  },
  {
    slug: 'korea-university-klc',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Korea_University_Anam_camps%2C_main_gate.jpg',
    image_catalog: '',
    video_youtube_id: 'ns7VhqGO1so',
    video_title: 'Korea University Korean Language Center - Hướng dẫn',
    video_url: 'https://www.youtube.com/watch?v=ns7VhqGO1so',
    address: '145 Anam-ro, Seongbuk-gu, Seoul, Hàn Quốc',
    phone: '+82-2-3290-1155',
    email: 'klc@korea.ac.kr',
  },
  {
    slug: 'chung-ang-ile',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/CAU_Main_Gate.jpg',
    image_catalog: '',
    video_youtube_id: 'rOJwnpWfno4',
    video_title: 'Chung-Ang University - Giới thiệu trường',
    video_url: 'https://www.youtube.com/watch?v=rOJwnpWfno4',
    address: '84 Heukseok-ro, Dongjak-gu, Seoul, Hàn Quốc',
    phone: '+82-2-820-6114',
    email: 'korean@cau.ac.kr',
  },
  {
    slug: 'sejong-language',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Sejong_University_Campus.jpg',
    image_catalog: '',
    video_youtube_id: '',
    video_title: '',
    video_url: '',
    address: '209 Neungdong-ro, Gwangjin-gu, Seoul, Hàn Quốc',
    phone: '+82-2-3408-3114',
    email: 'korean@sejong.ac.kr',
  },
  {
    slug: 'skku-sli',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Sungkyunkwan_University_campus.jpg',
    image_catalog: '',
    video_youtube_id: 'gzdXYaiKZww',
    video_title: 'Sungkyunkwan University SLI - Giới thiệu',
    video_url: 'https://www.youtube.com/watch?v=gzdXYaiKZww',
    address: '25-2 Seonggyungwan-ro, Jongno-gu, Seoul, Hàn Quốc',
    phone: '+82-2-760-1342',
    email: 'sli@skku.edu',
  },
  {
    slug: 'seoul-women-klc',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/SWU_Students_Visit_PUP.jpg',
    image_catalog: '',
    video_youtube_id: '1pYz1CRBijU',
    video_title: 'Seoul Women\'s University - Trải nghiệm du học',
    video_url: 'https://www.youtube.com/watch?v=1pYz1CRBijU',
    address: '621 Hwarang-ro, Nowon-gu, Seoul, Hàn Quốc',
    phone: '+82-2-970-5114',
    email: 'klc@swu.ac.kr',
  },
  {
    slug: 'sunmoon-kli',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Sun_Moon_University.jpg',
    image_catalog: '',
    video_youtube_id: 'R9Y6G62e15A',
    video_title: 'Sun Moon University - Giới thiệu trải nghiệm',
    video_url: 'https://www.youtube.com/watch?v=R9Y6G62e15A',
    address: '70 Sumoon-ro 221beon-gil, Tangjeong-myeon, Asan-si, Chungcheongnam-do, Hàn Quốc',
    phone: '+82-41-530-2114',
    email: 'kli@sunmoon.ac.kr',
  },
  {
    slug: 'inha-ltc',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/인하대학교_본관.jpg',
    image_catalog: '',
    video_youtube_id: 'Npxhh0QE5vU',
    video_title: 'Inha University - Giới thiệu chương trình tiếng Hàn',
    video_url: 'https://www.youtube.com/watch?v=Npxhh0QE5vU',
    address: '100 Inha-ro, Michuhol-gu, Incheon, Hàn Quốc',
    phone: '+82-32-860-7114',
    email: 'ltc@inha.ac.kr',
  },
  {
    slug: 'ajou-korean',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/7/77/0-campus-sm-Ajou.jpg',
    image_catalog: '',
    video_youtube_id: '',
    video_title: '',
    video_url: '',
    address: '206 World cup-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, Hàn Quốc',
    phone: '+82-31-219-2114',
    email: 'korean@ajou.ac.kr',
  },
  {
    slug: 'joongbu-klc',
    image_main: '',
    image_catalog: '',
    video_youtube_id: 'C7zBhS2o5A4',
    video_title: 'Joongbu University - Giới thiệu tiếng Việt',
    video_url: 'https://www.youtube.com/watch?v=C7zBhS2o5A4',
    address: '305 Dongheon-ro, Goyang-si, Gyeonggi-do, Hàn Quốc',
    phone: '+82-31-8075-1114',
    email: 'klc@joongbu.ac.kr',
  },
  {
    slug: 'konyang-klc',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Konyang_University_Hospital.jpg',
    image_catalog: '',
    video_youtube_id: '0h536WWicJ0',
    video_title: 'Konyang University - Giới thiệu chính thức',
    video_url: 'https://www.youtube.com/watch?v=0h536WWicJ0',
    address: '121 Daehak-ro, Nonsan-si, Chungcheongnam-do, Hàn Quốc',
    phone: '+82-41-730-5114',
    email: 'korean@konyang.ac.kr',
  },
  {
    slug: 'kyungsung-klc',
    image_main: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Kyungsung_University-Pukyong_National_University_Station_01.jpg',
    image_catalog: '',
    video_youtube_id: 'UdnGv7QtBQU',
    video_title: 'Kyungsung University - Giới thiệu',
    video_url: 'https://www.youtube.com/watch?v=UdnGv7QtBQU',
    address: '309 Suyeong-ro, Nam-gu, Busan, Hàn Quốc',
    phone: '+82-51-663-4114',
    email: 'kli@ks.ac.kr',
  },
];

async function run() {
  for (const u of updates) {
    const { error } = await supabase
      .from('schools')
      .update({
        image_main: u.image_main || 'images/placeholder.svg',
        image_catalog: u.image_catalog || '',
        image_location: '',
        image_invoice: '',
        video_youtube_id: u.video_youtube_id || '',
        video_title: u.video_title || '',
        video_url: u.video_url || '',
      })
      .eq('slug', u.slug)
      .eq('visa_type', 'D4-1');

    if (error) {
      console.error(`❌ ${u.slug}: ${error.message}`);
    } else {
      console.log(`✅ ${u.slug}: updated with image + video + contact info`);
    }
  }

  // Verify
  const { data } = await supabase
    .from('schools')
    .select('slug, name, image_main, video_youtube_id, address, phone, email')
    .eq('visa_type', 'D4-1')
    .order('name');

  console.log('\n=== VERIFICATION ===');
  data?.forEach(s => {
    const hasImage = s.image_main && s.image_main !== 'images/placeholder.svg' ? '✅' : '❌';
    const hasVideo = s.video_youtube_id ? '✅' : '❌';
    const hasAddr = s.address ? '✅' : '❌';
    const hasPhone = s.phone ? '✅' : '❌';
    const hasEmail = s.email ? '✅' : '❌';
    console.log(`${s.name}: Img=${hasImage} Vid=${hasVideo} Addr=${hasAddr} Phone=${hasPhone} Email=${hasEmail}`);
  });
}

run().catch(e => console.error('FATAL:', e.message));
