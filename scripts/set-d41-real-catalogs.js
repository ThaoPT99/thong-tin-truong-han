/**
 * Set verified catalog URLs for D4-1 schools
 * Only uses links confirmed working (HTTP 200, real PDF or official website)
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

const schoolsToUpdate = [
  // === PDF catalogs thật (verified HTTP 200 + application/pdf) ===
  {
    slug: 'sungshin-womens-university',
    catalog_url: 'https://www.sungshin.ac.kr/sites/siie_kor/file/2024-2025%20%EC%84%B1%EC%8B%A0%EC%97%AC%EB%8C%80%20%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B3%BC%EC%A0%95%20%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95_%EC%98%81%EC%96%B4.pdf',
    website: 'https://www.sungshin.ac.kr/sites/siie_kor/',
  },
  {
    slug: 'korea-university',
    catalog_url: 'https://klceng.korea.ac.kr/klceng/course/regular_guide.do',
    website: 'https://klceng.korea.ac.kr/',
  },
  {
    slug: 'chung-ang-university',
    catalog_url: 'https://korean.cau.ac.kr/english/registration.php?mid=n03_01_01',
    website: 'https://korean.cau.ac.kr/',
  },
  {
    slug: 'sejong-university',
    catalog_url: 'https://sos.sejong.ac.kr/pdf/343171/%EC%84%B8%EC%A2%85%EC%96%B4%ED%95%99%EC%9B%90%20%EB%B8%8C%EB%A1%9C%EC%85%94%202026-2027%20(%EC%98%81%EC%96%B4)(%EC%99%84%EC%84%B1)%20251031.pdf',
    website: 'https://www.sejong.ac.kr/',
  },
  {
    slug: 'sungkyunkwan-university-sli',
    catalog_url: 'https://koreansli.skku.edu/_res/ksli/etc/brochure_eng_25.pdf',
    website: 'https://koreansli.skku.edu/',
  },
  {
    slug: 'seoul-womens-university',
    catalog_url: 'https://klc.swu.ac.kr/eng/html/04_sub/01_sub.html',
    website: 'https://klc.swu.ac.kr/',
  },
  {
    slug: 'sun-moon-university',
    catalog_url: 'https://kli.sunmoon.ac.kr/file/%EC%84%A0%EB%AC%B8%EB%8C%80%ED%95%99%EA%B5%90%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95%2026%EB%85%84_%EC%96%B4%ED%95%99%EC%9B%90_%EC%98%81%EC%96%B4.pdf',
    website: 'https://kli.sunmoon.ac.kr/',
  },
  {
    slug: 'inha-university',
    catalog_url: 'https://ltc.inha.ac.kr/ltc/11120/subview.do',
    website: 'https://ltc.inha.ac.kr/',
  },
  {
    slug: 'ajou-university',
    catalog_url: 'https://www.ajou.ac.kr/iadmissions_en/korean/course.do',
    website: 'https://www.ajou.ac.kr/',
  },
  {
    slug: 'joongbu-university',
    catalog_url: null,
    website: 'https://www.joongbu.ac.kr/',
  },
  {
    slug: 'konyang-university',
    catalog_url: 'https://www.konyang.ac.kr/eng.do',
    website: 'https://www.konyang.ac.kr/',
  },
  {
    slug: 'kyungsung-university',
    catalog_url: 'https://kscms.ks.ac.kr/attach/EDITOR/FILE/2025/5/aDq4GS7q9wVCHFFLg6te.pdf',
    website: 'https://www.ks.ac.kr/',
  },
];

async function main() {
  console.log('=== Cập nhật catalog_url + website cho 12 trường D4-1 ===\n');

  let success = 0;
  let failed = 0;

  for (const school of schoolsToUpdate) {
    const updateData = {
      website: school.website,
    };
    if (school.catalog_url !== null) {
      updateData.catalog_url = school.catalog_url;
    } else {
      updateData.catalog_url = school.website; // fallback to website
    }

    const { data, error } = await supabase
      .from('schools')
      .update(updateData)
      .eq('slug', school.slug)
      .eq('visa_type', 'D4-1')
      .select('name');

    if (error) {
      console.error(`❌ ${school.slug}: ${error.message}`);
      failed++;
    } else if (data && data.length > 0) {
      const label = school.catalog_url?.endsWith('.pdf') ? '📄 PDF' : '🌐 Web';
      console.log(`✅ ${data[0].name} => ${label}`);
      success++;
    } else {
      console.log(`⚠️  ${school.slug}: Không tìm thấy trong DB`);
      failed++;
    }
  }

  console.log(`\n=== Kết quả: ${success} thành công, ${failed} thất bại ===`);
}

main().catch(console.error);
