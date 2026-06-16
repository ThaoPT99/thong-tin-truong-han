/**
 * Import dữ liệu từ data.js lên Supabase (batch insert)
 * Chạy: node scripts/import-supabase.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
  host: 'db.lzggxhunbnjrklbkywmb.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Hoangtumua@123',
  ssl: { rejectUnauthorized: false },
};

async function importData() {
  console.log('🔄 Reading data.js...');
  const dataJsPath = path.join(__dirname, '..', 'data.js');
  const code = fs.readFileSync(dataJsPath, 'utf8');

  // Use eval to extract data
  const wrapped = code
    .replace(/const SEMESTER_INFO/g, 'globalThis.SEMESTER_INFO')
    .replace(/const SCHOOLS_DATA/g, 'globalThis.SCHOOLS_DATA')
    .replace(/const GENERATED_ADVISOR_PROFILES/g, 'globalThis.GENERATED_ADVISOR_PROFILES')
    .replace(/const EXTRA_SHEETS/g, 'globalThis.EXTRA_SHEETS');

  eval(wrapped);

  const SCHOOLS_DATA = globalThis.SCHOOLS_DATA;
  const GENERATED_ADVISOR_PROFILES = globalThis.GENERATED_ADVISOR_PROFILES || {};
  const EXTRA_SHEETS = globalThis.EXTRA_SHEETS || {};
  const SEMESTER_INFO = globalThis.SEMESTER_INFO || {};

  const slugs = Object.keys(SCHOOLS_DATA);
  console.log(`📊 Found ${slugs.length} schools`);

  const client = new Client(DB_CONFIG);
  await client.connect();
  console.log('✅ Connected to database');

  // Clear existing data (in reverse dependency order)
  const tables = [
    'school_advisor_profiles', 'school_partners', 'school_documents',
    'school_conversions', 'school_advantages', 'school_majors',
    'school_conditions', 'schools', 'extra_visa_checklist',
    'extra_interviews', 'extra_applications', 'semester_info'
  ];
  for (const t of tables) {
    await client.query(`DELETE FROM ${t}`);
  }

  // Helper: batch insert rows
  async function batchInsert(table, columns, rows) {
    if (rows.length === 0) return;
    const colNames = columns.join(', ');
    const placeholders = rows.map((_, ri) =>
      `(${columns.map((_, ci) => `$${ri * columns.length + ci + 1}`).join(', ')})`
    ).join(', ');
    const values = rows.flat();
    await client.query(
      `INSERT INTO ${table} (${colNames}) VALUES ${placeholders}`,
      values
    );
  }

  // Import each school
  let count = 0;
  for (const slug of slugs) {
    const school = SCHOOLS_DATA[slug];
    process.stdout.write(`  ${slug}...`);

    // Insert school
    const schoolRes = await client.query(
      `INSERT INTO schools (slug, name, name_kr, name_en, system, quota, region, location, intro,
        tuition, insurance, ktx, schedule, documents_note, mou, website, catalog_url, invoice_url,
        video_url, video_youtube_id, video_title, image_main, image_catalog, image_location, image_invoice)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      RETURNING id`,
      [
        slug, school.name || '', school.nameKr || '', school.nameEn || '',
        school.system || '', school.quota || 0, school.region || '',
        school.location || '', school.intro || '', school.tuition || '',
        school.insurance || '', school.ktx || '', school.schedule || '',
        school.documentsNote || '', school.mou || '',
        (school.links && school.links.website) || '',
        (school.links && school.links.catalog) || '',
        (school.links && school.links.invoice) || '',
        (school.video && school.video.url) || '',
        (school.video && school.video.youtubeId) || '',
        (school.video && school.video.title) || '',
        (school.images && school.images.main) || 'images/placeholder.svg',
        (school.images && school.images.catalog) || '',
        (school.images && school.images.locationMap) || '',
        (school.images && school.images.invoice) || '',
      ]
    );
    const schoolId = schoolRes.rows[0].id;

    // Batch inserts for child records
    if (school.conditions && school.conditions.length) {
      await batchInsert('school_conditions', ['school_id', 'text', 'sort_order'],
        school.conditions.map((t, i) => [schoolId, t, i]));
    }
    if (school.majors && school.majors.length) {
      await batchInsert('school_majors', ['school_id', 'text', 'sort_order'],
        school.majors.map((t, i) => [schoolId, t, i]));
    }
    if (school.advantages && school.advantages.length) {
      await batchInsert('school_advantages', ['school_id', 'text', 'sort_order'],
        school.advantages.map((t, i) => [schoolId, t, i]));
    }
    if (school.conversion && school.conversion.length) {
      await batchInsert('school_conversions', ['school_id', 'text', 'sort_order'],
        school.conversion.map((t, i) => [schoolId, t, i]));
    }
    if (school.documents && school.documents.length) {
      await batchInsert('school_documents', ['school_id', 'text', 'sort_order'],
        school.documents.map((t, i) => [schoolId, t, i]));
    }
    if (school.partners && school.partners.length) {
      const partnerRows = school.partners.map(p => [schoolId, p.code || '', p.name || '', p.nameKr || '']);
      await batchInsert('school_partners', ['school_id', 'code', 'name', 'name_kr'], partnerRows);
    }

    // Advisor profile
    const advisor = GENERATED_ADVISOR_PROFILES[slug];
    if (advisor) {
      await client.query(
        `INSERT INTO school_advisor_profiles (school_id, gender, min_gpa, max_absences, region,
          cost_level, visa_chance, job_opportunity, e7_opportunity, study_load, interview_difficulty, tags)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [schoolId, advisor.gender || 'all', advisor.minGpa || 5.0, advisor.maxAbsences || 30,
          advisor.region || school.region || '', advisor.costLevel || 3, advisor.visaChance || 3,
          advisor.jobOpportunity || 3, advisor.e7Opportunity || 3, advisor.studyLoad || 3,
          advisor.interviewDifficulty || 2, advisor.tags || []]
      );
    }

    count++;
    console.log(' ✅');
  }

  // Import extra sheets
  console.log('\n📋 Importing extra sheets...');
  if (EXTRA_SHEETS && EXTRA_SHEETS.visaChecklist && EXTRA_SHEETS.visaChecklist.items) {
    const items = EXTRA_SHEETS.visaChecklist.items;
    await batchInsert('extra_visa_checklist', ['stt', 'content', 'note', 'link_url', 'link_text', 'sort_order'],
      items.map((item, i) => [item.stt || String(i + 1), item.noidung || '', item.luuy || '', item.link || '', item.linkText || '', i]));
    console.log(`  ✅ Visa checklist: ${items.length} items`);
  }
  if (EXTRA_SHEETS && EXTRA_SHEETS.phongVan && EXTRA_SHEETS.phongVan.items) {
    const items = EXTRA_SHEETS.phongVan.items;
    await batchInsert('extra_interviews', ['stt', 'content', 'link_url', 'link_text', 'sort_order'],
      items.map((item, i) => [item.stt || String(i + 1), item.noidung || '', item.link || '', item.linkText || '', i]));
    console.log(`  ✅ Interviews: ${items.length} items`);
  }

  // Semester info
  await client.query(
    'INSERT INTO semester_info (ky, nam, title) VALUES ($1,$2,$3)',
    [SEMESTER_INFO.ky || '3', SEMESTER_INFO.nam || '2027', SEMESTER_INFO.title || '']
  );
  console.log('  ✅ Semester info');

  console.log(`\n🎉 Imported ${count}/${slugs.length} schools successfully!`);
  await client.end();
}

importData().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
