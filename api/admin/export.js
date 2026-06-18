// GET /api/admin/export — export dữ liệu (Supabase client)
const { requireAdmin } = require('../../lib/auth');
const { supabase } = require('../../lib/supabase');

module.exports = requireAdmin(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [schoolsResult, checklistResult, interviewsResult, semestersResult, semesterSchoolsResult] = await Promise.all([
      supabase.from('schools').select('*').order('slug'),
      supabase.from('extra_visa_checklist').select('*').order('sort_order'),
      supabase.from('extra_interviews').select('*').order('sort_order'),
      supabase.from('semesters').select('*').order('sort_order'),
      supabase.from('semester_schools').select('*'),
    ]);

    const { data: schools } = schoolsResult;
    const { data: visaChecklist } = checklistResult;
    const { data: interviews } = interviewsResult;
    const semestersList = semestersResult.data || [];
    const semesterSchoolsList = semesterSchoolsResult.data || [];
    const semesterInfo = semestersList.find(s => s.is_active) || semestersList[0] || null;

    // Load all child records
    const [
      { data: conditions },
      { data: majors },
      { data: advantages },
      { data: conversions },
      { data: documents },
      { data: partners },
      { data: advisorProfiles },
    ] = await Promise.all([
      supabase.from('school_conditions').select('*').order('sort_order'),
      supabase.from('school_majors').select('*').order('sort_order'),
      supabase.from('school_advantages').select('*').order('sort_order'),
      supabase.from('school_conversions').select('*').order('sort_order'),
      supabase.from('school_documents').select('*').order('sort_order'),
      supabase.from('school_partners').select('*').order('sort_order'),
      supabase.from('school_advisor_profiles').select('*'),
    ]);

    // Group by school_id
    const groupBy = (rows, key = 'school_id') => {
      const map = {};
      for (const row of rows || []) {
        if (!map[row[key]]) map[row[key]] = [];
        map[row[key]].push(row);
      }
      return map;
    };

    const conditionsMap = groupBy(conditions);
    const majorsMap = groupBy(majors);
    const advantagesMap = groupBy(advantages);
    const conversionsMap = groupBy(conversions);
    const documentsMap = groupBy(documents);
    const partnersMap = groupBy(partners);
    const advisorsMap = {};
    for (const row of advisorProfiles || []) {
      advisorsMap[row.school_id] = row;
    }

    const exportSchools = (schools || []).map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      nameKr: s.name_kr,
      nameEn: s.name_en,
      system: s.system,
      quota: s.quota,
      region: s.region,
      location: s.location,
      intro: s.intro,
      tuition: s.tuition,
      insurance: s.insurance,
      ktx: s.ktx,
      schedule: s.schedule,
      documentsNote: s.documents_note,
      mou: s.mou,
      website: s.website,
      catalogUrl: s.catalog_url,
      invoiceUrl: s.invoice_url,
      videoUrl: s.video_url,
      videoYoutubeId: s.video_youtube_id,
      videoTitle: s.video_title,
      imageMain: s.image_main,
      conditions: (conditionsMap[s.id] || []).map((r) => r.text),
      majors: (majorsMap[s.id] || []).map((r) => r.text),
      advantages: (advantagesMap[s.id] || []).map((r) => r.text),
      conversion: (conversionsMap[s.id] || []).map((r) => r.text),
      documents: (documentsMap[s.id] || []).map((r) => r.text),
      partners: (partnersMap[s.id] || []).map((r) => ({ code: r.code, name: r.name, nameKr: r.name_kr })),
      advisorProfile: advisorsMap[s.id] || null,
    }));

    const exportData = {
      exportedAt: new Date().toISOString(),
      semesterInfo: semesterInfo || {},
      semesters: semestersList,
      semesterSchools: semesterSchoolsList,
      schools: exportSchools,
      extraSheets: {
        visaChecklist: {
          name: 'Check list HS xin Visa D2-6',
          items: (visaChecklist || []).map((r) => ({
            stt: r.stt,
            noidung: r.content,
            luuy: r.note,
            link: r.link_url,
            linkText: r.link_text,
          })),
        },
        phongVan: {
          name: 'Phỏng vấn visa',
          items: (interviews || []).map((r) => ({
            stt: r.stt,
            noidung: r.content,
            link: r.link_url,
            linkText: r.link_text,
          })),
        },
      },
    };

    return res.json({ success: true, data: exportData });
  } catch (err) {
    console.error('GET /api/admin/export error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
